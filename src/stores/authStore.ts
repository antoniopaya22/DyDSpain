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
import * as Linking from "expo-linking";
import { makeRedirectUri } from "expo-auth-session";
import type { Session, User, AuthChangeEvent } from "@supabase/supabase-js";
import type { Profile, AppMode } from "@/types/master";
import { translateAuthError } from "@/utils/auth";

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
      .then(({ data: { session } }) => {
        set({
          session,
          user: session?.user ?? null,
          loading: false,
          initialized: true,
        });
        if (session?.user) {
          get().fetchProfile();
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
      (_event: AuthChangeEvent, session: Session | null) => {
        set({ session, user: session?.user ?? null });
        if (session?.user) {
          get().fetchProfile();
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
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        REDIRECT_URI,
      );

      // If the browser was dismissed without completing, also try extracting
      // from the initial URL that Expo Go may have received via deep linking
      let callbackUrl: string | null = null;

      if (result.type === "success" && result.url) {
        callbackUrl = result.url;
      } else if (result.type === "dismiss") {
        // On some Android devices / Expo Go, the deep link arrives via Linking
        // instead of through WebBrowser's return value
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl?.includes("access_token")) {
          callbackUrl = initialUrl;
        }
      }

      if (!callbackUrl) {
        set({ loading: false });
        return;
      }

      // 3. Extract tokens from the redirect URL fragment (#)
      const url = new URL(callbackUrl);
      // Tokens can be in the hash fragment or query params depending on config
      const fragment = url.hash.substring(1);
      const params = new URLSearchParams(fragment || url.search);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) {
        throw new Error("No se recibieron los tokens de autenticación");
      }

      // 4. Set the session in Supabase
      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

      if (sessionError) throw sessionError;

      set({
        session: sessionData.session,
        user: sessionData.user,
        loading: false,
      });
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
