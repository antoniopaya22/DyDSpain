/**
 * AbilitiesTab - Pestaña de habilidades de clase del personaje
 * Para lanzadores de conjuros: muestra espacios de conjuro, trucos, hechizos conocidos/preparados,
 * libro de hechizos (mago), magia de pacto (brujo), y puntos de hechicería.
 * Para no-lanzadores: muestra habilidades de clase específicas como Furia (bárbaro),
 * Puntos de Ki (monje), Ataque Furtivo (pícaro), Tomar Aliento (guerrero), etc.
 */

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import { ConfirmDialog } from "@/components/ui";
import { useDialog } from "@/hooks/useDialog";
import {
  SPELLCASTING_ABILITY,
  CLASS_CASTER_TYPE,
  CLASS_SPELL_PREPARATION,
} from "@/types/spell";
import { formatModifier, ABILITY_NAMES } from "@/types/character";
import type { ClassId, Trait } from "@/types/character";
import type { ClassResourcesState } from "@/stores/characterStore";
import { useTheme } from "@/hooks/useTheme";
import {
  CLASS_LEVEL_FEATURES,
  RAGE_USES,
  RAGE_DAMAGE,
  MARTIAL_ARTS_DIE,
  SNEAK_ATTACK_DICE,
} from "@/data/srd/leveling";
import { getClassData } from "@/data/srd/classes";
import { getSpellById } from "@/data/srd/spells";

// ─── Helpers ─────────────────────────────────────────────────────────

function showToast(message: string) {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
}

const SPELL_LEVEL_COLORS: Record<number, string> = {
  0: "#9ca3af",
  1: "#3b82f6",
  2: "#22c55e",
  3: "#f59e0b",
  4: "#ef4444",
  5: "#a855f7",
  6: "#ec4899",
  7: "#14b8a6",
  8: "#f97316",
  9: "#dc2626",
};

// Colors and icons for each non-caster class ability section
const CLASS_ABILITY_THEME: Record<
  string,
  { icon: string; color: string; label: string }
> = {
  barbaro: { icon: "flash", color: "#dc2626", label: "Furia" },
  guerrero: { icon: "shield", color: "#b91c1c", label: "Combate" },
  monje: { icon: "hand-left", color: "#0891b2", label: "Ki" },
  picaro: { icon: "eye-off", color: "#374151", label: "Astucia" },
};

// ─── Class Ability Data Helpers ──────────────────────────────────────

interface ClassAbilityResource {
  id: string;
  nombre: string;
  descripcion: string;
  recurso?: {
    label: string;
    current: number | string;
    max: number | string;
    color: string;
    recovery: string;
  };
  escala?: {
    label: string;
    value: string;
  };
  /** Coste de recurso compartido (ej: 1 Ki para Golpe Aturdidor) */
  resourceCost?: {
    resourceId: string;
    amount: number;
    label: string; // e.g. "1 Ki", "4 Ki"
    color: string;
  };
}

function getBarbaroAbilities(level: number): ClassAbilityResource[] {
  const rageUses = RAGE_USES[level] ?? 2;
  const rageDamage = RAGE_DAMAGE[level] ?? 2;

  const abilities: ClassAbilityResource[] = [
    {
      id: "furia",
      nombre: "Furia",
      descripcion:
        "Como acción adicional, enfurécete. Ganas bonificador al daño cuerpo a cuerpo, ventaja en pruebas/salvaciones de FUE y resistencia a daño contundente, cortante y perforante. Dura 1 minuto.",
      recurso: {
        label: "Usos de Furia",
        current: rageUses,
        max: rageUses,
        color: "#dc2626",
        recovery: "Descanso largo",
      },
      escala: {
        label: "Daño de Furia",
        value: `+${rageDamage}`,
      },
    },
    {
      id: "defensa_sin_armadura_barbaro",
      nombre: "Defensa sin Armadura",
      descripcion:
        "Sin armadura, tu CA = 10 + mod. Destreza + mod. Constitución. Puedes usar escudo.",
    },
  ];

  if (level >= 2) {
    abilities.push({
      id: "ataque_temerario",
      nombre: "Ataque Temerario",
      descripcion:
        "Al atacar cuerpo a cuerpo, puedes atacar con ventaja, pero los ataques contra ti tienen ventaja hasta tu próximo turno.",
    });
    abilities.push({
      id: "sentido_peligro",
      nombre: "Sentido del Peligro",
      descripcion:
        "Ventaja en salvaciones de DES contra efectos que puedas ver.",
    });
  }

  if (level >= 5) {
    abilities.push({
      id: "ataque_extra_barbaro",
      nombre: "Ataque Extra",
      descripcion: "Puedes atacar dos veces al usar la acción de Atacar.",
    });
    abilities.push({
      id: "movimiento_rapido",
      nombre: "Movimiento Rápido",
      descripcion:
        "Tu velocidad aumenta en 10 pies mientras no lleves armadura pesada.",
    });
  }

  if (level >= 7) {
    abilities.push({
      id: "instinto_salvaje",
      nombre: "Instinto Salvaje",
      descripcion:
        "Ventaja en tiradas de iniciativa. Si estás sorprendido pero no incapacitado, puedes actuar normalmente si enfureces primero.",
    });
  }

  if (level >= 9) {
    const extraDice = level >= 17 ? 3 : level >= 13 ? 2 : 1;
    abilities.push({
      id: "critico_brutal",
      nombre: `Crítico Brutal (${extraDice} dado${extraDice > 1 ? "s" : ""})`,
      descripcion: `Puedes lanzar ${extraDice} dado(s) de daño de arma adicional(es) en un golpe crítico cuerpo a cuerpo.`,
    });
  }

  if (level >= 11) {
    abilities.push({
      id: "furia_incansable",
      nombre: "Furia Incansable",
      descripcion:
        "Si empiezas tu turno enfurecido y tienes 0 PG, puedes hacer una salvación de CON CD 10 para caer a 1 PG.",
    });
  }

  if (level >= 15) {
    abilities.push({
      id: "furia_persistente",
      nombre: "Furia Persistente",
      descripcion:
        "Tu Furia solo termina prematuramente si caes inconsciente o la finalizas voluntariamente.",
    });
  }

  return abilities;
}

function getGuerreroAbilities(level: number): ClassAbilityResource[] {
  const abilities: ClassAbilityResource[] = [
    {
      id: "estilo_combate",
      nombre: "Estilo de Combate",
      descripcion:
        "Has adoptado un estilo de combate: Arquería, Defensa, Duelo, Lucha con Arma a Dos Manos, Protección, etc.",
    },
    {
      id: "tomar_aliento",
      nombre: "Tomar Aliento",
      descripcion: `Puedes usar una acción adicional para recuperar PG = 1d10 + ${level} (tu nivel de guerrero).`,
      recurso: {
        label: "Usos",
        current: 1,
        max: 1,
        color: "#b91c1c",
        recovery: "Descanso corto o largo",
      },
    },
  ];

  if (level >= 2) {
    const oleadaUses = level >= 17 ? 2 : 1;
    abilities.push({
      id: "oleada_accion",
      nombre: "Oleada de Acción",
      descripcion:
        "En tu turno, puedes realizar una acción adicional además de tu acción y posible acción adicional normales.",
      recurso: {
        label: "Usos",
        current: oleadaUses,
        max: oleadaUses,
        color: "#ef4444",
        recovery: "Descanso corto o largo",
      },
    });
  }

  if (level >= 5) {
    const extraAttacks = level >= 20 ? 4 : level >= 11 ? 3 : 2;
    abilities.push({
      id: "ataque_extra_guerrero",
      nombre: `Ataque Extra (${extraAttacks - 1})`,
      descripcion: `Puedes atacar ${extraAttacks} veces al usar la acción de Atacar.`,
    });
  }

  if (level >= 9) {
    const indomableUses = level >= 17 ? 3 : level >= 13 ? 2 : 1;
    abilities.push({
      id: "indomable",
      nombre: "Indomable",
      descripcion:
        "Puedes repetir una tirada de salvación fallida. Debes usar el nuevo resultado.",
      recurso: {
        label: "Usos",
        current: indomableUses,
        max: indomableUses,
        color: "#f59e0b",
        recovery: "Descanso largo",
      },
    });
  }

  return abilities;
}

function getMonjeAbilities(level: number): ClassAbilityResource[] {
  const martialDie = MARTIAL_ARTS_DIE[level] ?? "1d4";
  const kiPoints = level >= 2 ? level : 0;
  const kiCost = (
    amount: number,
    label?: string,
  ): ClassAbilityResource["resourceCost"] => ({
    resourceId: "ki",
    amount,
    label: label ?? `${amount} Ki`,
    color: "#0891b2",
  });

  const abilities: ClassAbilityResource[] = [
    {
      id: "artes_marciales",
      nombre: "Artes Marciales",
      descripcion:
        "Puedes usar DES en lugar de FUE para ataques y daño con armas de monje. Puedes hacer un golpe desarmado como acción adicional tras atacar con un arma de monje.",
      escala: {
        label: "Dado de Artes Marciales",
        value: martialDie,
      },
    },
    {
      id: "defensa_sin_armadura_monje",
      nombre: "Defensa sin Armadura",
      descripcion:
        "Sin armadura ni escudo, tu CA = 10 + mod. Destreza + mod. Sabiduría.",
    },
  ];

  if (level >= 2) {
    abilities.push({
      id: "ki",
      nombre: "Puntos de Ki",
      descripcion:
        "Canalizas tu energía interior en forma de puntos de Ki. Se recuperan tras un descanso corto o largo.",
      recurso: {
        label: "Puntos de Ki",
        current: kiPoints,
        max: kiPoints,
        color: "#0891b2",
        recovery: "Descanso corto o largo",
      },
    });

    // Sub-habilidades de Ki como habilidades individuales usables
    abilities.push({
      id: "rafaga_golpes",
      nombre: "Ráfaga de Golpes",
      descripcion:
        "Inmediatamente después de usar la acción de Atacar, puedes gastar 1 punto de Ki para realizar dos golpes desarmados como acción adicional.",
      resourceCost: kiCost(1),
    });
    abilities.push({
      id: "paso_del_viento",
      nombre: "Paso del Viento",
      descripcion:
        "Puedes gastar 1 punto de Ki para usar Desenganche o Carrera como acción adicional. Tu distancia de salto se duplica este turno.",
      resourceCost: kiCost(1),
    });
    abilities.push({
      id: "defensa_paciente",
      nombre: "Defensa Paciente",
      descripcion:
        "Puedes gastar 1 punto de Ki para usar Esquivar como acción adicional en tu turno.",
      resourceCost: kiCost(1),
    });
  }

  if (level >= 2) {
    abilities.push({
      id: "movimiento_sin_armadura",
      nombre: "Movimiento sin Armadura",
      descripcion: `Tu velocidad aumenta ${level >= 18 ? "+30" : level >= 14 ? "+25" : level >= 10 ? "+20" : level >= 6 ? "+15" : "+10"} pies sin armadura. A nivel 9, puedes moverte por superficies verticales y líquidas sin caer.`,
    });
  }

  if (level >= 3) {
    abilities.push({
      id: "desviar_proyectiles",
      nombre: "Desviar Proyectiles",
      descripcion: `Puedes usar tu reacción para reducir el daño de un ataque a distancia en 1d10 + ${level} + mod. DES. Si reduces a 0, puedes gastar 1 Ki para devolver el ataque.`,
      resourceCost: kiCost(1, "1 Ki (devolver)"),
    });
  }

  if (level >= 4) {
    abilities.push({
      id: "caida_lenta",
      nombre: "Caída Lenta",
      descripcion: `Puedes usar tu reacción para reducir el daño por caída en ${5 * level}.`,
    });
  }

  if (level >= 5) {
    abilities.push({
      id: "ataque_extra_monje",
      nombre: "Ataque Extra",
      descripcion: "Puedes atacar dos veces al usar la acción de Atacar.",
    });
    abilities.push({
      id: "golpe_aturdidor",
      nombre: "Golpe Aturdidor",
      descripcion:
        "Cuando aciertas con un ataque cuerpo a cuerpo, puedes gastar 1 punto de Ki para intentar aturdir al objetivo (salvación de CON).",
      resourceCost: kiCost(1),
    });
  }

  if (level >= 6) {
    abilities.push({
      id: "golpes_ki_magicos",
      nombre: "Golpes de Ki Mágicos",
      descripcion:
        "Tus golpes desarmados cuentan como mágicos para superar resistencias e inmunidades.",
    });
  }

  if (level >= 7) {
    abilities.push({
      id: "evasion_monje",
      nombre: "Evasión",
      descripcion:
        "Si haces una salvación de DES para mitad de daño, no recibes daño en éxito y mitad en fallo.",
    });
    abilities.push({
      id: "quietud_mental",
      nombre: "Quietud Mental",
      descripcion:
        "Puedes usar tu acción para terminar un efecto de encantado o asustado sobre ti.",
    });
  }

  if (level >= 13) {
    abilities.push({
      id: "lengua_sol_luna",
      nombre: "Lengua del Sol y la Luna",
      descripcion:
        "Puedes entender y ser entendido por cualquier criatura que hable un idioma.",
    });
  }

  if (level >= 14) {
    abilities.push({
      id: "alma_diamantina",
      nombre: "Alma Diamantina",
      descripcion:
        "Tienes competencia en todas las tiradas de salvación. Si fallas una, puedes gastar 1 Ki para repetirla.",
      resourceCost: kiCost(1),
    });
  }

  if (level >= 15) {
    abilities.push({
      id: "cuerpo_atemporal",
      nombre: "Cuerpo Atemporal",
      descripcion:
        "Ya no sufres inconvenientes de la vejez y no puedes ser envejecido mágicamente. No necesitas comida ni agua.",
    });
  }

  if (level >= 18) {
    abilities.push({
      id: "cuerpo_vacio_invisible",
      nombre: "Cuerpo Vacío — Invisibilidad",
      descripcion:
        "Puedes gastar 4 Ki para hacerte invisible durante 1 minuto.",
      resourceCost: kiCost(4),
    });
    abilities.push({
      id: "cuerpo_vacio_astral",
      nombre: "Cuerpo Vacío — Proyección Astral",
      descripcion:
        "Puedes gastar 8 Ki para lanzar Proyección Astral sin componentes materiales.",
      resourceCost: kiCost(8),
    });
  }

  if (level >= 20) {
    abilities.push({
      id: "autoperfeccion",
      nombre: "Autoperfección",
      descripcion: "Cuando tires iniciativa sin puntos de Ki, recuperas 4.",
    });
  }

  return abilities;
}

function getPicaroAbilities(level: number): ClassAbilityResource[] {
  const sneakDice = SNEAK_ATTACK_DICE[level] ?? "1d6";

  const abilities: ClassAbilityResource[] = [
    {
      id: "ataque_furtivo",
      nombre: "Ataque Furtivo",
      descripcion:
        "Una vez por turno, puedes infligir daño adicional a una criatura que impactes si tienes ventaja o un aliado está a 1,5 m del objetivo. El arma debe ser sutil o a distancia.",
      escala: {
        label: "Daño de Ataque Furtivo",
        value: sneakDice,
      },
    },
    {
      id: "pericia",
      nombre: "Pericia",
      descripcion:
        "Elige dos competencias en habilidades (o una habilidad y herramientas de ladrón). Tu bonificador por competencia se duplica para pruebas con esas competencias.",
    },
    {
      id: "jerga_ladrones",
      nombre: "Jerga de Ladrones",
      descripcion:
        "Conoces la jerga de ladrones, un lenguaje secreto de señales, símbolos y argot.",
    },
  ];

  if (level >= 2) {
    abilities.push({
      id: "accion_astuta",
      nombre: "Acción Astuta",
      descripcion:
        "En cada turno puedes usar una acción adicional para Carrera, Desenganche o Esconderte.",
    });
  }

  if (level >= 5) {
    abilities.push({
      id: "esquiva_prodigiosa",
      nombre: "Esquiva Prodigiosa",
      descripcion:
        "Cuando un atacante que puedes ver te impacta, puedes usar tu reacción para reducir el daño a la mitad.",
    });
  }

  if (level >= 7) {
    abilities.push({
      id: "evasion_picaro",
      nombre: "Evasión",
      descripcion:
        "Si haces una salvación de DES para mitad de daño, no recibes daño en éxito y mitad en fallo.",
    });
  }

  if (level >= 11) {
    abilities.push({
      id: "talento_fiable",
      nombre: "Talento Fiable",
      descripcion:
        "Cuando hagas una prueba de característica en la que sumes tu bonificador de competencia, trata cualquier resultado de 1–9 en el d20 como un 10.",
    });
  }

  if (level >= 14) {
    abilities.push({
      id: "sentido_ciego",
      nombre: "Sentido Ciego",
      descripcion:
        "Si puedes oír, conoces la ubicación de cualquier criatura oculta o invisible a 10 pies de ti.",
    });
  }

  if (level >= 15) {
    abilities.push({
      id: "mente_escurridiza",
      nombre: "Mente Escurridiza",
      descripcion: "Tienes competencia en salvaciones de SAB.",
    });
  }

  if (level >= 18) {
    abilities.push({
      id: "elusivo",
      nombre: "Elusivo",
      descripcion:
        "Mientras no estés incapacitado, ningún ataque tiene ventaja contra ti.",
    });
  }

  if (level >= 20) {
    abilities.push({
      id: "golpe_de_suerte",
      nombre: "Golpe de Suerte",
      descripcion:
        "Si fallas un ataque contra un objetivo a tu alcance, puedes convertir el fallo en un acierto. Si fallas una prueba de característica, puedes tratar la tirada como un 20. 1 uso por descanso corto o largo.",
      recurso: {
        label: "Usos",
        current: 1,
        max: 1,
        color: "#374151",
        recovery: "Descanso corto o largo",
      },
    });
  }

  return abilities;
}

function getClassAbilities(
  clase: ClassId,
  level: number,
): ClassAbilityResource[] {
  switch (clase) {
    case "barbaro":
      return getBarbaroAbilities(level);
    case "guerrero":
      return getGuerreroAbilities(level);
    case "monje":
      return getMonjeAbilities(level);
    case "picaro":
      return getPicaroAbilities(level);
    default:
      return [];
  }
}

// ─── Main Component ──────────────────────────────────────────────────

export default function AbilitiesTab() {
  const { isDark, colors } = useTheme();
  const { dialogProps, showConfirm } = useDialog();
  const {
    character,
    magicState,
    classResources,
    useSpellSlot,
    restoreSpellSlot,
    restoreAllSpellSlots,
    usePactSlot,
    restoreAllPactSlots,
    setConcentration,
    clearConcentration,
    useTraitCharge,
    restoreTraitCharges,
    useClassResource,
    useClassResourceAmount,
    restoreClassResource,
    restoreAllClassResources,
  } = useCharacterStore();

  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [expandedAbility, setExpandedAbility] = useState<string | null>(null);

  if (!character) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-dark-500 dark:text-dark-300 text-base">
          No se ha cargado ningún personaje
        </Text>
      </View>
    );
  }

  const casterType = CLASS_CASTER_TYPE[character.clase];
  const spellcastingAbility =
    SPELLCASTING_ABILITY[character.clase as keyof typeof SPELLCASTING_ABILITY];
  const preparationType = CLASS_SPELL_PREPARATION[character.clase];
  const classData = getClassData(character.clase);
  const classTheme = CLASS_ABILITY_THEME[character.clase];

  // ── If this is a non-caster, show class abilities ──
  const isNonCaster = casterType === "none";

  // Spellcasting stats (for casters)
  const abilityMod = spellcastingAbility
    ? character.abilityScores[spellcastingAbility].modifier
    : 0;
  const profBonus = character.proficiencyBonus;
  const spellSaveDC = 8 + profBonus + abilityMod;
  const spellAttackBonus = profBonus + abilityMod;

  // Organize spells by level using SRD data (for casters)
  const allSpellIds = magicState
    ? [
        ...new Set([
          ...magicState.knownSpellIds,
          ...magicState.preparedSpellIds,
          ...magicState.spellbookIds,
        ]),
      ]
    : [
        ...new Set([
          ...character.knownSpellIds,
          ...character.preparedSpellIds,
          ...character.spellbookIds,
        ]),
      ];

  // Use SRD data to classify spells properly
  const cantrips = allSpellIds.filter((id) => {
    const spell = getSpellById(id);
    return spell ? spell.nivel === 0 : id.startsWith("truco_") || id.includes("truco");
  });
  const levelSpells = allSpellIds.filter((id) => {
    const spell = getSpellById(id);
    return spell ? spell.nivel > 0 : !id.startsWith("truco_") && !id.includes("truco");
  });

  // Group level spells by level for organized display
  const spellsByLevel: Record<number, string[]> = {};
  for (const id of levelSpells) {
    const spell = getSpellById(id);
    const lvl = spell?.nivel ?? 1;
    if (!spellsByLevel[lvl]) spellsByLevel[lvl] = [];
    spellsByLevel[lvl].push(id);
  }
  const sortedSpellLevels = Object.keys(spellsByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  const formatSpellName = (id: string): string => {
    const spell = getSpellById(id);
    if (spell) return spell.nombre;
    return id
      .replace(/^truco_/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getSpellLevel = (id: string): number => {
    return getSpellById(id)?.nivel ?? 1;
  };

  /** Whether this spell can be cast (known casters always can, prepared casters need preparation) */
  const canCastSpell = (id: string): boolean => {
    if (preparationType === "known" || preparationType === "none") return true;
    return isPrepared(id);
  };

  const isPrepared = (id: string): boolean => {
    if (magicState) {
      return magicState.preparedSpellIds.includes(id);
    }
    return character.preparedSpellIds.includes(id);
  };

  const isInSpellbook = (id: string): boolean => {
    if (magicState) {
      return magicState.spellbookIds.includes(id);
    }
    return character.spellbookIds.includes(id);
  };

  // ── Spell Slot Actions ──

  const handleUseSlot = async (level: number) => {
    const success = await useSpellSlot(level);
    if (success) {
      showToast(`Espacio de nivel ${level} usado`);
    } else {
      showToast(`No quedan espacios de nivel ${level}`);
    }
  };

  const handleRestoreSlot = async (level: number) => {
    await restoreSpellSlot(level);
    showToast(`Espacio de nivel ${level} restaurado`);
  };

  const handleRestoreAllSlots = () => {
    showConfirm(
      "Restaurar Espacios",
      "¿Restaurar todos los espacios de conjuro?",
      async () => {
        await restoreAllSpellSlots();
        if (character.clase === "brujo") {
          await restoreAllPactSlots();
        }
        showToast("Todos los espacios restaurados");
      },
      { confirmText: "Restaurar", cancelText: "Cancelar", type: "info" },
    );
  };

  const handleUsePactSlot = async () => {
    const success = await usePactSlot();
    if (success) {
      showToast("Espacio de pacto usado");
    } else {
      showToast("No quedan espacios de pacto");
    }
  };

  // ── Trait Actions ──

  const handleUseTraitCharge = async (traitId: string, traitName: string) => {
    await useTraitCharge(traitId);
    showToast(`${traitName}: uso consumido`);
  };

  const handleRestoreTraitCharges = async (
    traitId: string,
    traitName: string,
  ) => {
    await restoreTraitCharges(traitId);
    showToast(`${traitName}: usos restaurados`);
  };

  // ── Class Resource Actions ──

  const handleUseClassResource = async (resourceId: string, nombre: string) => {
    const success = await useClassResource(resourceId);
    if (success) {
      showToast(`${nombre}: uso consumido`);
    } else {
      showToast(`${nombre}: no quedan usos`);
    }
  };

  /** Usa N puntos de un recurso compartido (ej: 1 Ki para Golpe Aturdidor) */
  const handleUseClassResourceAmount = async (
    resourceId: string,
    amount: number,
    abilityName: string,
  ) => {
    const res = classResources?.resources[resourceId];
    if (!res || res.current < amount) {
      const resName = res?.nombre ?? resourceId;
      showToast(`${abilityName}: no tienes suficientes ${resName}`);
      return;
    }
    const ok = await useClassResourceAmount(resourceId, amount);
    if (ok) {
      showToast(`${abilityName}: -${amount} ${res.nombre}`);
    }
  };

  const handleRestoreClassResource = async (
    resourceId: string,
    nombre: string,
  ) => {
    await restoreClassResource(resourceId);
    showToast(`${nombre}: usos restaurados`);
  };

  const handleRestoreAllClassResources = () => {
    showConfirm(
      "Restaurar Recursos",
      "¿Restaurar todos los recursos de clase?",
      async () => {
        await restoreAllClassResources();
        showToast("Recursos restaurados");
      },
      { confirmText: "Restaurar", cancelText: "Cancelar", type: "info" },
    );
  };

  // ══════════════════════════════════════════════════════════════════
  // RENDER: Prominent Class Resource Slots (Ki, Rage, etc.)
  // ══════════════════════════════════════════════════════════════════

  const renderClassResourceSlots = () => {
    if (!classResources) return null;
    const resourceEntries = Object.values(classResources.resources);
    if (resourceEntries.length === 0) return null;

    return (
      <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons
              name="flash"
              size={20}
              color={classTheme?.color ?? colors.accentBlue}
            />
            <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
              Recursos de Clase
            </Text>
          </View>
          {resourceEntries.some((r) => r.current < r.max && r.max < 999) && (
            <TouchableOpacity
              className="bg-blue-600/20 rounded-lg px-3 py-1.5 active:bg-blue-600/40"
              onPress={handleRestoreAllClassResources}
            >
              <Text className="text-blue-400 text-xs font-semibold">
                Restaurar todos
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {resourceEntries.map((res) => {
          const isUnlimited = res.max >= 999;
          const available = res.current;
          const total = res.max;
          const resColor = classTheme?.color ?? colors.accentBlue;
          const pct =
            total > 0 && !isUnlimited ? (available / total) * 100 : 100;
          const showDots = total <= 10 && !isUnlimited;

          return (
            <View key={res.id} className="mb-4">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-dark-600 dark:text-dark-200 text-sm font-medium">
                  {res.nombre}
                </Text>
                <Text className="text-dark-400 text-xs">
                  {isUnlimited
                    ? "∞ / Ilimitado"
                    : `${available}/${total} disponibles`}
                </Text>
              </View>

              {/* Dot indicators (like spell slots) for resources <= 10 */}
              {showDots && (
                <View className="flex-row items-center">
                  <View className="flex-row flex-1 flex-wrap">
                    {Array.from({ length: total }).map((_, i) => {
                      const isAvailable = i < available;
                      return (
                        <TouchableOpacity
                          key={i}
                          className="h-9 w-9 rounded-lg mx-0.5 mb-1 items-center justify-center border"
                          style={{
                            backgroundColor: isAvailable
                              ? `${resColor}20`
                              : colors.bgPrimary,
                            borderColor: isAvailable
                              ? `${resColor}66`
                              : colors.borderDefault,
                          }}
                          onPress={() =>
                            isAvailable
                              ? handleUseClassResource(res.id, res.nombre)
                              : handleRestoreClassResource(res.id, res.nombre)
                          }
                        >
                          <Ionicons
                            name={isAvailable ? "ellipse" : "ellipse-outline"}
                            size={14}
                            color={
                              isAvailable ? resColor : colors.borderDefault
                            }
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TouchableOpacity
                    className="ml-2 bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-2 active:bg-gray-300 dark:active:bg-dark-600"
                    onPress={() => handleUseClassResource(res.id, res.nombre)}
                    disabled={available <= 0}
                    style={{ opacity: available > 0 ? 1 : 0.4 }}
                  >
                    <Ionicons name="remove" size={16} color={resColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="ml-1 bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-2 active:bg-gray-300 dark:active:bg-dark-600"
                    onPress={() =>
                      handleRestoreClassResource(res.id, res.nombre)
                    }
                    disabled={available >= total}
                    style={{ opacity: available < total ? 1 : 0.4 }}
                  >
                    <Ionicons name="add" size={16} color={resColor} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Progress bar for resources > 10 (e.g. Ki at high levels) */}
              {!showDots && !isUnlimited && (
                <View>
                  <View className="h-4 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden mb-2">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: resColor,
                      }}
                    />
                  </View>
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      className="flex-row items-center bg-gray-200 dark:bg-dark-700 rounded-lg px-3 py-2 mr-2 active:opacity-70"
                      onPress={() => handleUseClassResource(res.id, res.nombre)}
                      disabled={available <= 0}
                      style={{ opacity: available > 0 ? 1 : 0.4 }}
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        size={16}
                        color={resColor}
                      />
                      <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold ml-1">
                        −1
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-row items-center bg-gray-200 dark:bg-dark-700 rounded-lg px-3 py-2 active:opacity-70"
                      onPress={() =>
                        handleRestoreClassResource(res.id, res.nombre)
                      }
                      disabled={available >= total}
                      style={{ opacity: available < total ? 1 : 0.4 }}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={16}
                        color={colors.accentGreen}
                      />
                      <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold ml-1">
                        Restaurar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {isUnlimited && (
                <View className="flex-row items-center">
                  <Ionicons name="infinite" size={20} color={resColor} />
                  <Text className="text-dark-400 text-xs ml-1.5">
                    Uso ilimitado
                  </Text>
                </View>
              )}

              <Text className="text-dark-300 dark:text-dark-500 text-[10px] mt-1.5">
                Se recupera en:{" "}
                {res.recovery === "short_rest"
                  ? "Descanso corto o largo"
                  : "Descanso largo"}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  // ══════════════════════════════════════════════════════════════════
  // RENDER: Class Abilities for Non-Casters
  // ══════════════════════════════════════════════════════════════════

  const renderClassAbilitiesHeader = () => {
    const theme = classTheme ?? {
      icon: "star",
      color: colors.accentGold,
      label: "Habilidades",
    };

    // Check if any resource has been partially used
    const hasUsedResources = classResources
      ? Object.values(classResources.resources).some(
          (r) => r.current < r.max && r.max < 999,
        )
      : false;

    return (
      <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <View
            className="h-10 w-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${theme.color}20` }}
          >
            <Ionicons name={theme.icon as any} size={22} color={theme.color} />
          </View>
          <View className="flex-1">
            <Text className="text-dark-900 dark:text-white text-base font-semibold">
              {classData?.nombre ?? character.clase}
            </Text>
            <Text className="text-dark-400 text-xs">
              Nivel {character.nivel} · Habilidades de clase
            </Text>
          </View>
          {hasUsedResources && (
            <TouchableOpacity
              className="bg-blue-600/20 rounded-lg px-3 py-1.5 active:bg-blue-600/40"
              onPress={handleRestoreAllClassResources}
            >
              <Text className="text-blue-400 text-xs font-semibold">
                Restaurar todo
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick stats for the class */}
        <View className="flex-row flex-wrap">
          <StatBox
            label="Nivel"
            value={String(character.nivel)}
            color={theme.color}
          />
          <StatBox
            label="Competencia"
            value={`+${profBonus}`}
            color={colors.accentBlue}
          />
          <StatBox
            label="Dado de Golpe"
            value={classData?.hitDie ?? "d8"}
            color={colors.accentGreen}
          />
        </View>
      </View>
    );
  };

  const renderClassAbilityResource = (ability: ClassAbilityResource) => {
    if (!ability.recurso) return null;
    const { recurso } = ability;

    // Read live values from classResources store if available
    const storeRes = classResources?.resources[ability.id];
    const currentNum = storeRes
      ? storeRes.current
      : typeof recurso.current === "number"
        ? recurso.current
        : 0;
    const maxNum = storeRes
      ? storeRes.max
      : typeof recurso.max === "number"
        ? recurso.max
        : 0;
    const isUnlimited = maxNum >= 999;
    const pct =
      maxNum > 0 && !isUnlimited
        ? (currentNum / maxNum) * 100
        : isUnlimited
          ? 100
          : 0;

    return (
      <View className="mt-3">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold">
            {recurso.label}
          </Text>
          <Text className="text-sm font-bold" style={{ color: recurso.color }}>
            {isUnlimited ? "∞" : `${currentNum}/${maxNum}`}
          </Text>
        </View>

        {/* Progress bar */}
        {!isUnlimited && (
          <View className="h-3 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                backgroundColor: recurso.color,
              }}
            />
          </View>
        )}

        {/* Use / Restore buttons */}
        {storeRes && !isUnlimited && (
          <View className="flex-row items-center mt-2">
            <TouchableOpacity
              className="flex-row items-center bg-gray-200 dark:bg-dark-700 rounded-lg px-3 py-2 mr-2 active:opacity-70"
              onPress={() => handleUseClassResource(ability.id, ability.nombre)}
              disabled={currentNum <= 0}
              style={{ opacity: currentNum > 0 ? 1 : 0.4 }}
            >
              <Ionicons
                name="remove-circle-outline"
                size={16}
                color={recurso.color}
              />
              <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold ml-1">
                Usar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center bg-gray-200 dark:bg-dark-700 rounded-lg px-3 py-2 active:opacity-70"
              onPress={() =>
                handleRestoreClassResource(ability.id, ability.nombre)
              }
              disabled={currentNum >= maxNum}
              style={{ opacity: currentNum < maxNum ? 1 : 0.4 }}
            >
              <Ionicons
                name="add-circle-outline"
                size={16}
                color={colors.accentGreen}
              />
              <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold ml-1">
                Restaurar
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text className="text-dark-300 dark:text-dark-500 text-[10px] mt-1">
          Se recupera en: {recurso.recovery}
        </Text>
      </View>
    );
  };

  const renderClassAbilityScale = (ability: ClassAbilityResource) => {
    if (!ability.escala) return null;

    return (
      <View className="mt-2 flex-row items-center">
        <View className="bg-gray-200 dark:bg-dark-700 rounded-lg px-3 py-1.5 flex-row items-center">
          <Ionicons name="trending-up" size={12} color={colors.accentAmber} />
          <Text className="text-dark-600 dark:text-dark-200 text-xs font-medium ml-1.5">
            {ability.escala.label}:{" "}
          </Text>
          <Text
            className="text-sm font-bold"
            style={{ color: colors.accentAmber }}
          >
            {ability.escala.value}
          </Text>
        </View>
      </View>
    );
  };

  const renderClassAbilityCost = (ability: ClassAbilityResource) => {
    if (!ability.resourceCost) return null;
    const { resourceCost } = ability;

    const storeRes = classResources?.resources[resourceCost.resourceId];
    if (!storeRes) return null;

    const canAfford = storeRes.current >= resourceCost.amount;

    return (
      <View className="mt-3">
        <TouchableOpacity
          className="flex-row items-center rounded-lg px-4 py-2.5 active:opacity-70"
          style={{
            backgroundColor: canAfford
              ? `${resourceCost.color}20`
              : `${colors.textMuted}10`,
            borderWidth: 1,
            borderColor: canAfford
              ? `${resourceCost.color}40`
              : colors.borderDefault,
            opacity: canAfford ? 1 : 0.5,
          }}
          onPress={() =>
            handleUseClassResourceAmount(
              resourceCost.resourceId,
              resourceCost.amount,
              ability.nombre,
            )
          }
          disabled={!canAfford}
        >
          <Ionicons
            name="flash"
            size={16}
            color={canAfford ? resourceCost.color : colors.textMuted}
          />
          <Text
            className="text-sm font-semibold ml-2"
            style={{ color: canAfford ? resourceCost.color : colors.textMuted }}
          >
            Usar — {resourceCost.label}
          </Text>
          <View className="flex-1" />
          <Text
            className="text-xs"
            style={{ color: canAfford ? resourceCost.color : colors.textMuted }}
          >
            ({storeRes.current}/{storeRes.max} {storeRes.nombre})
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderClassAbilities = () => {
    const abilities = getClassAbilities(character.clase, character.nivel);
    if (abilities.length === 0) return null;

    return (
      <View className="mb-4">
        {abilities.map((ability) => {
          const isExpanded = expandedAbility === ability.id;
          return (
            <View
              key={ability.id}
              className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-3"
            >
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() =>
                  setExpandedAbility(isExpanded ? null : ability.id)
                }
                activeOpacity={0.7}
              >
                <View
                  className="h-8 w-8 rounded-full items-center justify-center mr-3"
                  style={{
                    backgroundColor: `${classTheme?.color ?? colors.accentGold}20`,
                  }}
                >
                  {ability.resourceCost ? (
                    <Ionicons
                      name="flash"
                      size={16}
                      color={ability.resourceCost.color}
                    />
                  ) : ability.recurso ? (
                    <Ionicons
                      name="flash"
                      size={16}
                      color={ability.recurso.color}
                    />
                  ) : ability.escala ? (
                    <Ionicons
                      name="trending-up"
                      size={16}
                      color={colors.accentAmber}
                    />
                  ) : (
                    <Ionicons
                      name="star"
                      size={16}
                      color={classTheme?.color ?? colors.accentGold}
                    />
                  )}
                </View>

                <View className="flex-1">
                  <Text className="text-dark-900 dark:text-white text-sm font-semibold">
                    {ability.nombre}
                  </Text>
                  {ability.recurso &&
                    (() => {
                      const storeRes = classResources?.resources[ability.id];
                      const cur = storeRes
                        ? storeRes.current
                        : ability.recurso!.current;
                      const mx = storeRes ? storeRes.max : ability.recurso!.max;
                      const isUnlimited = typeof mx === "number" && mx >= 999;
                      return (
                        <Text
                          className="text-xs mt-0.5"
                          style={{ color: ability.recurso!.color }}
                        >
                          {isUnlimited ? "Ilimitado" : `${cur}/${mx}`}{" "}
                          {ability.recurso!.label}
                        </Text>
                      );
                    })()}
                  {ability.resourceCost &&
                    (() => {
                      const storeRes =
                        classResources?.resources[
                          ability.resourceCost!.resourceId
                        ];
                      const canAfford = storeRes
                        ? storeRes.current >= ability.resourceCost!.amount
                        : false;
                      return (
                        <Text
                          className="text-xs mt-0.5"
                          style={{
                            color: canAfford
                              ? ability.resourceCost!.color
                              : colors.textMuted,
                          }}
                        >
                          Coste: {ability.resourceCost!.label}
                          {storeRes
                            ? ` (${storeRes.current}/${storeRes.max} disponibles)`
                            : ""}
                        </Text>
                      );
                    })()}
                  {ability.escala &&
                    !ability.recurso &&
                    !ability.resourceCost && (
                      <Text className="text-dark-400 text-xs mt-0.5">
                        {ability.escala.label}: {ability.escala.value}
                      </Text>
                    )}
                </View>

                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colors.textMuted}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View className="mt-3 pt-3 border-t border-dark-100 dark:border-surface-border/50">
                  <Text className="text-dark-500 dark:text-dark-300 text-xs leading-5">
                    {ability.descripcion}
                  </Text>
                  {renderClassAbilityResource(ability)}
                  {renderClassAbilityCost(ability)}
                  {renderClassAbilityScale(ability)}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderCharacterTraits = () => {
    // Show traits that come from class/race/background
    const traits = character.traits.filter(
      (t) =>
        t.origen === "clase" ||
        t.origen === "subclase" ||
        t.origen === "raza" ||
        t.origen === "trasfondo" ||
        t.origen === "dote",
    );

    if (traits.length === 0) return null;

    return (
      <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <Ionicons name="ribbon" size={20} color={colors.accentPurple} />
          <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
            Rasgos y Capacidades
          </Text>
        </View>

        {traits.map((trait) => (
          <TraitCard
            key={trait.id}
            trait={trait}
            onUse={() => handleUseTraitCharge(trait.id, trait.nombre)}
            onRestore={() => handleRestoreTraitCharges(trait.id, trait.nombre)}
          />
        ))}
      </View>
    );
  };

  // ══════════════════════════════════════════════════════════════════
  // RENDER: Spellcasting Sections (for casters)
  // ══════════════════════════════════════════════════════════════════

  const renderSpellcastingInfo = () => (
    <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
      <View className="flex-row items-center mb-3">
        <Ionicons name="flame" size={20} color={colors.accentDanger} />
        <Text className="text-dark-900 dark:text-white text-base font-semibold ml-2">
          Lanzamiento de Conjuros
        </Text>
      </View>

      <View className="flex-row flex-wrap">
        {spellcastingAbility && (
          <StatBox
            label="Aptitud Mágica"
            value={ABILITY_NAMES[spellcastingAbility]}
            subValue={formatModifier(abilityMod)}
            color={colors.accentPurple}
          />
        )}

        <StatBox
          label="CD de Salvación"
          value={String(spellSaveDC)}
          subValue={`8 + ${profBonus} + ${abilityMod}`}
          color={colors.accentAmber}
        />

        <StatBox
          label="Ataque Mágico"
          value={formatModifier(spellAttackBonus)}
          subValue={`${profBonus} + ${abilityMod}`}
          color={colors.accentDanger}
        />
      </View>

      <View className="mt-3 pt-3 border-t border-dark-100 dark:border-surface-border/50">
        <View className="flex-row items-center">
          <Ionicons
            name="information-circle-outline"
            size={14}
            color={colors.textMuted}
          />
          <Text className="text-dark-400 text-xs ml-1.5">
            {preparationType === "prepared"
              ? "Preparas conjuros de tu lista de clase cada día."
              : character.clase === "brujo"
                ? "Usas magia de pacto. Espacios se recuperan en descanso corto."
                : preparationType === "known"
                  ? "Conoces un número fijo de conjuros."
                  : preparationType === "spellbook"
                    ? "Aprendes conjuros en tu libro de hechizos y los preparas cada día."
                    : "No lanzas conjuros."}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSpellSlots = () => {
    if (!magicState) return null;

    const slotEntries = Object.entries(magicState.spellSlots)
      .filter(([_, slot]) => slot && slot.total > 0)
      .sort(([a], [b]) => Number(a) - Number(b));

    if (slotEntries.length === 0 && !magicState.pactMagicSlots) return null;

    return (
      <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons name="flash" size={20} color={colors.accentBlue} />
            <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
              Espacios de Conjuro
            </Text>
          </View>
          <TouchableOpacity
            className="bg-blue-600/20 rounded-lg px-3 py-1.5 active:bg-blue-600/40"
            onPress={handleRestoreAllSlots}
          >
            <Text className="text-blue-400 text-xs font-semibold">
              Restaurar todos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Regular spell slots */}
        {slotEntries.map(([levelStr, slot]) => {
          if (!slot) return null;
          const level = Number(levelStr);
          const available = slot.total - slot.used;
          const color = SPELL_LEVEL_COLORS[level] ?? "#3b82f6";

          return (
            <View key={level} className="mb-3">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-dark-600 dark:text-dark-200 text-sm font-medium">
                  Nivel {level}
                </Text>
                <Text className="text-dark-400 text-xs">
                  {available}/{slot.total} disponibles
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="flex-row flex-1">
                  {Array.from({ length: slot.total }).map((_, i) => {
                    const isAvailable = i < available;
                    return (
                      <TouchableOpacity
                        key={i}
                        className="h-9 w-9 rounded-lg mx-0.5 items-center justify-center border"
                        style={{
                          backgroundColor: isAvailable
                            ? `${color}20`
                            : colors.bgPrimary,
                          borderColor: isAvailable
                            ? `${color}66`
                            : colors.borderDefault,
                        }}
                        onPress={() =>
                          isAvailable
                            ? handleUseSlot(level)
                            : handleRestoreSlot(level)
                        }
                      >
                        <Ionicons
                          name={isAvailable ? "ellipse" : "ellipse-outline"}
                          size={14}
                          color={isAvailable ? color : colors.borderDefault}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  className="ml-2 bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-2 active:bg-gray-300 dark:active:bg-dark-600"
                  onPress={() => handleUseSlot(level)}
                  disabled={available <= 0}
                  style={{ opacity: available > 0 ? 1 : 0.4 }}
                >
                  <Ionicons name="remove" size={16} color={color} />
                </TouchableOpacity>
                <TouchableOpacity
                  className="ml-1 bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-2 active:bg-gray-300 dark:active:bg-dark-600"
                  onPress={() => handleRestoreSlot(level)}
                  disabled={slot.used <= 0}
                  style={{ opacity: slot.used > 0 ? 1 : 0.4 }}
                >
                  <Ionicons name="add" size={16} color={color} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Pact Magic Slots (Warlock) */}
        {magicState.pactMagicSlots && (
          <View className="mt-2 pt-3 border-t border-dark-100 dark:border-surface-border/50">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center">
                <Ionicons
                  name="bonfire-outline"
                  size={16}
                  color={colors.accentPurple}
                />
                <Text className="text-purple-300 text-sm font-medium ml-1.5">
                  Magia de Pacto (Nv. {magicState.pactMagicSlots.slotLevel})
                </Text>
              </View>
              <Text className="text-dark-400 text-xs">
                {magicState.pactMagicSlots.total -
                  magicState.pactMagicSlots.used}
                /{magicState.pactMagicSlots.total} disponibles
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="flex-row flex-1">
                {Array.from({ length: magicState.pactMagicSlots.total }).map(
                  (_, i) => {
                    const isAvailable =
                      i <
                      magicState.pactMagicSlots!.total -
                        magicState.pactMagicSlots!.used;
                    return (
                      <TouchableOpacity
                        key={i}
                        className="h-9 w-9 rounded-lg mx-0.5 items-center justify-center border"
                        style={{
                          backgroundColor: isAvailable
                            ? `${colors.accentPurple}20`
                            : colors.bgPrimary,
                          borderColor: isAvailable
                            ? `${colors.accentPurple}66`
                            : colors.borderDefault,
                        }}
                        onPress={isAvailable ? handleUsePactSlot : undefined}
                      >
                        <Ionicons
                          name={isAvailable ? "bonfire" : "bonfire-outline"}
                          size={14}
                          color={
                            isAvailable
                              ? colors.accentPurple
                              : colors.borderDefault
                          }
                        />
                      </TouchableOpacity>
                    );
                  },
                )}
              </View>
              <TouchableOpacity
                className="ml-2 bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-2 active:bg-gray-300 dark:active:bg-dark-600"
                onPress={handleUsePactSlot}
                disabled={
                  (magicState.pactMagicSlots?.used ?? 0) >=
                  (magicState.pactMagicSlots?.total ?? 0)
                }
                style={{
                  opacity:
                    (magicState.pactMagicSlots?.used ?? 0) <
                    (magicState.pactMagicSlots?.total ?? 0)
                      ? 1
                      : 0.4,
                }}
              >
                <Ionicons name="remove" size={16} color={colors.accentPurple} />
              </TouchableOpacity>
              <TouchableOpacity
                className="ml-1 bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-2 active:bg-gray-300 dark:active:bg-dark-600"
                onPress={async () => {
                  await restoreAllPactSlots();
                  showToast("Espacios de pacto restaurados");
                }}
                disabled={(magicState.pactMagicSlots?.used ?? 0) <= 0}
                style={{
                  opacity: (magicState.pactMagicSlots?.used ?? 0) > 0 ? 1 : 0.4,
                }}
              >
                <Ionicons name="add" size={16} color={colors.accentPurple} />
              </TouchableOpacity>
            </View>

            <Text className="text-dark-300 dark:text-dark-500 text-[10px] mt-1.5">
              Se recuperan en descanso corto
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderSorceryPoints = () => {
    if (!magicState?.sorceryPoints || character.clase !== "hechicero")
      return null;

    const { max, current } = magicState.sorceryPoints;

    return (
      <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons name="sparkles" size={20} color="#ec4899" />
            <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
              Puntos de Hechicería
            </Text>
          </View>
          <Text className="text-pink-400 text-lg font-bold">
            {current}/{max}
          </Text>
        </View>

        <View className="h-3 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${max > 0 ? (current / max) * 100 : 0}%`,
              backgroundColor: "#ec4899",
            }}
          />
        </View>

        <Text className="text-dark-300 dark:text-dark-500 text-[10px] mt-1.5">
          Se recuperan en descanso largo
        </Text>
      </View>
    );
  };

  const renderConcentration = () => {
    const { concentration } = character;
    if (!concentration) return null;

    return (
      <View className="bg-white dark:bg-surface-card rounded-card border border-purple-500/30 p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Ionicons name="eye" size={20} color={colors.accentPurple} />
            <View className="ml-3 flex-1">
              <Text className="text-dark-400 text-[10px] uppercase tracking-wider">
                Concentración activa
              </Text>
              <Text className="text-purple-300 text-sm font-semibold">
                {concentration.spellName}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-gray-200 dark:bg-dark-700 rounded-lg px-3 py-1.5 active:bg-gray-300 dark:active:bg-dark-600"
            onPress={() => {
              showConfirm(
                "Romper Concentración",
                `¿Dejar de concentrarte en "${concentration.spellName}"?`,
                clearConcentration,
                {
                  confirmText: "Romper",
                  cancelText: "Cancelar",
                  type: "danger",
                },
              );
            }}
          >
            <Text className="text-red-400 text-xs font-semibold">Romper</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCantrips = () => {
    if (cantrips.length === 0) return null;

    return (
      <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <View
            className="h-7 w-7 rounded-full items-center justify-center mr-2"
            style={{ backgroundColor: `${SPELL_LEVEL_COLORS[0]}20` }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: SPELL_LEVEL_COLORS[0] }}
            >
              0
            </Text>
          </View>
          <Text className="text-dark-900 dark:text-white text-sm font-semibold flex-1">
            Trucos
          </Text>
          <Text className="text-dark-400 text-xs">
            {cantrips.length} conocidos
          </Text>
        </View>

        {cantrips.map((spellId) => (
          <SpellCard
            key={spellId}
            spellId={spellId}
            name={formatSpellName(spellId)}
            level={0}
            prepared={true}
            isCantrip
          />
        ))}
      </View>
    );
  };

  const renderSpellList = () => {
    if (levelSpells.length === 0) return null;

    const sectionTitle =
      preparationType === "spellbook"
        ? "Libro de Hechizos"
        : preparationType === "prepared"
          ? "Conjuros Preparados"
          : "Conjuros Conocidos";

    const levelLabel = (lvl: number) =>
      lvl === 1
        ? "Nivel 1"
        : lvl === 2
          ? "Nivel 2"
          : lvl === 3
            ? "Nivel 3"
            : `Nivel ${lvl}`;

    return (
      <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <Ionicons name="book" size={20} color={colors.accentGold} />
          <Text className="text-dark-900 dark:text-white text-sm font-semibold flex-1 ml-2">
            {sectionTitle}
          </Text>
          <Text className="text-dark-400 text-xs">
            {levelSpells.length} conjuro(s)
          </Text>
        </View>

        {sortedSpellLevels.map((lvl) => {
          const spellsAtLevel = spellsByLevel[lvl];
          const lvlColor = SPELL_LEVEL_COLORS[lvl] ?? colors.accentBlue;
          return (
            <View key={lvl} style={{ marginBottom: lvl !== sortedSpellLevels[sortedSpellLevels.length - 1] ? 12 : 0 }}>
              {/* Level sub-header */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 6 }}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: `${lvlColor}20`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: lvlColor, fontSize: 11, fontWeight: "700" }}>{lvl}</Text>
                </View>
                <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "600" }}>
                  {levelLabel(lvl)}
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.borderSubtle, marginLeft: 4 }} />
              </View>

              {spellsAtLevel.map((spellId) => (
                <SpellCard
                  key={spellId}
                  spellId={spellId}
                  name={formatSpellName(spellId)}
                  level={getSpellLevel(spellId)}
                  prepared={canCastSpell(spellId)}
                  inSpellbook={isInSpellbook(spellId)}
                  showSpellbook={preparationType === "spellbook"}
                  onCast={(castLvl) => handleUseSlot(castLvl)}
                />
              ))}
            </View>
          );
        })}
      </View>
    );
  };

  const renderEmptySpells = () => {
    if (cantrips.length > 0 || levelSpells.length > 0) return null;

    return (
      <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-6 mb-4 items-center">
        <View className="h-16 w-16 rounded-full bg-gray-200 dark:bg-dark-700 items-center justify-center mb-4">
          <Ionicons name="book-outline" size={32} color={colors.textMuted} />
        </View>
        <Text className="text-dark-900 dark:text-white text-base font-semibold text-center mb-1">
          Sin conjuros
        </Text>
        <Text className="text-dark-500 dark:text-dark-300 text-sm text-center leading-5">
          No tienes conjuros conocidos ni preparados todavía. Los conjuros se
          seleccionan durante la creación del personaje.
        </Text>
      </View>
    );
  };

  // ══════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ══════════════════════════════════════════════════════════════════

  if (isNonCaster) {
    // Non-caster: show class abilities with prominent resource slots
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {renderClassAbilitiesHeader()}
          {renderClassResourceSlots()}
          {renderClassAbilities()}
          {renderCharacterTraits()}
        </ScrollView>

        <ConfirmDialog {...dialogProps} />
      </View>
    );
  }

  // Caster: show spellcasting + class traits
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {renderSpellcastingInfo()}
        {renderConcentration()}
        {renderSpellSlots()}
        {renderSorceryPoints()}
        {renderCantrips()}
        {renderSpellList()}
        {renderEmptySpells()}
        {renderCharacterTraits()}
      </ScrollView>

      <ConfirmDialog {...dialogProps} />
    </View>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function StatBox({
  label,
  value,
  subValue,
  color,
}: {
  label: string;
  value: string;
  subValue?: string;
  color: string;
}) {
  return (
    <View className="flex-1 min-w-[100px] bg-gray-200 dark:bg-dark-700 rounded-xl p-3 mr-2 mb-2 items-center border border-dark-100 dark:border-surface-border">
      <Text className="text-dark-400 text-[10px] uppercase tracking-wider mb-1">
        {label}
      </Text>
      <Text className="text-xl font-bold" style={{ color }}>
        {value}
      </Text>
      {subValue && (
        <Text className="text-dark-300 dark:text-dark-500 text-[10px] mt-0.5">
          {subValue}
        </Text>
      )}
    </View>
  );
}

function TraitCard({
  trait,
  onUse,
  onRestore,
}: {
  trait: Trait;
  onUse: () => void;
  onRestore: () => void;
}) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const hasCharges = trait.maxUses !== null && trait.maxUses > 0;
  const chargesLeft = trait.currentUses ?? 0;
  const chargesMax = trait.maxUses ?? 0;

  const origenLabel: Record<string, string> = {
    raza: "Raza",
    clase: "Clase",
    subclase: "Subclase",
    trasfondo: "Trasfondo",
    dote: "Dote",
    manual: "Manual",
  };

  const origenColor: Record<string, string> = {
    raza: colors.accentGreen,
    clase: colors.accentBlue,
    subclase: colors.accentPurple,
    trasfondo: colors.accentAmber,
    dote: colors.accentDanger,
    manual: colors.textMuted,
  };

  return (
    <View className="bg-gray-200 dark:bg-dark-700 rounded-lg p-3 mb-2 border border-dark-100 dark:border-surface-border">
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View className="flex-1">
          <Text className="text-dark-900 dark:text-white text-sm font-semibold">
            {trait.nombre}
          </Text>
          <View className="flex-row items-center mt-0.5">
            <Text
              className="text-[10px]"
              style={{ color: origenColor[trait.origen] ?? colors.textMuted }}
            >
              {origenLabel[trait.origen] ?? trait.origen}
            </Text>
            {hasCharges && (
              <Text className="text-dark-400 text-[10px] ml-2">
                {chargesLeft}/{chargesMax} usos
              </Text>
            )}
            {trait.recharge && (
              <Text className="text-dark-300 dark:text-dark-500 text-[10px] ml-2">
                ·{" "}
                {trait.recharge === "short_rest"
                  ? "Desc. corto"
                  : trait.recharge === "long_rest"
                    ? "Desc. largo"
                    : trait.recharge === "dawn"
                      ? "Al amanecer"
                      : trait.recharge}
              </Text>
            )}
          </View>
        </View>

        {hasCharges && (
          <View className="flex-row items-center mr-2">
            <TouchableOpacity
              className="bg-white dark:bg-dark-600 rounded-lg px-2 py-1.5 mr-1 active:opacity-70"
              onPress={(e) => {
                e.stopPropagation?.();
                onUse();
              }}
              disabled={chargesLeft <= 0}
              style={{ opacity: chargesLeft > 0 ? 1 : 0.4 }}
            >
              <Ionicons name="remove" size={14} color={colors.accentDanger} />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white dark:bg-dark-600 rounded-lg px-2 py-1.5 active:opacity-70"
              onPress={(e) => {
                e.stopPropagation?.();
                onRestore();
              }}
              disabled={chargesLeft >= chargesMax}
              style={{ opacity: chargesLeft < chargesMax ? 1 : 0.4 }}
            >
              <Ionicons name="add" size={14} color={colors.accentGreen} />
            </TouchableOpacity>
          </View>
        )}

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      {expanded && (
        <View className="mt-2 pt-2 border-t border-dark-100 dark:border-surface-border/50">
          <Text className="text-dark-500 dark:text-dark-300 text-xs leading-5">
            {trait.descripcion}
          </Text>
        </View>
      )}
    </View>
  );
}

function SpellCard({
  spellId,
  name,
  level,
  prepared,
  isCantrip,
  inSpellbook,
  showSpellbook,
  onCast,
}: {
  spellId: string;
  name: string;
  level: number;
  prepared: boolean;
  isCantrip?: boolean;
  inSpellbook?: boolean;
  showSpellbook?: boolean;
  onCast?: (level: number) => void;
}) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const color = SPELL_LEVEL_COLORS[level] ?? colors.accentBlue;

  return (
    <TouchableOpacity
      className="bg-gray-200 dark:bg-dark-700 rounded-lg p-3 mb-2 border border-dark-100 dark:border-surface-border"
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View
          className="h-8 w-8 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${color}20` }}
        >
          {isCantrip ? (
            <Ionicons name="sparkles" size={16} color={color} />
          ) : (
            <Text className="text-xs font-bold" style={{ color }}>
              {level}
            </Text>
          )}
        </View>

        <View className="flex-1">
          <Text className="text-dark-900 dark:text-white text-sm font-semibold">
            {name}
          </Text>
          <View className="flex-row items-center mt-0.5">
            {isCantrip && (
              <Text className="text-dark-400 text-[10px] mr-2">
                Truco{(() => { const s = getSpellById(spellId); return s ? ` · ${s.escuela}` : ""; })()}
              </Text>
            )}
            {!isCantrip && prepared && (
              <View className="flex-row items-center mr-2">
                <Ionicons
                  name="checkmark-circle"
                  size={10}
                  color={colors.accentGreen}
                />
                <Text className="text-green-600 dark:text-green-400 text-[10px] ml-0.5">
                  Preparado
                </Text>
              </View>
            )}
            {showSpellbook && inSpellbook && (
              <View className="flex-row items-center mr-2">
                <Ionicons name="book" size={10} color={colors.accentGold} />
                <Text className="text-gold-700 dark:text-gold-400 text-[10px] ml-0.5">
                  En libro
                </Text>
              </View>
            )}
          </View>
        </View>

        {!isCantrip && onCast && prepared && (
          <TouchableOpacity
            className="bg-primary-500/20 rounded-lg px-3 py-1.5 mr-2 active:bg-primary-500/40"
            onPress={(e) => {
              e.stopPropagation?.();
              onCast(level);
            }}
          >
            <Text className="text-primary-400 text-xs font-semibold">
              Lanzar
            </Text>
          </TouchableOpacity>
        )}

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.textMuted}
        />
      </View>

      {expanded && (
        <View className="mt-2 pt-2 border-t border-dark-100 dark:border-surface-border/50">
          {(() => {
            const srdSpell = getSpellById(spellId);
            if (srdSpell) {
              return (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  <Text className="text-dark-500 dark:text-dark-300 text-xs">
                    {srdSpell.escuela}
                  </Text>
                  {!isCantrip && (
                    <Text className="text-dark-400 text-xs">
                      · Nivel {srdSpell.nivel}
                    </Text>
                  )}
                </View>
              );
            }
            return (
              <Text className="text-dark-500 dark:text-dark-300 text-xs leading-5">
                ID: {spellId}
              </Text>
            );
          })()}
          <Text className="text-dark-400 text-[10px] mt-1 italic">
            La descripción detallada del conjuro se mostrará cuando se carguen
            los datos completos del SRD.
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
