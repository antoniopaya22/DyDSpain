/**
 * Store de ajustes y configuración de la app con Zustand y persistencia (HU-14)
 *
 * Gestiona: tema visual, reglas opcionales, unidades de medida,
 * notificaciones y preferencias generales.
 */

import { create } from "zustand";
import { STORAGE_KEYS, setItem, getItem } from "@/utils/storage";

// ─── Tipos ───────────────────────────────────────────────────────────

export type ThemeMode = "claro" | "oscuro" | "auto";
export type UnitSystem = "imperial" | "metrico";

export interface OptionalRules {
  /** Activar sistema de dotes en lugar de ASI (HU-15) */
  dotesActivas: boolean;
  /** Permitir multiclase en la creación/subida de nivel */
  multiclase: boolean;
  /** true = valor fijo de PV al subir de nivel, false = tirar dado */
  pvFijos: boolean;
  /** Permitir compra de puntos de característica en la creación */
  compraPuntos: boolean;
  /** Activar reglas de carga/peso estrictas */
  encumbranceDetallada: boolean;
}

export interface AppSettings {
  /** Tema visual de la app */
  tema: ThemeMode;
  /** Sistema de unidades de medida */
  unidades: UnitSystem;
  /** Si las notificaciones locales están activas */
  notificacionesActivas: boolean;
  /** Minutos de anticipación para recordatorio de sesión */
  recordatorioAnticipacion: number;
  /** Reglas opcionales activadas */
  reglasOpcionales: OptionalRules;
  /** Fecha del último backup (ISO string o null) */
  ultimoBackup: string | null;
}

// ─── Estado por defecto ──────────────────────────────────────────────

const DEFAULT_OPTIONAL_RULES: OptionalRules = {
  dotesActivas: false,
  multiclase: false,
  pvFijos: true,
  compraPuntos: true,
  encumbranceDetallada: false,
};

const DEFAULT_SETTINGS: AppSettings = {
  tema: "oscuro",
  unidades: "metrico",
  notificacionesActivas: false,
  recordatorioAnticipacion: 60,
  reglasOpcionales: { ...DEFAULT_OPTIONAL_RULES },
  ultimoBackup: null,
};

// ─── Interfaces del store ────────────────────────────────────────────

interface SettingsState {
  /** Configuración actual */
  settings: AppSettings;
  /** Si se están cargando los ajustes */
  loading: boolean;
  /** Mensaje de error */
  error: string | null;
  /** Si los ajustes ya fueron cargados desde storage */
  loaded: boolean;
}

interface SettingsActions {
  /** Carga los ajustes desde AsyncStorage */
  loadSettings: () => Promise<void>;
  /** Guarda los ajustes actuales en AsyncStorage */
  saveSettings: () => Promise<void>;

  // ── Tema ──
  /** Cambia el tema visual */
  setTheme: (tema: ThemeMode) => Promise<void>;

  // ── Unidades ──
  /** Cambia el sistema de unidades */
  setUnits: (unidades: UnitSystem) => Promise<void>;

  // ── Reglas opcionales ──
  /** Activa o desactiva una regla opcional */
  toggleOptionalRule: (rule: keyof OptionalRules) => Promise<void>;
  /** Establece un valor específico para una regla opcional */
  setOptionalRule: (rule: keyof OptionalRules, value: boolean) => Promise<void>;
  /** Restablece las reglas opcionales a sus valores por defecto */
  resetOptionalRules: () => Promise<void>;

  // ── Notificaciones ──
  /** Activa o desactiva notificaciones */
  setNotificaciones: (activas: boolean) => Promise<void>;
  /** Cambia la anticipación del recordatorio */
  setRecordatorioAnticipacion: (minutos: number) => Promise<void>;

  // ── Backup ──
  /** Registra la fecha del último backup */
  setUltimoBackup: (fecha: string) => Promise<void>;

  // ── Reset ──
  /** Restablece TODOS los ajustes a sus valores por defecto */
  resetAllSettings: () => Promise<void>;

  /** Limpia el error actual */
  clearError: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

// ─── Helper de persistencia ──────────────────────────────────────────

async function persistSettings(settings: AppSettings): Promise<void> {
  try {
    await setItem(STORAGE_KEYS.SETTINGS, settings);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[SettingsStore] Error persisting settings: ${message}`);
  }
}

// ─── Store ───────────────────────────────────────────────────────────

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  // ── Estado inicial ──
  settings: { ...DEFAULT_SETTINGS },
  loading: false,
  error: null,
  loaded: false,

  // ── Acciones ──

  loadSettings: async () => {
    set({ loading: true, error: null });
    try {
      const stored = await getItem<AppSettings>(STORAGE_KEYS.SETTINGS);
      if (stored) {
        // Merge con defaults para cubrir campos nuevos que no existan en storage
        const merged: AppSettings = {
          ...DEFAULT_SETTINGS,
          ...stored,
          reglasOpcionales: {
            ...DEFAULT_OPTIONAL_RULES,
            ...(stored.reglasOpcionales || {}),
          },
        };
        set({ settings: merged, loading: false, loaded: true });
      } else {
        // Primera ejecución: guardar defaults
        await persistSettings(DEFAULT_SETTINGS);
        set({ settings: { ...DEFAULT_SETTINGS }, loading: false, loaded: true });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar los ajustes";
      console.error("[SettingsStore] loadSettings:", message);
      set({ error: message, loading: false, loaded: true });
    }
  },

  saveSettings: async () => {
    try {
      const { settings } = get();
      await persistSettings(settings);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al guardar los ajustes";
      console.error("[SettingsStore] saveSettings:", message);
      set({ error: message });
    }
  },

  setTheme: async (tema: ThemeMode) => {
    const { settings } = get();
    const updated = { ...settings, tema };
    set({ settings: updated });
    await persistSettings(updated);
  },

  setUnits: async (unidades: UnitSystem) => {
    const { settings } = get();
    const updated = { ...settings, unidades };
    set({ settings: updated });
    await persistSettings(updated);
  },

  toggleOptionalRule: async (rule: keyof OptionalRules) => {
    const { settings } = get();
    const updated: AppSettings = {
      ...settings,
      reglasOpcionales: {
        ...settings.reglasOpcionales,
        [rule]: !settings.reglasOpcionales[rule],
      },
    };
    set({ settings: updated });
    await persistSettings(updated);
  },

  setOptionalRule: async (rule: keyof OptionalRules, value: boolean) => {
    const { settings } = get();
    const updated: AppSettings = {
      ...settings,
      reglasOpcionales: {
        ...settings.reglasOpcionales,
        [rule]: value,
      },
    };
    set({ settings: updated });
    await persistSettings(updated);
  },

  resetOptionalRules: async () => {
    const { settings } = get();
    const updated: AppSettings = {
      ...settings,
      reglasOpcionales: { ...DEFAULT_OPTIONAL_RULES },
    };
    set({ settings: updated });
    await persistSettings(updated);
  },

  setNotificaciones: async (activas: boolean) => {
    const { settings } = get();
    const updated = { ...settings, notificacionesActivas: activas };
    set({ settings: updated });
    await persistSettings(updated);
  },

  setRecordatorioAnticipacion: async (minutos: number) => {
    const { settings } = get();
    const clamped = Math.max(0, Math.min(1440, minutos)); // 0 a 24h
    const updated = { ...settings, recordatorioAnticipacion: clamped };
    set({ settings: updated });
    await persistSettings(updated);
  },

  setUltimoBackup: async (fecha: string) => {
    const { settings } = get();
    const updated = { ...settings, ultimoBackup: fecha };
    set({ settings: updated });
    await persistSettings(updated);
  },

  resetAllSettings: async () => {
    const defaults = { ...DEFAULT_SETTINGS, reglasOpcionales: { ...DEFAULT_OPTIONAL_RULES } };
    set({ settings: defaults, error: null });
    await persistSettings(defaults);
  },

  clearError: () => {
    set({ error: null });
  },
}));

// ─── Selectores de conveniencia ──────────────────────────────────────

/** Devuelve true si las dotes están activadas como regla opcional */
export function useDotesActivas(): boolean {
  return useSettingsStore((state) => state.settings.reglasOpcionales.dotesActivas);
}

/** Devuelve true si la multiclase está activada */
export function useMulticlaseActiva(): boolean {
  return useSettingsStore((state) => state.settings.reglasOpcionales.multiclase);
}

/** Devuelve true si se usan PV fijos al subir de nivel */
export function usePvFijos(): boolean {
  return useSettingsStore((state) => state.settings.reglasOpcionales.pvFijos);
}

/** Devuelve el tema actual */
export function useTemaActual(): ThemeMode {
  return useSettingsStore((state) => state.settings.tema);
}

/** Devuelve el sistema de unidades actual */
export function useUnidadesActuales(): UnitSystem {
  return useSettingsStore((state) => state.settings.unidades);
}

// Re-export unit conversion utilities (moved to @/utils/units)
export { convertirDistancia, convertirPeso } from "@/utils/units";

// ─── Constantes de la app para "Acerca de" (HU-14.7) ────────────────

export const APP_INFO = {
  nombre: "DyMEs",
  nombreCompleto: "DyMEs — Dungeons & Dragons 5e",
  version: "1.0.0",
  descripcion:
    "Aplicación de gestión de personajes y partidas de D&D 5e en español. " +
    "Todo el contenido del SRD 5.1 disponible offline.",
  desarrollador: "DyMEs Team",
  licenciaSRD:
    "Este producto contiene material del Systems Reference Document 5.1 " +
    '("SRD 5.1") de Wizards of the Coast LLC, disponible bajo la ' +
    "Creative Commons Attribution 4.0 International License (CC BY 4.0).",
  enlaceSRD: "https://srd.nosolorol.com/DD5/index.html",
  tecnologias: [
    "React Native",
    "Expo",
    "NativeWind (Tailwind CSS)",
    "Zustand",
    "TypeScript",
    "AsyncStorage",
  ],
  repositorio: "",
} as const;
