/**
 * Supabase client singleton.
 *
 * Reads SUPABASE_URL and SUPABASE_ANON_KEY from app.json extra config.
 * The URL polyfill is imported first so `URL` is globally available in
 * React Native environments.
 */

import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";
import type { Database } from "@/types/supabase";

// ─── Supabase Project Credentials ────────────────────────────────────
// Read from app.json > extra. These are public (anon) credentials —
// Row Level Security (RLS) protects the data.

const extra = Constants.expoConfig?.extra ?? {};
const SUPABASE_URL =
  extra.supabaseUrl ?? "https://dvodghbjmtydijbrgsmj.supabase.co";
const SUPABASE_ANON_KEY =
  extra.supabaseAnonKey ?? "";

if (!SUPABASE_ANON_KEY) {
  console.warn(
    "[Supabase] Missing SUPABASE_ANON_KEY in app.json extra. " +
      "Add it under expo.extra.supabaseAnonKey.",
  );
}

// ─── Client ──────────────────────────────────────────────────────────

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // On web: auto-parse tokens from URL hash after OAuth redirect
    // On native: disabled (we extract tokens manually from WebBrowser)
    detectSessionInUrl: Platform.OS === "web",
  },
});
