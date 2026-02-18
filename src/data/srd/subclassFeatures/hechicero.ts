/**
 * Rasgos de subclase: Hechicero
 */

import type { SubclassFeatureData } from "./types";

export const HECHICERO_SUBCLASS_FEATURES: SubclassFeatureData[] = [
  // ── Linaje Dracónico ──────────────────────────────────────────────
  {
    subclaseId: "linaje_draconico",
    claseId: "hechicero",
    nombre: "Linaje Dracónico",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Ancestro Draconiano",
            descripcion:
              "Elige un tipo de dragón como ancestro. Esto determina tu tipo de daño y otras habilidades futuras. Además, puedes hablar, leer y escribir Dracónico.",
            elecciones: [
              {
                id: "ancestro_dragon",
                nombre: "Ancestro Draconiano",
                instruccion: "Elige el tipo de dragón de tu linaje:",
                tipo: "single",
                opciones: [
                  { id: "negro", nombre: "Negro", descripcion: "Daño: Ácido. Aliento: Línea 1,5×9 m (salvación DES)." },
                  { id: "azul", nombre: "Azul", descripcion: "Daño: Relámpago. Aliento: Línea 1,5×9 m (salvación DES)." },
                  { id: "laton", nombre: "Latón", descripcion: "Daño: Fuego. Aliento: Línea 1,5×9 m (salvación DES)." },
                  { id: "bronce", nombre: "Bronce", descripcion: "Daño: Relámpago. Aliento: Línea 1,5×9 m (salvación DES)." },
                  { id: "cobre", nombre: "Cobre", descripcion: "Daño: Ácido. Aliento: Línea 1,5×9 m (salvación DES)." },
                  { id: "oro", nombre: "Oro", descripcion: "Daño: Fuego. Aliento: Cono 4,5 m (salvación DES)." },
                ],
              },
            ],
          },
          {
            nombre: "Resiliencia Draconiana",
            descripcion:
              "Tu máximo de PG aumenta en 1, y aumenta en 1 por cada nivel de hechicero posterior. Además, cuando no llevas armadura, tu CA es 13 + tu mod. DES.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Afinidad Elemental",
            descripcion:
              "Cuando lanzas un conjuro que inflige daño del tipo asociado a tu ancestro, puedes sumar tu mod. CAR al daño. Además, puedes gastar 1 punto de hechicería para ganar resistencia a ese tipo de daño durante 1 hora.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Alas de Dragón",
            descripcion:
              "Como acción adicional, haces brotar alas de dragón de tu espalda. Ganas velocidad de vuelo igual a tu velocidad actual. Las alas duran hasta que las descartes.",
          },
        ],
      },
      {
        nivel: 18,
        rasgos: [
          {
            nombre: "Presencia Draconiana",
            descripcion:
              "Como acción, puedes gastar 5 puntos de hechicería para proyectar un aura de 18 m de temor o asombro durante 1 minuto. Las criaturas hostiles deben superar SAB o quedan asustadas (temor) o hechizadas (asombro).",
          },
        ],
      },
    ],
  },

  // ── Magia Salvaje ──────────────────────────────────────────────────
  {
    subclaseId: "magia_salvaje",
    claseId: "hechicero",
    nombre: "Magia Salvaje",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Oleada de Magia Salvaje",
            descripcion:
              "Después de lanzar un conjuro de hechicero de nivel 1 o superior, el DM puede pedirte que tires un d20. Si sacas 1, tiras en la tabla de Oleada de Magia Salvaje para generar un efecto mágico aleatorio.",
          },
          {
            nombre: "Mareas del Caos",
            descripcion:
              "Puedes manipular las fuerzas del azar para ganar ventaja en una tirada de ataque, prueba de habilidad o salvación. Si lo haces, antes de lanzar tu siguiente conjuro, debes tirar en la tabla de Oleada de Magia Salvaje. Una vez por descanso largo.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Doblar la Suerte",
            descripcion:
              "Cuando otra criatura que puedas ver hace una tirada de ataque, prueba de habilidad o salvación, puedes usar tu reacción y gastar 2 puntos de hechicería para tirar 1d4 y sumar o restar del resultado.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Caos Controlado",
            descripcion:
              "Cuando tiras en la tabla de Oleada de Magia Salvaje, puedes tirar dos veces y elegir qué resultado aplicar.",
          },
        ],
      },
      {
        nivel: 18,
        rasgos: [
          {
            nombre: "Bombardeo de Hechizos",
            descripcion:
              "Cuando tiras daño de un conjuro de hechicero de nivel 5+, puedes elegir un dado de daño y repetir el resultado. Debes usar la nueva tirada. Puedes usar esta capacidad una vez por turno.",
          },
        ],
      },
    ],
  },

  // ── Alma Divina ────────────────────────────────────────────────────
  {
    subclaseId: "alma_divina",
    claseId: "hechicero",
    nombre: "Alma Divina",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Magia Divina",
            descripcion:
              "Tu conexión con lo divino te permite aprender conjuros de la lista de clérigo además de la de hechicero. Cuando aprendes un nuevo conjuro de hechicero, puedes elegirlo de la lista de hechicero o de clérigo.",
          },
          {
            nombre: "Afinidad Favorecida",
            descripcion:
              "Ganas un conjuro adicional basado en tu afinidad: Buena (Cura de Heridas), Mala (Infligir Heridas), Legal (Bendición), Caótica (Perdición), o Neutral (Protección contra el Bien y el Mal).",
            elecciones: [
              {
                id: "afinidad_divina",
                nombre: "Afinidad Favorecida",
                instruccion: "Elige tu afinidad divina:",
                tipo: "single",
                opciones: [
                  { id: "buena", nombre: "Buena", descripcion: "Aprendes Cura de Heridas." },
                  { id: "mala", nombre: "Mala", descripcion: "Aprendes Infligir Heridas." },
                  { id: "legal", nombre: "Legal", descripcion: "Aprendes Bendición." },
                  { id: "caotica", nombre: "Caótica", descripcion: "Aprendes Perdición." },
                  { id: "neutral", nombre: "Neutral", descripcion: "Aprendes Protección contra el Bien y el Mal." },
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
            nombre: "Curación Empoderada",
            descripcion:
              "Cuando tú o un aliado a 1,5 m tira dados para recuperar PG con un conjuro, puedes gastar 1 punto de hechicería para repetir cualquier número de esos dados (una vez por turno).",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Alas Celestiales",
            descripcion:
              "Como acción adicional, manifiestas un par de alas espectrales que te dan velocidad de vuelo igual a tu velocidad de caminar. Las alas pueden ser de águila, murciélago o dragón según tu afinidad.",
          },
        ],
      },
      {
        nivel: 18,
        rasgos: [
          {
            nombre: "Restauración Sobrenatural",
            descripcion:
              "Al inicio de tu turno mientras tengas menos de la mitad de tus PG máximos, recuperas un número de PG igual a la mitad de tu máximo de PG de hechicero. Una vez por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Alma de Relojería ──────────────────────────────────────────────
  {
    subclaseId: "alma_relojeria",
    claseId: "hechicero",
    nombre: "Alma de Relojería",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Magia de Restauración",
            descripcion:
              "Aprendes conjuros adicionales según tu nivel (Ayuda, Protección contra el Bien y el Mal a nivel 1; Ayuda, Restauración Menor a nivel 3; Protección contra Energía, Disipar Magia a nivel 5; etc.). No cuentan para tu límite.",
          },
          {
            nombre: "Restablecer el Equilibrio",
            descripcion:
              "Cuando una criatura a 18 m va a hacer una tirada con ventaja o desventaja, puedes usar tu reacción para anular esa ventaja o desventaja. Usos iguales a tu bon. de competencia por descanso largo.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Bastión del Derecho",
            descripcion:
              "Como acción, elige hasta 3 criaturas a 9 m y gasta 1-3 puntos de hechicería (1 por criatura). Cada una gana una custodia con PG = 2 × tu nivel de hechicero. La custodia absorbe daño y dura hasta tu próximo descanso largo.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Cabalgar el Reloj",
            descripcion:
              "Como reacción cuando tú u otra criatura a 9 m es impactada o falla una salvación, puedes gastar 7 puntos de hechicería para anular el ataque o la salvación fallida.",
          },
        ],
      },
      {
        nivel: 18,
        rasgos: [
          {
            nombre: "Convergencia de la Relojería",
            descripcion:
              "Como acción, creas un aura de 9 m de radio durante 1 minuto: restaura 20 PG a cada aliado que inicie su turno en el aura, y cualquier criatura que hagas daño recibe 20 PG de daño de fuerza extra. Armas y conjuros de daño dentro del aura infligen máximo daño una vez por turno. Una vez por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Mente Aberrante ────────────────────────────────────────────────
  {
    subclaseId: "mente_aberrante",
    claseId: "hechicero",
    nombre: "Mente Aberrante",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Conjuros Psíquicos",
            descripcion:
              "Aprendes conjuros adicionales: Detectar Magia, Comunicación Telepática (nv1); Detectar Pensamientos, Nube de Puñales (nv3); Enviar, Hambre de Hadar (nv5); Dominar Bestia, Tentáculos Negros de Evard (nv7); Telekinesis, Modificar Memoria (nv9).",
          },
          {
            nombre: "Telepatía",
            descripcion:
              "Puedes comunicarte telepáticamente con cualquier criatura a 9 m de ti si compartís un idioma. No necesitas línea de visión.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Escudo Psíquico",
            descripcion:
              "Cuando tú u otra criatura a 9 m hace una tirada de salvación, puedes usar tu reacción y gastar puntos de hechicería para tirar dados extra. Por 1 punto ganas 1d4, por 2 puntos 2d4, etc. El resultado se suma a la salvación.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Desvelación Psíquica",
            descripcion:
              "Como acción adicional, gastas 5 puntos de hechicería o más para revelar presencias: conoces ubicación de cada criatura a 9 m por punto gastado por encima de 5. Además puedes lanzar conjuros de hechicero con componentes verbales y somáticos sin necesidad de ellos durante 10 minutos.",
          },
        ],
      },
      {
        nivel: 18,
        rasgos: [
          {
            nombre: "Deformación de la Realidad",
            descripcion:
              "Como acción, gastas 5 puntos de hechicería: elige hasta 6 criaturas a 36 m. Cada una hace salvación de INT. Si falla, recibe 12d6 de daño psíquico y queda aturdida hasta el final de tu siguiente turno. Si tiene éxito, mitad de daño sin aturdimiento.",
          },
        ],
      },
    ],
  },

  // ── Tormenta Tempestuosa ───────────────────────────────────────────
  {
    subclaseId: "tormenta_tempestuosa",
    claseId: "hechicero",
    nombre: "Tormenta Tempestuosa",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Magia del Viento",
            descripcion:
              "Puedes usar una acción adicional en tu turno para canalizar magia tormentosa: hasta el final de tu turno, puedes volar 3 m sin provocar ataques de oportunidad.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Corazón de la Tormenta",
            descripcion:
              "Ganas resistencia al daño de rayo y trueno. Además, cuando comienzas a lanzar un conjuro de nivel 1+ en tu turno, puedes infligir daño de rayo o trueno (tú eliges) igual a la mitad de tu nivel de hechicero a una criatura a 3 m.",
          },
          {
            nombre: "Guía de la Tormenta",
            descripcion:
              "Puedes controlar sutilmente el clima a tu alrededor. Si llueve, puedes hacer que deje de llover en un radio de 6 m. Puedes crear efectos sensoriales menores de tormenta.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Furia de la Tormenta",
            descripcion:
              "Cuando recibes daño de un ataque, puedes usar tu reacción para infligir daño de rayo a la criatura atacante igual a tu nivel de hechicero. La criatura debe hacer salvación de DES o es empujada 6 m en línea recta.",
          },
        ],
      },
      {
        nivel: 18,
        rasgos: [
          {
            nombre: "Alma del Viento",
            descripcion:
              "Ganas inmunidad al daño de rayo y trueno. Además ganas velocidad de vuelo mágica igual a tu velocidad de caminar, y puedes reducir tu velocidad de vuelo a 0 como reacción para evitar caer.",
          },
        ],
      },
    ],
  },

  // ── Alma de las Sombras ────────────────────────────────────────────
  {
    subclaseId: "alma_sombras",
    claseId: "hechicero",
    nombre: "Alma de las Sombras",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Ojos del Oscuro",
            descripcion:
              "Ganas visión en la oscuridad a 36 m. Si ya la tienes, se extiende 9 m más. Puedes lanzar Oscuridad gastando 2 puntos de hechicería y puedes ver a través de esa oscuridad.",
          },
          {
            nombre: "Fuerza del Enterrado",
            descripcion:
              "Al inicio de tu turno, si tienes 0 PG, puedes hacer una salvación de CAR CD 5 + el número de veces que has usado esta capacidad. Si tienes éxito, vuelves a 1 PG. La dificultad se reinicia tras un descanso largo.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Sabueso de la Mala Suerte",
            descripcion:
              "Como acción adicional, gastas 3 puntos de hechicería para invocar un sabueso de sombras que aparece a 9 m de una criatura objetivo que puedas ver. El sabueso tiene tus estadísticas de hechicero y ataca al objetivo con ventaja. Desaparece si el objetivo cae a 0 PG, si el sabueso llega a 0 PG, o tras 5 minutos.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Caminar en las Sombras",
            descripcion:
              "Como acción adicional cuando estés en luz tenue u oscuridad, puedes teletransportarte mágicamente hasta 36 m a otro punto en luz tenue u oscuridad que puedas ver.",
          },
        ],
      },
      {
        nivel: 18,
        rasgos: [
          {
            nombre: "Forma Sombría",
            descripcion:
              "Como acción adicional, gastas 6 puntos de hechicería para transformarte en sombra durante 1 minuto. Ganas resistencia a todo daño excepto fuerza y radiante, puedes moverte por espacios de otras criaturas y objetos, y ganas velocidad de vuelo de 12 m.",
          },
        ],
      },
    ],
  },
];
