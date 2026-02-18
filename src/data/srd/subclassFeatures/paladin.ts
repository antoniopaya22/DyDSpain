/**
 * Rasgos de subclase: Paladín
 */

import type { SubclassFeatureData } from "./types";

export const PALADIN_SUBCLASS_FEATURES: SubclassFeatureData[] = [
  // ── Juramento de Devoción ──────────────────────────────────────────
  {
    subclaseId: "juramento_entrega",
    claseId: "paladin",
    nombre: "Juramento de Devoción",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Arma Sagrada",
            descripcion:
              "Como acción, imbuyes un arma con energía positiva durante 1 minuto. Sumas tu mod. CAR a las tiradas de ataque. El arma emite luz brillante en 6 m y tenue en 6 m más. Cuenta como mágica.",
          },
          {
            nombre: "Canalizar Divinidad: Expulsar Impíos",
            descripcion:
              "Como acción, presentas tu símbolo sagrado. Cada infernal o muerto viviente a 9 m que pueda oírte debe superar una salvación de SAB o queda expulsado durante 1 minuto.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Aura de Devoción",
            descripcion:
              "Tú y las criaturas amistosas a 3 m de ti no podéis ser hechizados mientras estés consciente. A nivel 18, el alcance aumenta a 9 m.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Pureza de Espíritu",
            descripcion:
              "Siempre estás bajo el efecto del conjuro Protección contra el mal y el bien.",
          },
        ],
      },
      {
        nivel: 20,
        rasgos: [
          {
            nombre: "Nimbo Sagrado",
            descripcion:
              "Como acción, emanas un aura de luz solar durante 1 minuto. Luz brillante a 9 m, luz tenue 9 m más. Los enemigos que empiecen su turno en la luz reciben 10 de daño radiante. Tienes ventaja en salvaciones contra conjuros de infernales y muertos vivientes. Una vez por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Juramento de los Antiguos ──────────────────────────────────────
  {
    subclaseId: "juramento_antiguos",
    claseId: "paladin",
    nombre: "Juramento de los Antiguos",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Ira de la Naturaleza",
            descripcion:
              "Como acción, haces que plantas espectrales erupcionen del suelo en un cuadrado de 3 m a 3 m que puedas ver. El terreno se vuelve difícil durante 1 minuto. Cada criatura en el área al lanzarse: salvación de FUE o queda atrapada (velocidad 0). Puede usar acción para repetir salvación.",
          },
          {
            nombre: "Canalizar Divinidad: Expulsar Infieles",
            descripcion:
              "Como acción, presentas tu símbolo sagrado. Cada fata o infernal a 9 m: salvación de SAB o queda expulsado 1 minuto (debe huir a máxima velocidad).",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Aura de Custodia",
            descripcion:
              "Tú y tus aliados a 3 m ganan resistencia al daño de conjuros. A nivel 18, radio de 9 m.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Centinela Imperecedero",
            descripcion:
              "Cuando llegas a 0 PG y no mueres, vuelves a 1 PG. Una vez por descanso largo.",
          },
        ],
      },
      {
        nivel: 20,
        rasgos: [
          {
            nombre: "Campeón de los Ancianos",
            descripcion:
              "Como acción, te transformas. Durante 1 minuto: recuperas 10 PG al inicio de cada turno (si tienes menos de la mitad), tus conjuros de paladín no requieren componentes materiales, y enemigos a 3 m tienen desventaja en salvaciones contra tu Canalizar Divinidad y conjuros. Una vez por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Juramento de Venganza ──────────────────────────────────────────
  {
    subclaseId: "juramento_venganza",
    claseId: "paladin",
    nombre: "Juramento de Venganza",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Voto de Enemistad",
            descripcion:
              "Como acción adicional, elige a una criatura a 3 m. Tienes ventaja en tiradas de ataque contra ella durante 1 minuto o hasta que caiga a 0 PG o quede inconsciente.",
          },
          {
            nombre: "Canalizar Divinidad: Expulsar Abominaciones",
            descripcion:
              "Como acción, cada infernal o no-muerto a 9 m: salvación de SAB o queda expulsado 1 minuto.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Vengador Implacable",
            descripcion:
              "Cuando una criatura hostil a 9 m de ti se mueve, puedes usar tu reacción para moverte hasta tu velocidad hacia ella.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Alma de Venganza",
            descripcion:
              "Cuando una criatura contra la que tienes Voto de Enemistad hace un ataque, puedes usar tu reacción para hacer un ataque de oportunidad.",
          },
        ],
      },
      {
        nivel: 20,
        rasgos: [
          {
            nombre: "Ángel Vengador",
            descripcion:
              "Como acción, te transformas durante 1 hora: alas que dan velocidad de vuelo 18 m, un aura a 9 m que aterroriza enemigos (salvación de SAB o asustados 1 turno). Una vez por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Juramento de la Corona ─────────────────────────────────────────
  {
    subclaseId: "juramento_corona",
    claseId: "paladin",
    nombre: "Juramento de la Corona",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Desafío del Campeón",
            descripcion:
              "Como acción adicional, cada criatura de tu elección a 9 m: salvación de SAB o no puede alejarse más de 9 m de ti. Si queda asustada o empujada, la velocidad es 0.",
          },
          {
            nombre: "Canalizar Divinidad: Expulsar la Revuelta",
            descripcion:
              "Como acción, fuerza la paz. Cada criatura a 9 m que pueda oírte: salvación de SAB o queda encantada 1 minuto (velocidad 0, sin atacar). Termina si recibe daño.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Aura de Lealtad",
            descripcion:
              "Tú y aliados a 3 m no podéis ser hechizados. A nivel 18, radio de 9 m.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Resistencia Indomable",
            descripcion:
              "Tienes ventaja en salvaciones contra ser paralizado o aturdido.",
          },
        ],
      },
      {
        nivel: 20,
        rasgos: [
          {
            nombre: "Exaltado Campeón",
            descripcion:
              "Tu presencia es refugio. Como acción, ganas los siguientes beneficios durante 1 hora: resistencia al daño contundente, perforante y cortante no mágico; aliados a 9 m tienen ventaja en salvaciones contra muerte; ventaja en salvaciones de SAB. Una vez por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Juramento de Conquista ─────────────────────────────────────────
  {
    subclaseId: "juramento_conquista",
    claseId: "paladin",
    nombre: "Juramento de Conquista",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Presencia Conquistadora",
            descripcion:
              "Como acción, cada criatura de tu elección a 9 m: salvación de SAB o asustada 1 minuto. Puede repetir salvación al final de cada turno.",
          },
          {
            nombre: "Canalizar Divinidad: Golpe Guiado",
            descripcion:
              "Cuando haces una tirada de ataque, puedes usar Canalizar Divinidad para ganar +10 al resultado.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Aura de Conquista",
            descripcion:
              "Si una criatura asustada por ti empieza su turno a 3 m, su velocidad se reduce a 0 y recibe daño psíquico igual a la mitad de tu nivel de paladín. A nivel 18, radio de 9 m.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Espíritu Despiadado",
            descripcion:
              "Ganas los siguientes beneficios: no puedes ser hechizado, y cuando una criatura te inflige daño, puedes usar tu reacción para infligir daño psíquico igual a tu mod. de CAR.",
          },
        ],
      },
      {
        nivel: 20,
        rasgos: [
          {
            nombre: "Conquistador Invencible",
            descripcion:
              "Como acción durante 1 minuto: ganas resistencia a todo daño, puedes hacer un ataque adicional como acción adicional cuando usas Atacar, y los ataques con arma cuerpo a cuerpo tienen +1d6 de daño. Una vez por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Juramento de Redención ─────────────────────────────────────────
  {
    subclaseId: "juramento_redencion",
    claseId: "paladin",
    nombre: "Juramento de Redención",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Emisario de la Paz",
            descripcion:
              "Como acción adicional, ganas +5 a las pruebas de Persuasión durante 10 minutos.",
          },
          {
            nombre: "Canalizar Divinidad: Reproche del Violento",
            descripcion:
              "Cuando una criatura a 9 m inflige daño, puedes usar tu reacción y Canalizar Divinidad: la criatura recibe el mismo daño radiante (salvación de SAB para mitad).",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Aura del Guardián",
            descripcion:
              "Cuando una criatura a 3 m de ti recibe daño, puedes usar tu reacción para redirigir ese daño a ti mismo en su lugar (sin reducción). A nivel 18, radio de 9 m.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Espíritu Protector",
            descripcion:
              "Ganas resistencia a todo daño de armas (contundente, perforante y cortante no mágico).",
          },
        ],
      },
      {
        nivel: 20,
        rasgos: [
          {
            nombre: "Emisario de Redención",
            descripcion:
              "Como acción durante 1 minuto: tu CA sube a 20 si es menor, conjuros de curación en ti o en aliados a 9 m curan el máximo, mientras tengas PG la primera vez que un aliado a 9 m sería reducido a 0 PG, ese aliado queda en 1 PG. Una vez por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Juramento de Gloria ────────────────────────────────────────────
  {
    subclaseId: "juramento_gloria",
    claseId: "paladin",
    nombre: "Juramento de Gloria",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Inspiración Estimulante",
            descripcion:
              "Como acción adicional, cada criatura de tu elección a 9 m gana PG temporales iguales a tu nivel de paladín + mod. CAR.",
          },
          {
            nombre: "Canalizar Divinidad: Proeza Atlética",
            descripcion:
              "Como acción adicional, durante 10 minutos: ventaja en pruebas de Atletismo y Acrobacia, y puedes cargar, empujar o arrastrar el doble de peso.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Aura de Arrojo",
            descripcion:
              "Tú y aliados a 3 m ganáis bonificación a las pruebas de Atletismo y salvaciones de FUE igual a tu mod. de CAR. A nivel 18, radio de 9 m.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Defensa Gloriosa",
            descripcion:
              "Cuando tú o un aliado a 3 m es impactado; puedes usar tu reacción y gastar un uso de Castigo Divino (sin conjuro) para sumar tu mod. de CAR a la CA del objetivo contra ese ataque. Si el ataque falla, puedes hacer un ataque contra el atacante.",
          },
        ],
      },
      {
        nivel: 20,
        rasgos: [
          {
            nombre: "Presencia Viva de la Leyenda",
            descripcion:
              "Como acción adicional, durante 1 minuto: si fallas una salvación o una tirada de ataque, puedes usar tu reacción para repetirla; ventaja en pruebas de CAR. Una vez por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── Juramento del Centinela ────────────────────────────────────────
  {
    subclaseId: "juramento_centinela",
    claseId: "paladin",
    nombre: "Juramento del Centinela",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Toque del Centinela",
            descripcion:
              "Cuando impactas con un ataque cuerpo a cuerpo puedes Canalizar Divinidad para dar al objetivo una marca luminosa durante 1 minuto. La criatura marcada no puede volverse invisible y emite luz tenue 1,5 m.",
          },
          {
            nombre: "Canalizar Divinidad: Reproche del Centinela",
            descripcion:
              "Como acción, elige una criatura a 9 m: salvación de CAR. Si falla, es hechizada 1 minuto (velocidad 0, los ataques contra ella tienen +1d6 radiante). Puede repetir al recibir daño.",
          },
        ],
      },
      {
        nivel: 7,
        rasgos: [
          {
            nombre: "Aura del Centinela",
            descripcion:
              "Emites un aura de 9 m. Tú y aliados en el aura ganáis +bon. de competencia a la iniciativa (mínimo 10 en la iniciativa). A nivel 18 también ganas ventaja en iniciativa.",
          },
        ],
      },
      {
        nivel: 15,
        rasgos: [
          {
            nombre: "Vigilante Incansable",
            descripcion:
              "Cuando tiras iniciativa y no te quedan usos de Canalizar Divinidad, recuperas un uso.",
          },
        ],
      },
      {
        nivel: 20,
        rasgos: [
          {
            nombre: "Vigilia del Centinela",
            descripcion:
              "Como acción durante 1 minuto: ganas visión verdadera a 36 m, tienes ventaja en ataques contra criaturas a 1,5 m de aliados, y cuando impactas puedes forzar salvación de FUE (CD = tu CD de conjuro) o la criatura es empujada 3 m y queda derribada. Una vez por descanso largo.",
          },
        ],
      },
    ],
  },
];
