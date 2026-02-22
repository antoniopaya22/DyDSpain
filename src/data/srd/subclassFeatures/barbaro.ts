/**
 * Rasgos de subclase: Bárbaro
 * PHB'24 + XGtE + TCoE
 */

import type { SubclassFeatureData } from "./types";

export const BARBARO_SUBCLASS_FEATURES: SubclassFeatureData[] = [
  // ── Senda del Berserker (PHB'24) ───────────────────────────────────
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
              "Mientras estés en furia, puedes realizar un ataque cuerpo a cuerpo adicional como parte de tu acción de Atacar (una vez por turno). Si usas Ataque Temerario, puedes realizar un segundo ataque adicional. Cuando tu furia termina, sufres un nivel de agotamiento (máx. 6 niveles).",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Furia sin Límites",
            descripcion:
              "No puedes ser hechizado ni asustado mientras estés en furia. Si ya lo estabas al entrar en furia, el efecto se suspende mientras dure la furia.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Represalia",
            descripcion:
              "Cuando recibes daño de una criatura a 1,5 m de ti, puedes usar tu reacción para realizar un ataque cuerpo a cuerpo contra esa criatura.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Presencia Intimidante",
            descripcion:
              "Como acción adicional, elige una criatura a 9 m que pueda verte u oírte. Debe superar una salvación de SAB (CD = 8 + tu bon. competencia + mod. FUE) o queda asustada de ti hasta el final de tu siguiente turno. Si la criatura falla la salvación por 5 o más, queda asustada durante 1 minuto; puede repetir la salvación al final de cada turno para terminar el efecto.",
          },
        ],
      },
    ],
  },

  // ── Senda del Corazón Salvaje (PHB'24) ─────────────────────────────
  {
    subclaseId: "senda_corazon_salvaje",
    claseId: "barbaro",
    nombre: "Senda del Corazón Salvaje",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Hablar con Animales",
            descripcion:
              "Puedes lanzar Hablar con Animales como ritual y como conjuro preparado. Sabiduría es tu característica de conjuración.",
          },
          {
            nombre: "Furia de lo Salvaje",
            descripcion:
              "Al entrar en furia, elige uno de los siguientes efectos que dura mientras estés en furia.",
            elecciones: [
              {
                id: "furia_salvaje_3",
                nombre: "Furia de lo Salvaje",
                instruccion: "Elige tu manifestación salvaje:",
                tipo: "single",
                opciones: [
                  {
                    id: "oso",
                    nombre: "Oso",
                    descripcion:
                      "Mientras estés en furia, tienes resistencia a todos los tipos de daño excepto al de Fuerza, Necrótico y Psíquico.",
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
                      "Mientras estés en furia, tus aliados tienen ventaja en tiradas de ataque cuerpo a cuerpo contra cualquier criatura hostil a 1,5 m de ti.",
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
            nombre: "Aspecto de lo Salvaje",
            descripcion:
              "Obtienes un beneficio permanente basado en un aspecto animal. Puedes cambiar esta elección cada vez que subes de nivel.",
            elecciones: [
              {
                id: "aspecto_salvaje_6",
                nombre: "Aspecto de lo Salvaje",
                instruccion: "Elige tu aspecto animal:",
                tipo: "single",
                opciones: [
                  {
                    id: "buho",
                    nombre: "Búho",
                    descripcion:
                      "Tienes visión en la oscuridad con un alcance de 18 m. Si ya tienes visión en la oscuridad, su alcance aumenta en 18 m.",
                  },
                  {
                    id: "pantera",
                    nombre: "Pantera",
                    descripcion:
                      "Tu velocidad de caminar aumenta en 3 m (10 pies) y ganas velocidad de trepar y nadar iguales a tu velocidad.",
                  },
                  {
                    id: "salmon",
                    nombre: "Salmón",
                    descripcion:
                      "Tu distancia de salto de longitud y salto de altura aumentan en un número de pies igual a tu bon. competencia × 3.",
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
            nombre: "Hablar con la Naturaleza",
            descripcion:
              "Puedes lanzar Comunión con la Naturaleza como ritual. Cuando lo haces, una manifestación espiritual de uno de los animales que has elegido previamente te transmite la información.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Poder de lo Salvaje",
            descripcion:
              "Al entrar en furia, elige uno de los siguientes efectos que dura mientras estés en furia.",
            elecciones: [
              {
                id: "poder_salvaje_14",
                nombre: "Poder de lo Salvaje",
                instruccion: "Elige tu poder animal:",
                tipo: "single",
                opciones: [
                  {
                    id: "halcon",
                    nombre: "Halcón",
                    descripcion:
                      "Mientras estés en furia y uses Ataque Temerario, puedes atacar a una segunda criatura a 1,5 m del objetivo con el mismo ataque (tira por separado). El daño de Furia solo se aplica una vez.",
                  },
                  {
                    id: "leon",
                    nombre: "León",
                    descripcion:
                      "Mientras estés en furia, al mover al menos 3 m en línea recta hacia una criatura e impactarla, esa criatura debe superar una salvación de FUE (CD = 8 + bon. competencia + mod. FUE) o caerá Derribada.",
                  },
                  {
                    id: "carnero",
                    nombre: "Carnero",
                    descripcion:
                      "Mientras estés en furia, puedes causar un empuje de 9 m (30 pies) cuando impactes a una criatura Grande o menor con un ataque cuerpo a cuerpo, en vez de los 4,5 m habituales.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Senda del Árbol del Mundo (PHB'24) ─────────────────────────────
  {
    subclaseId: "senda_arbol_mundo",
    claseId: "barbaro",
    nombre: "Senda del Árbol del Mundo",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Vitalidad del Árbol",
            descripcion:
              "Tu furia te conecta con el Árbol del Mundo. Al entrar en furia, ganas un número de puntos de golpe temporales iguales a tu mod. CON (mín. 1). Mientras estés en furia y adyacente a al menos un aliado, tú y ellos tenéis Ventaja en salvaciones de muerte.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Ramas del Árbol",
            descripcion:
              "Mientras estés en furia, puedes usar tu reacción cuando un aliado a 9 m de ti sea impactado por un ataque. Reduces el daño que ese aliado recibe en un número igual a tu bon. competencia (solo una vez por ronda). Además, puedes teletransportar al aliado a un espacio desocupado a 1,5 m de ti (el aliado debe desearlo).",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Raíces Golpeadoras",
            descripcion:
              "Mientras estés en furia, el terreno a 4,5 m de ti es terreno difícil para criaturas hostiles. Cuando uses Golpe Brutal, puedes empujar al objetivo hasta 3 m en cualquier dirección (o tirarlo al suelo).",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Viajar por el Árbol",
            descripcion:
              "Mientras estés en furia, puedes usar una acción adicional para teletransportarte hasta 18 m a un espacio desocupado que puedas ver. Una vez al turno, cuando te teletransportes, cada criatura de tu elección en un radio de 1,5 m de tu destino debe superar una salvación de CON (CD = 8 + bon. competencia + mod. FUE) o recibir 3d6 de daño de Fuerza, mitad si supera.",
          },
        ],
      },
    ],
  },

  // ── Senda del Fanático (PHB'24) ────────────────────────────────────
  {
    subclaseId: "senda_fanatico",
    claseId: "barbaro",
    nombre: "Senda del Fanático",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Furia Divina",
            descripcion:
              "Mientras estés en furia, la primera criatura que impactes en cada turno con un ataque de arma recibe 1d6 de daño Necrótico o Radiante (tú eliges al entrar en furia). Este daño aumenta a 2d6 al nivel 14.",
          },
          {
            nombre: "Guerrero de los Dioses",
            descripcion:
              "Si un conjuro como Revivir se usa para devolverte a la vida, no requiere componentes materiales.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Enfoque Fanático",
            descripcion:
              "Si fallas una salvación o una prueba de característica mientras estés en furia, puedes repetir la tirada y usar el nuevo resultado. Puedes usar este rasgo un número de veces igual a tu bon. competencia, y recuperas todos los usos tras un descanso largo.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Presencia Fanática",
            descripcion:
              "Como acción adicional, puedes soltar un grito de batalla. Hasta 10 criaturas de tu elección a 18 m que puedan oírte ganan ventaja en tiradas de ataque y salvaciones hasta el inicio de tu siguiente turno. Una vez uses este rasgo, no puedes repetirlo hasta acabar un descanso largo.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Furia de los Dioses",
            descripcion:
              "Mientras estés en furia, tu Furia Divina inflige 2d6 en lugar de 1d6. Además, si eres reducido a 0 PG mientras estés en furia y no mueres directamente, puedes usar tu reacción para mantener 1 PG e infligir daño Necrótico o Radiante (tú eliges) igual a 3d12 + tu nivel de bárbaro a una criatura a 18 m que puedas ver.",
          },
        ],
      },
    ],
  },

  // ── Senda del Guardián Ancestral (XGtE) ────────────────────────────
  {
    subclaseId: "senda_guardian_ancestral",
    claseId: "barbaro",
    nombre: "Senda del Guardián Ancestral",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Protectores Ancestrales",
            descripcion:
              "Mientras estés en furia, guerreros espectrales aparecen. La primera criatura que impactes en tu turno tiene desventaja en tiradas de ataque que no te incluyan hasta el inicio de tu siguiente turno. Además, cuando esa criatura impacte a un aliado, el daño se reduce en 2d6.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Escudo Espiritual",
            descripcion:
              "Mientras estés en furia, cuando un aliado a 9 m de ti reciba daño, puedes usar tu reacción para reducir ese daño en 2d6. A nivel 10 aumenta a 3d6, y a nivel 14 a 4d6.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Consultar con los Espíritus",
            descripcion:
              "Puedes lanzar Augurio o Clarividencia sin componentes materiales ni espacios de conjuro. Sabiduría es tu característica de conjuración. Una vez lances cualquiera de estos conjuros de esta forma, no puedes repetirlo hasta acabar un descanso corto o largo.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Ancestros Vengativos",
            descripcion:
              "Mientras estés en furia, cuando uses tu reacción de Escudo Espiritual para reducir daño, la criatura atacante recibe daño de Fuerza igual al daño que redujo el escudo.",
          },
        ],
      },
    ],
  },

  // ── Senda del Heraldo de la Tormenta (XGtE) ───────────────────────
  {
    subclaseId: "senda_heraldo_tormenta",
    claseId: "barbaro",
    nombre: "Senda del Heraldo de la Tormenta",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Aura de Tormenta",
            descripcion:
              "Mientras estés en furia, emanas un aura en un radio de 3 m. El efecto depende del entorno elegido. Puedes cambiar de entorno cada vez que subas de nivel.",
            elecciones: [
              {
                id: "aura_tormenta_3",
                nombre: "Aura de Tormenta",
                instruccion: "Elige tu entorno de tormenta:",
                tipo: "single",
                opciones: [
                  {
                    id: "desierto",
                    nombre: "Desierto",
                    descripcion:
                      "Al inicio de cada uno de tus turnos mientras estes en furia, cada criatura de tu elección en el aura recibe 2 de daño de Fuego. A nivel 5 aumenta a 3, a nivel 10 a 4, a nivel 15 a 5 y a nivel 20 a 6.",
                  },
                  {
                    id: "mar",
                    nombre: "Mar",
                    descripcion:
                      "Al inicio de cada uno de tus turnos mientras estés en furia, puedes elegir una criatura en el aura. Debe superar una salvación de DES (CD = 8 + bon. competencia + mod. CON) o recibe 1d6 de daño de Relámpago. A nivel 10 aumenta a 2d6, a nivel 15 a 3d6 y a nivel 20 a 4d6.",
                  },
                  {
                    id: "tundra",
                    nombre: "Tundra",
                    descripcion:
                      "Al inicio de cada uno de tus turnos mientras estés en furia, cada criatura de tu elección en el aura gana 2 puntos de golpe temporales (requiere que puedan verte). A nivel 5 aumenta a 3, a nivel 10 a 4, a nivel 15 a 5 y a nivel 20 a 6.",
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
            nombre: "Alma de Tormenta",
            descripcion:
              "Ganas resistencia a un tipo de daño según tu entorno elegido. Desierto: Fuego. Mar: Relámpago. Tundra: Frío. Además, ganas un beneficio menor: Desierto: no te afecta el calor extremo y puedes prender objetos con tu toque. Mar: puedes respirar bajo el agua y velocidad de nado de 9 m. Tundra: no te afecta el frío extremo y puedes congelar agua con tu toque.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Tormenta Protectora",
            descripcion:
              "Cada criatura de tu elección en tu Aura de Tormenta gana resistencia al tipo de daño de tu entorno (Fuego, Relámpago o Frío).",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Tormenta Furiosa",
            descripcion:
              "Tu aura gana un efecto adicional según tu entorno. Desierto: cuando una criatura te impacta con un ataque, puedes usar tu reacción para infligir daño de Fuego igual a la mitad de tu nivel de bárbaro. Mar: cuando impactas a una criatura, puedes infligir 1d6 de daño de Relámpago adicional y la criatura debe superar una salvación de FUE o queda Derribada. Tundra: cuando activas tu aura, puedes elegir una criatura en ella; debe superar una salvación de FUE (CD = 8 + bon. competencia + mod. CON) o su velocidad se reduce a 0 hasta el inicio de tu siguiente turno.",
          },
        ],
      },
    ],
  },

  // ── Senda de la Bestia (TCoE) ──────────────────────────────────────
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
              "Al entrar en furia, manifiestas un arma natural que cuenta como ataque cuerpo a cuerpo simple. Elige una forma cada vez que enfurezcas.",
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
                      "1d6 cortante cada garra. Al atacar con garras usando la acción de Atacar, puedes realizar un ataque extra con garras como parte de la misma acción.",
                  },
                  {
                    id: "cola",
                    nombre: "Cola",
                    descripcion:
                      "1d8 perforante. Alcance de 3 m. Puedes usar tu reacción al recibir un impacto para tirar 1d8 y sumar el resultado a tu CA contra ese ataque (puede hacer que falle).",
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
              "Tus armas naturales de Forma de la Bestia cuentan como mágicas a efectos de superar resistencias. Además, ganas velocidad de nado y trepar iguales a tu velocidad de caminar.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Furia Infecciosa",
            descripcion:
              "Al impactar con tus armas naturales a una criatura, puedes forzarla a hacer una salvación de SAB (CD = 8 + bon. competencia + mod. CON). Si falla, recibe 2d12 de daño psíquico. Si supera, en su lugar usa su reacción para hacer un ataque cuerpo a cuerpo contra otra criatura de tu elección a su alcance. Usos iguales a tu bon. competencia por descanso largo.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Llamada de la Cacería",
            descripcion:
              "Al entrar en furia, puedes elegir un número de aliados a 9 m igual a tu mod. CON (mín. 1). Cada aliado gana 1d6 de PG temporales. Mientras tu furia dure, una vez por turno cuando un aliado elegido impacte a una criatura con un ataque, ese aliado puede sumar 1d6 al daño. Usos iguales a tu bon. competencia por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Senda de la Magia Salvaje (TCoE) ───────────────────────────────
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
              "Puedes lanzar Detectar Magia sin usar un espacio de conjuro. Sabiduría es tu característica de conjuración. Usos iguales a tu bon. competencia por descanso largo.",
          },
          {
            nombre: "Oleada de Magia Salvaje",
            descripcion:
              "Al entrar en furia, tira en la tabla de Oleada de Magia Salvaje (d8) para determinar un efecto mágico. 1: Teletransportarte 9 m y emitir destello. 2: Cada criatura a 9 m debe superar salvación de CON o recibe 1d12 de Necrótico. 3: Escudo mágico da +1 a CA y tus aliados a 3 m también. 4: Zarcillos de espinas a 4,5 m; criatura atacante recibe 1d6 de Fuerza. 5: Arma mágica inflige 1d6 de Fuerza extra. 6: Espíritu de protección da 1d6 PG temporales a aliados a 9 m. 7: Flores/luces iluminan 3 m y criaturas hostiles tienen desventaja al atacar a tus aliados. 8: Rayo intangible; puedes usar BA para telep. 9 m y cada criatura a 1,5 m del destino recibe 1d6 de Fuerza.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Magia Reconstituyente",
            descripcion:
              "Puedes tocar a una criatura y darle un beneficio. Tirada de ataque/característica: la criatura tira 1d3 y suma a su siguiente tirada. Espacio de conjuro: recupera un espacio de conjuro de nivel no superior a tu bon. competencia (dividido entre 2, redondeado arriba). Usos iguales a tu bon. competencia por descanso largo.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Contragolpe Inestable",
            descripcion:
              "Cuando estés en furia y recibas daño o falles una salvación, puedes usar tu reacción para tirar de nuevo en la tabla de Oleada de Magia Salvaje, reemplazando el efecto actual por el nuevo.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Oleada Controlada",
            descripcion:
              "Cuando tires en la tabla de Oleada de Magia Salvaje, puedes tirar dos veces y elegir cuál de los dos resultados usar. Si tiras el mismo número en ambos dados, puedes ignorar la tabla y elegir cualquier efecto de ella.",
          },
        ],
      },
    ],
  },
];
