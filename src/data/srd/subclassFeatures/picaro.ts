/**
 * Rasgos de subclase: Pícaro
 */

import type { SubclassFeatureData } from "./types";

export const PICARO_SUBCLASS_FEATURES: SubclassFeatureData[] = [
  // ── Ladrón ─────────────────────────────────────────────────────────
  {
    subclaseId: "ladron",
    claseId: "picaro",
    nombre: "Ladrón",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Manos Rápidas",
            descripcion:
              "Puedes usar la acción adicional de Astucia para hacer una prueba de Destreza (Juego de Manos), usar herramientas de ladrón para desarmar trampas o abrir cerraduras, o usar la acción de Usar un Objeto.",
          },
          {
            nombre: "Trepar como un Mono",
            descripcion:
              "Obtienes velocidad de trepar igual a tu velocidad de caminar. Además, al saltar, la distancia recorrida aumenta en un número de pies igual a tu mod. DES.",
          },
        ],
      },
      {
        nivel: 9,
        rasgos: [
          {
            nombre: "Sigilo Supremo",
            descripcion:
              "Tienes ventaja en pruebas de Destreza (Sigilo) si no te mueves más de la mitad de tu velocidad en el mismo turno.",
          },
        ],
      },
      {
        nivel: 13,
        rasgos: [
          {
            nombre: "Usar Dispositivo Mágico",
            descripcion:
              "Puedes ignorar los requisitos de clase, raza y nivel para usar objetos mágicos.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Reflejos de Ladrón",
            descripcion:
              "Puedes realizar dos turnos en la primera ronda de combate. El primer turno es en tu iniciativa normal y el segundo en tu iniciativa − 10.",
          },
        ],
      },
    ],
  },

  // ── Asesino ────────────────────────────────────────────────────────
  {
    subclaseId: "asesino",
    claseId: "picaro",
    nombre: "Asesino",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Competencias Adicionales",
            descripcion:
              "Ganas competencia con el kit de disfraz y el kit de venenos.",
          },
          {
            nombre: "Asesinar",
            descripcion:
              "Tienes ventaja en tiradas de ataque contra cualquier criatura que no haya actuado aún en combate. Cualquier impacto que consigas contra una criatura sorprendida es un golpe crítico.",
          },
        ],
        competenciasGanadas: {
          herramientas: ["Kit de disfraz", "Kit de venenos"],
        },
      },
      {
        nivel: 9,
        rasgos: [
          {
            nombre: "Maestro del Engaño",
            descripcion:
              "Puedes crear identidades falsas de forma infalible. Gastas 25 po y 7 días de trabajo para establecer una identidad con documentación, conocidos y disfraz.",
          },
        ],
      },
      {
        nivel: 13,
        rasgos: [
          {
            nombre: "Impostor",
            descripcion:
              "Puedes imitar de forma infalible el habla, la escritura y el comportamiento de otra persona tras observarla al menos 3 horas.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Golpe Mortal",
            descripcion:
              "Cuando impactas a una criatura sorprendida, debe hacer una salvación de CON (CD 8 + mod. DES + bon. competencia) o recibe el doble de daño del ataque.",
          },
        ],
      },
    ],
  },

  // ── Embaucador Arcano ──────────────────────────────────────────────
  {
    subclaseId: "embaucador_arcano",
    claseId: "picaro",
    nombre: "Embaucador Arcano",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Conjuración",
            descripcion:
              "Aprendes 3 trucos: Mano de Mago (obligatorio) y 2 más de la lista de mago. Aprendes 3 conjuros de nivel 1 de las escuelas de Encantamiento o Ilusión. Inteligencia es tu característica de conjuración.",
          },
          {
            nombre: "Mano de Mago Versátil",
            descripcion:
              "Cuando lanzas Mano de Mago, puedes hacerla invisible. Además, puedes usarla para: colocar un objeto, sacarlo/meterlo en un contenedor, usar herramientas de ladrón a distancia. Puedes hacer todo esto como acción adicional.",
          },
        ],
      },
      {
        nivel: 9,
        rasgos: [
          {
            nombre: "Emboscada Mágica",
            descripcion:
              "Si estás oculto de una criatura cuando le lanzas un conjuro, tiene desventaja en su salvación contra ese conjuro en ese turno.",
          },
        ],
      },
      {
        nivel: 13,
        rasgos: [
          {
            nombre: "Embaucador Versátil",
            descripcion:
              "Ganas la capacidad de robar los efectos activos de conjuros de otros. Cuando una criatura lanza un conjuro en sí misma, puedes usar tu Mano de Mago para robarlo (salvación INT contra tu CD).",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Ladrón de Conjuros",
            descripcion:
              "Ganas la capacidad de robar conocimiento de conjuros. Cuando una criatura lanza un conjuro de nivel 1-4 que te incluya como objetivo, puedes usar tu reacción para obligarla a hacer una salvación contra tu CD. Si falla, el conjuro no tiene efecto y tú lo almacenas durante 8 horas.",
          },
        ],
      },
    ],
  },

  // ── Espadachín ─────────────────────────────────────────────────────
  {
    subclaseId: "espadachin",
    claseId: "picaro",
    nombre: "Espadachín",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Juego de Pies Elegante",
            descripcion:
              "Durante tu turno, si realizas un ataque cuerpo a cuerpo contra una criatura, esa criatura no puede hacerte ataques de oportunidad por el resto de tu turno.",
          },
          {
            nombre: "Audacia Temeraria",
            descripcion:
              "Puedes añadir tu mod. de CAR a la iniciativa. Además, no necesitas ventaja en la tirada de ataque para usar Ataque Furtivo si estás a 1,5 m del objetivo y no hay otra criatura a 1,5 m de ti.",
          },
        ],
      },
      {
        nivel: 9,
        rasgos: [
          {
            nombre: "Panache",
            descripcion:
              "Como acción, puedes hacer una prueba de Persuasión contra la Perspicacia de una criatura. Si tienes éxito y no es hostil, queda hechizada 1 minuto. Si es hostil, se enfoca en ti (desventaja atacando a otros, no puede hacer ataques de oportunidad contra otros) durante 1 minuto.",
          },
        ],
      },
      {
        nivel: 13,
        rasgos: [
          {
            nombre: "Elegancia en Combate",
            descripcion:
              "Como acción adicional, ganas ventaja en la próxima prueba de Acrobacias o Atletismo en ese turno. Puedes lanzar Mano de Mago como parte de esta acción.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Maestro Duelista",
            descripcion:
              "Cuando fallas un ataque con un arma de finura, puedes tirar de nuevo con ventaja. Una vez por turno.",
          },
        ],
      },
    ],
  },

  // ── Explorador Urbano ──────────────────────────────────────────────
  {
    subclaseId: "explorador_urbano",
    claseId: "picaro",
    nombre: "Explorador Urbano",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Oído al Suelo",
            descripcion:
              "Ganas competencia en una habilidad: Perspicacia, Investigación o Sigilo (si no la tienes). Tu bon. de competencia se dobla para pruebas de la habilidad elegida en entornos urbanos.",
          },
          {
            nombre: "Ojo del Espía",
            descripcion:
              "Puedes leer los labios de criaturas que puedas ver y que estén hablando un idioma que conozcas. Usas tu acción adicional para percibir detalles ocultos en una zona de 9 m.",
          },
        ],
      },
      {
        nivel: 9,
        rasgos: [
          {
            nombre: "Red de Contactos",
            descripcion:
              "En cualquier ciudad, puedes establecer una red de informadores si pasas 3 días. Puedes solicitar información a través de esta red (el DM determina lo que aprenden).",
          },
        ],
      },
      {
        nivel: 13,
        rasgos: [
          {
            nombre: "Sombra Urbana",
            descripcion:
              "Puedes esconderte como acción adicional incluso si estás a plena vista, siempre y cuando estés en un entorno urbano concurrido.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Maestro de la Intriga",
            descripcion:
              "Puedes usar tu Ataque Furtivo incluso contra una criatura que no esté sorprendida o flanqueada, siempre que estéis en un entorno urbano. Además, tus ataques críticos en ciudades infligen un dado extra de Ataque Furtivo.",
          },
        ],
      },
    ],
  },

  // ── Inquisitivo ────────────────────────────────────────────────────
  {
    subclaseId: "inquisitivo",
    claseId: "picaro",
    nombre: "Inquisitivo",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Oreja Atenta",
            descripcion:
              "Puedes usar una acción adicional para hacer una prueba de Percepción o Investigación. Puedes usar Perspicacia para encontrar criaturas ocultas: prueba de Perspicacia contra el Engaño de la criatura.",
          },
          {
            nombre: "Ojo Perspicaz",
            descripcion:
              "Como acción adicional, puedes usar Perspicacia contra una criatura (tu Perspicacia vs. su Engaño). Si tienes éxito, puedes usar Ataque Furtivo contra esa criatura sin necesitar ventaja durante 1 minuto.",
          },
          {
            nombre: "Ojo Insaciable",
            descripcion:
              "Cuando realizas una prueba de Perspicacia, Investigación o Percepción, puedes tratar un resultado de 7 o menos como un 8.",
          },
        ],
      },
      {
        nivel: 9,
        rasgos: [
          {
            nombre: "Ojo Firme",
            descripcion:
              "Tu mínimo en pruebas de Percepción, Investigación y Perspicacia sube a tu bon. de competencia + mod. de SAB (mín 10).",
          },
        ],
      },
      {
        nivel: 13,
        rasgos: [
          {
            nombre: "Sentido Infalible",
            descripcion:
              "Puedes percibir cuando alguien miente. Si una criatura hace una prueba de Engaño contra ti, sabes automáticamente si miente o dice la verdad.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Ojo de la Debilidad",
            descripcion:
              "Cuando usas Ojo Perspicaz y tienes éxito, el daño de tu Ataque Furtivo contra ese objetivo aumenta en 3d6.",
          },
        ],
      },
    ],
  },

  // ── Fantasma ───────────────────────────────────────────────────────
  {
    subclaseId: "fantasma",
    claseId: "picaro",
    nombre: "Fantasma",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Susurros de los Muertos",
            descripcion:
              "Cuando terminas un descanso corto o largo, puedes ganar competencia en una habilidad o herramienta de tu elección. Esta competencia dura hasta que uses esta capacidad de nuevo.",
          },
          {
            nombre: "Atisbo de la Muerte",
            descripcion:
              "Cuando matas a una criatura con un Ataque Furtivo, puedes hacer que otro objetivo a 9 m de la víctima reciba la mitad del daño del Ataque Furtivo (daño necrótico). Usos iguales a tu bon. de competencia por descanso largo.",
          },
        ],
      },
      {
        nivel: 9,
        rasgos: [
          {
            nombre: "Fichas del Más Allá",
            descripcion:
              "Cuando una vida termina a 9 m de ti, puedes crear una ficha espiritual. Mientras la llevas, tienes ventaja en tiradas de salvación contra muerte y de Constitución. Puedes tener un número igual a tu bon. de competencia.",
          },
        ],
      },
      {
        nivel: 13,
        rasgos: [
          {
            nombre: "Paseo Fantasmal",
            descripcion:
              "Como acción adicional, puedes asumir una forma espectral. Ganas velocidad de vuelo de 3 m y puedes moverte a través de criaturas y objetos (recibes 1d10 de fuerza si terminas dentro). Dura 10 minutos. Una vez por descanso largo (o gastando una ficha).",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Marca de la Muerte",
            descripcion:
              "Puedes gastar una ficha para duplicar tu daño de Ataque Furtivo contra una criatura.",
          },
        ],
      },
    ],
  },

  // ── Espía Maestro ──────────────────────────────────────────────────
  {
    subclaseId: "espia_maestro",
    claseId: "picaro",
    nombre: "Espía Maestro",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Maestro del Espionaje",
            descripcion:
              "Ganas competencia en el kit de disfraz y kit de falsificación si no las tienes. Puedes preparar identidades falsas imborrables.",
          },
          {
            nombre: "Tácticas de Espionaje",
            descripcion:
              "Puedes usar tu Acción de Esconderse como acción adicional, incluso en combate. Además, puedes comunicarte en código secreto con cualquier criatura que comparta un lenguaje contigo.",
          },
        ],
        competenciasGanadas: {
          herramientas: ["Kit de disfraz", "Kit de falsificación"],
        },
      },
      {
        nivel: 9,
        rasgos: [
          {
            nombre: "Infiltración Maestra",
            descripcion:
              "Puedes adoptar una identidad diferente durante 7 días de preparación. En esa forma, recuerdas toda información y tienes ventaja en Engaño para mantener la identidad.",
          },
        ],
      },
      {
        nivel: 13,
        rasgos: [
          {
            nombre: "Impostor Perfecto",
            descripcion:
              "Es virtualmente imposible detectar tu disfraz por medios no mágicos. Además, puedes leer los labios de cualquier criatura visible.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Red de Espías",
            descripcion:
              "Tienes una red de espías en cada ciudad importante del mundo. Puedes solicitar información y obtener resultados en 1d4 días. Además, nunca puedes ser sorprendido.",
          },
        ],
      },
    ],
  },

  // ── Acechador de Almas ─────────────────────────────────────────────
  {
    subclaseId: "acechador_almas",
    claseId: "picaro",
    nombre: "Acechador de Almas",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Cuchilla Psíquica",
            descripcion:
              "Manifiestas cuchillas de energía psiónica. Tienes dados de Energía Psiónica (d6, número = bon. competencia × 2). Cuando usas Ataque Furtivo, infliges daño psíquico extra igual al dado. Recuperas todos con descanso largo, uno con acción adicional (1/descanso corto).",
          },
          {
            nombre: "Susurro Psíquico",
            descripcion:
              "Puedes establecer comunicación telepática con una criatura a 36 m. Ambos podéis comunicaros a través del vínculo. Usos iguales al bon. de competencia por descanso largo.",
          },
        ],
      },
      {
        nivel: 9,
        rasgos: [
          {
            nombre: "Cuchillas del Alma",
            descripcion:
              "Tus cuchillas de energía psiónica ahora pueden usarse como un arma arrojadiza con alcance de 18 m. Puedes realizar ataques cuerpo a cuerpo y a distancia con ellas.",
          },
        ],
      },
      {
        nivel: 13,
        rasgos: [
          {
            nombre: "Velo Psíquico",
            descripcion:
              "Puedes hacerte invisible junto con todo lo que lleves durante 1 hora o hasta que ataques o fuerces una salvación. Usos iguales a tu bon. de competencia por descanso largo.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Desgarro Mental",
            descripcion:
              "Tras infligir daño de Ataque Furtivo, puedes forzar a la criatura a hacer salvación de SAB (CD 8 + mod. DES + bon. competencia). Si falla, queda aturdida hasta el final de tu siguiente turno. Una vez por descanso largo (o gastando 3 dados psíquicos).",
          },
        ],
      },
    ],
  },
];
