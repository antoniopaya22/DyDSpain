/**
 * Rasgos de subclase: Brujo
 */

import type { SubclassFeatureData } from "./types";

export const BRUJO_SUBCLASS_FEATURES: SubclassFeatureData[] = [
  // ── El Infernal ────────────────────────────────────────────────────
  {
    subclaseId: "patron_infernal",
    claseId: "brujo",
    nombre: "El Infernal",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Bendición del Oscuro",
            descripcion:
              "Cuando reduces a una criatura hostil a 0 PG, ganas PG temporales iguales a tu mod. CAR + tu nivel de brujo (mínimo 1).",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Buena Suerte del Oscuro",
            descripcion:
              "Puedes llamar a tu patrón para que altere el destino. Cuando hagas una prueba de característica o una tirada de salvación, puedes usar este rasgo para sumar 1d10 al resultado. Una vez por descanso corto o largo.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Resistencia Infernal",
            descripcion:
              "Puedes elegir un tipo de daño. Ganas resistencia a ese tipo de daño hasta que elijas otro con este rasgo. El daño de arma mágica o de plata ignora esta resistencia.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Viajar al Infierno",
            descripcion:
              "Cuando impactas a una criatura con un ataque, puedes usar este rasgo para transportarla instantáneamente a los planos inferiores. Desaparece y sufre un paisaje infernal hasta el final de tu siguiente turno, recibiendo 10d10 de daño psíquico al regresar. Una vez por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── El Feérico ─────────────────────────────────────────────────────
  {
    subclaseId: "patron_feerico",
    claseId: "brujo",
    nombre: "El Feérico",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Presencia Feérica",
            descripcion:
              "Como acción, cada criatura en un cubo de 3 m que se origine en ti: salvación de SAB o queda hechizada o asustada (tú eliges) hasta el final de tu siguiente turno. Una vez por descanso corto o largo.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Escape Brumoso",
            descripcion:
              "Cuando recibes daño, puedes usar tu reacción para volverte invisible y teletransportarte hasta 18 m. Visible al inicio de tu siguiente turno. Una vez por descanso corto o largo.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Defensa Seductora",
            descripcion:
              "Tu patrón te enseña a desviar mentes. No puedes ser hechizado, y cuando otra criatura intenta hechizarte, puedes usar tu reacción para intentar hechizar a esa criatura (salvación de SAB contra tu CD de conjuro).",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Delirio Sombrío",
            descripcion:
              "Como acción, elige una criatura a 18 m que puedas ver: salvación de SAB. Si falla, queda hechizada o asustada (tú eliges) durante 1 minuto, creyendo estar perdida en un reino feérico. Puede repetir salvación al final de cada turno, terminando el efecto en éxito. Si lo resiste la primera vez, no puedes usarlo contra ella de nuevo.",
          },
        ],
      },
    ],
  },

  // ── El Gran Antiguo ────────────────────────────────────────────────
  {
    subclaseId: "patron_gran_antiguo",
    claseId: "brujo",
    nombre: "El Gran Antiguo",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Mente Despierta",
            descripcion:
              "Puedes comunicarte telepáticamente con cualquier criatura a 9 m de ti que puedas ver. No necesitas compartir un idioma, pero la criatura debe entender al menos un idioma.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Custodia Entrópica",
            descripcion:
              "Cuando una criatura hace una tirada de ataque contra ti, puedes usar tu reacción para imponer desventaja. Si el ataque falla, tu próximo ataque contra esa criatura tiene ventaja (debe usarse antes de finalizar tu siguiente turno). Una vez por descanso corto o largo.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Escudo de Pensamiento",
            descripcion:
              "Tus pensamientos no pueden ser leídos por telepatía u otros medios a menos que lo permitas. Ganas resistencia al daño psíquico. Cuando una criatura te inflige daño psíquico, puedes usar tu reacción para infligir el mismo daño a la criatura.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Crear Siervo",
            descripcion:
              "Puedes contagiar la magia de tu patrón a un humanoide incapacitado con tu toque: salvación de CAR o queda hechizado. Puedes comunicarte telepáticamente con él y darle órdenes. Puede repetir salvación al final de cada hora, pero obtiene desventaja si el DM lo decreta.",
          },
        ],
      },
    ],
  },

  // ── El Celestial ───────────────────────────────────────────────────
  {
    subclaseId: "patron_celestial",
    claseId: "brujo",
    nombre: "El Celestial",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Trucos Adicionales",
            descripcion:
              "Aprendes los trucos Luz y Llama Sagrada, que no cuentan para tu límite de trucos de brujo.",
          },
          {
            nombre: "Luz Curativa",
            descripcion:
              "Tienes una reserva de dados d6 para curar. El número de dados es 1 + nivel de brujo. Como acción adicional, elige una criatura a 18 m y gasta dados: recupera PG iguales al total. Alternativamente, puedes gastar 5 dados para curar a la criatura y darle estabilidad. Recuperas todos los dados tras un descanso largo.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Alma Radiante",
            descripcion:
              "Ganas resistencia al daño radiante. Cuando lanzas un conjuro que inflija daño de fuego o radiante, puedes sumar tu mod. de CAR al daño de una tirada contra un objetivo.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Resistencia Celestial",
            descripcion:
              "Ganas PG temporales iguales a tu nivel de brujo + mod. de CAR al finalizar un descanso corto o largo.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Venganza Abrasadora",
            descripcion:
              "Cuando una criatura te inflige daño, puedes usar tu reacción para infligir daño radiante igual a la mitad de tu nivel de brujo + mod. de CAR, y la criatura queda cegada hasta el final de tu siguiente turno. Una vez por descanso largo.",
          },
        ],
      },
    ],
  },

  // ── El Hexblade ────────────────────────────────────────────────────
  {
    subclaseId: "patron_hexblade",
    claseId: "brujo",
    nombre: "El Hexblade",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Maldición del Hexblade",
            descripcion:
              "Como acción adicional, maldices a una criatura a 9 m durante 1 minuto: +bon. competencia al daño contra ella, crits en 19-20, si muere recuperas PG = nivel de brujo + mod. CAR. Una vez por descanso corto o largo.",
          },
          {
            nombre: "Guerrero Hexblade",
            descripcion:
              "Ganas competencia con armadura media, escudos y armas marciales. Puedes usar tu mod. de CAR (en lugar de FUE o DES) para tiradas de ataque y daño con armas con las que seas competente (una a la vez). El arma cuenta como tu foco.",
          },
        ],
        competenciasGanadas: {
          armaduras: ["Armaduras medias", "Escudos"],
          armas: ["Armas marciales"],
        },
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Espectro Acusado",
            descripcion:
              "Cuando la criatura maldecida por tu Maldición del Hexblade muere, puedes vincular su espíritu y hacer que te sirva como espectro. Tiene estadísticas de espectro con PG = mitad de tu máximo. Obedece tus órdenes verbales. Solo puedes crear uno así, y desaparece al final de tu siguiente descanso largo.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Armadura de Hechizos",
            descripcion:
              "Puedes usar una acción para tocar un arma y convertirla en tu arma pacto. Cuando eres impactado mientras empuñas tu arma pacto, puedes usar tu reacción y gastar un espacio de conjuro de brujo para ganar +armor igual al doble del nivel del espacio gastado (aplicable a ese ataque y a posteriores hasta tu siguiente turno).",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Maestro de los Hechizos",
            descripcion:
              "Tu Maldición del Hexblade mejora. Cuando impactas a la criatura maldecida, infliges daño necrótico adicional igual a tu mod. de CAR (mínimo 1).",
          },
        ],
      },
    ],
  },

  // ── El Genio ───────────────────────────────────────────────────────
  {
    subclaseId: "patron_genio",
    claseId: "brujo",
    nombre: "El Genio",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Tipo de Genio",
            descripcion:
              "Elige el tipo de genio que es tu patrón: Dao (tierra, daño contundente), Djinni (aire, daño de trueno), Efreeti (fuego, daño de fuego), Marid (agua, daño de frío). Esto determina conjuros extra y tipo de daño.",
            elecciones: [
              {
                id: "tipo_genio",
                nombre: "Tipo de Genio",
                instruccion: "Elige el tipo de genio que es tu patrón:",
                tipo: "single",
                opciones: [
                  { id: "dao", nombre: "Dao", descripcion: "Tierra. Daño contundente. Conjuros: Santuario, Picos de piedra..." },
                  { id: "djinni", nombre: "Djinni", descripcion: "Aire. Daño de trueno. Conjuros: Onda atronadora, Viento protector..." },
                  { id: "efreeti", nombre: "Efreeti", descripcion: "Fuego. Daño de fuego. Conjuros: Manos Ardientes, Esfera Ardiente..." },
                  { id: "marid", nombre: "Marid", descripcion: "Agua. Daño de frío. Conjuros: Niebla, Difuminar..." },
                ],
              },
            ],
          },
          {
            nombre: "Recipiente del Genio",
            descripcion:
              "Tu patrón te da un recipiente mágico (anillo, lámpara, etc.). Puedes entrar en él como acción (espacio dentro = radio 6 m). Puedes permanecer dentro un número de horas = 2 × bon. de competencia. Sales como acción adicional. Mientras estés dentro, puedes oír el exterior.",
          },
          {
            nombre: "Ira del Genio",
            descripcion:
              "Una vez por turno, cuando impactas con un ataque, infliges daño extra del tipo de tu genio igual a tu bon. de competencia.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Bienestar Elemental",
            descripcion:
              "Cuando terminas un descanso largo dentro de tu recipiente, tú y hasta 5 criaturas que se unan ganan el beneficio de un descanso corto además del largo. También, puedes usar tu recipiente como foco de conjuros de brujo.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Refugio Protector",
            descripcion:
              "Como acción, puedes vincular a una criatura voluntaria a tu recipiente. Mientras está vinculada, puedes elegir: cuando la criatura recibe daño, puedes usar tu reacción para que entre en el recipiente (sale al inicio de su siguiente turno). Bon. competencia usos por descanso largo.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Deseo Limitado",
            descripcion:
              "Puedes rogar a tu patrón que te conceda un deseo menor. Como acción, puedes replicar los efectos de cualquier conjuro de nivel 6 o inferior. No necesitas componentes. Una vez cada 1d4 descansos largos.",
          },
        ],
      },
    ],
  },

  // ── El Insondable ──────────────────────────────────────────────────
  {
    subclaseId: "patron_insondable",
    claseId: "brujo",
    nombre: "El Insondable",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Conjuros Expandidos",
            descripcion:
              "Aprendes conjuros extra de tu patrón: Crear o Destruir Agua, Onda Atronadora (nv1); Ráfaga de Viento, Silencio (nv2); Relámpago, Caminar por el Agua (nv3); Control del Agua, Invocar Elemental (nv4); Cono de Frío, Paso Brumoso de Bigby (nv5).",
          },
          {
            nombre: "Tentáculo de las Profundidades",
            descripcion:
              "Como acción adicional, invocas un tentáculo espectral a 18 m que dura 1 minuto. Cuando aparece y como acción adicional en turnos posteriores puedes moverlo 9 m y atacar (1d8 de daño de frío, y reduce velocidad del objetivo 3 m). Bon. competencia usos por descanso largo.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Alma Oceánica",
            descripcion:
              "Ganas resistencia al daño de frío. Puedes respirar bajo el agua y ganas velocidad de nado de 12 m. Mientras estés submarino, tus conjuros de brujo ignoran las restricciones normales de lanzar en agua.",
          },
          {
            nombre: "Custodia de las Profundidades",
            descripcion:
              "Cuando una criatura que puedes ver recibe daño de tu Tentáculo de las Profundidades, puedes usar tu reacción para reducir el daño que esa criatura recibe de cualquier fuente en 1d8.",
          },
        ],
      },
      {
        nivel: 10,
        rasgos: [
          {
            nombre: "Tentáculo Agarrador",
            descripcion:
              "Al crear tu Tentáculo de las Profundidades, el área a 3 m se vuelve terreno difícil. Criaturas que empiecen su turno en el área: salvación de FUE o son arrastradas 3 m hacia el tentáculo y reciben 1d8 de daño de frío. El tentáculo ahora inflige 2d8.",
          },
        ],
      },
      {
        nivel: 14,
        rasgos: [
          {
            nombre: "Transporte Abisal",
            descripcion:
              "Puedes teletransportarte mágicamente hasta 9 m a un espacio desocupado que puedas ver (como acción adicional). Cuando lo haces, puedes elegir un punto dentro de 1,5 m: se convierte en terreno difícil lleno de agua durante 1 minuto. Cada criatura que entre por primera vez: 2d8 de daño de frío (salvación de FUE).",
          },
        ],
      },
    ],
  },
];
