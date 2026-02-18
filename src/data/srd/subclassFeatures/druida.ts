/**
 * Rasgos de subclase: Druida
 */

import type { SubclassFeatureData } from "./types";

export const DRUIDA_SUBCLASS_FEATURES: SubclassFeatureData[] = [
  // ── Círculo de la Tierra ───────────────────────────────────────────
  {
    subclaseId: "circulo_tierra",
    claseId: "druida",
    nombre: "Círculo de la Tierra",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Truco Adicional",
            descripcion:
              "Aprendes un truco de druida adicional de tu elección.",
          },
          {
            nombre: "Recuperación Natural",
            descripcion:
              "Durante un descanso corto, puedes recuperar espacios de conjuro cuya suma de niveles sea igual o menor a la mitad de tu nivel de druida (redondeado arriba). No puedes recuperar espacios de nivel 6 o superior. Una vez por descanso largo.",
          },
          {
            nombre: "Conjuros del Círculo",
            descripcion:
              "Tu conexión con la tierra te otorga conjuros adicionales basados en el terreno que elijas.",
            elecciones: [
              {
                id: "terreno_circulo",
                nombre: "Terreno del Círculo",
                instruccion: "Elige el terreno con el que estás vinculado:",
                tipo: "single",
                opciones: [
                  { id: "artico", nombre: "Ártico", descripcion: "Conjuros extra: Inmovilizar persona, Crecimiento de espinas (nv3), Lentitud, Ventisca (nv5), Libertad de movimiento, Tormenta de hielo (nv7), Comunión con la naturaleza, Cono de frío (nv9)." },
                  { id: "costa", nombre: "Costa", descripcion: "Conjuros extra: Imagen especular, Paso brumoso (nv3), Caminar sobre el agua, Respirar bajo el agua (nv5), Control del agua, Libertad de movimiento (nv7), Conjurar elemental, Escudriñar (nv9)." },
                  { id: "desierto", nombre: "Desierto", descripcion: "Conjuros extra: Desenfoque, Silencio (nv3), Crear comida y agua, Protección contra energía (nv5), Perdición, Terreno alucinatorio (nv7), Plaga de insectos, Muro de piedra (nv9)." },
                  { id: "bosque", nombre: "Bosque", descripcion: "Conjuros extra: Piel agallada, Telaraña (nv3), Invocar animales, Crecimiento vegetal (nv5), Adivinación, Libertad de movimiento (nv7), Comunión con la naturaleza, Paso entre árboles (nv9)." },
                  { id: "pradera", nombre: "Pradera", descripcion: "Conjuros extra: Invisibilidad, Paso sin rastro (nv3), Luz del día, Acelerar (nv5), Adivinación, Libertad de movimiento (nv7), Ensueño, Plaga de insectos (nv9)." },
                  { id: "montaña", nombre: "Montaña", descripcion: "Conjuros extra: Crecimiento de espinas, Araña trepadora (nv3), Relámpago, Fusionarse con la piedra (nv5), Forma pétrea, Muro de piedra (nv7), Paso entre muros, Paso entre árboles (nv9)." },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Círculo de la Luna ─────────────────────────────────────────────
  {
    subclaseId: "circulo_luna",
    claseId: "druida",
    nombre: "Círculo de la Luna",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Forma Salvaje de Combate",
            descripcion:
              "Puedes usar Forma Salvaje como acción adicional (en lugar de acción). Mientras estés transformado, puedes gastar un espacio de conjuro como acción adicional para recuperar 1d8 PG por nivel del espacio.",
          },
          {
            nombre: "Formas del Círculo",
            descripcion:
              "Puedes transformarte en bestias con CR hasta 1 (sin restricción de movimiento). A nivel 6 CR = nivel de druida ÷ 3.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Golpe Primigenio",
            descripcion:
              "Tus ataques en Forma Salvaje cuentan como mágicos para superar resistencias e inmunidades.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Forma Salvaje Elemental",
            descripcion:
              "Puedes gastar dos usos de Forma Salvaje para transformarte en un elemental de aire, tierra, fuego o agua.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Mil Formas",
            descripcion:
              "Puedes lanzar Alterar Forma a voluntad sin gastar espacios de conjuro.",
          },
        ],
      },
    ],
  },

  // ── Círculo de los Sueños ──────────────────────────────────────────
  {
    subclaseId: "circulo_suenos",
    claseId: "druida",
    nombre: "Círculo de los Sueños",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Bálsamo del Círculo Veraniego",
            descripcion:
              "Tienes una reserva de energía feérica para curar. Dados de curación: d6 × tu nivel de druida. Como acción adicional, gasta dados (máx. la mitad de tu nivel de druida a la vez) para curar a una criatura a 36 m. El objetivo también gana 1 PG temporal por dado gastado. Recuperas todos los dados tras un descanso largo.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Hogar de Sombras del Claro de Luna",
            descripcion:
              "Durante un descanso corto, puedes invocar un refugio feérico: una esfera invisible de 9 m de radio. Tú y tus aliados obtienen +5 a pruebas de Sigilo y SAB (Percepción). La luz y sonido del exterior no pueden penetrar. Dura 8 horas o hasta que lo desactives.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Pasajes Ocultos",
            descripcion:
              "Como acción, 10 criaturas voluntarias a 9 m son teletransportadas hasta 18 m a espacios desocupados que puedas ver. Cada una puede ver a través de la niebla feérica durante 1 turno, ganando 1,5 m extra de velocidad. Una vez por descanso largo (o gasta un espacio de nivel 4+).",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Caminante entre Sueños",
            descripcion:
              "Al final de un descanso corto, puedes lanzar un conjuro similar a Puerta Arcana que te lleva al Feywild o de regreso al plano material. Hasta 8 criaturas voluntarias pueden entrar. Puedes elegir el punto de llegada.",
          },
        ],
      },
    ],
  },

  // ── Círculo del Pastor ─────────────────────────────────────────────
  {
    subclaseId: "circulo_pastor",
    claseId: "druida",
    nombre: "Círculo del Pastor",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Habla de las Bestias",
            descripcion:
              "Puedes comunicarte con bestias como si compartierais un idioma.",
          },
          {
            nombre: "Tótem Espiritual",
            descripcion:
              "Como acción adicional, invocas un espíritu incorpóreo en un punto que puedas ver a 18 m. Tiene un aura de 9 m y dura 1 minuto. Elige: Oso (cada aliado en aura gana PG temporales = 5 + tu nivel de druida), Halcón (aliados en aura pueden usar tu reacción para atacar), Unicornio (cuando lanzas curación, aliados en aura recuperan PG extra = tu nivel de druida). Usos iguales a tu bon. de competencia por descanso largo.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Espíritus Poderosos",
            descripcion:
              "Las bestias y feéricos invocados por tus conjuros ganan beneficios: 2 PG extra por dado de golpe, y sus ataques con armas naturales cuentan como mágicos.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Vigilia del Espíritu Guardian",
            descripcion:
              "Tu Tótem Espiritual puede proteger. Cuando una criatura en el aura recibe daño, puedes usar tu reacción para reducir el daño en una cantidad igual a la mitad de tu nivel de druida.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Invocación Fiel",
            descripcion:
              "Los espíritus de la naturaleza responden a tu llamada. Las criaturas invocadas por tus conjuros de conjuración ganan +2 a las tiradas de ataque y +2 PG por dado de golpe.",
          },
        ],
      },
    ],
  },

  // ── Círculo de las Esporas ─────────────────────────────────────────
  {
    subclaseId: "circulo_esporas",
    claseId: "druida",
    nombre: "Círculo de las Esporas",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Aura de Esporas",
            descripcion:
              "Tienes un halo de esporas invisible con radio de 3 m. Como reacción, cuando una criatura en el aura se mueve o te ataca, puedes infligir 1d4 de daño necrótico (salvación de CON). Daño aumenta: 1d6 (nv6), 1d8 (nv10), 1d10 (nv14).",
          },
          {
            nombre: "Animación Simbiótica",
            descripcion:
              "Como acción, puedes gastar un uso de Forma Salvaje para despertar tus esporas: ganas 4 PG temporales por nivel de druida. Mientras tengas estos PG temporales, tu cuerpo a cuerpo inflige 1d6 de daño necrótico extra. Dura 10 minutos.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Cadáver Animado",
            descripcion:
              "Puedes animar cadáveres con tus esporas. Como acción, toca un cadáver: se levanta con 1 PG como zombi durante 1 hora. En combate, actúa en tu turno y puedes controlarlo. Máximo = tu mod. de SAB a la vez.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Propagación de Esporas",
            descripcion:
              "Tu Aura de Esporas puede crecer. Mientras Animación Simbiótica esté activa, puedes mover tu nube de esporas hasta 9 m como acción adicional.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Cuerpo Fúngico",
            descripcion:
              "Tus esporas te dan resiliencia: no puedes ser cegado, ensordecido, asustado ni envenenado. Y cualquier golpe crítico contra ti se convierte en golpe normal.",
          },
        ],
      },
    ],
  },

  // ── Círculo de las Estrellas ───────────────────────────────────────
  {
    subclaseId: "circulo_estrellas",
    claseId: "druida",
    nombre: "Círculo de las Estrellas",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Mapa Estelar",
            descripcion:
              "Tienes un mapa estelar como foco druídico. Aprendes Guía y Rayo Orientador (no cuentan para tu límite). Puedes lanzar Rayo Orientador sin gastar espacio un número de veces igual a tu bon. de competencia por descanso largo.",
          },
          {
            nombre: "Forma Estelar",
            descripcion:
              "Como acción adicional, gastas un uso de Forma Salvaje para adoptar una forma estelar durante 10 minutos. Elige: Arquero (puedes hacer un ataque a distancia de 18 m que inflige daño radiante = 1d8 + mod. SAB), Cáliz (cuando lanzas curación, tú o un aliado a 9 m recupera PG = 1d8 + mod. SAB), Dragón (mínimo 10 en pruebas de INT/SAB; y salvaciones de CON para concentración tienen mínimo 10).",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Constelación Cósmica",
            descripcion:
              "Las formas Arquero y Cáliz mejoran: Arquero ahora hace 2d8. Cáliz ahora cura 2d8. Dragón otorga velocidad de vuelo de 6 m.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Resplandor Completo",
            descripcion:
              "Tu Forma Estelar gana un beneficio adicional: Arquero da resistencia al daño contundente/perforante/cortante. Cáliz da resistencia al daño necrótico/radiante. Dragón otorga visión verdadera a 9 m. Puedes cambiar de forma como acción adicional.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Forma Estelar Suprema",
            descripcion:
              "Tu Forma Estelar dura hasta que la desactives (no necesitas Forma Salvaje). Mientras esté activa, puedes cambiar la constelación al inicio de cada turno.",
          },
        ],
      },
    ],
  },

  // ── Círculo de la Llama ────────────────────────────────────────────
  {
    subclaseId: "circulo_llama",
    claseId: "druida",
    nombre: "Círculo de la Llama",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Conjuros de Círculo",
            descripcion:
              "Siempre tienes preparados ciertos conjuros de fuego: Manos Ardientes, Esfera Ardiente (nv2), Forma llameante, Bola de fuego (nv3), Muro de fuego, Forma llameante mayor (nv4), Llama del alba (nv5).",
          },
          {
            nombre: "Espíritu de Llama Salvaje",
            descripcion:
              "Como acción, gastas un uso de Forma Salvaje para invocar un espíritu de llama a 9 m. Tiene CA = 13 + bon. comp., PG según tabla, y puede atacar como tu acción adicional: 1d6+bon. comp. de daño de fuego en 1,5 m, o 1d6+bon. comp. de daño de fuego a distancia 18 m.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Vínculo Primordial",
            descripcion:
              "Tu Espíritu de Llama mejora: cuando tú o el espíritu infligís daño de fuego, suma tu mod. de SAB. Además cuando lanzas un conjuro de restaurar PG puedes hacerlo desde la posición del espíritu.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Teletransporte Flamígero",
            descripcion:
              "Como sustituto de movimiento, tú o tu espíritu podéis teletransportaros hasta 4,5 m al lado del otro. La criatura que se teletransporta puede infligir 1d6 + mod. SAB de daño de fuego a criaturas a 1,5 m de donde aparece.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Llama Eterna",
            descripcion:
              "Si el espíritu cae a 0 PG, puedes usar tu reacción y gastar un espacio de conjuro de nivel 1+ para que el espíritu estalle (cada criatura a 3 m: salvación de DES o 2d10 + nivel espacio de fuego) y reaparezca con PG totales al inicio de tu siguiente turno.",
          },
        ],
      },
    ],
  },
];
