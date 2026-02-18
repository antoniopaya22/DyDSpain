/**
 * Class ability data for non-caster classes (Bárbaro, Guerrero, Monje, Pícaro).
 * Extracted from AbilitiesTab for separation of concerns: data ≠ UI.
 */

import type { ClassId } from "@/types/character";
import {
  RAGE_USES,
  RAGE_DAMAGE,
  MARTIAL_ARTS_DIE,
  SNEAK_ATTACK_DICE,
} from "@/data/srd/leveling";

// ─── Types ───────────────────────────────────────────────────────────

export interface ClassAbilityResource {
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
    label: string;
    color: string;
  };
}

// ─── Bárbaro ─────────────────────────────────────────────────────────

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

// ─── Guerrero ────────────────────────────────────────────────────────

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

// ─── Monje ───────────────────────────────────────────────────────────

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

// ─── Pícaro ──────────────────────────────────────────────────────────

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

// ─── Dispatcher ──────────────────────────────────────────────────────

export function getClassAbilities(
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
