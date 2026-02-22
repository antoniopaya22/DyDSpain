/**
 * Auth Store — Zustand store for authentication and user profile.
 *
 * Handles Google OAuth via Supabase’s signInWithOAuth + expo-web-browser,
 * email/password auth, session management, profile loading, and
 * app-mode switching (jugador / master).
 *
 * Google OAuth flow:
 *  1. supabase.auth.signInWithOAuth generates the authorization URL
 *  2. We open it with WebBrowser.openAuthSessionAsync
 *  3. Supabase redirects back to the custom scheme (dymes://)
 *  4. We extract the tokens from the URL fragment and set the session
 */

import { create } from "zustand";
import { Platform } from "react-native";
import { supabase } from "@/lib/supabase";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import type { Session, User, AuthChangeEvent } from "@supabase/supabase-js";
import type { Profile, AppMode } from "@/types/master";
import { translateAuthError } from "@/utils/auth";
import { clearUserData } from "@/utils/storage";
import { restoreFromCloud } from "@/services/supabaseService";
import { useCharacterStore } from "./characterStore";
import { useCampaignStore } from "./campaignStore";
import { useMasterStore } from "./masterStore";

// Warm up the browser on Android for faster OAuth popup
if (Platform.OS === "android") {
  WebBrowser.warmUpAsync();
}

// Redirect URI for OAuth callback
// Web: current origin; Expo Go: exp:// scheme (auto); Dev build: custom scheme
function getRedirectUri(): string {
  if (Platform.OS === "web") {
    if (globalThis.window === undefined) return "";
    return globalThis.location.origin;
  }
  // makeRedirectUri() without arguments auto-detects:
  //  - Expo Go → exp://192.168.x.x:8081/--/
  //  - Dev build / standalone → dymes://
  return makeRedirectUri();
}
const REDIRECT_URI = getRedirectUri();

/**
 * Parse an OAuth callback URL and establish a Supabase session.
 * Handles both PKCE (?code=xxx) and implicit (#access_token=xxx) flows.
 * Returns true if a session was successfully established.
 */
async function extractAndSetSession(callbackUrl: string): Promise<boolean> {
  try {
    const url = new URL(callbackUrl);

    // PKCE flow: ?code=xxx
    const code = url.searchParams.get("code");
    if (code) {
      console.log("[AuthStore] PKCE code detected, exchanging for session...");
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("[AuthStore] exchangeCodeForSession failed:", error.message);
        return false;
      }
      return true;
    }

    // Implicit flow: #access_token=xxx&refresh_token=xxx
    const fragment = url.hash.substring(1);
    if (fragment) {
      const params = new URLSearchParams(fragment);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      if (accessToken && refreshToken) {
        console.log("[AuthStore] Implicit tokens detected, setting session...");
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          console.error("[AuthStore] setSession failed:", error.message);
          return false;
        }
        return true;
      }
    }

    console.warn("[AuthStore] Callback URL had no code or tokens:", callbackUrl.substring(0, 100));
    return false;
  } catch (err) {
    console.error("[AuthStore] extractAndSetSession error:", err);
    return false;
  }
}

// ─── State ───────────────────────────────────────────────────────────

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  /** Success message (e.g. after signup requiring email confirmation) */
  successMessage: string | null;
}

interface AuthActions {
  initialize: () => () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  /** Register a new account with email + password + optional display name */
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  setAppMode: (mode: AppMode) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}

type AuthStore = AuthState & AuthActions;

// ─── Store ───────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>((set, get) => ({
  // ── Initial state ──
  session: null,
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  error: null,
  successMessage: null,

  // ── Initialize ──
  initialize: () => {
    // 1. Restore existing session
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        set({
          session,
          user: session?.user ?? null,
          loading: false,
          initialized: true,
        });
        if (session?.user) {
          get().fetchProfile();
          // Restore campaigns + characters from Supabase if local storage is empty
          const restored = await restoreFromCloud(session.user.id);
          if (restored > 0) {
            console.log(`[AuthStore] Restored ${restored} campaigns from cloud`);
            useCampaignStore.getState().loadCampaigns();
          }
        }
      })
      .catch((err) => {
        console.error("[AuthStore] getSession failed:", err);
        set({ loading: false, initialized: true });
      });

    // 2. Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        set({ session, user: session?.user ?? null, loading: false });
        if (session?.user) {
          get().fetchProfile();
          // On SIGNED_IN event, restore cloud data if local is empty
          if (_event === "SIGNED_IN") {
            const restored = await restoreFromCloud(session.user.id);
            if (restored > 0) {
              console.log(`[AuthStore] Restored ${restored} campaigns from cloud`);
              useCampaignStore.getState().loadCampaigns();
            }
          }
        } else {
          set({ profile: null });
        }
      },
    );

    // Return unsubscribe function
    return () => subscription.unsubscribe();
  },

  // ── Google Sign-In ──
  // Web: direct redirect (page navigates to Google → back to app).
  //       detectSessionInUrl + onAuthStateChange handle the rest.
  // Native: popup via WebBrowser + manual token extraction.
  signInWithGoogle: async () => {
    set({ loading: true, error: null, successMessage: null });
    try {
      if (Platform.OS === "web") {
        // ── Web: full-page redirect ──
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: globalThis.location.origin,
          },
        });
        if (error) throw error;
        // The browser will navigate away; session is picked up on reload
        // via detectSessionInUrl + onAuthStateChange.
        return;
      }

      // ── Native: WebBrowser popup ──
      // 1. Get the OAuth authorization URL from Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: REDIRECT_URI,
          skipBrowserRedirect: true,
        },
      });
      if (error || !data.url) throw error ?? new Error("No se obtuvo la URL de autorización");

      // 2. Open the auth URL in the system browser
      console.log("[AuthStore] Opening OAuth with REDIRECT_URI:", REDIRECT_URI);
      console.log("[AuthStore] Auth URL (base):", data.url.split("?")[0]);

      // Wrap openAuthSessionAsync with a timeout so it never hangs forever.
      // If Supabase's allowed Redirect URLs don't include the exp:// URI,
      // the browser will never redirect back and the promise won't resolve.
      const BROWSER_TIMEOUT_MS = 120_000; // 2 minutes
      const browserPromise = WebBrowser.openAuthSessionAsync(
        data.url,
        REDIRECT_URI,
      );
      let didTimeout = false;
      const timeoutPromise = new Promise<WebBrowser.WebBrowserAuthSessionResult>(
        (resolve) =>
          setTimeout(() => {
            didTimeout = true;
            resolve({ type: WebBrowser.WebBrowserResultType.DISMISS });
          }, BROWSER_TIMEOUT_MS),
      );
      const result = await Promise.race([browserPromise, timeoutPromise]);

      // Clean up the Custom Tab on Android
      if (Platform.OS === "android") {
        WebBrowser.coolDownAsync();
      }

      console.log(
        "[AuthStore] WebBrowser result:",
        result.type,
        didTimeout ? "(timed out)" : "",
        result.type === "success" ? (result as { url?: string }).url?.substring(0, 100) : "",
      );

      // If timed out, try to close the browser popup
      if (didTimeout) {
        try { WebBrowser.dismissBrowser(); } catch { /* may not be open */ }
      }

      // On success, WebBrowser returns the callback URL directly
      if (result.type === "success" && "url" in result && result.url) {
        const sessionEstablished = await extractAndSetSession(result.url);
        if (sessionEstablished) {
          set({ loading: false });
          return;
        }
      }

      // On Android / Expo Go, openAuthSessionAsync often returns "dismiss"
      // even though the redirect succeeded. The global URL handler in
      // _layout.tsx will catch the deep link and call setSession/exchangeCode,
      // which triggers onAuthStateChange → loading: false.
      // Wait briefly for that to happen before giving up.
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // If onAuthStateChange already set the session, we're done
      if (get().session) {
        set({ loading: false });
        return;
      }

      // Otherwise, clear loading — user will need to try again
      console.warn(
        "[AuthStore] OAuth: no session established. " +
        "Ensure that the Redirect URL in Supabase Dashboard " +
        "(Authentication → URL Configuration) includes: " + REDIRECT_URI,
      );
      set({ loading: false });
    } catch (err) {
      const raw =
        err instanceof Error ? err.message : "Error al iniciar sesión con Google";
      const message = translateAuthError(raw);
      console.error("[AuthStore] signInWithGoogle:", raw);
      set({ error: message, loading: false });
    }
  },

  // ── Email Sign-In ──
  signInWithEmail: async (email: string, password: string) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({
        session: data.session,
        user: data.user,
        loading: false,
      });
    } catch (err) {
      const raw =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      const message = translateAuthError(raw);
      console.error("[AuthStore] signInWithEmail:", raw);
      set({ error: message, loading: false });
    }
  },

  // ── Email Sign-Up ──
  signUpWithEmail: async (email: string, password: string, name?: string) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: name ? { full_name: name } : undefined,
        },
      });
      if (error) throw error;

      // Supabase returns a fake user with no session when email already exists
      // (to prevent email enumeration). Detect this case:
      const isExistingUser =
        data.user &&
        !data.session &&
        data.user.identities?.length === 0;

      if (isExistingUser) {
        set({
          loading: false,
          error: "Ya existe una cuenta con este correo electrónico",
        });
        return;
      }

      // If email confirmation is required, session may be null
      if (data.session) {
        set({
          session: data.session,
          user: data.user,
          loading: false,
        });
      } else {
        set({
          loading: false,
          successMessage: "\u00a1Cuenta creada! Revisa tu correo para confirmar tu cuenta.",
        });
      }
    } catch (err) {
      const raw =
        err instanceof Error ? err.message : "Error al crear la cuenta";
      const message = translateAuthError(raw);
      console.error("[AuthStore] signUpWithEmail:", raw);
      set({ error: message, loading: false });
    }
  },

  // ── Sign Out ──
  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all in-memory stores so the next user starts fresh
      useCharacterStore.getState().clearCharacter();
      useCampaignStore.setState({
        campaigns: [],
        activeCampaignId: null,
        loading: false,
        error: null,
      });
      useMasterStore.setState({
        campaigns: [],
        activeCampaignId: null,
        players: [],
        loadingCampaigns: false,
        loadingPlayers: false,
        error: null,
      });

      // Also wipe persisted user data from AsyncStorage (keeps settings)
      await clearUserData();

      set({ session: null, user: null, profile: null, loading: false });
    } catch (err) {
      const raw =
        err instanceof Error ? err.message : "Error al cerrar sesión";
      const message = translateAuthError(raw);
      console.error("[AuthStore] signOut:", raw);
      set({ error: message, loading: false });
    }
  },

  // ── Fetch Profile ──
  fetchProfile: async () => {
    const user = get().user;
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        // Table doesn't exist yet — skip silently
        if (error.code === "42P01" || error.code === "PGRST116" || error.message?.includes("does not exist")) {
          return;
        }
        throw error;
      }
      set({ profile: data as Profile });
    } catch (err) {
      console.error("[AuthStore] fetchProfile:", err);
    }
  },

  // ── Set App Mode ──
  setAppMode: async (mode: AppMode) => {
    const user = get().user;
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ modo_actual: mode })
        .eq("id", user.id);

      if (error) {
        // Table doesn't exist yet — just update local state
        if (error.message?.includes("does not exist")) {
          set((state) => ({
            profile: state.profile ? { ...state.profile, modo_actual: mode } : null,
          }));
          return;
        }
        throw error;
      }

      set((state) => ({
        profile: state.profile ? { ...state.profile, modo_actual: mode } : null,
      }));
    } catch (err) {
      console.error("[AuthStore] setAppMode:", err);
    }
  },

  // ── Clear Error ──
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ successMessage: null }),
}));

// ─── Selectors ───────────────────────────────────────────────────────

export const selectIsAuthenticated = (state: AuthStore) => !!state.session;
export const selectPlayerCode = (state: AuthStore) =>
  state.profile?.codigo_jugador ?? null;
export const selectAppMode = (state: AuthStore) =>
  state.profile?.modo_actual ?? "jugador";
export const selectIsPremium = (state: AuthStore) =>
  state.profile?.es_premium ?? false;
