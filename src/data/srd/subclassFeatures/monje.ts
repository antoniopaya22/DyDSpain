/**
 * Rasgos de subclase: Monje
 */

import type { SubclassFeatureData } from "./types";

export const MONJE_SUBCLASS_FEATURES: SubclassFeatureData[] = [
  // ── Camino de la Mano Abierta ──────────────────────────────────────
  {
    subclaseId: "camino_mano_abierta",
    claseId: "monje",
    nombre: "Camino de la Mano Abierta",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Técnica de la Mano Abierta",
            descripcion:
              "Cuando impactas a una criatura con un ataque de Ráfaga de Golpes, puedes imponerle uno de los siguientes efectos: debe superar una salvación de DES o queda derribada; debe superar una salvación de FUE o la empujas hasta 4,5 m; no puede usar reacciones hasta el final de tu siguiente turno.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Integralidad Corporal",
            descripcion:
              "Puedes usar tu acción para curarte a ti mismo una cantidad de PG igual a 3 × tu nivel de monje. Puedes usar este rasgo una vez por descanso largo.",
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Tranquilidad",
            descripcion:
              "Al final de un descanso largo, obtienes el efecto del conjuro Santuario (CD = 8 + mod. SAB + bon. competencia) hasta el inicio de tu siguiente descanso largo.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Palma Estremecedora",
            descripcion:
              "Cuando impactas a una criatura con un ataque sin arma, puedes gastar 3 puntos de ki para hacer vibrar su cuerpo. Al finalizar ese efecto (hasta 10 días después), reduces la criatura a 0 PG o le infliges 10d10 de daño necrótico.",
          },
        ],
      },
    ],
  },

  // ── Camino de la Sombra ────────────────────────────────────────────
  {
    subclaseId: "camino_sombra",
    claseId: "monje",
    nombre: "Camino de la Sombra",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Artes de las Sombras",
            descripcion:
              "Puedes gastar 2 puntos de ki para lanzar Oscuridad, Pasar sin Rastro, Silencio o Visión en la Oscuridad sin componentes materiales. También aprendes el truco Ilusión Menor.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Paso de Sombra",
            descripcion:
              "Cuando estés en un área de luz tenue u oscuridad, puedes usar tu acción adicional para teletransportarte hasta 18 m a otro espacio en luz tenue u oscuridad. Luego tienes ventaja en el primer ataque cuerpo a cuerpo antes del final del turno.",
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Manto de Sombras",
            descripcion:
              "Cuando estés en un área de luz tenue u oscuridad, puedes usar tu acción para volverte invisible. Permaneces invisible hasta que ataques, lances un conjuro o entres en un área de luz brillante.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Oportunista",
            descripcion:
              "Cuando una criatura a 1,5 m de ti es impactada por el ataque de otra criatura, puedes usar tu reacción para realizar un ataque cuerpo a cuerpo contra esa criatura.",
          },
        ],
      },
    ],
  },

  // ── Camino de los Cuatro Elementos ─────────────────────────────────
  {
    subclaseId: "camino_cuatro_elementos",
    claseId: "monje",
    nombre: "Camino de los Cuatro Elementos",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Discípulo de los Elementos",
            descripcion:
              "Aprendes disciplinas que aprovechan el poder de los cuatro elementos. Conoces Golpe Elemental y una disciplina adicional. Gastas puntos de ki para activar tus disciplinas.",
            elecciones: [
              {
                id: "disciplina_nivel3",
                nombre: "Disciplina Elemental",
                instruccion: "Elige una disciplina elemental:",
                tipo: "single",
                opciones: [
                  {
                    id: "colmillos_serpiente",
                    nombre: "Colmillos de la Serpiente de Fuego",
                    descripcion: "Gastas 1 ki para crear látigos de fuego con alcance 3 m. Infliges 1d10 de fuego.",
                  },
                  {
                    id: "puño_trueno",
                    nombre: "Puño del Trueno Inapelable",
                    descripcion: "Gastas 2 ki para crear una onda de trueno. Criaturas a 4,5 m: salvación CON o 2d6 trueno + empujadas 3 m.",
                  },
                  {
                    id: "oleada_agua",
                    nombre: "Oleada del Río Hambriento",
                    descripcion: "Gastas 2 ki para un cono de agua de 4,5 m. DES o 3d10 contundente + derribar.",
                  },
                  {
                    id: "defensa_piedra",
                    nombre: "Presa del Viento del Norte",
                    descripcion: "Gastas 1-3 ki para lanzar Armadura de Agathys (1 nivel de conjuro por ki gastado, máx 3).",
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
            nombre: "Disciplina Adicional",
            descripcion:
              "Aprendes una disciplina elemental adicional. También puedes acceder a disciplinas de nivel superior.",
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Disciplina Avanzada",
            descripcion:
              "Aprendes una disciplina elemental adicional. Desbloqueas disciplinas de nivel aún más alto como Bola de Fuego (4 ki) o Muro de Piedra (6 ki).",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Maestro Elemental",
            descripcion:
              "Aprendes una disciplina elemental adicional. Accedes a las disciplinas más poderosas.",
          },
        ],
      },
    ],
  },

  // ── Camino de la Misericordia ──────────────────────────────────────
  {
    subclaseId: "camino_misericordia",
    claseId: "monje",
    nombre: "Camino de la Misericordia",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Implementos de la Misericordia",
            descripcion:
              "Ganas competencia con el kit de herbalista y el kit de envenenador. También ganas una máscara especial de subclase.",
          },
          {
            nombre: "Mano de la Curación",
            descripcion:
              "Cuando usas tu Ráfaga de Golpes, puedes reemplazar uno de los ataques sin arma por un toque curativo. Gastas 1 punto de ki y la criatura tocada recupera PG iguales a un dado de artes marciales + mod. SAB.",
          },
          {
            nombre: "Mano del Dolor",
            descripcion:
              "Cuando impactas con un ataque sin arma, puedes gastar 1 punto de ki para infligir daño necrótico extra igual a un dado de artes marciales + mod. SAB. Solo una vez por turno.",
          },
        ],
        competenciasGanadas: {
          herramientas: ["Kit de herbalista", "Kit de envenenador"],
        },
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Toque del Médico",
            descripcion:
              "Mano de la Curación puede también terminar una enfermedad o una de estas condiciones: cegado, ensordecido, paralizado, envenenado o aturdido.",
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Ráfaga Curativa",
            descripcion:
              "Cuando usas Mano de la Curación, puedes gastar ki adicional (hasta tu mod. de SAB) para curar dados de artes marciales adicionales por cada ki.",
          },
          {
            nombre: "Manos del Destino",
            descripcion:
              "Cuando usas Mano del Dolor y reduces a una criatura a 0 PG, puedes gastar 1 ki para darle un fallo en tirada de salvación contra muerte.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Mano del Destino Final",
            descripcion:
              "Tu Mano del Dolor se vuelve devastadora. Puedes gastar 4 ki junto con Mano del Dolor para que la criatura haga salvación de CON o reciba 2d10 de daño necrótico extra y quede envenenada y cegada.",
          },
        ],
      },
    ],
  },

  // ── Camino del Alma Solar ──────────────────────────────────────────
  {
    subclaseId: "camino_alma_solar",
    claseId: "monje",
    nombre: "Camino del Alma Solar",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Rayo del Sol Radiante",
            descripcion:
              "Puedes lanzar un rayo de luz radiante como ataque a distancia (alcance 9 m, 1d4 + mod. DES de daño radiante). Además, puedes gastar 1 ki al usar Ráfaga de Golpes para lanzar 2 rayos como ataques adicionales.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Estallido del Sol Ardiente",
            descripcion:
              "Puedes gastar 2 ki para lanzar Manos Ardientes (daño radiante en lugar de fuego). Puedes gastar ki adicional (hasta 3) para aumentar el nivel del conjuro.",
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Escudo del Sol",
            descripcion:
              "Puedes gastar 1 ki como reacción al recibir daño para reducir ese daño en 5 + tu nivel de monje. Si reduces a 0, puedes gastar 1 ki más para lanzar un rayo contra el atacante.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Sol Abrasador",
            descripcion:
              "Puedes gastar 3 ki para lanzar un orbe de luz. Criaturas en una esfera de 18 m deben hacer salvación de CON o reciben 2d6 de daño radiante y quedan cegadas 1 minuto.",
          },
        ],
      },
    ],
  },

  // ── Camino del Kensei ──────────────────────────────────────────────
  {
    subclaseId: "camino_kensei",
    claseId: "monje",
    nombre: "Camino del Kensei",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Armas Kensei",
            descripcion:
              "Elige 2 armas kensei: una cuerpo a cuerpo y una a distancia (no pueden ser pesadas ni especiales). Cuentan como armas de monje. Obtienes +2 a CA si realizas un ataque sin arma con un arma kensei cuerpo a cuerpo.",
            elecciones: [
              {
                id: "arma_kensei_cac",
                nombre: "Arma Kensei Cuerpo a Cuerpo",
                instruccion: "Elige tu arma kensei cuerpo a cuerpo:",
                tipo: "single",
                opciones: [
                  { id: "espada_larga", nombre: "Espada Larga", descripcion: "1d8 (1d10 a dos manos) cortante." },
                  { id: "espada_corta", nombre: "Espada Corta", descripcion: "1d6 cortante, ligera, finura." },
                  { id: "hacha_guerra", nombre: "Hacha de Guerra", descripcion: "1d8 (1d10 a dos manos) cortante." },
                  { id: "latigo", nombre: "Látigo", descripcion: "1d4 cortante, finura, alcance." },
                  { id: "cimitarra", nombre: "Cimitarra", descripcion: "1d6 cortante, ligera, finura." },
                ],
              },
              {
                id: "arma_kensei_dist",
                nombre: "Arma Kensei a Distancia",
                instruccion: "Elige tu arma kensei a distancia:",
                tipo: "single",
                opciones: [
                  { id: "arco_largo", nombre: "Arco Largo", descripcion: "1d8 perforante, pesada (excepción kensei), munición, distancia (45/180 m)." },
                  { id: "arco_corto", nombre: "Arco Corto", descripcion: "1d6 perforante, munición, distancia (24/96 m)." },
                  { id: "dardo", nombre: "Dardo", descripcion: "1d4 perforante, finura, arrojadiza (6/18 m)." },
                ],
              },
            ],
          },
          {
            nombre: "Pincelada Ágil",
            descripcion:
              "Ganas competencia en un tipo de herramientas de artesano o un instrumento musical (utensilios de caligrafía/pinturas recomendado).",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Toque Kensei",
            descripcion:
              "Tus ataques con armas kensei cuentan como mágicos. Cuando impactas con un arma kensei, puedes gastar 1 ki para infligir un dado de artes marciales de daño extra.",
          },
          {
            nombre: "Hábil Arquero",
            descripcion:
              "Como acción adicional, puedes dar a tus ataques a distancia con armas kensei un bonificador de +2 a las tiradas de daño en ese turno.",
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Afilado como el Viento",
            descripcion:
              "Cuando realizas un ataque sin arma como acción adicional, puedes gastar 1 ki para hacer que ese ataque sea a distancia (alcance 9 m). Si impactas, inflige daño extra igual a tu dado de artes marciales.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Precisión Infalible",
            descripcion:
              "Cuando fallas un ataque con un arma de monje, puedes tirar de nuevo la tirada de ataque (no la de daño). Una vez por turno.",
          },
        ],
      },
    ],
  },

  // ── Camino del Asceta ──────────────────────────────────────────────
  {
    subclaseId: "camino_asceta",
    claseId: "monje",
    nombre: "Camino del Asceta",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Restricciones del Asceta",
            descripcion:
              "Estableces un voto personal de restricción. Mientras lo mantengas, ganas ki adicional al inicio de tu turno en combate (1 ki por turno).",
          },
          {
            nombre: "Golpe Penitente",
            descripcion:
              "Cuando impactas con un ataque sin arma, puedes infligirte un dado de artes marciales de daño para añadir 2 dados de artes marciales al daño del ataque.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Abstención Total",
            descripcion:
              "Cuando fallas una tirada de salvación o eres impactado por un ataque, puedes gastar 2 ki para tirar de nuevo la salvación o forzar al atacante a repetir su tirada.",
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Resistencia Irrompible",
            descripcion:
              "Cuando te reducen a 0 PG, puedes gastar 3 ki para caer a 1 PG en su lugar. Una vez por descanso largo.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Cuerpo y Alma Puros",
            descripcion:
              "Ganas resistencia a todo daño excepto fuerza mientras estés en combate y tengas al menos 1 punto de ki.",
          },
        ],
      },
    ],
  },

  // ── Camino de la Muerte Larga ──────────────────────────────────────
  {
    subclaseId: "camino_muerte_larga",
    claseId: "monje",
    nombre: "Camino de la Muerte Larga",
    niveles: [
      {
        nivel: 3,
        rasgos: [
          {
            nombre: "Toque de la Muerte",
            descripcion:
              "Cuando impactas a una criatura con un ataque sin arma, puedes gastar 1 ki para infligir daño necrótico extra igual a un dado de artes marciales. Si la criatura muere, ganas PG temporales iguales a tu mod. SAB + nivel de monje.",
          },
        ],
      },
      {
        nivel: 6,
        rasgos: [
          {
            nombre: "Hora de Necesidad",
            descripcion:
              "Puedes gastar 2 ki como acción para tomar la forma de la muerte: ganas ventaja en tiradas de Intimidación y resistencia al daño necrótico durante 10 minutos.",
          },
        ],
      },
      {
        nivel: 11,
        rasgos: [
          {
            nombre: "Maestría sobre la Muerte",
            descripcion:
              "Cuando te reducen a 0 PG, puedes gastar 1 ki (sin reacción) para caer a 1 PG en su lugar. Puedes hacerlo mientras tengas ki.",
          },
        ],
      },
      {
        nivel: 17,
        rasgos: [
          {
            nombre: "Toque del Sueño Eterno",
            descripcion:
              "Tu Toque de la Muerte se vuelve devastador. Puedes gastar 4 ki junto con un ataque sin arma para forzar una salvación de CON. Si falla, la criatura cae a 0 PG.",
          },
        ],
      },
    ],
  },
];
