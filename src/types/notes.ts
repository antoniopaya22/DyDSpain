/**
 * Tipos para el sistema de notas de D&D 5e en español (HU-09)
 */

// Re-export constants (moved to @/constants/notes)
export {
  NOTE_TYPE_NAMES,
  PREDEFINED_TAG_NAMES,
  PREDEFINED_TAG_ICONS,
  PREDEFINED_TAG_COLORS,
} from "@/constants/notes";

// Re-export utility functions (moved to @/utils/notes)
export {
  createDefaultNote,
  createQuickNote,
  getPredefinedTags,
  filterNotes,
  sortNotes,
  getNotePreview,
  getNextSessionNumber,
} from "@/utils/notes";

// ─── Tipos de nota ───────────────────────────────────────────────────

export type NoteType = "general" | "diario";

// ─── Etiquetas predefinidas ──────────────────────────────────────────

export type PredefinedTag =
  | "npc"
  | "lugar"
  | "mision"
  | "objeto"
  | "lore"
  | "pista"
  | "comercio"
  | "general";

// ─── Etiqueta (tag) ──────────────────────────────────────────────────

export interface NoteTag {
  /** Identificador único de la etiqueta */
  id: string;
  /** Nombre visible de la etiqueta */
  nombre: string;
  /** Icono (emoji o nombre de icono) */
  icon: string;
  /** Color hexadecimal */
  color: string;
  /** Si es una etiqueta predefinida del sistema o personalizada */
  predefined: boolean;
}

// ─── Nota ────────────────────────────────────────────────────────────

export interface Note {
  /** Identificador único (UUID) */
  id: string;
  /** UUID del personaje al que pertenece la nota */
  personajeId: string;
  /** UUID de la partida asociada */
  partidaId: string;
  /** Título de la nota (obligatorio) */
  titulo: string;
  /** Contenido de texto libre */
  contenido: string;
  /** IDs de etiquetas asociadas */
  etiquetas: string[];
  /** Si la nota está fijada/pinneada en la parte superior */
  fijada: boolean;
  /** Tipo de nota: general o entrada de diario */
  tipo: NoteType;
  /** Número de sesión (solo para tipo 'diario') */
  numeroSesion: number | null;
  /** Fecha de la sesión de juego (solo para tipo 'diario') */
  fechaSesion: string | null;
  /** Si la nota es visible para el Master (modo master) */
  visibleParaMaster: boolean;
  /** Si la nota fue enviada por el Master */
  enviadaPorMaster: boolean;
  /** UUID del master que envió la nota (si aplica) */
  masterRemitenteId: string | null;
  /** Fecha de creación (ISO 8601) */
  fechaCreacion: string;
  /** Fecha de última modificación (ISO 8601) */
  fechaModificacion: string;
}

// ─── Entrada para crear nota ─────────────────────────────────────────

export interface CreateNoteInput {
  personajeId: string;
  partidaId: string;
  titulo: string;
  contenido: string;
  etiquetas?: string[];
  tipo?: NoteType;
  numeroSesion?: number | null;
  fechaSesion?: string | null;
  visibleParaMaster?: boolean;
}

// ─── Entrada para actualizar nota ────────────────────────────────────

export interface UpdateNoteInput {
  titulo?: string;
  contenido?: string;
  etiquetas?: string[];
  fijada?: boolean;
  tipo?: NoteType;
  numeroSesion?: number | null;
  fechaSesion?: string | null;
  visibleParaMaster?: boolean;
}

// ─── Nota rápida (HU-09.9) ──────────────────────────────────────────

export interface QuickNoteInput {
  personajeId: string;
  partidaId: string;
  contenido: string;
}

// ─── Filtros de búsqueda de notas ────────────────────────────────────

export interface NoteFilters {
  /** Texto de búsqueda (busca en título y contenido) */
  searchQuery?: string;
  /** Filtrar por etiquetas (IDs) */
  tagIds?: string[];
  /** Filtrar por tipo de nota */
  tipo?: NoteType;
  /** Filtrar solo notas fijadas */
  soloFijadas?: boolean;
  /** Filtrar solo notas del master */
  soloDelMaster?: boolean;
  /** Filtrar solo notas visibles para el master */
  soloVisiblesParaMaster?: boolean;
}

// ─── Opciones de ordenamiento ────────────────────────────────────────

export type NoteSortField =
  | "fechaModificacion"
  | "fechaCreacion"
  | "titulo"
  | "numeroSesion";

export type NoteSortOrder = "asc" | "desc";

export interface NoteSortOptions {
  field: NoteSortField;
  order: NoteSortOrder;
}

// ─── Estado del store de notas ───────────────────────────────────────

export interface NotesState {
  /** Todas las notas cargadas */
  notes: Note[];
  /** Etiquetas personalizadas creadas por el usuario */
  customTags: NoteTag[];
  /** Filtros activos */
  activeFilters: NoteFilters;
  /** Ordenamiento actual */
  sortOptions: NoteSortOptions;
  /** Si se está cargando datos */
  loading: boolean;
}
