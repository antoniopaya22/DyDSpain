/**
 * Rasgos de subclase: Bardo
 */

import type { SubclassFeatureData } from "./types";

export const BARDO_SUBCLASS_FEATURES: SubclassFeatureData[] = [
  // ── Colegio del Conocimiento ──────────────────────────────────────
  {
    subclaseId: "colegio_conocimiento",
    claseId: "bardo",
    nombre: "Colegio del Conocimiento",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Competencias Adicionales",
            descripcion:
              "Ganas competencia en tres habilidades cualesquiera de tu elección.",
          },
          {
            nombre: "Palabras Cortantes",
            descripcion:
              "Cuando una criatura que puedas ver a 18 m o menos realice una tirada de ataque, una prueba de característica o una tirada de daño, puedes emplear tu reacción y gastar un uso de Inspiración Bárdica para tirar un dado de Inspiración Bárdica y restar el resultado a la tirada de la criatura. La criatura debe poder oírte y no ser inmune al estado hechizado.",
          },
        ],
        habilidadesExtra: {
          cantidad: 3,
          cualquiera: true,
        },
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Secretos Mágicos Adicionales",
            descripcion:
              "Aprendes dos conjuros a tu elección de las listas de cualquier clase. Puedes elegir trucos o conjuros de un nivel que puedas lanzar. Estos conjuros se consideran conjuros de bardo pero no cuentan para el total de conjuros que conoces.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Habilidad sin Parangón",
            descripcion:
              "Cuando hagas una prueba de característica, puedes gastar un uso de Inspiración Bárdica. Tira el dado de Inspiración Bárdica y suma el resultado a tu prueba. Puedes elegir hacerlo después de tirar el d20, pero antes de que el GM diga si la superas o no.",
          },
        ],
      },
    ],
  },

  // ── Colegio del Valor ──────────────────────────────────────────────
  {
    subclaseId: "colegio_valor",
    claseId: "bardo",
    nombre: "Colegio del Valor",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Competencias Adicionales",
            descripcion:
              "Ganas competencia con armaduras medianas, escudos y armas marciales.",
          },
          {
            nombre: "Inspiración de Combate",
            descripcion:
              "Cuando otorgas un dado de Inspiración Bárdica, el aliado puede usarlo para sumar a una tirada de daño de arma, o como reacción para sumarlo a su CA contra un ataque (después de ver la tirada, pero antes de saber si impacta).",
          },
        ],
        competenciasGanadas: {
          armaduras: ["Armaduras medianas", "Escudos"],
          armas: ["Armas marciales"],
        },
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Ataque Extra",
            descripcion:
              "Puedes atacar dos veces, en lugar de una, cada vez que realices la acción de Atacar en tu turno.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Inspiración de Batalla Superior",
            descripcion:
              "Cuando un aliado use tu dado de Inspiración Bárdica en una tirada de daño o para aumentar su CA, tirará dos dados de Inspiración Bárdica y elegirá el resultado mayor.",
          },
        ],
      },
    ],
  },

  // ── Colegio de las Espadas ─────────────────────────────────────────
  {
    subclaseId: "colegio_espadas",
    claseId: "bardo",
    nombre: "Colegio de las Espadas",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Competencias Adicionales",
            descripcion:
              "Ganas competencia con armaduras medianas y con la cimitarra. Puedes usar un arma cuerpo a cuerpo en la que seas competente como canalizador mágico para tus conjuros de bardo.",
          },
          {
            nombre: "Estilo de Combate",
            descripcion:
              "Eliges un estilo de combate como especialidad.",
            elecciones: [
              {
                id: "estilo_combate",
                nombre: "Estilo de Combate",
                instruccion: "Elige tu estilo de combate:",
                tipo: "single",
                opciones: [
                  {
                    id: "duelo",
                    nombre: "Duelo",
                    descripcion:
                      "Cuando empuñas un arma cuerpo a cuerpo en una mano y ninguna otra arma, obtienes un bonificador de +2 a las tiradas de daño con esa arma.",
                  },
                  {
                    id: "dos_armas",
                    nombre: "Combate con Dos Armas",
                    descripcion:
                      "Cuando combates con dos armas, puedes sumar tu modificador de característica al daño del segundo ataque.",
                  },
                ],
              },
            ],
          },
          {
            nombre: "Florituras con Cuchillas",
            descripcion:
              "Al realizar la acción de Atacar, puedes gastar un uso de Inspiración Bárdica y sumar el dado a la tirada de daño. Además, elige una floritura: Defensiva (suma el dado a tu CA hasta tu siguiente turno), Móvil (suma el dado a tu velocidad, sin ataques de oportunidad del objetivo), u Ofensiva (empujas al objetivo 1,5 m × el resultado del dado).",
          },
        ],
        competenciasGanadas: {
          armaduras: ["Armaduras medianas"],
          armas: ["Cimitarra"],
        },
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Ataque Extra",
            descripcion:
              "Puedes atacar dos veces, en lugar de una, cada vez que realices la acción de Atacar en tu turno.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Floritura Magistral",
            descripcion:
              "Cada vez que uses una Floritura con Cuchillas, puedes tirar un d6 en lugar de gastar un dado de Inspiración Bárdica. Si decides gastar el dado de Inspiración Bárdica y obtienes un 9 o 10, la Floritura no consume el uso.",
          },
        ],
      },
    ],
  },

  // ── Colegio del Glamour ────────────────────────────────────────────
  {
    subclaseId: "colegio_glamour",
    claseId: "bardo",
    nombre: "Colegio del Glamour",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Presencia Manifiesta",
            descripcion:
              "Como acción bonus, puedes gastar un uso de Inspiración Bárdica para proyectar una presencia cautivadora. Elige hasta un número de criaturas igual a tu modificador de Carisma (mínimo 1) que puedas ver a 18 m o menos. Cada objetivo debe superar una tirada de salvación de Sabiduría o quedará hechizado por ti durante 1 minuto.",
          },
          {
            nombre: "Manto de Inspiración",
            descripcion:
              "Como acción bonus, puedes gastar un uso de Inspiración Bárdica para otorgar a hasta 5 aliados a 18 m o menos puntos de golpe temporales iguales al dado de Inspiración Bárdica + tu modificador de Carisma. Cada aliado puede usar su reacción para moverse hasta su velocidad sin provocar ataques de oportunidad.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Manto de la Majestad",
            descripcion:
              "Como acción bonus, puedes lanzar Mandato sin gastar un espacio de conjuro en cada turno durante 1 minuto. Criaturas hechizadas por ti fallan automáticamente su salvación. Una vez por descanso largo.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Belleza Irresistible",
            descripcion:
              "Como acción, proyectas tu belleza feérica durante 1 minuto. Cualquier criatura que te ataque por primera vez en cada turno debe superar una salvación de Sabiduría o quedará hechizada hasta el final de su turno. Una vez por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Colegio de la Elocuencia ───────────────────────────────────────
  {
    subclaseId: "colegio_elocuencia",
    claseId: "bardo",
    nombre: "Colegio de la Elocuencia",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Maestro del Argumento",
            descripcion:
              "Ganas competencia en Persuasión y Engaño. Si ya eres competente en alguna, tu bonificador de competencia se duplica (Pericia) para esas habilidades.",
          },
          {
            nombre: "Verdad Innegable",
            descripcion:
              "Cuando una criatura tira tu dado de Inspiración Bárdica y obtiene un 1, puede volver a tirar y debe usar el nuevo resultado. Si el resultado final es inferior a 2, se considera un 2.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Elocuencia Imparable",
            descripcion:
              "Cuando una criatura suma tu dado de Inspiración Bárdica a una prueba, tirada de ataque o tirada de salvación y falla, no pierde ese uso de Inspiración Bárdica.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Palabras Universales",
            descripcion:
              "Puedes lanzar Sugerencia sin gastar un espacio de conjuro ni concentración, afectando hasta 5 criaturas simultáneamente. Una vez por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Colegio de los Lamentos ────────────────────────────────────────
  {
    subclaseId: "colegio_lamentos",
    claseId: "bardo",
    nombre: "Colegio de los Lamentos",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Palabras del Terror",
            descripcion:
              "Si hablas con un humanoide a solas durante al menos 1 minuto, el objetivo debe superar una salvación de Sabiduría o quedará aterrorizado por ti o por otra criatura de tu elección. El efecto dura 1 hora.",
          },
          {
            nombre: "Inspiración del Lamento",
            descripcion:
              "Al impactar con un ataque con arma, puedes gastar un uso de Inspiración Bárdica para infligir daño psíquico adicional: 2d6 a nivel 3, 3d6 a nivel 5, 5d6 a nivel 10 y 8d6 a nivel 15. Una vez por turno.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Manto de Sombras",
            descripcion:
              "Como acción bonus, gasta un uso de Inspiración Bárdica para volverte invisible durante 1 minuto o hasta que ataques, lances un conjuro o te concentres.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Palabras Mortíferas",
            descripcion:
              "Al reducir un humanoide a 0 PG, capturas su sombra espiritual. Puedes asumir su apariencia, voz y recuerdos superficiales durante 1 hora. Las criaturas que la conocían deben superar una prueba de Perspicacia contra tu CD de conjuros para detectar el engaño.",
          },
        ],
      },
    ],
  },

  // ── Colegio de la Creación ─────────────────────────────────────────
  {
    subclaseId: "colegio_creacion",
    claseId: "bardo",
    nombre: "Colegio de la Creación",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Notas de Creación",
            descripcion:
              "Cuando otorgas un dado de Inspiración Bárdica, la criatura también gana puntos de golpe temporales iguales al resultado del dado.",
          },
          {
            nombre: "Objeto de Rendimiento",
            descripcion:
              "Como acción, puedes crear un objeto no mágico de hasta 1 m³ en un espacio a 3 m o menos. Debe ser algo que hayas visto antes. El objeto emite un brillo tenue y desaparece al expirar su duración.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Animar la Creación",
            descripcion:
              "Como acción, anima un objeto Grande o más pequeño a 9 m de ti. El objeto cobra vida durante 1 hora, obedece tus órdenes y tiene estadísticas basadas en su tamaño. Usos = mod. Carisma por descanso largo.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Canción de la Creación",
            descripcion:
              "Puedes crear más de un objeto con Objeto de Rendimiento. Además, puedes restaurar un uso gastado de Notas de Creación como acción. Una restauración por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Colegio del Espíritu ───────────────────────────────────────────
  {
    subclaseId: "colegio_espiritu",
    claseId: "bardo",
    nombre: "Colegio del Espíritu",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Cuentos de Más Allá",
            descripcion:
              "Al otorgar un dado de Inspiración Bárdica, tiras en la tabla de Cuentos del Más Allá para determinar qué relato manifiestas. El cuento otorga un efecto especial al aliado según el resultado.",
          },
          {
            nombre: "Guía Espiritual",
            descripcion:
              "Aprendes el conjuro Hablar con los muertos sin componente material. No cuenta para el total de conjuros de bardo que conoces y puedes lanzarlo como ritual.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Canal del Más Allá",
            descripcion:
              "Cuando una criatura con tu dado de Inspiración Bárdica lo usa y falla, puedes usar tu reacción para recuperar el dado. Usos = mod. Carisma por descanso largo.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Historias Eternas",
            descripcion:
              "Con Cuentos de Más Allá, puedes otorgar el cuento a dos criaturas a la vez. Puedes tirar dos veces en la tabla y elegir qué cuento manifiestas.",
          },
        ],
      },
    ],
  },
];
