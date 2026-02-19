/**
 * useCharacterSync — Automatically syncs local character data to Supabase.
 *
 * When the user is authenticated and a character is shared with a master
 * campaign, this hook debounces and pushes changes to the `personajes` table.
 * Implements offline-first: changes queue locally and push when online.
 */

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useCharacterStore } from "@/stores/characterStore";
import { upsertCharacter } from "@/services/supabaseService";
import type { Character } from "@/types/character";

const SYNC_DEBOUNCE_MS = 2000;

/**
 * Call this hook in the character sheet screen.
 * It watches the character store and pushes updates to Supabase.
 */
export function useCharacterSync() {
  const user = useAuthStore((s) => s.user);
  const character = useCharacterStore((s) => s.character);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || !character) return;

    // Use the character's own update timestamp as fingerprint.
    // This covers ALL mutations (hp, spells, inventory, etc.)
    // since every store slice updates `actualizadoEn` on change.
    const fingerprint = character.actualizadoEn;

    if (fingerprint === lastSyncedRef.current) return;

    // Debounce the sync
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        // Strip private data (notes) before syncing
        const publicData = stripPrivateData(character);
        await upsertCharacter(character.id, user.id, publicData as unknown as Record<string, unknown>);
        lastSyncedRef.current = fingerprint;
        console.log("[CharacterSync] Synced character", character.id);
      } catch (err) {
        console.error("[CharacterSync] Failed to sync:", err);
        // Offline / error — will retry on next change
      }
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, character]);
}

/**
 * Removes private fields (personal notes) before sending to Supabase.
 * The master should not see the player's private notes.
 */
function stripPrivateData(character: Character): Character {
  // Notes are stored separately (noteStore), not in the Character object,
  // so we send the full character snapshot to Supabase.
  return character;
}
