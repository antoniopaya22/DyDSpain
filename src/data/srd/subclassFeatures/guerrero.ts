/**
 * Rasgos de subclase: Guerrero
 */

import type { SubclassFeatureData } from "./types";

export const GUERRERO_SUBCLASS_FEATURES: SubclassFeatureData[] = [
  // ── Campeón ────────────────────────────────────────────────────────
  {
    subclaseId: "campeon",
    claseId: "guerrero",
    nombre: "Campeón",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Crítico Mejorado",
            descripcion:
              "Tus ataques con arma obtienen un golpe crítico con un 19 o 20 natural.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Atleta Notable",
            descripcion:
              "Puedes sumar la mitad de tu bonificador de competencia (redondeado arriba) a cualquier prueba de Fuerza, Destreza o Constitución que no use ya tu bonificador. Además, al tomar carrerilla, la distancia de salto largo aumenta en un número de pies igual a tu mod. FUE.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Estilo de Combate Adicional",
            descripcion:
              "Puedes elegir un segundo Estilo de Combate.",
            elecciones: [
              {
                id: "estilo_combate_extra",
                nombre: "Estilo de Combate Adicional",
                instruccion: "Elige un estilo de combate adicional:",
                tipo: "single",
                opciones: [
                  {
                    id: "defensa",
                    nombre: "Defensa",
                    descripcion: "Mientras lleves armadura, ganas +1 a la CA.",
                  },
                  {
                    id: "duelo",
                    nombre: "Duelo",
                    descripcion:
                      "+2 a las tiradas de daño con un arma cuerpo a cuerpo en una mano.",
                  },
                  {
                    id: "gran_arma",
                    nombre: "Combate con Arma Grande",
                    descripcion:
                      "Puedes repetir un 1 o 2 en dados de daño de armas a dos manos.",
                  },
                  {
                    id: "proteccion",
                    nombre: "Protección",
                    descripcion:
                      "Con un escudo, puedes usar tu reacción para imponer desventaja a un ataque contra un aliado a 1,5 m.",
                  },
                  {
                    id: "dos_armas",
                    nombre: "Combate con Dos Armas",
                    descripcion:
                      "Sumas tu modificador de característica al daño del segundo ataque.",
                  },
                  {
                    id: "tiro_con_arco",
                    nombre: "Tiro con Arco",
                    descripcion: "+2 a las tiradas de ataque con armas a distancia.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Crítico Superior",
            descripcion:
              "Tus ataques con arma obtienen un golpe crítico con un 18, 19 o 20 natural.",
          },
        ],
      },
      {
        nivel: 18,
        rasgos: [
          {
            nombre: "Superviviente",
            descripcion:
              "Al inicio de cada turno, si tienes la mitad o menos de tus PG máximos (y al menos 1 PG), recuperas 5 + tu mod. CON puntos de golpe.",
          },
        ],
      },
    ],
  },

  // ── Maestro de Batalla ─────────────────────────────────────────────
  {
    subclaseId: "maestro_batalla",
    claseId: "guerrero",
    nombre: "Maestro de Batalla",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Superioridad en Combate",
            descripcion:
              "Aprendes maniobras que se alimentan de dados de superioridad (d8). Obtienes 4 dados que se recuperan en descansos cortos o largos.",
          },
          {
            nombre: "Maniobras",
            descripcion:
              "Elige tres maniobras de combate.",
            elecciones: [
              {
                id: "maniobras_nivel3",
                nombre: "Maniobras",
                instruccion: "Elige 3 maniobras de combate:",
                tipo: "multi",
                cantidad: 3,
                opciones: [
                  { id: "maniobra_atacar", nombre: "Atacar de Precisión", descripcion: "Suma el dado de superioridad a una tirada de ataque." },
                  { id: "maniobra_desarmar", nombre: "Ataque de Desarme", descripcion: "Al impactar, suma el dado al daño. El objetivo debe superar FUE o soltar un objeto." },
                  { id: "maniobra_provocar", nombre: "Ataque Provocador", descripcion: "Al impactar, el dado se suma al daño. Si el objetivo ataca a otro que no seas tú, tiene desventaja." },
                  { id: "maniobra_empujar", nombre: "Ataque de Empuje", descripcion: "Al impactar, suma el dado al daño. Si es Grande o menor, empújalo hasta 4,5 m o derriba." },
                  { id: "maniobra_barrer", nombre: "Ataque de Barrido", descripcion: "Al impactar, si hay otra criatura a 1,5 m, recibe daño igual al dado de superioridad." },
                  { id: "maniobra_contraatacar", nombre: "Contraatacar", descripcion: "Cuando una criatura te falla con un ataque cuerpo a cuerpo, usa tu reacción para atacar y suma el dado al daño." },
                  { id: "maniobra_evadir", nombre: "Evasión Táctica", descripcion: "Suma el dado de superioridad a tu CA contra un ataque." },
                  { id: "maniobra_fintar", nombre: "Finta", descripcion: "Usa tu acción adicional para obtener ventaja en tu siguiente ataque contra una criatura y suma el dado al daño." },
                  { id: "maniobra_ordenar", nombre: "Maniobra de Mando", descripcion: "Un aliado puede usar su reacción para moverse su velocidad y sumar el dado al daño de su siguiente ataque." },
                  { id: "maniobra_zancadilla", nombre: "Ataque de Zancadilla", descripcion: "Al impactar, suma el dado al daño. Si el objetivo es Grande o menor, debe superar FUE o cae derribado." },
                ],
              },
            ],
          },
          {
            nombre: "Estudiante de la Guerra",
            descripcion:
              "Ganas competencia con un tipo de herramientas de artesano de tu elección.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Conoce a tu Enemigo",
            descripcion:
              "Tras 1 minuto observando una criatura fuera de combate, el GM te dice si es igual, superior o inferior a ti en dos de: FUE, DES, CON, CA, PG actuales, nivel total de clase, nivel de clase de guerrero.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Superioridad Implacable",
            descripcion:
              "Cuando tires iniciativa sin dados de superioridad, recuperas uno.",
          },
        ],
      },
    ],
  },

  // ── Caballero Sobrenatural ─────────────────────────────────────────
  {
    subclaseId: "caballero_sobrenatural",
    claseId: "guerrero",
    nombre: "Caballero Sobrenatural",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Conjuración",
            descripcion:
              "Aprendes 2 trucos de la lista de mago y 3 conjuros de nivel 1. Inteligencia es tu característica de conjuración. Dos tercios de tus conjuros deben ser de las escuelas de Abjuración o Evocación.",
          },
          {
            nombre: "Vínculo con Arma",
            descripcion:
              "Puedes vincular hasta dos armas mediante un ritual de 1 hora. Un arma vinculada no puede ser desarmada y puedes invocarla con una acción adicional.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Magia de Guerra",
            descripcion:
              "Cuando uses tu acción para lanzar un truco, puedes realizar un ataque con arma como acción adicional.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Golpe Sobrenatural",
            descripcion:
              "Aprendes a hacer que tus ataques con arma debiliten la resistencia de las criaturas a tus conjuros. Al impactar con un arma, la criatura tiene desventaja en la siguiente salvación contra un conjuro tuyo antes del final de tu siguiente turno.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Carga Arcana",
            descripcion:
              "Ganas la capacidad de teletransportarte hasta 9 m a un espacio desocupado que puedas ver cuando uses Oleada de Acción. Puedes teletransportarte antes o después de la acción adicional.",
          },
        ],
      },
      {
        nivel: 18,
        rasgos: [
          {
            nombre: "Magia de Guerra Mejorada",
            descripcion:
              "Cuando uses tu acción para lanzar un conjuro, puedes realizar un ataque con arma como acción adicional.",
          },
        ],
      },
    ],
  },

  // ── Samurái ────────────────────────────────────────────────────────
  {
    subclaseId: "samurai",
    claseId: "guerrero",
    nombre: "Samurái",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Espíritu de Combate",
            descripcion:
              "Como acción adicional, puedes darte ventaja en todas las tiradas de ataque con arma hasta el final del turno actual. También ganas 5 PG temporales (aumenta con el nivel). Usos iguales a tu bon. de competencia por descanso largo.",
          },
          {
            nombre: "Elegante Cortesano",
            descripcion:
              "Ganas competencia en una de estas habilidades: Historia, Perspicacia o Persuasión. También ganas competencia en Sabiduría (salvaciones) si eliges esta opción.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Elegancia al Servicio",
            descripcion:
              "Tu disciplina y atención te otorgan competencia en salvaciones de Sabiduría. Si ya la tienes, ganas Inteligencia o Carisma en su lugar.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Espíritu Incansable",
            descripcion:
              "Cuando tires iniciativa y no tengas usos de Espíritu de Combate, recuperas un uso.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Golpe Rápido",
            descripcion:
              "Si usas Espíritu de Combate y haces la acción de Atacar, puedes realizar un ataque con arma adicional como parte de esa acción.",
          },
        ],
      },
      {
        nivel: 18,
        rasgos: [
          {
            nombre: "Fuerza Antes de la Muerte",
            descripcion:
              "Si te reducen a 0 PG y no mueres instantáneamente, puedes gastar una reacción para tomar un turno extra inmediatamente, interrumpiendo el turno actual. Si sigues a 0 PG al final de ese turno, caes inconsciente. Una vez por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Caballero Arcano ───────────────────────────────────────────────
  {
    subclaseId: "caballero_arcano",
    claseId: "guerrero",
    nombre: "Caballero Arcano",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Conocimiento Arcano",
            descripcion:
              "Aprendes 2 trucos de la lista de mago y 3 conjuros de nivel 1. Inteligencia es tu característica de conjuración. Debes elegir conjuros de las escuelas de Abjuración o Evocación (similar al Caballero Sobrenatural pero con enfoque diferente).",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Golpe Arcano",
            descripcion:
              "Al impactar a una criatura con un ataque con arma, puedes gastar un espacio de conjuro para infligir 2d6 de daño de fuerza adicional (+1d6 por nivel del espacio, máximo 4d6).",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Defensa Arcana",
            descripcion:
              "Puedes gastar un espacio de conjuro como reacción al recibir daño para reducir ese daño en 2d6 (+1d6 por nivel del espacio).",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Arcano Mejorado",
            descripcion:
              "Tu Golpe Arcano inflige ahora 2d8 en lugar de 2d6 (+1d8 por nivel del espacio).",
          },
        ],
      },
    ],
  },

  // ── Guerrero Psiónico ──────────────────────────────────────────────
  {
    subclaseId: "psi_warrior",
    claseId: "guerrero",
    nombre: "Guerrero Psiónico",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Energía Psiónica",
            descripcion:
              "Tienes un número de dados de Energía Psiónica (d6) igual al doble de tu bon. de competencia. Puedes usarlos para activar tus rasgos psiónicos. Recuperas todos tras un descanso largo y uno con una acción adicional (una vez por descanso corto).",
          },
          {
            nombre: "Escudo Protector",
            descripcion:
              "Cuando tú o una criatura a 9 m recibe daño, puedes gastar un dado de Energía Psiónica y reducir el daño en el resultado + mod. INT (mín 1).",
          },
          {
            nombre: "Golpe Psiónico",
            descripcion:
              "Al impactar con un arma, puedes gastar un dado de Energía Psiónica para añadir daño de fuerza igual al resultado.",
          },
          {
            nombre: "Movimiento Telequinético",
            descripcion:
              "Como acción adicional, puedes mover un objeto Mediano o menor o una criatura voluntaria a 9 m hasta 9 m. Si es una criatura, puedes moverla a ti. Puedes gastar un dado psiónico para mover a alguien no voluntario (salvación de FUE).",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Adepción Telequinética",
            descripcion:
              "Al usar Oleada de Acción, puedes mover un objeto o criatura con tu mente además de la acción adicional.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Bastión Protector",
            descripcion:
              "Al final de un descanso largo, puedes elegir a un número de criaturas igual a tu mod. INT (mín 1). Obtienen PG temporales iguales a un dado de Energía Psiónica + nivel de guerrero.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Golpe Masivo",
            descripcion:
              "Puedes gastar un dado de Energía Psiónica al impactar para forzar al objetivo una salvación de FUE o queda derribado y recibe daño extra.",
          },
        ],
      },
      {
        nivel: 18,
        rasgos: [
          {
            nombre: "Maestro Telequinético",
            descripcion:
              "Puedes lanzar Telequinesis sin componentes, usando INT como característica de conjuración. Mientras mantengas concentración en él, ganas velocidad de vuelo de 9 m. Una vez por descanso largo (o gastando un dado psiónico).",
          },
        ],
      },
    ],
  },

  // ── Caballero de las Runas ─────────────────────────────────────────
  {
    subclaseId: "rune_knight",
    claseId: "guerrero",
    nombre: "Caballero de las Runas",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Grabador de Runas",
            descripcion:
              "Aprendes a inscribir runas mágicas en tu equipo. Conoces 2 runas de tu elección y puedes inscribirlas en objetos que lleves. Cada runa otorga un beneficio pasivo y un poder activo (una vez por descanso corto).",
            elecciones: [
              {
                id: "runas_nivel3",
                nombre: "Runas",
                instruccion: "Elige 2 runas:",
                tipo: "multi",
                cantidad: 2,
                opciones: [
                  {
                    id: "runa_nube",
                    nombre: "Runa de la Nube (Engaño)",
                    descripcion:
                      "Ventaja en pruebas de Engaño. Activa: cuando tú o alguien a 9 m es impactado, puedes invocar la runa para que el atacante deba elegir otro objetivo en la zona.",
                  },
                  {
                    id: "runa_fuego",
                    nombre: "Runa del Fuego",
                    descripcion:
                      "Doble de competencia en pruebas de herramientas. Activa: cuando impactas, encadenas al objetivo (salvación de FUE o queda apresado y recibe 2d6 de fuego por turno).",
                  },
                  {
                    id: "runa_escarcha",
                    nombre: "Runa de la Escarcha",
                    descripcion:
                      "Ventaja en pruebas de Trato con Animales y contento con noticias. Activa: cuando alguien a 9 m es impactado, puedes dar +2 a CA a la criatura (temp) y el atacante recibe 2d6 de frío.",
                  },
                  {
                    id: "runa_piedra",
                    nombre: "Runa de Piedra (Perspicacia)",
                    descripcion:
                      "Ventaja en pruebas de Perspicacia. Activa: cuando impactas, la criatura debe hacer salvación de SAB o queda hechizada por 1 minuto (incapacitada, velocidad 0).",
                  },
                  {
                    id: "runa_colina",
                    nombre: "Runa de la Colina (nivel 7+)",
                    descripcion:
                      "Resistencia al daño por veneno. Activa: puedes ganar resistencia a contundente, perforante y cortante durante 1 minuto. Requiere nivel 7.",
                  },
                  {
                    id: "runa_tormenta",
                    nombre: "Runa de la Tormenta (nivel 7+)",
                    descripcion:
                      "Ventaja en pruebas de Atletismo. Activa: cuando impactas, la criatura debe hacer salvación de CON o queda incapacitada hasta el final de tu siguiente turno. Requiere nivel 7.",
                  },
                ],
              },
            ],
          },
          {
            nombre: "Poder del Gigante",
            descripcion:
              "Como acción adicional, te vuelves Grande durante 1 minuto. Tienes ventaja en pruebas de FUE y tiradas de salvación de FUE. Una vez por descanso corto.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Runa Adicional",
            descripcion:
              "Conoces una runa adicional (3 en total). Desbloqueas las runas de nivel 7+.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Gran Estatura",
            descripcion:
              "Puedes crecer a Enorme con Poder del Gigante. Además, el daño de tus armas aumenta en 1d6 mientras estés agrandado.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Runa Maestra",
            descripcion:
              "Conoces una runa adicional (4 en total). Invocar una runa ya usada gasta una tirada de salvación.",
          },
        ],
      },
      {
        nivel: 18,
        rasgos: [
          {
            nombre: "Poder Rúnico",
            descripcion:
              "Conoces una runa adicional (5 en total). Puedes invocar cada runa dos veces por descanso corto en lugar de una.",
          },
        ],
      },
    ],
  },
];
