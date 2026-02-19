/**
 * Types for Master Mode (HU-10)
 *
 * Re-exports Supabase row types with domain aliases and adds
 * client-side types for the master campaign lobby & real-time panel.
 */

import type {
  ProfileRow,
  CampanaMasterRow,
  CampanaJugadorRow,
  PersonajeRow,
} from "./supabase";

// ─── Re-export DB row types with friendlier names ────────────────────

export type Profile = ProfileRow;
export type MasterCampaign = CampanaMasterRow;
export type CampaignPlayer = CampanaJugadorRow;
export type SyncedCharacter = PersonajeRow;

// ─── App Mode ────────────────────────────────────────────────────────

export type AppMode = "jugador" | "master";

// ─── Inputs ──────────────────────────────────────────────────────────

export interface CreateMasterCampaignInput {
  nombre: string;
  descripcion?: string;
  imagen?: string;
}

export interface UpdateMasterCampaignInput {
  nombre?: string;
  descripcion?: string;
  imagen?: string;
}

// ─── Enriched types (joined data for UI) ─────────────────────────────

/** A player entry enriched with profile + character data for the lobby */
export interface LobbyPlayer {
  /** campana_jugadores row */
  membership: CampaignPlayer;
  /** Player's profile */
  profile: Profile;
  /** The character the player shares (null if not yet selected) */
  character: SyncedCharacter | null;
}

/** Master campaign with live player list */
export interface MasterCampaignWithPlayers extends MasterCampaign {
  jugadores: LobbyPlayer[];
}

// ─── Character card summary (for the master panel) ───────────────────

export interface CharacterSummary {
  nombre: string;
  jugadorNombre: string;
  clase: string;
  nivel: number;
  pgActuales: number;
  pgMaximos: number;
  ca: number;
  condiciones: string[];
  recursosClase: { nombre: string; actual: number; maximo: number }[];
  espaciosHechizo: { nivel: number; usados: number; maximo: number }[];
  ultimaActualizacion: string;
}
