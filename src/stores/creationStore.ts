/**
 * Store de creación de personaje (wizard) con Zustand y persistencia del borrador.
 * Gestiona el estado del wizard paso a paso (HU-02) con guardado automático
 * del borrador en AsyncStorage para recuperación.
 */

import { create } from "zustand";
import { randomUUID } from "expo-crypto";
import type {
  CharacterCreationDraft,
  AbilityScores,
  AbilityScoreMethod,
  AbilityKey,
  RaceId,
  SubraceId,
  ClassId,
  BackgroundId,
  SkillKey,
  Alignment,
  Personality,
  Appearance,
  Character,
  AbilityScoresDetailed,
  AbilityScoreDetail,
  SkillProficiencies,
  SkillProficiency,
  SavingThrowProficiencies,
  HitPoints,
  HitDicePool,
  DeathSaves,
  SpeedInfo,
  Proficiencies,
  CombatLogEntry,
} from "@/types/character";
import {
  calcModifier,
  calcProficiencyBonus,
  SKILLS,
} from "@/types/character";
import { STORAGE_KEYS, setItem, getItem, removeItem } from "@/utils/storage";
import { getRaceData, getSubraceData, getTotalRacialBonuses } from "@/data/srd/races";
import { getClassData, calcLevel1HP } from "@/data/srd/classes";
import { getBackgroundData } from "@/data/srd/backgrounds";
import { createDefaultInventory } from "@/types/item";

// ─── Constantes ──────────────────────────────────────────────────────

export const TOTAL_STEPS = 11;

export const STEP_NAMES: Record<number, string> = {
  1: "Nombre",
  2: "Raza",
  3: "Clase",
  4: "Estadísticas",
  5: "Trasfondo",
  6: "Habilidades",
  7: "Hechizos",
  8: "Equipamiento",
  9: "Personalidad",
  10: "Apariencia",
  11: "Resumen",
};

export const STEP_ROUTES: Record<number, string> = {
  1: "index",
  2: "race",
  3: "class",
  4: "abilities",
  5: "background",
  6: "skills",
  7: "spells",
  8: "equipment",
  9: "personality",
  10: "appearance",
  11: "summary",
};

// ─── Tipos del store ─────────────────────────────────────────────────

interface CreationState {
  /** Borrador actual de creación */
  draft: CharacterCreationDraft | null;
  /** Si se está cargando el borrador */
  loading: boolean;
  /** Mensaje de error */
  error: string | null;
  /** Si hay cambios sin guardar */
  isDirty: boolean;
}

interface CreationActions {
  // ── Gestión del borrador ──
  /** Inicia un nuevo borrador para una campaña */
  startCreation: (campaignId: string) => Promise<void>;
  /** Carga un borrador existente de AsyncStorage */
  loadDraft: (campaignId: string) => Promise<boolean>;
  /** Guarda el borrador actual en AsyncStorage */
  saveDraft: () => Promise<void>;
  /** Elimina el borrador de creación */
  discardDraft: (campaignId: string) => Promise<void>;
  /** Comprueba si existe un borrador para una campaña */
  hasDraft: (campaignId: string) => Promise<boolean>;

  // ── Navegación entre pasos ──
  /** Avanza al siguiente paso */
  nextStep: () => void;
  /** Retrocede al paso anterior */
  prevStep: () => void;
  /** Va a un paso específico */
  goToStep: (step: number) => void;

  // ── Setters de cada paso del wizard ──
  /** Paso 1: Nombre */
  setNombre: (nombre: string) => void;
  /** Paso 2: Raza y subraza */
  setRaza: (raza: RaceId, subraza: SubraceId) => void;
  /** Paso 3: Clase */
  setClase: (clase: ClassId) => void;
  /** Paso 4: Estadísticas */
  setAbilityScoreMethod: (method: AbilityScoreMethod) => void;
  setAbilityScores: (scores: AbilityScores) => void;
  /** Paso 5: Trasfondo */
  setTrasfondo: (trasfondo: BackgroundId) => void;
  /** Paso 6: Habilidades */
  setSkillChoices: (skills: SkillKey[]) => void;
  /** Paso 7: Hechizos */
  setSpellChoices: (choices: {
    cantrips: string[];
    spells: string[];
    spellbook?: string[];
  }) => void;
  /** Paso 8: Equipamiento */
  setEquipmentChoices: (choices: Record<string, string>) => void;
  /** Paso 9: Personalidad y alineamiento */
  setPersonality: (personality: Personality) => void;
  setAlineamiento: (alineamiento: Alignment) => void;
  /** Paso 10: Apariencia */
  setAppearance: (appearance: Appearance) => void;
  /** Bonificadores libres de raza (semielfo) */
  setFreeAbilityBonuses: (bonuses: AbilityKey[]) => void;

  // ── Validación ──
  /** Valida si un paso está completo */
  isStepValid: (step: number) => boolean;
  /** Obtiene los pasos completados hasta ahora */
  getCompletedSteps: () => number[];

  // ── Construcción del personaje ──
  /** Ensambla el personaje final a partir del borrador */
  buildCharacter: () => Character | null;

  // ── Utilidades ──
  /** Limpia el estado del store */
  reset: () => void;
  /** Limpia errores */
  clearError: () => void;
}

type CreationStore = CreationState & CreationActions;

// ─── Estado inicial ──────────────────────────────────────────────────

const INITIAL_STATE: CreationState = {
  draft: null,
  loading: false,
  error: null,
  isDirty: false,
};

// ─── Store ───────────────────────────────────────────────────────────

export const useCreationStore = create<CreationStore>((set, get) => ({
  ...INITIAL_STATE,

  // ── Gestión del borrador ───────────────────────────────────────────

  startCreation: async (campaignId: string) => {
    const newDraft: CharacterCreationDraft = {
      currentStep: 1,
      campaignId,
      lastSaved: new Date().toISOString(),
    };
    set({ draft: newDraft, isDirty: true, error: null });
    await setItem(STORAGE_KEYS.CREATION_DRAFT(campaignId), newDraft);
  },

  loadDraft: async (campaignId: string) => {
    set({ loading: true, error: null });
    try {
      const stored = await getItem<CharacterCreationDraft>(
        STORAGE_KEYS.CREATION_DRAFT(campaignId)
      );
      if (stored) {
        set({ draft: stored, loading: false, isDirty: false });
        return true;
      }
      set({ loading: false });
      return false;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar el borrador";
      console.error("[CreationStore] loadDraft:", message);
      set({ error: message, loading: false });
      return false;
    }
  },

  saveDraft: async () => {
    const { draft } = get();
    if (!draft) return;

    try {
      const updatedDraft = {
        ...draft,
        lastSaved: new Date().toISOString(),
      };
      await setItem(
        STORAGE_KEYS.CREATION_DRAFT(draft.campaignId),
        updatedDraft
      );
      set({ draft: updatedDraft, isDirty: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al guardar el borrador";
      console.error("[CreationStore] saveDraft:", message);
      set({ error: message });
    }
  },

  discardDraft: async (campaignId: string) => {
    try {
      await removeItem(STORAGE_KEYS.CREATION_DRAFT(campaignId));
      set(INITIAL_STATE);
    } catch (err) {
      console.warn("[CreationStore] discardDraft: error al eliminar borrador");
    }
  },

  hasDraft: async (campaignId: string) => {
    try {
      const stored = await getItem<CharacterCreationDraft>(
        STORAGE_KEYS.CREATION_DRAFT(campaignId)
      );
      return stored !== null;
    } catch {
      return false;
    }
  },

  // ── Navegación entre pasos ─────────────────────────────────────────

  nextStep: () => {
    const { draft } = get();
    if (!draft || draft.currentStep >= TOTAL_STEPS) return;
    const newDraft = { ...draft, currentStep: draft.currentStep + 1 };
    set({ draft: newDraft, isDirty: true });
  },

  prevStep: () => {
    const { draft } = get();
    if (!draft || draft.currentStep <= 1) return;
    const newDraft = { ...draft, currentStep: draft.currentStep - 1 };
    set({ draft: newDraft, isDirty: true });
  },

  goToStep: (step: number) => {
    const { draft } = get();
    if (!draft || step < 1 || step > TOTAL_STEPS) return;
    const newDraft = { ...draft, currentStep: step };
    set({ draft: newDraft, isDirty: true });
  },

  // ── Setters de cada paso ───────────────────────────────────────────

  setNombre: (nombre: string) => {
    const { draft } = get();
    if (!draft) return;
    set({ draft: { ...draft, nombre }, isDirty: true });
  },

  setRaza: (raza: RaceId, subraza: SubraceId) => {
    const { draft } = get();
    if (!draft) return;
    set({
      draft: {
        ...draft,
        raza,
        subraza,
        // Limpiar elecciones que dependen de la raza
        skillChoices: undefined,
      },
      isDirty: true,
    });
  },

  setClase: (clase: ClassId) => {
    const { draft } = get();
    if (!draft) return;
    set({
      draft: {
        ...draft,
        clase,
        // Limpiar elecciones que dependen de la clase
        skillChoices: undefined,
        spellChoices: undefined,
        equipmentChoices: undefined,
      },
      isDirty: true,
    });
  },

  setAbilityScoreMethod: (method: AbilityScoreMethod) => {
    const { draft } = get();
    if (!draft) return;
    set({
      draft: { ...draft, abilityScoreMethod: method },
      isDirty: true,
    });
  },

  setAbilityScores: (scores: AbilityScores) => {
    const { draft } = get();
    if (!draft) return;
    set({
      draft: { ...draft, abilityScoresBase: scores },
      isDirty: true,
    });
  },

  setTrasfondo: (trasfondo: BackgroundId) => {
    const { draft } = get();
    if (!draft) return;
    set({
      draft: {
        ...draft,
        trasfondo,
        // Limpiar elecciones de habilidades ya que el trasfondo otorga habilidades fijas
        skillChoices: undefined,
      },
      isDirty: true,
    });
  },

  setSkillChoices: (skills: SkillKey[]) => {
    const { draft } = get();
    if (!draft) return;
    set({
      draft: { ...draft, skillChoices: skills },
      isDirty: true,
    });
  },

  setSpellChoices: (choices) => {
    const { draft } = get();
    if (!draft) return;
    set({
      draft: { ...draft, spellChoices: choices },
      isDirty: true,
    });
  },

  setEquipmentChoices: (choices: Record<string, string>) => {
    const { draft } = get();
    if (!draft) return;
    set({
      draft: { ...draft, equipmentChoices: choices },
      isDirty: true,
    });
  },

  setPersonality: (personality: Personality) => {
    const { draft } = get();
    if (!draft) return;
    set({
      draft: { ...draft, personality },
      isDirty: true,
    });
  },

  setAlineamiento: (alineamiento: Alignment) => {
    const { draft } = get();
    if (!draft) return;
    set({
      draft: { ...draft, alineamiento },
      isDirty: true,
    });
  },

  setAppearance: (appearance: Appearance) => {
    const { draft } = get();
    if (!draft) return;
    set({
      draft: { ...draft, appearance },
      isDirty: true,
    });
  },

  setFreeAbilityBonuses: (bonuses: AbilityKey[]) => {
    const { draft } = get();
    if (!draft) return;
    set({
      draft: { ...draft, freeAbilityBonuses: bonuses },
      isDirty: true,
    });
  },

  // ── Validación ─────────────────────────────────────────────────────

  isStepValid: (step: number) => {
    const { draft } = get();
    if (!draft) return false;

    switch (step) {
      case 1: // Nombre
        return !!draft.nombre && draft.nombre.trim().length >= 1;

      case 2: // Raza
        if (!draft.raza) return false;
        const raceData = getRaceData(draft.raza);
        // Si la raza tiene subrazas, una debe estar seleccionada
        if (raceData.subraces.length > 0 && !draft.subraza) return false;
        return true;

      case 3: // Clase
        return !!draft.clase;

      case 4: // Estadísticas
        if (!draft.abilityScoreMethod || !draft.abilityScoresBase) return false;
        const scores = draft.abilityScoresBase;
        // Todas las puntuaciones deben ser al menos 1
        return (
          scores.fue >= 1 &&
          scores.des >= 1 &&
          scores.con >= 1 &&
          scores.int >= 1 &&
          scores.sab >= 1 &&
          scores.car >= 1
        );

      case 5: // Trasfondo
        return !!draft.trasfondo;

      case 6: // Habilidades
        return !!draft.skillChoices && draft.skillChoices.length > 0;

      case 7: // Hechizos (puede ser válido sin hechizos si la clase no lanza conjuros)
        if (!draft.clase) return false;
        const classData = getClassData(draft.clase);
        if (classData.casterType === "none") return true;
        // Half-casters sin conjuros a nivel 1 (explorador, paladín)
        if (classData.cantripsAtLevel1 === 0 && classData.spellsAtLevel1 === 0) return true;
        return !!draft.spellChoices;

      case 8: // Equipamiento
        return !!draft.equipmentChoices;

      case 9: // Personalidad
        return !!draft.personality && !!draft.alineamiento;

      case 10: // Apariencia (opcional, siempre válido)
        return true;

      case 11: // Resumen (válido si todos los pasos anteriores son válidos)
        // Check steps 1-9 directly to avoid circular recursion with getCompletedSteps
        for (let s = 1; s <= 9; s++) {
          if (!get().isStepValid(s)) return false;
        }
        return true;

      default:
        return false;
    }
  },

  getCompletedSteps: () => {
    const { isStepValid } = get();
    const completed: number[] = [];
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      if (isStepValid(i)) {
        completed.push(i);
      }
    }
    return completed;
  },

  // ── Construcción del personaje ─────────────────────────────────────

  buildCharacter: () => {
    const { draft } = get();
    if (!draft) return null;

    // Validar que los datos mínimos estén presentes
    if (
      !draft.nombre ||
      !draft.raza ||
      !draft.clase ||
      !draft.abilityScoresBase ||
      !draft.trasfondo ||
      !draft.alineamiento
    ) {
      return null;
    }

    const characterId = randomUUID();
    const inventoryId = randomUUID();
    const now = new Date().toISOString();

    const raceData = getRaceData(draft.raza);
    const subraceData = draft.subraza
      ? getSubraceData(draft.raza, draft.subraza)
      : null;
    const classData = getClassData(draft.clase);
    const backgroundData = getBackgroundData(draft.trasfondo);

    // ── Calcular bonificadores raciales ──
    const racialBonuses = getTotalRacialBonuses(draft.raza, draft.subraza ?? null);

    // ── Calcular bonificadores libres (ej: semielfo elige 2 × +1) ──
    const freeBonuses: Partial<Record<AbilityKey, number>> = {};
    if (draft.freeAbilityBonuses && draft.freeAbilityBonuses.length > 0) {
      for (const key of draft.freeAbilityBonuses) {
        freeBonuses[key] = (freeBonuses[key] ?? 0) + 1;
      }
    }

    // ── Construir puntuaciones de característica detalladas ──
    const baseScores = draft.abilityScoresBase;
    const abilityKeys: AbilityKey[] = ["fue", "des", "con", "int", "sab", "car"];

    const abilityScores: AbilityScoresDetailed = {} as AbilityScoresDetailed;
    for (const key of abilityKeys) {
      const base = baseScores[key];
      const racial = (racialBonuses[key] ?? 0) + (freeBonuses[key] ?? 0);
      const total = base + racial;
      const detail: AbilityScoreDetail = {
        base,
        racial,
        improvement: 0,
        misc: 0,
        override: null,
        total,
        modifier: calcModifier(total),
      };
      abilityScores[key] = detail;
    }

    // ── Competencias de habilidades ──
    const skillProficiencies: SkillProficiencies = {} as SkillProficiencies;
    const allSkillKeys = Object.keys(SKILLS) as SkillKey[];
    for (const sk of allSkillKeys) {
      skillProficiencies[sk] = { level: "none" };
    }

    // Habilidades del trasfondo
    for (const sk of backgroundData.skillProficiencies) {
      skillProficiencies[sk] = { level: "proficient", source: "trasfondo" };
    }

    // Habilidades de la raza
    if (raceData.skillProficiencies) {
      for (const sk of raceData.skillProficiencies) {
        skillProficiencies[sk] = { level: "proficient", source: "raza" };
      }
    }

    // Habilidades elegidas por el jugador (clase + raza si aplica)
    if (draft.skillChoices) {
      for (const sk of draft.skillChoices) {
        if (skillProficiencies[sk].level === "none") {
          skillProficiencies[sk] = { level: "proficient", source: "clase" };
        }
      }
    }

    // ── Tiradas de salvación ──
    const savingThrows: SavingThrowProficiencies = {} as SavingThrowProficiencies;
    for (const key of abilityKeys) {
      savingThrows[key] = {
        proficient: classData.savingThrows.includes(key),
        source: classData.savingThrows.includes(key) ? "clase" : undefined,
      };
    }

    // ── Puntos de golpe ──
    const conMod = abilityScores.con.modifier;
    const hpBonusPerLevel = subraceData?.hpBonusPerLevel ?? 0;
    const maxHP = calcLevel1HP(draft.clase, conMod) + hpBonusPerLevel;

    const hp: HitPoints = {
      max: maxHP,
      current: maxHP,
      temp: 0,
    };

    // ── Dados de golpe ──
    const hitDice: HitDicePool = {
      die: classData.hitDie,
      total: 1,
      remaining: 1,
    };

    // ── Salvaciones de muerte ──
    const deathSaves: DeathSaves = {
      successes: 0,
      failures: 0,
    };

    // ── Velocidad ──
    const speed: SpeedInfo = {
      walk: raceData.speed,
    };

    // ── Competencias generales ──
    const proficiencies: Proficiencies = {
      armors: [...classData.armorProficiencies],
      weapons: [
        ...classData.weaponProficiencies,
        ...(raceData.weaponProficiencies ?? []),
        ...(subraceData?.weaponProficiencies ?? []),
      ],
      tools: [
        ...classData.toolProficiencies,
        ...(backgroundData.toolProficiencies ?? []),
        ...(subraceData?.toolProficiencies ?? []),
      ],
      languages: [
        ...raceData.languages,
      ],
    };

    // ── Rasgos ──
    const traits: Character["traits"] = [];

    // Rasgos de raza
    for (const trait of raceData.traits) {
      traits.push({
        id: randomUUID(),
        nombre: trait.nombre,
        descripcion: trait.descripcion,
        origen: "raza",
        maxUses: null,
        currentUses: null,
        recharge: null,
      });
    }

    // Rasgos de subraza
    if (subraceData) {
      for (const trait of subraceData.traits) {
        traits.push({
          id: randomUUID(),
          nombre: trait.nombre,
          descripcion: trait.descripcion,
          origen: "raza",
          maxUses: null,
          currentUses: null,
          recharge: null,
        });
      }
    }

    // Rasgos de clase (nivel 1)
    for (const feature of classData.level1Features) {
      traits.push({
        id: randomUUID(),
        nombre: feature.nombre,
        descripcion: feature.descripcion,
        origen: "clase",
        maxUses: null,
        currentUses: null,
        recharge: null,
      });
    }

    // Rasgo de trasfondo
    traits.push({
      id: randomUUID(),
      nombre: backgroundData.featureName,
      descripcion: backgroundData.featureDescription,
      origen: "trasfondo",
      maxUses: null,
      currentUses: null,
      recharge: null,
    });

    // ── Personalidad ──
    const personality: Personality = draft.personality ?? {
      traits: [],
      ideals: "",
      bonds: "",
      flaws: "",
    };

    // ── Apariencia ──
    const appearance: Appearance = draft.appearance ?? {};

    // ── Hechizos ──
    const knownSpellIds: string[] = [];
    const preparedSpellIds: string[] = [];
    const spellbookIds: string[] = [];

    if (draft.spellChoices) {
      knownSpellIds.push(
        ...(draft.spellChoices.cantrips ?? []),
        ...(draft.spellChoices.spells ?? [])
      );
      // Para magos, también llenar el libro de hechizos
      if (draft.clase === "mago" && draft.spellChoices.spellbook) {
        spellbookIds.push(...draft.spellChoices.spellbook);
      }
      // Los conjuros conocidos se preparan automáticamente a nivel 1 para la mayoría de clases
      preparedSpellIds.push(...(draft.spellChoices.spells ?? []));
    }

    // ── Historial de nivel ──
    const levelHistory: Character["levelHistory"] = [
      {
        level: 1,
        date: now,
        hpGained: maxHP,
        hpMethod: "fixed",
        spellsLearned: knownSpellIds.length > 0 ? [...knownSpellIds] : undefined,
      },
    ];

    // ── Combate log vacío ──
    const combatLog: CombatLogEntry[] = [];

    // ── Ensamblar personaje ──
    const character: Character = {
      id: characterId,
      campaignId: draft.campaignId,

      nombre: draft.nombre.trim(),
      raza: draft.raza,
      subraza: draft.subraza ?? null,
      clase: draft.clase,
      subclase: null,
      nivel: 1,
      experiencia: 0,
      trasfondo: draft.trasfondo,
      alineamiento: draft.alineamiento,

      abilityScores,
      skillProficiencies,
      savingThrows,

      hp,
      hitDice,
      deathSaves,
      speed,
      damageModifiers: [],
      conditions: [],
      concentration: null,
      combatLog,

      proficiencies,
      proficiencyBonus: calcProficiencyBonus(1),

      traits,

      personality,
      appearance,

      levelHistory,

      knownSpellIds,
      preparedSpellIds,
      spellbookIds,

      inventoryId,

      creadoEn: now,
      actualizadoEn: now,
    };

    return character;
  },

  // ── Utilidades ─────────────────────────────────────────────────────

  reset: () => {
    set(INITIAL_STATE);
  },

  clearError: () => {
    set({ error: null });
  },
}));

// ─── Funciones auxiliares exportadas ─────────────────────────────────

/**
 * Calcula las puntuaciones totales (base + racial + free bonuses) para previsualización.
 */
export function calcTotalScoresPreview(
  baseScores: AbilityScores,
  raceId: RaceId,
  subraceId: SubraceId,
  freeAbilityBonuses?: AbilityKey[]
): AbilityScores {
  const racialBonuses = getTotalRacialBonuses(raceId, subraceId ?? null);

  // Compute free bonuses (e.g. semi-elf picks 2 × +1)
  const freeBonuses: Partial<Record<AbilityKey, number>> = {};
  if (freeAbilityBonuses && freeAbilityBonuses.length > 0) {
    for (const key of freeAbilityBonuses) {
      freeBonuses[key] = (freeBonuses[key] ?? 0) + 1;
    }
  }

  return {
    fue: baseScores.fue + (racialBonuses.fue ?? 0) + (freeBonuses.fue ?? 0),
    des: baseScores.des + (racialBonuses.des ?? 0) + (freeBonuses.des ?? 0),
    con: baseScores.con + (racialBonuses.con ?? 0) + (freeBonuses.con ?? 0),
    int: baseScores.int + (racialBonuses.int ?? 0) + (freeBonuses.int ?? 0),
    sab: baseScores.sab + (racialBonuses.sab ?? 0) + (freeBonuses.sab ?? 0),
    car: baseScores.car + (racialBonuses.car ?? 0) + (freeBonuses.car ?? 0),
  };
}

/**
 * Obtiene todas las habilidades ya otorgadas por raza y trasfondo
 * (para excluirlas de las opciones de clase).
 */
export function getGrantedSkills(
  raceId: RaceId | undefined,
  trasfondoId: BackgroundId | undefined
): SkillKey[] {
  const granted: SkillKey[] = [];

  if (raceId) {
    const raceData = getRaceData(raceId);
    if (raceData.skillProficiencies) {
      granted.push(...raceData.skillProficiencies);
    }
  }

  if (trasfondoId) {
    const bgData = getBackgroundData(trasfondoId);
    granted.push(...bgData.skillProficiencies);
  }

  return [...new Set(granted)];
}

/**
 * Obtiene las habilidades disponibles para elegir de la clase,
 * excluyendo las ya otorgadas por raza y trasfondo.
 */
export function getAvailableClassSkills(
  classId: ClassId,
  raceId: RaceId | undefined,
  trasfondoId: BackgroundId | undefined
): SkillKey[] {
  const classData = getClassData(classId);
  const granted = getGrantedSkills(raceId, trasfondoId);

  return classData.skillChoicePool.filter(
    (skill) => !granted.includes(skill)
  );
}

/**
 * Devuelve cuántas habilidades debe elegir el jugador en total
 * (clase + raza si aplica, como semielfo).
 */
export function getRequiredSkillCount(
  classId: ClassId | undefined,
  raceId: RaceId | undefined
): number {
  let count = 0;

  if (classId) {
    const classData = getClassData(classId);
    count += classData.skillChoiceCount;
  }

  if (raceId) {
    const raceData = getRaceData(raceId);
    if (raceData.skillChoiceCount) {
      count += raceData.skillChoiceCount;
    }
  }

  return count;
}
