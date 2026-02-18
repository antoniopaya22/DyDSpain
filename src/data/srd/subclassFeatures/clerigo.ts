/**
 * Rasgos de subclase: Clérigo
 */

import type { SubclassFeatureData } from "./types";

export const CLERIGO_SUBCLASS_FEATURES: SubclassFeatureData[] = [
  // ── Dominio de la Vida ─────────────────────────────────────────────
  {
    subclaseId: "dominio_vida",
    claseId: "clerigo",
    nombre: "Dominio de la Vida",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Competencia con Armaduras Pesadas",
            descripcion:
              "Ganas competencia con armaduras pesadas.",
          },
          {
            nombre: "Discípulo de la Vida",
            descripcion:
              "Tus conjuros de curación son más efectivos. Cuando usas un conjuro de nivel 1 o superior para restaurar PG, el objetivo recupera PG adicionales iguales a 2 + el nivel del conjuro.",
          },
        ],
        competenciasGanadas: {
          armaduras: ["Armaduras pesadas"],
        },
      },
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Preservar la Vida",
            descripcion:
              "Como acción, restauras PG a criaturas a 9 m de ti. Distribuyes hasta 5 × tu nivel de clérigo en PG (máximo la mitad de los PG máximos de cada criatura).",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Sanador Bendito",
            descripcion:
              "Los conjuros de curación que lanzas sobre otros también te curan a ti. Recuperas 2 + el nivel del conjuro en PG cuando usas un conjuro de nivel 1+ para curar a otro.",
          },
        ],
      },
      {
        nivel: 8,
        rasgos: [
          {
            nombre: "Golpe Divino",
            descripcion:
              "Una vez por turno, puedes infligir 1d8 de daño radiante extra al impactar con un ataque de arma. Sube a 2d8 a nivel 14.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Curación Suprema",
            descripcion:
              "Cuando tires para restaurar PG con un conjuro de curación, en lugar de tirar los dados, usa el valor máximo de cada dado.",
          },
        ],
      },
    ],
  },

  // ── Dominio de la Luz ──────────────────────────────────────────────
  {
    subclaseId: "dominio_luz",
    claseId: "clerigo",
    nombre: "Dominio de la Luz",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Truco Adicional: Luz",
            descripcion:
              "Aprendes el truco Luz si no lo conocías. No cuenta para tu número máximo de trucos.",
          },
          {
            nombre: "Destello Protector",
            descripcion:
              "Cuando eres atacado por una criatura a 9 m que puedas ver, puedes usar tu reacción para imponer desventaja en la tirada de ataque con un destello de luz. Usos iguales a tu mod. de SAB por descanso largo.",
          },
        ],
      },
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Resplandor del Alba",
            descripcion:
              "Como acción, presentas tu símbolo sagrado y la oscuridad es disipada. Cada criatura hostil a 9 m: salvación de CON o 2d10 + nivel de clérigo de daño radiante, mitad si tiene éxito. También disipa oscuridad mágica de nivel igual o menor a tu espacio de conjuro.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Destello Mejorado",
            descripcion:
              "Puedes usar Destello Protector cuando una criatura a 9 m que puedas ver ataca a alguien que no seas tú.",
          },
        ],
      },
      {
        nivel: 8,
        rasgos: [
          {
            nombre: "Golpe Potente (Radiante)",
            descripcion:
              "Añades tu mod. de SAB al daño de trucos de clérigo. Al nivel 14, inflinges 1d8 de daño radiante extra.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Corona de Luz",
            descripcion:
              "Puedes usar tu acción para activar un aura de luz solar con radio 18 m. Dura 1 minuto y emite luz brillante 18 m y tenue otros 18 m. Los enemigos en la luz brillante tienen desventaja en salvaciones contra conjuros que inflijan daño de fuego o radiante.",
          },
        ],
      },
    ],
  },

  // ── Dominio de la Guerra ───────────────────────────────────────────
  {
    subclaseId: "dominio_guerra",
    claseId: "clerigo",
    nombre: "Dominio de la Guerra",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Competencias Adicionales",
            descripcion:
              "Ganas competencia con armadura pesada y armas marciales.",
          },
          {
            nombre: "Sacerdote Guerrero",
            descripcion:
              "Cuando usas la acción de Atacar, puedes realizar un ataque con arma como acción adicional. Usos iguales a tu mod. de SAB por descanso largo.",
          },
        ],
        competenciasGanadas: {
          armaduras: ["Armaduras pesadas"],
          armas: ["Armas marciales"],
        },
      },
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Golpe Guiado",
            descripcion:
              "Cuando haces una tirada de ataque, puedes usar Canalizar Divinidad para ganar +10 al resultado. Lo decides después de ver la tirada pero antes de saber si impacta.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Bendición del Dios de la Guerra",
            descripcion:
              "Cuando una criatura a 9 m realiza una tirada de ataque, puedes usar tu reacción y Canalizar Divinidad para darle +10 al resultado.",
          },
        ],
      },
      {
        nivel: 8,
        rasgos: [
          {
            nombre: "Golpe Divino",
            descripcion:
              "Una vez por turno, al impactar con un arma, infliges 1d8 de daño extra del mismo tipo. Al nivel 14, 2d8.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Avatar de Batalla",
            descripcion:
              "Ganas resistencia a daño contundente, perforante y cortante de ataques no mágicos.",
          },
        ],
      },
    ],
  },

  // ── Dominio del Conocimiento ───────────────────────────────────────
  {
    subclaseId: "dominio_conocimiento",
    claseId: "clerigo",
    nombre: "Dominio del Conocimiento",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Bendiciones del Conocimiento",
            descripcion:
              "Aprendes dos idiomas adicionales. Ganas competencia en dos de estas habilidades: Arcano, Historia, Naturaleza o Religión. Tu bon. de competencia se dobla en pruebas con esas habilidades.",
          },
        ],
        habilidadesExtra: {
          cantidad: 2,
          entre: ["Arcano", "Historia", "Naturaleza", "Religión"],
        },
      },
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Comprensión del Conocimiento",
            descripcion:
              "Como acción, elige una habilidad o herramienta. Durante 10 minutos, tienes competencia con ella.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Leer Pensamientos",
            descripcion:
              "Puedes leer los pensamientos superficiales de una criatura (salvación de SAB). Si falla, puedes lanzar Sugestión sin gastar espacio de conjuro.",
          },
        ],
      },
      {
        nivel: 8,
        rasgos: [
          {
            nombre: "Golpe Potente",
            descripcion:
              "Añades tu mod. de SAB al daño de trucos de clérigo.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Visiones del Pasado",
            descripcion:
              "Puedes meditar para recibir visiones del pasado de un objeto o zona. Objeto: visión de su dueño anterior. Zona: visión de un evento reciente significativo. Una vez por descanso corto.",
          },
        ],
      },
    ],
  },

  // ── Dominio de la Naturaleza ───────────────────────────────────────
  {
    subclaseId: "dominio_naturaleza",
    claseId: "clerigo",
    nombre: "Dominio de la Naturaleza",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Acólito de la Naturaleza",
            descripcion:
              "Aprendes un truco de druida (cuenta como truco de clérigo). Ganas competencia en una habilidad: Trato con Animales, Naturaleza o Supervivencia.",
          },
          {
            nombre: "Competencia con Armadura Pesada",
            descripcion: "Ganas competencia con armadura pesada.",
          },
        ],
        competenciasGanadas: {
          armaduras: ["Armaduras pesadas"],
        },
      },
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Encantar Animales y Plantas",
            descripcion:
              "Como acción, cada bestia y planta a 9 m debe hacer salvación de SAB o queda hechizada 1 minuto (velocidad 0, incapacitada).",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Amortiguar Elementos",
            descripcion:
              "Cuando tú o una criatura a 9 m recibe daño de ácido, frío, fuego, rayo o trueno, puedes usar tu reacción para dar resistencia a ese daño.",
          },
        ],
      },
      {
        nivel: 8,
        rasgos: [
          {
            nombre: "Golpe Divino",
            descripcion:
              "Una vez por turno, al impactar con un arma, infliges 1d8 de daño extra de frío, fuego o rayo (tú eliges). Al nivel 14, 2d8.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Maestro de la Naturaleza",
            descripcion:
              "Ganas la capacidad de ordenar a bestias y plantas. Como acción adicional, mientras criaturas estén hechizadas por tu Encantar Animales y Plantas, puedes ordenarles qué hacer en su siguiente turno.",
          },
        ],
      },
    ],
  },

  // ── Dominio de la Tempestad ────────────────────────────────────────
  {
    subclaseId: "dominio_tempestad",
    claseId: "clerigo",
    nombre: "Dominio de la Tempestad",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Competencias Adicionales",
            descripcion:
              "Ganas competencia con armadura pesada y armas marciales.",
          },
          {
            nombre: "Ira de la Tormenta",
            descripcion:
              "Cuando una criatura a 1,5 m que puedas ver te impacta, puedes usar tu reacción para infligir 2d8 de daño de rayo o trueno. Usos iguales a tu mod. de SAB por descanso largo.",
          },
        ],
        competenciasGanadas: {
          armaduras: ["Armaduras pesadas"],
          armas: ["Armas marciales"],
        },
      },
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Furia Destructora",
            descripcion:
              "Cuando tires daño de rayo o trueno, puedes usar Canalizar Divinidad para infligir el máximo en lugar de tirar dados.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Portador del Trueno",
            descripcion:
              "Cuando infliges daño de rayo a una criatura Grande o menor, también puedes empujarla hasta 3 m.",
          },
        ],
      },
      {
        nivel: 8,
        rasgos: [
          {
            nombre: "Golpe Divino",
            descripcion:
              "Una vez por turno, al impactar con un arma, infliges 1d8 de daño de trueno extra. Al nivel 14, 2d8.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Nacido de la Tormenta",
            descripcion:
              "Ganas velocidad de vuelo igual a tu velocidad de caminar siempre que no estés bajo tierra ni en interior.",
          },
        ],
      },
    ],
  },

  // ── Dominio del Engaño ─────────────────────────────────────────────
  {
    subclaseId: "dominio_engano",
    claseId: "clerigo",
    nombre: "Dominio del Engaño",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Bendición del Embaucador",
            descripcion:
              "Puedes usar tu acción para tocar a una criatura voluntaria (no tú) y darle ventaja en pruebas de Engaño y Sigilo durante 1 hora o hasta que uses esta capacidad de nuevo.",
          },
        ],
      },
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Invocar Duplicado",
            descripcion:
              "Como acción, creas una copia ilusoria de ti mismo a 9 m que dura 1 minuto (o hasta pérdida de concentración). Puedes moverla 9 m como acción adicional. Puedes lanzar conjuros como si estuvieras en la posición de la ilusión.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Manto de Sombras",
            descripcion:
              "Como acción, te vuelves invisible hasta el final de tu siguiente turno o hasta que ataques o lances un conjuro.",
          },
        ],
      },
      {
        nivel: 8,
        rasgos: [
          {
            nombre: "Golpe Divino (Veneno)",
            descripcion:
              "Una vez por turno, al impactar con un arma, infliges 1d8 de daño de veneno extra. Al nivel 14, 2d8.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Duplicado Mejorado",
            descripcion:
              "Tu Invocar Duplicado ahora crea 4 copias en lugar de una. Puedes moverlas independientemente.",
          },
        ],
      },
    ],
  },

  // ── Dominio de la Forja ────────────────────────────────────────────
  {
    subclaseId: "dominio_forja",
    claseId: "clerigo",
    nombre: "Dominio de la Forja",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Competencias Adicionales",
            descripcion:
              "Ganas competencia con armadura pesada y herramientas de herrero.",
          },
          {
            nombre: "Bendición de la Forja",
            descripcion:
              "Al final de un descanso largo, puedes encantar un arma o armadura no mágica para darle +1. El bonificador dura hasta tu siguiente descanso largo.",
          },
        ],
        competenciasGanadas: {
          armaduras: ["Armaduras pesadas"],
          herramientas: ["Herramientas de herrero"],
        },
      },
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Bendición del Artesano",
            descripcion:
              "Realizas un ritual de 1 hora para crear un objeto no mágico (debe incluir metal): armadura, arma simple, 10 municiones, herrería o un objeto metálico del PHB. Se materializa al final del ritual.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Alma de la Forja",
            descripcion:
              "Ganas resistencia al daño de fuego. Mientras lleves armadura pesada, ganas +1 a la CA.",
          },
        ],
      },
      {
        nivel: 8,
        rasgos: [
          {
            nombre: "Golpe Divino (Fuego)",
            descripcion:
              "Una vez por turno, al impactar con un arma, infliges 1d8 de daño de fuego extra. Al nivel 14, 2d8.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Santo de la Forja y el Fuego",
            descripcion:
              "Ganas inmunidad al daño de fuego. Mientras lleves armadura pesada, ganas resistencia al daño contundente, perforante y cortante de ataques no mágicos.",
          },
        ],
      },
    ],
  },

  // ── Dominio de la Tumba ────────────────────────────────────────────
  {
    subclaseId: "dominio_tumba",
    claseId: "clerigo",
    nombre: "Dominio de la Tumba",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Truco Adicional: Toque Helado",
            descripcion:
              "Aprendes el truco Toque Helado (cuenta como truco de clérigo).",
          },
          {
            nombre: "Ojos de la Tumba",
            descripcion:
              "Puedes detectar no-muertos a 18 m. Como acción, detectas la ubicación de cada no-muerto que no esté tras cobertura total. Este sentido no indica el tipo. Usos iguales a tu mod. de SAB por descanso largo.",
          },
          {
            nombre: "Círculo de Mortalidad",
            descripcion:
              "Tus conjuros de curación son más efectivos en criaturas a 0 PG: usa el máximo de cada dado en lugar de tirar. Además, aprendes Piedad como truco (no cuenta para tu límite).",
          },
        ],
      },
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Camino al Interior",
            descripcion:
              "Como acción, apuntas a una criatura a 9 m. Si es maldita o dañada por no-muertos, puedes usar Canalizar Divinidad para darle vulnerabilidad al próximo ataque hasta el inicio de tu siguiente turno (no funciona contra no-muertos o constructos).",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Centinela ante la Puerta",
            descripcion:
              "Puedes sentir cuando una criatura a 9 m debe hacer una tirada de salvación contra muerte. Puedes usar Canalizar Divinidad para darle un éxito automático.",
          },
        ],
      },
      {
        nivel: 8,
        rasgos: [
          {
            nombre: "Golpe Potente (Necrótico)",
            descripcion:
              "Añades tu mod. de SAB al daño de trucos de clérigo (daño necrótico).",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Guardián de las Almas",
            descripcion:
              "Cuando una criatura a 9 m recupera PG, puedes darle PG adicionales iguales a tu nivel de clérigo. Una vez por turno.",
          },
        ],
      },
    ],
  },

  // ── Dominio del Orden ──────────────────────────────────────────────
  {
    subclaseId: "dominio_orden",
    claseId: "clerigo",
    nombre: "Dominio del Orden",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Competencias Adicionales",
            descripcion:
              "Ganas competencia con armadura pesada e Intimidación o Persuasión.",
          },
          {
            nombre: "Voz de la Autoridad",
            descripcion:
              "Cuando lanzas un conjuro de nivel 1 o superior en un aliado, esa criatura puede usar su reacción para realizar un ataque con arma (contra un objetivo de tu elección que puedas ver).",
          },
        ],
        competenciasGanadas: {
          armaduras: ["Armaduras pesadas"],
        },
      },
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Demanda del Orden",
            descripcion:
              "Como acción, cada criatura de tu elección a 9 m que pueda oírte: salvación de SAB o queda hechizada hasta el final de tu siguiente turno o recibe daño. En tu siguiente turno, como acción adicional, ordenas a las criaturas hechizadas que se muevan.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Encarnación del Derecho",
            descripcion:
              "Si lanzas un conjuro de encantamiento de nivel 1+ en una criatura, puedes infligir 2d8 de daño psíquico a una criatura que puedas ver dentro de la primera. Usos iguales a tu mod. de SAB por descanso largo.",
          },
        ],
      },
      {
        nivel: 8,
        rasgos: [
          {
            nombre: "Golpe Divino (Psíquico)",
            descripcion:
              "Una vez por turno, al impactar con un arma, infliges 1d8 de daño psíquico extra. Al nivel 14, 2d8.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Ira del Orden",
            descripcion:
              "Los enemigos que fallan la salvación de Demanda del Orden quedan maldecidos durante 1 minuto. Mientras maldecidos, la primera vez que sean impactados cada turno reciben 2d8 de daño psíquico.",
          },
        ],
      },
    ],
  },

  // ── Dominio de la Paz ──────────────────────────────────────────────
  {
    subclaseId: "dominio_paz",
    claseId: "clerigo",
    nombre: "Dominio de la Paz",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Implemento de la Paz",
            descripcion:
              "Ganas competencia en una de: Perspicacia, Interpretación o Persuasión.",
          },
          {
            nombre: "Vínculo de Empatía",
            descripcion:
              "Como acción, elige a un número de criaturas igual a tu bon. de competencia a 9 m (incluyéndote). Ganan 1d4 extra en una tirada de ataque, prueba de habilidad o salvación una vez por turno mientras estén a 9 m de otra criatura vinculada. Dura 10 minutos. Usos iguales a bon. de competencia por descanso largo.",
          },
        ],
      },
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Bálsamo de Paz",
            descripcion:
              "Te mueves hasta tu velocidad. Cuando te mueves a 1,5 m de una criatura aliada, puedes restaurar 2d6 + mod. SAB de PG (cada criatura solo una vez por uso).",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Vínculo Protector",
            descripcion:
              "Mientras estás vinculado a otra criatura por Vínculo de Empatía, puedes usar tu reacción cuando esa criatura recibe daño para teletransportarte a un espacio a 1,5 m de ella y recibir tú todo el daño.",
          },
        ],
      },
      {
        nivel: 8,
        rasgos: [
          {
            nombre: "Golpe Potente (Radiante)",
            descripcion:
              "Añades tu mod. de SAB al daño de trucos de clérigo (daño radiante).",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Vínculo Expansivo",
            descripcion:
              "Los beneficios de Vínculo de Empatía funcionan hasta a 18 m. Además, cuando una criatura vinculada es impactada, el vinculado puede usar tu reacción para dar resistencia a ese daño.",
          },
        ],
      },
    ],
  },

  // ── Dominio del Crepúsculo ─────────────────────────────────────────
  {
    subclaseId: "dominio_crepusculo",
    claseId: "clerigo",
    nombre: "Dominio del Crepúsculo",
    niveles: [
      {
        nivel: 1,
        rasgos: [
          {
            nombre: "Competencias Adicionales",
            descripcion:
              "Ganas competencia con armadura pesada y armas marciales.",
          },
          {
            nombre: "Ojos de la Noche",
            descripcion:
              "Ganas visión en la oscuridad a 90 m. Como acción, puedes compartirla con criaturas voluntarias a 3 m (un número = a tu mod. de SAB). Dura 1 hora.",
          },
          {
            nombre: "Bendición del Vigilante",
            descripcion:
              "Al final de un descanso largo, puedes elegir criaturas (hasta tu mod. de SAB) e incluyéndote. Cada una gana ventaja en tiradas de iniciativa.",
          },
        ],
        competenciasGanadas: {
          armaduras: ["Armaduras pesadas"],
          armas: ["Armas marciales"],
        },
      },
      {
        nivel: 2,
        rasgos: [
          {
            nombre: "Canalizar Divinidad: Santuario Crepuscular",
            descripcion:
              "Como acción, presentas tu símbolo y una esfera de luz tenue de 9 m aparece centrada en ti durante 1 minuto. Tú y aliados en la esfera ganan 1d6 + nivel de clérigo de PG temporales al final de cada turno, y terminan los efectos de hechizado o asustado.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Pasos del Valiente",
            descripcion:
              "Tú y aliados dentro de tu Santuario Crepuscular ganan cobertura a media contra quienes estén fuera de la esfera.",
          },
        ],
      },
      {
        nivel: 8,
        rasgos: [
          {
            nombre: "Golpe Divino (Radiante)",
            descripcion:
              "Una vez por turno, al impactar con un arma, infliges 1d8 de daño radiante extra. Al nivel 14, 2d8.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Velo del Crepúsculo",
            descripcion:
              "La luz tenue de tu Santuario Crepuscular ahora da media cobertura. Tú y aliados en la esfera ganan velocidad de vuelo de 9 m.",
          },
        ],
      },
    ],
  },
];
