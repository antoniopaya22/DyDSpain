/**
 * Supabase Service Layer — Data access functions for Master Mode.
 *
 * All Supabase queries are centralised here so stores and components
 * don't need to import the client directly.
 */

import { supabase } from "@/lib/supabase";
import type {
  CampanaMasterRow,
  CampanaJugadorRow,
  PersonajeRow,
  ProfileRow,
} from "@/types/supabase";
import type {
  CreateMasterCampaignInput,
  UpdateMasterCampaignInput,
  LobbyPlayer,
} from "@/types/master";

// ═══════════════════════════════════════════════════════════════════
// Profile
// ═══════════════════════════════════════════════════════════════════

/** Look up a player profile by their short shareable code */
export async function findPlayerByCode(
  code: string,
): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("codigo_jugador", code.toUpperCase().trim())
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw error;
  }
  return data as ProfileRow;
}

// ═══════════════════════════════════════════════════════════════════
// Master Campaigns
// ═══════════════════════════════════════════════════════════════════

/** Fetch all campaigns owned by the given master */
export async function fetchMasterCampaigns(
  masterId: string,
): Promise<CampanaMasterRow[]> {
  const { data, error } = await supabase
    .from("campanas_master")
    .select("*")
    .eq("master_id", masterId)
    .order("actualizado_en", { ascending: false });

  if (error) {
    // Table/relation doesn't exist yet — return empty instead of crashing.
    // Supabase returns various codes depending on version (42P01, PGRST204, etc.)
    const isTableMissing =
      error.code === "42P01" ||
      error.code === "PGRST204" ||
      error.message?.includes("does not exist") ||
      error.message?.includes("Not Found");

    if (isTableMissing) {
      console.warn(
        "[supabaseService] Table campanas_master not available:",
        error.code,
        error.message,
        "— Run supabase/migrations/001_master_mode.sql",
      );
      return [];
    }
    throw new Error(error.message);
  }
  return (data ?? []) as CampanaMasterRow[];
}

/** Create a new master campaign */
export async function createMasterCampaign(
  masterId: string,
  input: CreateMasterCampaignInput,
): Promise<CampanaMasterRow> {
  const { data, error } = await supabase
    .from("campanas_master")
    .insert({
      master_id: masterId,
      nombre: input.nombre.trim(),
      descripcion: input.descripcion?.trim() || null,
      imagen: input.imagen || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CampanaMasterRow;
}

/** Update an existing master campaign */
export async function updateMasterCampaign(
  campaignId: string,
  input: UpdateMasterCampaignInput,
): Promise<CampanaMasterRow> {
  const payload: Record<string, unknown> = {};
  if (input.nombre !== undefined) payload.nombre = input.nombre.trim();
  if (input.descripcion !== undefined)
    payload.descripcion = input.descripcion?.trim() || null;
  if (input.imagen !== undefined) payload.imagen = input.imagen || null;

  const { data, error } = await supabase
    .from("campanas_master")
    .update(payload)
    .eq("id", campaignId)
    .select()
    .single();

  if (error) throw error;
  return data as CampanaMasterRow;
}

/** Delete a master campaign (cascade removes player links) */
export async function deleteMasterCampaign(
  campaignId: string,
): Promise<void> {
  const { error } = await supabase
    .from("campanas_master")
    .delete()
    .eq("id", campaignId);

  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════════════
// Campaign Players
// ═══════════════════════════════════════════════════════════════════

/** Fetch players (with profile + character) for a campaign */
export async function fetchCampaignPlayers(
  campaignId: string,
): Promise<LobbyPlayer[]> {
  const { data, error } = await supabase
    .from("campana_jugadores")
    .select(
      `
      *,
      profile:profiles!jugador_id(*),
      character:personajes!personaje_id(*)
    `,
    )
    .eq("campana_id", campaignId);

  if (error) throw error;

  return ((data ?? []) as unknown[]).map((row: unknown) => {
    const r = row as Record<string, unknown>;
    return {
      membership: {
        id: r.id,
        campana_id: r.campana_id,
        jugador_id: r.jugador_id,
        personaje_id: r.personaje_id,
        unido_en: r.unido_en,
      } as CampanaJugadorRow,
      profile: r.profile as ProfileRow,
      character: (r.character as PersonajeRow) ?? null,
    };
  });
}

/** Add a player to a campaign */
export async function addPlayerToCampaign(
  campaignId: string,
  playerId: string,
): Promise<CampanaJugadorRow> {
  const { data, error } = await supabase
    .from("campana_jugadores")
    .insert({
      campana_id: campaignId,
      jugador_id: playerId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CampanaJugadorRow;
}

/** Remove a player from a campaign */
export async function removePlayerFromCampaign(
  campaignId: string,
  playerId: string,
): Promise<void> {
  const { error } = await supabase
    .from("campana_jugadores")
    .delete()
    .eq("campana_id", campaignId)
    .eq("jugador_id", playerId);

  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════════════
// Synced Characters
// ═══════════════════════════════════════════════════════════════════

/** Upsert a character snapshot to Supabase (used by the sync layer) */
export async function upsertCharacter(
  characterId: string,
  userId: string,
  datos: Record<string, unknown>,
): Promise<PersonajeRow> {
  const { data, error } = await supabase
    .from("personajes")
    .upsert(
      {
        id: characterId,
        usuario_id: userId,
        datos,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data as PersonajeRow;
}

/** Fetch all characters owned by a user */
export async function fetchUserCharacters(
  userId: string,
): Promise<PersonajeRow[]> {
  const { data, error } = await supabase
    .from("personajes")
    .select("*")
    .eq("usuario_id", userId)
    .order("actualizado_en", { ascending: false });

  if (error) throw error;
  return (data ?? []) as PersonajeRow[];
}

/** Assign (or un-assign) a character to a campaign membership */
export async function assignCharacterToCampaign(
  campaignId: string,
  playerId: string,
  characterId: string | null,
): Promise<void> {
  const { error } = await supabase
    .from("campana_jugadores")
    .update({ personaje_id: characterId })
    .eq("campana_id", campaignId)
    .eq("jugador_id", playerId);

  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════════════
// Local Campaign Sync (backup player campaigns to Supabase)
// ═══════════════════════════════════════════════════════════════════

/** Sync a local campaign to Supabase for backup */
export async function syncLocalCampaign(
  userId: string,
  campaign: {
    id: string;
    nombre: string;
    descripcion?: string;
    imagen?: string;
    personajeId?: string;
    creadoEn: string;
    actualizadoEn: string;
  },
): Promise<void> {
  const { error } = await supabase.from("campanas_jugador").upsert(
    {
      id: campaign.id,
      usuario_id: userId,
      nombre: campaign.nombre,
      descripcion: campaign.descripcion || null,
      imagen: campaign.imagen || null,
      personaje_id: campaign.personajeId || null,
      creado_en: campaign.creadoEn,
      actualizado_en: campaign.actualizadoEn,
    },
    { onConflict: "id" },
  );

  if (error) throw error;
}
