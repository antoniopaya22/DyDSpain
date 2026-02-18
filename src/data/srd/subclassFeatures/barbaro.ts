/**
 * Rasgos de subclase: Bárbaro
 */

import type { SubclassFeatureData } from "./types";

export const BARBARO_SUBCLASS_FEATURES: SubclassFeatureData[] = [
  // ── Senda del Berserker ────────────────────────────────────────────
  {
    subclaseId: "senda_berserker",
    claseId: "barbaro",
    nombre: "Senda del Berserker",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Frenesí",
            descripcion:
              "Al entrar en furia, puedes elegir caer en frenesí. Si lo haces, durante esa furia puedes realizar un ataque cuerpo a cuerpo extra como acción adicional en cada turno. Al finalizar, sufres un nivel de agotamiento.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Furia sin Límites",
            descripcion:
              "No puedes ser hechizado ni asustado mientras estés en furia. Si estabas hechizado o asustado al entrar en furia, el efecto se suspende.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Presencia Intimidante",
            descripcion:
              "Puedes usar tu acción para asustar a alguien. Elige una criatura a 9 m que pueda verte. Debe superar una salvación de Sabiduría (CD 8 + tu bon. competencia + mod. CAR) o queda asustada hasta el final de tu siguiente turno.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Represalia",
            descripcion:
              "Cuando recibes daño de una criatura a 1,5 m de ti, puedes usar tu reacción para realizar un ataque cuerpo a cuerpo contra ella.",
          },
        ],
      },
    ],
  },

  // ── Senda del Guerrero Totémico ────────────────────────────────────
  {
    subclaseId: "senda_guerrero_totemico",
    claseId: "barbaro",
    nombre: "Senda del Guerrero Totémico",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Tótem Espiritual",
            descripcion:
              "Elige un espíritu animal como tótem. Obtienes un beneficio según el tótem elegido mientras estés en furia.",
            elecciones: [
              {
                id: "totem_nivel3",
                nombre: "Espíritu Totémico",
                instruccion: "Elige tu espíritu totémico:",
                tipo: "single",
                opciones: [
                  {
                    id: "oso",
                    nombre: "Oso",
                    descripcion:
                      "Mientras estés en furia, tienes resistencia a todos los tipos de daño excepto al psíquico.",
                  },
                  {
                    id: "aguila",
                    nombre: "Águila",
                    descripcion:
                      "Mientras estés en furia, las demás criaturas tienen desventaja en ataques de oportunidad contra ti, y puedes usar la acción de Carrera como acción adicional.",
                  },
                  {
                    id: "lobo",
                    nombre: "Lobo",
                    descripcion:
                      "Mientras estés en furia, tus aliados tienen ventaja en tiradas de ataque cuerpo a cuerpo contra criaturas a 1,5 m de ti.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Aspecto de la Bestia",
            descripcion:
              "Obtienes un beneficio basado en un animal totémico.",
            elecciones: [
              {
                id: "totem_nivel6",
                nombre: "Aspecto de la Bestia",
                instruccion: "Elige tu aspecto animal:",
                tipo: "single",
                opciones: [
                  {
                    id: "oso",
                    nombre: "Oso",
                    descripcion:
                      "Tu capacidad de carga se duplica y tienes ventaja en pruebas de Fuerza para empujar, tirar, levantar o romper objetos.",
                  },
                  {
                    id: "aguila",
                    nombre: "Águila",
                    descripcion:
                      "Puedes ver hasta 1,5 km sin dificultad y no tienes desventaja en pruebas de Percepción por distancia.",
                  },
                  {
                    id: "lobo",
                    nombre: "Lobo",
                    descripcion:
                      "Puedes rastrear a otras criaturas mientras viajas a ritmo rápido y puedes moverte sigilosamente a ritmo normal.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Caminante Totémico",
            descripcion:
              "Obtienes un beneficio basado en un animal totémico.",
            elecciones: [
              {
                id: "totem_nivel14",
                nombre: "Caminante Totémico",
                instruccion: "Elige tu caminante totémico:",
                tipo: "single",
                opciones: [
                  {
                    id: "oso",
                    nombre: "Oso",
                    descripcion:
                      "Mientras estés en furia, las criaturas a 1,5 m tienen desventaja en tiradas de ataque contra objetivos que no seas tú.",
                  },
                  {
                    id: "aguila",
                    nombre: "Águila",
                    descripcion:
                      "Mientras estés en furia, ganas velocidad de vuelo igual a tu velocidad de caminar. Si terminas tu turno en el aire, caes.",
                  },
                  {
                    id: "lobo",
                    nombre: "Lobo",
                    descripcion:
                      "Mientras estés en furia, puedes usar una acción adicional para derribar a una criatura Grande o menor cuando la impactes con un ataque cuerpo a cuerpo.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Senda del Guerrero del Alma ────────────────────────────────────
  {
    subclaseId: "senda_guerrero_alma",
    claseId: "barbaro",
    nombre: "Senda del Guerrero del Alma",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Escudo del Alma",
            descripcion:
              "Mientras estés en furia y no lleves armadura pesada, ganas +2 a la CA. Puedes usar un escudo y seguir obteniendo este beneficio.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Sustento del Alma",
            descripcion:
              "Si debes realizar una tirada de salvación de muerte al inicio de tu turno, puedes gastar una furia para que cuente como haber sacado un 20 (recuperas 1 PG).",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Núcleo Imparable",
            descripcion:
              "Tu CAR no puede ser reducida por debajo de su valor natural mientras estés en furia, e ignoras el agotamiento mientras estés en furia.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Estallido del Alma",
            descripcion:
              "Cuando entres en furia, cada criatura de tu elección a 3 m debe superar una salvación de CAR (CD 8 + bon. competencia + mod. CAR) o ser asustada hasta el final de tu siguiente turno. Una vez uses esto, no puedes repetirlo hasta que acabes un descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Senda del Portador Ancestral ───────────────────────────────────
  {
    subclaseId: "senda_portador_ancestral",
    claseId: "barbaro",
    nombre: "Senda del Portador Ancestral",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Protectores Ancestrales",
            descripcion:
              "Mientras estés en furia, guerreros espectrales aparecen. La primera criatura que impactes en tu turno tiene desventaja en tiradas de ataque que no te incluyan hasta el inicio de tu siguiente turno.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Consultar con los Espíritus",
            descripcion:
              "Puedes lanzar los conjuros Augurio y Hablar con los Muertos como rituales, sin componentes materiales. Sabiduría es tu característica de conjuración.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Escudo Vengativo",
            descripcion:
              "Los espíritus ancestrales se vuelven lo bastante poderosos como para proteger a tus aliados. Mientras estés en furia, cada criatura que elijas a 9 m gana resistencia a daño contundente, cortante y perforante.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Ancestros Vengativos",
            descripcion:
              "Cuando usas Escudo Vengativo, si la criatura que provocó la furia ataca a uno de tus aliados protegidos, el atacante recibe daño de fuerza igual a tu mod. de CAR (mín. 1).",
          },
        ],
      },
    ],
  },

  // ── Senda del Heraldo de la Furia ──────────────────────────────────
  {
    subclaseId: "senda_heraldo_furia",
    claseId: "barbaro",
    nombre: "Senda del Heraldo de la Furia",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Frenético Divino",
            descripcion:
              "Mientras estés en furia, la primera criatura que impactes en cada turno recibe 1d6 de daño extra. Este daño es necrótico o radiante (elige al entrar en furia).",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Aura Fanática",
            descripcion:
              "Mientras estés en furia, tú y cada aliado a 3 m tenéis ventaja en las tiradas de salvación contra ser hechizado o asustado. Esta aura aumenta a 6 m al nivel 10.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Poder Celestial",
            descripcion:
              "El daño extra de Frenético Divino aumenta a 1d8.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Furia Más Allá de la Muerte",
            descripcion:
              "Mientras estés en furia, caer a 0 puntos de golpe no te deja inconsciente. Sigues haciendo tiradas de salvación contra muerte y solo mueres si la furia termina con 0 PG.",
          },
        ],
      },
    ],
  },

  // ── Senda de la Bestia ─────────────────────────────────────────────
  {
    subclaseId: "senda_bestia",
    claseId: "barbaro",
    nombre: "Senda de la Bestia",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Forma de la Bestia",
            descripcion:
              "Al entrar en furia, manifiestas un arma natural que cuenta como ataque cuerpo a cuerpo simple.",
            elecciones: [
              {
                id: "forma_bestia_3",
                nombre: "Forma de la Bestia",
                instruccion: "Elige tu arma natural:",
                tipo: "single",
                opciones: [
                  {
                    id: "mordisco",
                    nombre: "Mordisco",
                    descripcion:
                      "1d8 perforante. Una vez por turno, si tu PG actual es menor que la mitad del máximo, recuperas PG iguales a tu bon. de competencia al impactar.",
                  },
                  {
                    id: "garras",
                    nombre: "Garras",
                    descripcion:
                      "1d6 cortante cada una. Al atacar con garras puedes realizar un ataque extra con garras como parte de la misma acción.",
                  },
                  {
                    id: "cola",
                    nombre: "Cola",
                    descripcion:
                      "1d12 perforante. Alcance de 3 m. Puedes usar tu reacción al recibir un impacto para tirar 1d8 y sumar el resultado a tu CA contra ese ataque.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Alma Bestial",
            descripcion:
              "Tus armas naturales cuentan como mágicas. También ganas una capacidad de movimiento.",
            elecciones: [
              {
                id: "alma_bestial_6",
                nombre: "Alma Bestial",
                instruccion: "Elige tu capacidad de movimiento:",
                tipo: "single",
                opciones: [
                  {
                    id: "nadar",
                    nombre: "Nadar",
                    descripcion:
                      "Ganas velocidad de nado igual a tu velocidad de caminar y puedes respirar bajo el agua.",
                  },
                  {
                    id: "trepar",
                    nombre: "Trepar",
                    descripcion:
                      "Ganas velocidad de trepar igual a tu velocidad de caminar y puedes trepar por superficies difíciles sin prueba.",
                  },
                  {
                    id: "saltar",
                    nombre: "Saltar",
                    descripcion:
                      "Cuando saltas, puedes sumarlo a tu movimiento sin prueba de Atletismo, incrementando la distancia en un número de pies igual a tu bon. competencia.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Furia Infecciosa",
            descripcion:
              "Al impactar con tus armas naturales, puedes maldecir al objetivo. La próxima vez que golpee a alguien antes de tu siguiente turno, recibe 2d12 de daño psíquico. Usos iguales a tu bon. competencia por descanso largo.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Llamada de la Cacería",
            descripcion:
              "Cuando una criatura a 9 m reduce a 0 PG a otra criatura, puedes usar tu reacción para que esa criatura haga una salvación de SAB (CD 8 + bon. competencia + mod. CON) o cae en una furia temporal hasta el fin de su siguiente turno, recibiendo daño psíquico.",
          },
        ],
      },
    ],
  },

  // ── Senda de la Magia Salvaje ──────────────────────────────────────
  {
    subclaseId: "senda_magia_salvaje",
    claseId: "barbaro",
    nombre: "Senda de la Magia Salvaje",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Percepción Mágica",
            descripcion:
              "Puedes lanzar Detectar Magia como ritual sin componentes materiales. Sabiduría es tu característica de conjuración.",
          },
          {
            nombre: "Oleada de Magia Salvaje",
            descripcion:
              "Al entrar en furia, tira en la tabla de Magia Salvaje del bárbaro para determinar un efecto mágico aleatorio que dura mientras estés en furia.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Carga Mágica",
            descripcion:
              "Puedes usar tu acción para tocar un arma simple o marcial y cargarla de energía. El siguiente impacto con ella inflige 1d6 de daño de fuerza adicional y puede teletransportar al objetivo 4,5 m a un espacio que elijas. Usos iguales a tu bon. competencia por descanso largo.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Contragolpe Inestable",
            descripcion:
              "Cuando estés en peligro, la magia fluye a través de ti. Inmediatamente después de recibir daño o fallar una salvación mientras estés en furia, puedes tirar otra vez en la tabla de Oleada de Magia Salvaje (reemplaza el efecto anterior).",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Bombardeo Controlado",
            descripcion:
              "Cuando tiras daño de un rasgo de subclase o conjuro, puedes tirar un dado de daño adicional, elegir uno y descartarlo, usando el resto.",
          },
        ],
      },
    ],
  },

  // ── Senda del Guardián Salvaje ─────────────────────────────────────
  {
    subclaseId: "senda_guardian_salvaje",
    claseId: "barbaro",
    nombre: "Senda del Guardián Salvaje",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Defensor Feral",
            descripcion:
              "Al nivel 3, mientras estés en furia tu velocidad aumenta en 3 m y ganas trepar y nadar si no los tenías.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Vínculo Primordial",
            descripcion:
              "Puedes comunicarte con bestias de forma limitada. Ganas competencia en la habilidad Trato con Animales si no la tenías.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Espíritu del Mundo Natural",
            descripcion:
              "Los espíritus de la naturaleza te protegen. Cuando terminas un descanso largo, ganas los beneficios de uno de estos conjuros (sin componentes): Comunión con la naturaleza o Paseo por los árboles. Dura hasta que termines un descanso largo.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Forma Salvaje Furiosa",
            descripcion:
              "Mientras estés en furia, canalizas salvajismo. Tu movimiento no provoca ataques de oportunidad y puedes usar tu acción para asustar criaturas a 9 m (salvación de SAB CD 8 + bon. competencia + mod. CON).",
          },
        ],
      },
    ],
  },
];
