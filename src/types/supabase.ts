/**
 * TypeScript types matching the Supabase database schema.
 * Generated from supabase/migrations/001_master_mode.sql
 */

// ─── Database type map (used by supabase-js generics) ────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      personajes: {
        Row: PersonajeRow;
        Insert: PersonajeInsert;
        Update: PersonajeUpdate;
      };
      campanas_master: {
        Row: CampanaMasterRow;
        Insert: CampanaMasterInsert;
        Update: CampanaMasterUpdate;
      };
      campana_jugadores: {
        Row: CampanaJugadorRow;
        Insert: CampanaJugadorInsert;
        Update: CampanaJugadorUpdate;
      };
      campanas_jugador: {
        Row: CampanaJugadorLocalRow;
        Insert: CampanaJugadorLocalInsert;
        Update: CampanaJugadorLocalUpdate;
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ─── Profiles ────────────────────────────────────────────────────────

export interface ProfileRow {
  id: string;
  nombre: string;
  avatar_url: string | null;
  codigo_jugador: string;
  es_premium: boolean;
  modo_actual: "jugador" | "master";
  creado_en: string;
  actualizado_en: string;
}

export type ProfileInsert = Partial<Omit<ProfileRow, "id">> & { id: string };
export type ProfileUpdate = Partial<Omit<ProfileRow, "id">>;

// ─── Personajes sincronizados ────────────────────────────────────────

export interface PersonajeRow {
  id: string;
  usuario_id: string;
  datos: Record<string, unknown>;
  codigo_personaje: string;
  actualizado_en: string;
}

export type PersonajeInsert = Omit<PersonajeRow, "actualizado_en"> & {
  actualizado_en?: string;
};
export type PersonajeUpdate = Partial<Omit<PersonajeRow, "id">>;

// ─── Campañas del Master ─────────────────────────────────────────────

export interface CampanaMasterRow {
  id: string;
  master_id: string;
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  creado_en: string;
  actualizado_en: string;
}

export type CampanaMasterInsert = Omit<
  CampanaMasterRow,
  "id" | "creado_en" | "actualizado_en"
> & {
  id?: string;
  creado_en?: string;
  actualizado_en?: string;
};

export type CampanaMasterUpdate = Partial<
  Omit<CampanaMasterRow, "id" | "master_id">
>;

// ─── Relación campaña ↔ jugador ──────────────────────────────────────

export interface CampanaJugadorRow {
  id: string;
  campana_id: string;
  jugador_id: string;
  personaje_id: string | null;
  unido_en: string;
}

export type CampanaJugadorInsert = Omit<CampanaJugadorRow, "id" | "unido_en"> & {
  id?: string;
  unido_en?: string;
};

export type CampanaJugadorUpdate = Partial<
  Omit<CampanaJugadorRow, "id" | "campana_id" | "jugador_id">
>;

// ─── Campañas locales sincronizadas ──────────────────────────────────

export interface CampanaJugadorLocalRow {
  id: string;
  usuario_id: string;
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  personaje_id: string | null;
  creado_en: string;
  actualizado_en: string;
}

export type CampanaJugadorLocalInsert = Omit<
  CampanaJugadorLocalRow,
  "creado_en" | "actualizado_en"
> & {
  creado_en?: string;
  actualizado_en?: string;
};

export type CampanaJugadorLocalUpdate = Partial<
  Omit<CampanaJugadorLocalRow, "id" | "usuario_id">
>;
