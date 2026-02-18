/**
 * Rasgos de subclase: Mago
 */

import type { SubclassFeatureData } from "./types";

export const MAGO_SUBCLASS_FEATURES: SubclassFeatureData[] = [
  // ── Escuela de Evocación ───────────────────────────────────────────
  {
    subclaseId: "escuela_evocacion",
    claseId: "mago",
    nombre: "Escuela de Evocación",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Erudito de Evocación",
            descripcion:
              "El tiempo y dinero que debes invertir para copiar un conjuro de evocación en tu libro se reduce a la mitad.",
          },
          {
            nombre: "Esculpir Conjuros",
            descripcion:
              "Cuando lanzas un conjuro de evocación que afecte a otras criaturas, puedes elegir un número de ellas igual a 1 + el nivel del conjuro. Las criaturas elegidas superan automáticamente su tirada de salvación y no reciben daño.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Trucos Potenciados",
            descripcion:
              "Tus trucos de daño afectan incluso a criaturas que superen su tirada de salvación. Reciben la mitad del daño del truco.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Evocación Empoderada",
            descripcion:
              "Puedes sumar tu mod. INT al resultado de daño de cualquier conjuro de evocación de mago. El daño extra se aplica a una sola tirada de daño, que puede afectar a una o más criaturas.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Sobrecargar",
            descripcion:
              "Puedes aumentar el poder de tus conjuros de evocación más simples. Cuando lanzas un conjuro de evocación de nivel 1–5 que inflige daño, puedes infligir el daño máximo de ese conjuro. Una vez por descanso largo (o gasta un espacio de nivel 5+ para repetirlo).",
          },
        ],
      },
    ],
  },

  // ── Escuela de Abjuración ─────────────────────────────────────────
  {
    subclaseId: "escuela_abjuracion",
    claseId: "mago",
    nombre: "Escuela de Abjuración",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Erudito en Abjuración",
            descripcion:
              "El oro y tiempo que necesitas para copiar un conjuro de abjuración en tu libro se reduce a la mitad.",
          },
          {
            nombre: "Custodia Arcana",
            descripcion:
              "Cuando lanzas un conjuro de abjuración de nivel 1 o superior, creas una custodia mágica con PG = el doble de tu nivel de mago + mod. de INT. Cuando recibes daño, la custodia lo absorbe primero. Si llega a 0, el daño sobrante lo recibes tú.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Custodia Proyectada",
            descripcion:
              "Cuando una criatura a 9 m que puedas ver recibe daño, puedes usar tu reacción para que tu Custodia Arcana absorba el daño en su lugar.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Custodia Mejorada",
            descripcion:
              "Cuando lanzas un conjuro de abjuración de nivel 1+, recuperas PG de custodia iguales al doble del nivel del conjuro.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Resistencia a Conjuros",
            descripcion:
              "Tienes ventaja en salvaciones contra conjuros. Además, tienes resistencia al daño de conjuros.",
          },
        ],
      },
    ],
  },

  // ── Escuela de Conjuración ─────────────────────────────────────────
  {
    subclaseId: "escuela_conjuracion",
    claseId: "mago",
    nombre: "Escuela de Conjuración",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Erudito en Conjuración",
            descripcion:
              "El oro y tiempo para copiar conjuros de conjuración se reduce a la mitad.",
          },
          {
            nombre: "Conjuración Menor",
            descripcion:
              "Como acción, conjuras un objeto inanimado en tu mano o en el suelo a 3 m. No puede ser mayor que 90 cm de lado ni pesar más de 5 kg. Desaparece tras 1 hora o al usar esta capacidad de nuevo. No puede ser un objeto mágico.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Transposición Benigna",
            descripcion:
              "Como acción, te teletransportas hasta 9 m a un espacio desocupado que puedas ver. Alternativamente, elige a una criatura voluntaria Pequeña o Mediana a 9 m: os intercambiáis posiciones. Una vez por descanso largo (o gasta un espacio de conjuro para repetirlo).",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Conjuración Enfocada",
            descripcion:
              "Mientras te concentras en un conjuro de conjuración, tu concentración no se rompe al recibir daño.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Invocaciones Perdurables",
            descripcion:
              "Cualquier criatura que invoques o crees con un conjuro de conjuración tiene 30 PG temporales.",
          },
        ],
      },
    ],
  },

  // ── Escuela de Adivinación ─────────────────────────────────────────
  {
    subclaseId: "escuela_adivinacion",
    claseId: "mago",
    nombre: "Escuela de Adivinación",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Erudito en Adivinación",
            descripcion:
              "El oro y tiempo para copiar conjuros de adivinación se reduce a la mitad.",
          },
          {
            nombre: "Portento",
            descripcion:
              "Al terminar un descanso largo, tiras 2d20 y anotas los resultados. Puedes sustituir cualquier tirada de ataque, salvación o prueba de habilidad (tuya o de una criatura que veas) por uno de esos resultados antes de tirar. Cada dado de portento solo se usa una vez.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Adivinación Experta",
            descripcion:
              "Lanzar conjuros de adivinación es tan fácil que apenas cuesta esfuerzo. Cuando lanzas un conjuro de adivinación de nivel 2+, recuperas un espacio de conjuro de nivel inferior al usado (máximo nivel 5).",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "El Tercer Ojo",
            descripcion:
              "Como acción, ganas uno de estos beneficios hasta tu próximo descanso (corto o largo): visión en la oscuridad 36 m, visión etérea 18 m, leer cualquier idioma, o ver criaturas/objetos invisibles a 3 m.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Portento Mayor",
            descripcion:
              "Las visiones de tus sueños se intensifican. Ahora tiras 3d20 para Portento en lugar de 2d20.",
          },
        ],
      },
    ],
  },

  // ── Escuela de Encantamiento ───────────────────────────────────────
  {
    subclaseId: "escuela_encantamiento",
    claseId: "mago",
    nombre: "Escuela de Encantamiento",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Erudito en Encantamiento",
            descripcion:
              "El oro y tiempo para copiar conjuros de encantamiento se reduce a la mitad.",
          },
          {
            nombre: "Mirada Hipnótica",
            descripcion:
              "Como acción, elige a un humanoide a 1,5 m que puedas ver. Si no es hostil, queda hechizado hasta el final de tu siguiente turno. Velocidad 0, incapacitado, visiblemente aturdido. En turnos siguientes puedes mantener el efecto con tu acción. Termina si te mueves a más de 1,5 m de la criatura, si no puede verte ni oírte, o si recibe daño.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Encanto Instintivo",
            descripcion:
              "Cuando una criatura a 9 m que puedas ver te ataca, puedes usar tu reacción para desviar el ataque a otra criatura a 9 m (debe poder ser objetivo). El atacante debe hacer salvación de SAB; si falla, debe atacar a la otra criatura.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Encantamiento Dividido",
            descripcion:
              "Cuando lanzas un conjuro de encantamiento de nivel 1+ que apunte a una sola criatura, puedes apuntar a una segunda criatura en el alcance del conjuro.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Alterar Recuerdos",
            descripcion:
              "Cuando una criatura queda hechizada por tus conjuros, puedes alterar su memoria: no recuerda nada de lo que hiciste mientras estuvo hechizada (1 + mod. de CAR horas).",
          },
        ],
      },
    ],
  },

  // ── Escuela de Ilusión ─────────────────────────────────────────────
  {
    subclaseId: "escuela_ilusion",
    claseId: "mago",
    nombre: "Escuela de Ilusión",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Erudito en Ilusión",
            descripcion:
              "El oro y tiempo para copiar conjuros de ilusión se reduce a la mitad.",
          },
          {
            nombre: "Ilusión Menor Mejorada",
            descripcion:
              "Cuando lanzas Ilusión Menor, puedes crear tanto un sonido como una imagen con una sola lanzamiento.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Ilusiones Maleables",
            descripcion:
              "Cuando lanzas un conjuro de ilusión con duración de 1 minuto o más, puedes usar tu acción para cambiar la naturaleza de la ilusión (siguiendo las restricciones del conjuro).",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Yo Ilusorio",
            descripcion:
              "Cuando recibes daño, puedes usar tu reacción para volverte invisible y crear una copia ilusoria tuya. La copia recibe el ataque. Quedas invisible hasta el inicio de tu siguiente turno o hasta que ataques/lances conjuro. Una vez por descanso corto.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Realidad Ilusoria",
            descripcion:
              "Puedes elegir un objeto dentro de una ilusión que estés manteniendo y hacerlo real durante 1 minuto. No puede ser algo que inflija daño directamente.",
          },
        ],
      },
    ],
  },

  // ── Escuela de Nigromancia ─────────────────────────────────────────
  {
    subclaseId: "escuela_nigromancia",
    claseId: "mago",
    nombre: "Escuela de Nigromancia",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Erudito en Nigromancia",
            descripcion:
              "El oro y tiempo para copiar conjuros de nigromancia se reduce a la mitad.",
          },
          {
            nombre: "Cosecha Lúgubre",
            descripcion:
              "Cuando matas a una o más criaturas con un conjuro de nivel 1+, recuperas PG iguales al doble del nivel del conjuro (o triple si es de nigromancia). No funciona contra constructos ni no-muertos.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Siervos No Muertos",
            descripcion:
              "Los no-muertos que crees con Animar Muertos tienen beneficios adicionales: sus PG máximos aumentan en tu nivel de mago, y añaden tu bon. de competencia a sus tiradas de daño con armas.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Inured to Undeath (Acostumbrado a la No Muerte)",
            descripcion:
              "Ganas resistencia al daño necrótico. Tu máximo de PG no puede ser reducido.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Dominar No Muertos",
            descripcion:
              "Como acción, apuntas a un no-muerto a 18 m: salvación de CAR con desventaja de tu CD de conjuro o queda bajo tu control. Un no-muerto inteligente (INT 8+) repite la salvación al final de cada hora. Si éxito, no puedes usarlo contra él de nuevo.",
          },
        ],
      },
    ],
  },

  // ── Escuela de Transmutación ───────────────────────────────────────
  {
    subclaseId: "escuela_transmutacion",
    claseId: "mago",
    nombre: "Escuela de Transmutación",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Erudito en Transmutación",
            descripcion:
              "El oro y tiempo para copiar conjuros de transmutación se reduce a la mitad.",
          },
          {
            nombre: "Alquimia Menor",
            descripcion:
              "Puedes alterar temporalmente las propiedades de materiales no mágicos. Como acción, transformas hasta 30 cm cúbicos de madera en piedra, piedra en hierro, hierro en cobre, o cobre en plata. Dura 1 hora o hasta que pierdas concentración.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Piedra del Transmutador",
            descripcion:
              "En 8 horas creas una piedra que otorga uno de estos beneficios al portador: visión en la oscuridad 18 m, +3 m de velocidad, competencia en salvaciones de CON, o resistencia a un tipo de daño elemental (ácido, frío, fuego, rayo o trueno). Eliges el beneficio al crearla y puedes cambiarlo con Alquimia Menor.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Cambiaformas",
            descripcion:
              "Puedes lanzar Polimorfismo sobre ti mismo sin gastar un espacio de conjuro. Cuando lo haces, solo puedes transformarte en una bestia con CR igual o inferior a 1. Una vez por descanso corto.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Transmutador Maestro",
            descripcion:
              "Puedes destruir tu Piedra del Transmutador para obtener uno de estos efectos: transmutar un objeto no mágico (hasta 1,5 m de lado) a otro material; eliminar maldiciones, enfermedades y venenos de una criatura; lanzar Revivir a una criatura tocando la piedra en los 8 minutos siguientes a su muerte; o lanzar Alterar Forma sobre ti mismo.",
          },
        ],
      },
    ],
  },

  // ── Mago de Guerra ─────────────────────────────────────────────────
  {
    subclaseId: "mago_guerra",
    claseId: "mago",
    nombre: "Mago de Guerra",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Entrenamiento Marcial",
            descripcion:
              "Ganas competencia con armadura ligera y un arma marcial o simple de tu elección.",
          },
          {
            nombre: "Canción de Espada Arcana",
            descripcion:
              "Como acción adicional, activas la Canción de Espada durante 1 minuto: ganas bonificador igual a tu mod. de INT al daño con armas, a la CA (si no llevas armadura media o pesada ni escudo), a pruebas de Acrobacia y a salvaciones de CON para mantener concentración. Usos iguales a tu bon. de competencia por descanso largo.",
          },
        ],
        competenciasGanadas: {
          armaduras: ["Armaduras ligeras"],
        },
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Ataque Extra",
            descripcion:
              "Puedes atacar dos veces cuando usas la acción de Atacar en tu turno.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Canción de Defensa",
            descripcion:
              "Mientras tu Canción de Espada está activa, cuando recibes daño puedes usar tu reacción para gastar un espacio de conjuro y reducir el daño en 5 × nivel del espacio gastado.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Canción de Victoria",
            descripcion:
              "Añades tu mod. de INT al daño de tus conjuros de daño cuerpo a cuerpo mientras tu Canción de Espada está activa.",
          },
        ],
      },
    ],
  },

  // ── Cronurgista ────────────────────────────────────────────────────
  {
    subclaseId: "cronurgista",
    claseId: "mago",
    nombre: "Cronurgista",
    niveles: [
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Ajuste Temporal",
            descripcion:
              "Como reacción, cuando tú u otra criatura a 9 m hace una tirada de ataque, prueba de habilidad o salvación, puedes obligar a repetirla. Usos iguales a tu mod. de INT por descanso largo.",
          },
          {
            nombre: "Cronurgía Temporal",
            descripcion:
              "Aprendes el conjuro Cronurgía que te permite modificar la velocidad de los objetos y criaturas. Como acción adicional a 18 m: la criatura objetivo debe hacer salvación de SAB o su velocidad se reduce a la mitad y no puede hacer reacciones hasta el final de tu siguiente turno.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Hechizo Acelerado",
            descripcion:
              "Puedes guardar un conjuro en un mote de tiempo congelado. Cuando lanzas un conjuro de nivel 1-4 con tiempo de lanzamiento de 1 acción, puedes condensarlo. Cualquier criatura que lleve el mote puede usarlo como acción para lanzar el conjuro. El mote desaparece tras 1 hora o al usarse.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Convergencia de la Posibilidad",
            descripcion:
              "Puedes proteger a una criatura a 18 m contra un peligro futuro. Como acción, la criatura gana una reacción especial: si sufre daño, puede usar esa reacción para ganar resistencia al daño y teletransportarse hasta 9 m. Una vez por descanso largo.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Arcanos Inversos",
            descripcion:
              "Tu comprensión del tiempo te permite manipular la magia. Cuando ves una criatura lanzando un conjuro a 18 m, puedes usar tu reacción y gastar un espacio del mismo nivel o superior para anularlo. Si el conjuro requiere concentración, fuerza su pérdida.",
          },
        ],
      },
    ],
  },
];
