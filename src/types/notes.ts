/**
 * Tipos para el sistema de notas de D&D 5e en español (HU-09)
 */

// ─── Tipos de nota ───────────────────────────────────────────────────

export type NoteType = "general" | "diario";

export const NOTE_TYPE_NAMES: Record<NoteType, string> = {
  general: "General",
  diario: "Diario de Sesión",
};

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

export const PREDEFINED_TAG_NAMES: Record<PredefinedTag, string> = {
  npc: "NPC",
  lugar: "Lugar",
  mision: "Misión",
  objeto: "Objeto",
  lore: "Lore / Historia",
  pista: "Pista",
  comercio: "Comercio",
  general: "General",
};

export const PREDEFINED_TAG_ICONS: Record<PredefinedTag, string> = {
  npc: "🧑",
  lugar: "📍",
  mision: "⚔️",
  objeto: "🔮",
  lore: "📖",
  pista: "💡",
  comercio: "💰",
  general: "📝",
};

export const PREDEFINED_TAG_COLORS: Record<PredefinedTag, string> = {
  npc: "#f59e0b",
  lugar: "#22c55e",
  mision: "#ef4444",
  objeto: "#a855f7",
  lore: "#3b82f6",
  pista: "#eab308",
  comercio: "#f97316",
  general: "#6b7280",
};

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

// ─── Funciones utilitarias de notas ──────────────────────────────────

/**
 * Crea una nota vacía por defecto con los campos mínimos.
 */
export function createDefaultNote(
  id: string,
  personajeId: string,
  partidaId: string
): Note {
  const now = new Date().toISOString();
  return {
    id,
    personajeId,
    partidaId,
    titulo: "",
    contenido: "",
    etiquetas: [],
    fijada: false,
    tipo: "general",
    numeroSesion: null,
    fechaSesion: null,
    visibleParaMaster: false,
    enviadaPorMaster: false,
    masterRemitenteId: null,
    fechaCreacion: now,
    fechaModificacion: now,
  };
}

/**
 * Crea una nota rápida con título auto-generado basado en la fecha actual.
 */
export function createQuickNote(
  id: string,
  input: QuickNoteInput
): Note {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    id,
    personajeId: input.personajeId,
    partidaId: input.partidaId,
    titulo: `Nota rápida - ${formattedDate} ${formattedTime}`,
    contenido: input.contenido,
    etiquetas: [],
    fijada: false,
    tipo: "general",
    numeroSesion: null,
    fechaSesion: null,
    visibleParaMaster: false,
    enviadaPorMaster: false,
    masterRemitenteId: null,
    fechaCreacion: now.toISOString(),
    fechaModificacion: now.toISOString(),
  };
}

/**
 * Genera las etiquetas predefinidas como objetos NoteTag.
 */
export function getPredefinedTags(): NoteTag[] {
  const predefinedKeys: PredefinedTag[] = [
    "npc",
    "lugar",
    "mision",
    "objeto",
    "lore",
    "pista",
    "comercio",
    "general",
  ];

  return predefinedKeys.map((key) => ({
    id: `predefined_${key}`,
    nombre: PREDEFINED_TAG_NAMES[key],
    icon: PREDEFINED_TAG_ICONS[key],
    color: PREDEFINED_TAG_COLORS[key],
    predefined: true,
  }));
}

/**
 * Filtra notas según los filtros proporcionados.
 */
export function filterNotes(notes: Note[], filters: NoteFilters): Note[] {
  let result = [...notes];

  // Filtrar por texto de búsqueda
  if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
    const query = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (note) =>
        note.titulo.toLowerCase().includes(query) ||
        note.contenido.toLowerCase().includes(query)
    );
  }

  // Filtrar por etiquetas
  if (filters.tagIds && filters.tagIds.length > 0) {
    result = result.filter((note) =>
      filters.tagIds!.some((tagId) => note.etiquetas.includes(tagId))
    );
  }

  // Filtrar por tipo
  if (filters.tipo) {
    result = result.filter((note) => note.tipo === filters.tipo);
  }

  // Filtrar solo fijadas
  if (filters.soloFijadas) {
    result = result.filter((note) => note.fijada);
  }

  // Filtrar solo notas del master
  if (filters.soloDelMaster) {
    result = result.filter((note) => note.enviadaPorMaster);
  }

  // Filtrar solo notas visibles para el master
  if (filters.soloVisiblesParaMaster) {
    result = result.filter((note) => note.visibleParaMaster);
  }

  return result;
}

/**
 * Ordena notas según las opciones de ordenamiento.
 * Las notas fijadas siempre aparecen primero, independientemente del orden.
 */
export function sortNotes(notes: Note[], options: NoteSortOptions): Note[] {
  const pinned = notes.filter((n) => n.fijada);
  const unpinned = notes.filter((n) => !n.fijada);

  const compareFn = (a: Note, b: Note): number => {
    let comparison = 0;

    switch (options.field) {
      case "fechaModificacion":
        comparison =
          new Date(a.fechaModificacion).getTime() -
          new Date(b.fechaModificacion).getTime();
        break;
      case "fechaCreacion":
        comparison =
          new Date(a.fechaCreacion).getTime() -
          new Date(b.fechaCreacion).getTime();
        break;
      case "titulo":
        comparison = a.titulo.localeCompare(b.titulo, "es");
        break;
      case "numeroSesion":
        comparison = (a.numeroSesion ?? 0) - (b.numeroSesion ?? 0);
        break;
    }

    return options.order === "desc" ? -comparison : comparison;
  };

  pinned.sort(compareFn);
  unpinned.sort(compareFn);

  return [...pinned, ...unpinned];
}

/**
 * Genera la vista previa de una nota (primeras líneas del contenido).
 * @param contenido - Contenido completo de la nota
 * @param maxLength - Longitud máxima de la vista previa (por defecto 120 caracteres)
 */
export function getNotPreview(contenido: string, maxLength: number = 120): string {
  if (!contenido || contenido.trim().length === 0) {
    return "Sin contenido";
  }

  const trimmed = contenido.trim().replace(/\n+/g, " ");

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return trimmed.substring(0, maxLength).trim() + "...";
}

/**
 * Calcula el siguiente número de sesión basándose en las notas de diario existentes.
 */
export function getNextSessionNumber(notes: Note[]): number {
  const diaryNotes = notes.filter(
    (n) => n.tipo === "diario" && n.numeroSesion !== null
  );

  if (diaryNotes.length === 0) return 1;

  const maxSession = Math.max(
    ...diaryNotes.map((n) => n.numeroSesion ?? 0)
  );

  return maxSession + 1;
}
