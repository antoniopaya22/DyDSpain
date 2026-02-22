/**
 * useCharacterSync — Automatically syncs local character data to Supabase.
 *
 * Watches ALL character-related state (character, magic, class resources,
 * inventory, notes) and debounces pushes to the `personajes` table.
 * Implements offline-first: changes queue locally and push when online.
 *
 * Key design choices:
 *   - Deep JSON fingerprint: catches ALL mutations (equip, spell slots,
 *     coin changes, notes, etc.) — not just `actualizadoEn`.
 *   - Flush-on-unmount: if the user navigates away before the debounce
 *     fires, the pending sync is sent immediately (fire-and-forget).
 *   - Notes included: notes are synced alongside the character data.
 *
 * Returns the `codigo_personaje` once the first sync completes.
 */

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useCharacterStore } from "@/stores/characterStore";
import { upsertCharacter } from "@/services/supabaseService";
import type { Character } from "@/types/character";
import type { Note } from "@/types/notes";
import type { Inventory } from "@/types/item";
import type { InternalMagicState } from "@/stores/characterStore/helpers";
import type { ClassResourcesState } from "@/stores/characterStore/classResourceTypes";

const SYNC_DEBOUNCE_MS = 2_000;

/**
 * Extended payload that bundles all character-related data for the master view.
 * Stored as a single JSONB object in Supabase `personajes.datos`.
 */
export interface SyncedCharacterData extends Character {
  _magicState?: InternalMagicState | null;
  _classResources?: ClassResourcesState | null;
  _inventory?: Inventory | null;
  _notes?: Note[] | null;
}

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Builds a deep fingerprint that covers every mutable field across all slices.
 * Whenever ANY field changes, the fingerprint changes → sync triggers.
 */
function buildFingerprint(
  character: Character,
  magicState: InternalMagicState | null,
  classResources: ClassResourcesState | null,
  inventory: Inventory | null,
  notes: Note[],
): string {
  // Character: use actualizadoEn + volatile combat/progression fields
  // that may NOT always bump actualizadoEn (e.g. from older store versions).
  const charPrint = `${character.actualizadoEn}|${character.hp.current}/${character.hp.max}/${character.hp.temp}|${character.hitDice.remaining}|${character.deathSaves.successes}/${character.deathSaves.failures}|${character.conditions.length}|${character.concentration?.spellId ?? ""}|${character.traits.map(t => `${t.id}:${t.currentUses}`).join(",")}|${character.nivel}|${character.experiencia}|${character.preparedSpellIds.join(",")}|${character.knownSpellIds.length}`;

  // Magic state: full serialisation (spell slots, pact magic, sorcery points)
  const magicPrint = magicState
    ? JSON.stringify(magicState)
    : "";

  // Class resources: all current values
  const resPrint = classResources
    ? JSON.stringify(classResources)
    : "";

  // Inventory: full serialisation (coins + every item field)
  const invPrint = inventory
    ? JSON.stringify(inventory)
    : "";

  // Notes: count + latest modification timestamp
  const notesPrint = notes.length > 0
    ? `${notes.length}|${notes[0]?.fechaModificacion ?? notes[0]?.fechaCreacion ?? ""}`
    : "";

  return `${charPrint}||${magicPrint}||${resPrint}||${invPrint}||${notesPrint}`;
}

/**
 * Builds the payload for Supabase sync.
 * Bundles the Character object with magic state, class resources, inventory and notes.
 */
function buildSyncPayload(
  character: Character,
  magicState: InternalMagicState | null,
  classResources: ClassResourcesState | null,
  inventory: Inventory | null,
  notes: Note[],
): SyncedCharacterData {
  return {
    ...character,
    _magicState: magicState,
    _classResources: classResources,
    _inventory: inventory,
    _notes: notes.length > 0 ? notes : null,
  };
}

// ── Hook ─────────────────────────────────────────────────────────────

/**
 * Call this hook in the character sheet screen.
 * It watches the character store and pushes updates to Supabase.
 * Returns the `characterCode` (codigo_personaje) once synced.
 */
export function useCharacterSync(): string | null {
  const user = useAuthStore((s) => s.user);
  const character = useCharacterStore((s) => s.character);
  const magicState = useCharacterStore((s) => s.magicState);
  const classResources = useCharacterStore((s) => s.classResources);
  const inventory = useCharacterStore((s) => s.inventory);
  const notes = useCharacterStore((s) => s.notes);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedRef = useRef<string | null>(null);
  const [characterCode, setCharacterCode] = useState<string | null>(null);

  // Ref holding the pending (un-synced) payload for flush-on-unmount.
  const pendingRef = useRef<{
    charId: string;
    userId: string;
    payload: Record<string, unknown>;
  } | null>(null);

  // ── Main sync effect (debounced) ───────────────────────────────────
  useEffect(() => {
    if (!user || !character) return;

    const fingerprint = buildFingerprint(
      character, magicState, classResources, inventory, notes,
    );

    // Skip if nothing changed since the last successful sync.
    if (fingerprint === lastSyncedRef.current) return;

    // Prepare the payload eagerly so flush-on-unmount has it.
    const syncData = buildSyncPayload(
      character, magicState, classResources, inventory, notes,
    ) as unknown as Record<string, unknown>;

    pendingRef.current = {
      charId: character.id,
      userId: user.id,
      payload: syncData,
    };

    // Debounce: cancel previous timer, start a new one.
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const result = await upsertCharacter(
          character.id, user.id, syncData,
        );
        lastSyncedRef.current = fingerprint;
        pendingRef.current = null;
        setCharacterCode(result.codigo_personaje);
        console.log(
          "[CharacterSync] Synced", character.id,
          "code:", result.codigo_personaje,
        );
      } catch (err) {
        console.error("[CharacterSync] Failed to sync:", err);
        // pendingRef stays set → will retry on next change or flush on unmount
      }
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, character, magicState, classResources, inventory, notes]);

  // ── Flush on unmount ───────────────────────────────────────────────
  // If the user navigates away before the debounce fires, push the
  // pending payload immediately (fire-and-forget).
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (pendingRef.current) {
        const { charId, userId, payload } = pendingRef.current;
        upsertCharacter(charId, userId, payload)
          .then(() => console.log("[CharacterSync] Flushed on unmount", charId))
          .catch((err) => console.error("[CharacterSync] Flush failed:", err));
        pendingRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return characterCode;
}
