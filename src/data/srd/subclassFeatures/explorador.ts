/**
 * Rasgos de subclase: Explorador
 */

import type { SubclassFeatureData } from "./types";

export const EXPLORADOR_SUBCLASS_FEATURES: SubclassFeatureData[] = [
  // ── Cazador ────────────────────────────────────────────────────────
  {
    subclaseId: "cazador",
    claseId: "explorador",
    nombre: "Cazador",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Presa del Cazador",
            descripcion:
              "Elige un rasgo de cazador.",
            elecciones: [
              {
                id: "presa_cazador",
                nombre: "Presa del Cazador",
                instruccion: "Elige tu especialización de caza:",
                tipo: "single",
                opciones: [
                  {
                    id: "matador_colosos",
                    nombre: "Matador de Colosos",
                    descripcion:
                      "Cuando impactas a una criatura con un ataque de arma, ésta recibe 1d8 de daño extra si está por debajo de su máximo de PG.",
                  },
                  {
                    id: "matador_gigantes",
                    nombre: "Matador de Gigantes",
                    descripcion:
                      "Si una criatura Grande o mayor a 1,5 m te ataca, puedes usar tu reacción para moverte 1,5 m sin provocar ataques de oportunidad.",
                  },
                  {
                    id: "destructor_hordas",
                    nombre: "Destructor de Hordas",
                    descripcion:
                      "Una vez por turno, cuando hagas un ataque de arma, puedes atacar a otra criatura a 1,5 m del primer objetivo usando la misma tirada de ataque.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Tácticas Defensivas",
            descripcion:
              "Elige una táctica defensiva.",
            elecciones: [
              {
                id: "tactica_defensiva",
                nombre: "Tácticas Defensivas",
                instruccion: "Elige tu táctica defensiva:",
                tipo: "single",
                opciones: [
                  {
                    id: "escapar_horda",
                    nombre: "Escapar de la Horda",
                    descripcion: "Los ataques de oportunidad contra ti tienen desventaja.",
                  },
                  {
                    id: "defensa_multiataques",
                    nombre: "Defensa contra Multiataques",
                    descripcion: "Cuando una criatura te impacta con un ataque, ganas +4 a la CA contra ataques siguientes de esa criatura durante ese turno.",
                  },
                  {
                    id: "voluntad_acero",
                    nombre: "Voluntad de Acero",
                    descripcion: "Tienes ventaja en tiradas de salvación para evitar ser asustado.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Multiataque",
            descripcion:
              "Elige una opción de multiataque.",
            elecciones: [
              {
                id: "multiataque_cazador",
                nombre: "Multiataque",
                instruccion: "Elige tu tipo de multiataque:",
                tipo: "single",
                opciones: [
                  {
                    id: "salva",
                    nombre: "Salva",
                    descripcion:
                      "Puedes usar tu acción para hacer un ataque a distancia contra cualquier número de criaturas en un radio de 3 m de un punto que puedas ver dentro del alcance de tu arma. Debes tener munición para cada objetivo.",
                  },
                  {
                    id: "ataque_giratorio",
                    nombre: "Ataque Giratorio",
                    descripcion:
                      "Puedes usar tu acción para realizar un ataque cuerpo a cuerpo contra cualquier número de criaturas a 1,5 m o menos de ti, con una tirada de ataque separada para cada una.",
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
            nombre: "Defensa Superior del Cazador",
            descripcion:
              "Elige una defensa superior.",
            elecciones: [
              {
                id: "defensa_superior_cazador",
                nombre: "Defensa Superior del Cazador",
                instruccion: "Elige tu defensa superior:",
                tipo: "single",
                opciones: [
                  {
                    id: "evasion",
                    nombre: "Evasión",
                    descripcion:
                      "Cuando te veas sometido a un efecto que te permita hacer una tirada de salvación de Destreza para recibir solo la mitad de daño, no recibes daño si superas la salvación, y solo la mitad si fallas.",
                  },
                  {
                    id: "resistir_la_marea",
                    nombre: "Resistir la Marea",
                    descripcion:
                      "Cuando una criatura te impacte con un ataque cuerpo a cuerpo, puedes usar tu reacción para obligarla a repetir el mismo ataque contra otra criatura (distinta de ella) a tu elección que esté a su alcance.",
                  },
                  {
                    id: "esquiva_instintiva",
                    nombre: "Esquiva Instintiva",
                    descripcion:
                      "Cuando un atacante que puedas ver te impacte con un ataque, puedes usar tu reacción para reducir el daño a la mitad.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Señor de las Bestias ───────────────────────────────────────────
  {
    subclaseId: "senor_bestias",
    claseId: "explorador",
    nombre: "Señor de las Bestias",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Compañero del Explorador",
            descripcion:
              "Obtienes una bestia compañera (máximo tamaño Mediano, CR 1/4 o inferior). La bestia actúa en tu turno: puedes usar tu acción adicional para ordenarle Atacar, Correr, Esquivar o Desengancharse. Si no le ordenas, usa Esquivar.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Entrenamiento Excepcional",
            descripcion:
              "Tu compañero puede usar Esquivar cuando le ordenas Atacar. Sus ataques cuentan como mágicos.",
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Bestia Furiosa",
            descripcion:
              "Cuando ordenas a tu bestia la acción de Atacar, puede realizar dos ataques o usar Ataque Múltiple si lo tiene.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Compañerismo Compartido",
            descripcion:
              "Cuando lanzas un conjuro con objetivo en ti mismo, también puedes afectar a tu bestia compañera si está a 9 m de ti.",
          },
        ],
      },
    ],
  },

  // ── Acechador del Horizonte ────────────────────────────────────────
  {
    subclaseId: "acechador_horizonte",
    claseId: "explorador",
    nombre: "Acechador del Horizonte",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Detectar Portal",
            descripcion:
              "Como acción, puedes detectar la distancia y dirección al portal planar más cercano a 1,5 km. Una vez por descanso corto.",
          },
          {
            nombre: "Enemigo Planar",
            descripcion:
              "Aprendes el conjuro Protección contra el Bien y el Mal. Puedes lanzarlo sin gastar un espacio de conjuro un número de veces igual a tu mod. de SAB por descanso largo.",
          },
          {
            nombre: "Paso Etéreo",
            descripcion:
              "Puedes lanzar Paso Etéreo sin gastar un espacio de conjuro, pero solo dura hasta el final del turno actual. Usos iguales a tu bon. de competencia por descanso largo.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Defensa Etérea",
            descripcion:
              "Cuando recibes daño, puedes gastar una reacción para volverte resistente a todo el daño de ese ataque volviéndote brevemente etéreo. Una vez por descanso corto.",
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Ataques Distantes",
            descripcion:
              "Puedes atacar por portales. Cuando usas la acción de Atacar, puedes realizar cada ataque desde tu posición o desde la de un portal a 9 m de ti (ves a través de él brevemente).",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Paso Espectral",
            descripcion:
              "Puedes moverte a través del Plano Etéreo. Marketing: al moverte, puedes gastar 3 m de movimiento para teletransportarte 3 m a un espacio desocupado visible. Ignoras terreno difícil en esta teletransportación.",
          },
        ],
      },
    ],
  },

  // ── Asesino de Monstruos ───────────────────────────────────────────
  {
    subclaseId: "asesino_monstruos",
    claseId: "explorador",
    nombre: "Asesino de Monstruos",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Presa del Cazador",
            descripcion:
              "Puedes usar una acción adicional para designar a una criatura como tu presa. Ganas un dado extra de daño (1d6) la primera vez que impactes a esa presa en cada turno. Además, tienes ventaja en pruebas de Percepción y Supervivencia para rastrearla.",
          },
          {
            nombre: "Conocimiento del Cazador",
            descripcion:
              "Puedes usar una acción para aprender las vulnerabilidades, inmunidades, resistencias y habilidades especiales de tu presa.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Presa Sobrenatural",
            descripcion:
              "El dado de Presa del Cazador también te da ventaja en tiradas de salvación contra los efectos de tu presa.",
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Contraataque Mágico",
            descripcion:
              "Cuando tu presa te obligue a hacer una tirada de salvación, puedes usar tu reacción para atacarla con un arma.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Matador",
            descripcion:
              "Cuando tu presa está a 0 PG o menos, puedes usar tu acción adicional para transferir la marca de Presa a una nueva criatura sin gastar un uso.",
          },
        ],
      },
    ],
  },

  // ── Errante Feérico ────────────────────────────────────────────────
  {
    subclaseId: "errante_feerico",
    claseId: "explorador",
    nombre: "Errante Feérico",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Encanto Errante",
            descripcion:
              "Puedes lanzar Paso Brumoso sin gastar un espacio de conjuro un número de veces igual a tu bon. de competencia por descanso largo. Cuando lo lanzas, puedes elegir a una criatura voluntaria a 1,5 m para llevarla contigo.",
          },
          {
            nombre: "Percepción Feérica",
            descripcion:
              "Tienes ventaja en tiradas de salvación contra ser hechizado y la magia no puede hacerte dormir.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Favor Feérico",
            descripcion:
              "Cada vez que lances Paso Brumoso, puedes elegir que la criatura que dejaste atrás o la que apareció contigo sea reforzada (PG temporales iguales a 2d10).",
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Guardián Sombrío",
            descripcion:
              "Cuando una criatura a 9 m que puedas ver recibe daño, puedes usar tu reacción para teletransportarte a un espacio a 1,5 m de la criatura y recibir tú el daño en su lugar.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Paso Huidizo",
            descripcion:
              "Cuando lanzas Paso Brumoso, puedes teletransportarte hasta 9 m en lugar de 9 m, y también puedes convertirte en invisible hasta el inicio de tu siguiente turno.",
          },
        ],
      },
    ],
  },

  // ── Caminante del Enjambre ─────────────────────────────────────────
  {
    subclaseId: "caminante_enjambre",
    claseId: "explorador",
    nombre: "Caminante del Enjambre",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Enjambre Reunido",
            descripcion:
              "Un enjambre de espíritus fey se reúne a tu alrededor. Una vez por turno, cuando impactes con un ataque, puedes infligir 1d6 extra de daño perforante. Además, puedes moverte 1,5 m sin provocar ataques de oportunidad.",
          },
          {
            nombre: "Caminante del Enjambre",
            descripcion:
              "Puedes usar Paso Brumoso como si un espíritu del enjambre te cargara. Usos iguales a tu bon. de competencia por descanso largo.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Enjambre Revoltoso",
            descripcion:
              "Si tu enjambre inflige daño con Enjambre Reunido, él y criaturas de tu elección a 1,5 m ganan cobertura a tres cuartos hasta el inicio de tu siguiente turno.",
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Marea del Enjambre",
            descripcion:
              "El daño extra de Enjambre Reunido aumenta a 1d8. También puedes elegir un aliado a 1,5 m para que el enjambre lo cure en lugar de infligir daño.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Enjambre Poderoso",
            descripcion:
              "El daño extra de Enjambre Reunido aumenta a 2d8. Cuando usas Paso Brumoso, puedes teleportar aliados a 1,5 m contigo.",
          },
        ],
      },
    ],
  },

  // ── Drakewarden ────────────────────────────────────────────────────
  {
    subclaseId: "drakewarden",
    claseId: "explorador",
    nombre: "Drakewarden",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Compañero Draconiano",
            descripcion:
              "Invocas a un pequeño dracónido como acción usando un espacio de conjuro. Sigue tu iniciativa, tiene PG = 5 + 5×nivel explorador, y sus ataques usan tu mod. ataque.",
            elecciones: [
              {
                id: "tipo_dragon_drake",
                nombre: "Tipo de Dragón",
                instruccion: "Elige el tipo elemental de tu dracónido:",
                tipo: "single",
                opciones: [
                  { id: "acido", nombre: "Ácido", descripcion: "Tu dracónido inflige daño de ácido." },
                  { id: "frio", nombre: "Frío", descripcion: "Tu dracónido inflige daño de frío." },
                  { id: "fuego", nombre: "Fuego", descripcion: "Tu dracónido inflige daño de fuego." },
                  { id: "rayo", nombre: "Rayo", descripcion: "Tu dracónido inflige daño de rayo." },
                  { id: "veneno", nombre: "Veneno", descripcion: "Tu dracónido inflige daño de veneno." },
                ],
              },
            ],
          },
          {
            nombre: "Don Draconiano",
            descripcion:
              "Aprendes el truco Taumaturgia. Puedes cambiar el tipo de daño del dracónido cada vez que lo invocas.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Aliento del Compañero",
            descripcion:
              "Tu dracónido puede lanzar un aliento en cono de 6 m (salvación de DES, 2d6 del tipo elegido). Puedes usarlo un número de veces igual a tu bon. de competencia por descanso largo.",
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Drake Grande",
            descripcion:
              "Tu dracónido crece a tamaño Grande y puedes usarlo como montura. Gana velocidad de vuelo de 12 m.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Vínculo Perfeccionado",
            descripcion:
              "El aliento inflige 3d6 de daño. Cuando tu dracónido impacta a una criatura, esa criatura también recibe 1d6 de daño extra del tipo draconiano.",
          },
        ],
      },
    ],
  },
];
