/**
 * Opciones de subclase por clase para D&D 5e SRD en español.
 * Cada clase tiene una lista de subclases disponibles con su nombre,
 * breve descripción y fuente original.
 */

import type { ClassId } from "@/types/character";

// ─── Tipos ───────────────────────────────────────────────────────────

export interface SubclassOption {
  /** Identificador único (slug) */
  id: string;
  /** Nombre en español */
  nombre: string;
  /** Descripción corta (1-2 frases) */
  descripcion: string;
  /** Fuente: 'SRD', 'PHB', 'XGtE', 'TCoE', 'UA', etc. */
  fuente: string;
}

// ─── Subclases por clase ─────────────────────────────────────────────

export const SUBCLASS_OPTIONS: Record<ClassId, SubclassOption[]> = {
  // ─── BÁRBARO ───────────────────────────────────────────────────────
  barbaro: [
    {
      id: "senda_berserker",
      nombre: "Senda del Berserker",
      descripcion:
        "Canalizas tu furia en un frenesí violento e imparable. Tu rabia te permite atacar sin cesar, pero conlleva un precio de agotamiento.",
      fuente: "PHB",
    },
    {
      id: "senda_guerrero_totemico",
      nombre: "Senda del Guerrero Totémico",
      descripcion:
        "Tu furia te conecta con espíritus animales que te otorgan poderes sobrenaturales según el tótem elegido: Oso, Águila o Lobo.",
      fuente: "PHB",
    },
    {
      id: "senda_guerrero_alma",
      nombre: "Senda del Guerrero del Alma",
      descripcion:
        "Tu furia se alimenta de la energía divina. Puedes canalizar tu furia como poder sagrado para dañar enemigos y proteger aliados.",
      fuente: "XGtE",
    },
    {
      id: "senda_portador_ancestral",
      nombre: "Senda del Portador del Ancestral",
      descripcion:
        "Invocas a los espíritus de tus antepasados guerreros que luchan a tu lado, protegen a tus aliados y asedian a tus enemigos.",
      fuente: "XGtE",
    },
    {
      id: "senda_heraldo_furia",
      nombre: "Senda del Heraldo de Furia",
      descripcion:
        "Tu furia genera un aura elemental de tormenta que daña a tus enemigos cercanos. Elige entre Desierto, Mar o Tundra.",
      fuente: "XGtE",
    },
    {
      id: "senda_bestia",
      nombre: "Senda de la Bestia",
      descripcion:
        "Tu furia desata la bestia interior, transformando tu cuerpo con garras, mordisco o cola como armas naturales.",
      fuente: "TCoE",
    },
    {
      id: "senda_magia_salvaje",
      nombre: "Senda de la Magia Salvaje",
      descripcion:
        "Tu furia genera surges de magia caótica con efectos aleatorios que pueden beneficiarte a ti y a tus aliados.",
      fuente: "TCoE",
    },
    {
      id: "senda_guardian_salvaje",
      nombre: "Senda del Guardián Salvaje",
      descripcion:
        "Canalizas la furia de la naturaleza, conectándote con espíritus salvajes que potencian tus instintos y tu cuerpo.",
      fuente: "UA",
    },
  ],

  // ─── BARDO ─────────────────────────────────────────────────────────
  bardo: [
    {
      id: "colegio_conocimiento",
      nombre: "Colegio del Conocimiento",
      descripcion:
        "Recoges conocimiento de casi cualquier fuente. Tu saber y tus palabras cortantes inspiran y desmoralizan a partes iguales.",
      fuente: "PHB",
    },
    {
      id: "colegio_valor",
      nombre: "Colegio del Valor",
      descripcion:
        "Inspiras a otros con actos heroicos. Ganas competencia en armaduras medias, escudos y armas marciales.",
      fuente: "PHB",
    },
    {
      id: "colegio_espadas",
      nombre: "Colegio de las Espadas",
      descripcion:
        "Combinas el arte escénico con la destreza marcial, usando florituras de combate como extensión de tu actuación.",
      fuente: "XGtE",
    },
    {
      id: "colegio_glamour",
      nombre: "Colegio del Glamour",
      descripcion:
        "Canalizas la belleza sobrenatural de las hadas para fascinar, encantar y cautivar a quienes te rodean.",
      fuente: "XGtE",
    },
    {
      id: "colegio_elocuencia",
      nombre: "Colegio de la Elocuencia",
      descripcion:
        "Dominas las palabras con tal maestría que tu retórica puede persuadir, conmover y desarmar cualquier resistencia.",
      fuente: "TCoE",
    },
    {
      id: "colegio_lamentos",
      nombre: "Colegio de los Lamentos",
      descripcion:
        "Usas el miedo, los secretos y la manipulación psicológica como armas, ocultando un veneno emocional tras melodías encantadoras.",
      fuente: "XGtE",
    },
    {
      id: "colegio_creacion",
      nombre: "Colegio de la Creación",
      descripcion:
        "Crees que el cosmos fue cantado a la existencia. Tu música puede traer objetos y maravillas al mundo.",
      fuente: "TCoE",
    },
    {
      id: "colegio_espiritu",
      nombre: "Colegio del Espíritu",
      descripcion:
        "Canalizas las historias de los héroes caídos. Cuando narras tus cuentos, las leyendas cobran vida a tu alrededor.",
      fuente: "VRGtR",
    },
  ],

  // ─── BRUJO ─────────────────────────────────────────────────────────
  brujo: [
    {
      id: "patron_infernal",
      nombre: "El Infernal",
      descripcion:
        "Has hecho un pacto con un señor infernal. Ganas poder para castigar y destruir con fuego y fuerza oscura.",
      fuente: "PHB",
    },
    {
      id: "patron_feerico",
      nombre: "El Feérico",
      descripcion:
        "Tu patrón es un señor feérico que te otorga el poder de fascinar, encantar y engañar a otros seres.",
      fuente: "PHB",
    },
    {
      id: "patron_gran_antiguo",
      nombre: "El Gran Antiguo",
      descripcion:
        "Tu patrón es una entidad incomprensible del más allá. Obtienes poder telepático y la capacidad de doblegar mentes.",
      fuente: "PHB",
    },
    {
      id: "patron_celestial",
      nombre: "El Celestial",
      descripcion:
        "Tu patrón es un ser celestial que te otorga poderes curativos y de protección junto con fuego sagrado.",
      fuente: "XGtE",
    },
    {
      id: "patron_hexblade",
      nombre: "El Hexblade",
      descripcion:
        "Tu patrón se manifiesta a través de un arma maldita. Puedes usar Carisma para ataques y maldecir a tus enemigos.",
      fuente: "XGtE",
    },
    {
      id: "patron_genio",
      nombre: "El Genio",
      descripcion:
        "Tu patrón es un genio elemental. Ganas un refugio especial y poderes vinculados al elemento de tu genio.",
      fuente: "TCoE",
    },
    {
      id: "patron_insondable",
      nombre: "El Insondable",
      descripcion:
        "Tu patrón es una entidad de las profundidades oceánicas, otorgándote poder sobre el agua y las criaturas marinas.",
      fuente: "TCoE",
    },
  ],

  // ─── CLÉRIGO ───────────────────────────────────────────────────────
  clerigo: [
    {
      id: "dominio_vida",
      nombre: "Dominio de la Vida",
      descripcion:
        "Te especializas en curación y protección divina. Tus conjuros curativos son más potentes y puedes restaurar más PG.",
      fuente: "PHB",
    },
    {
      id: "dominio_luz",
      nombre: "Dominio de la Luz",
      descripcion:
        "Canalizas el poder de la luz sagrada para deslumbrar, quemar e iluminar contra las fuerzas de la oscuridad.",
      fuente: "PHB",
    },
    {
      id: "dominio_guerra",
      nombre: "Dominio de la Guerra",
      descripcion:
        "Eres un campeón divino en el campo de batalla. Ganas competencia en armas marciales y armaduras pesadas.",
      fuente: "PHB",
    },
    {
      id: "dominio_conocimiento",
      nombre: "Dominio del Conocimiento",
      descripcion:
        "Tu deidad valora el saber. Aprendes idiomas adicionales y puedes acceder a conocimiento oculto a través de la fe.",
      fuente: "PHB",
    },
    {
      id: "dominio_naturaleza",
      nombre: "Dominio de la Naturaleza",
      descripcion:
        "Sirves a una deidad de la naturaleza, obteniendo poder sobre plantas, animales y los elementos naturales.",
      fuente: "PHB",
    },
    {
      id: "dominio_tempestad",
      nombre: "Dominio de la Tempestad",
      descripcion:
        "Dominas el poder de las tormentas. Puedes castigar a quienes te atacan con relámpagos y truenos divinos.",
      fuente: "PHB",
    },
    {
      id: "dominio_engano",
      nombre: "Dominio del Engaño",
      descripcion:
        "Tu deidad favorece la astucia y la ilusión. Puedes crear duplicados ilusorios y mejorar tu sigilo y engaño.",
      fuente: "PHB",
    },
    {
      id: "dominio_forja",
      nombre: "Dominio de la Forja",
      descripcion:
        "Canalizas el poder de la creación divina. Puedes bendecir armas y armaduras con magia sagrada.",
      fuente: "XGtE",
    },
    {
      id: "dominio_tumba",
      nombre: "Dominio de la Tumba",
      descripcion:
        "Vigilas el límite entre la vida y la muerte. Tienes poder sobre los no muertos y puedes proteger contra la muerte.",
      fuente: "XGtE",
    },
    {
      id: "dominio_orden",
      nombre: "Dominio del Orden",
      descripcion:
        "Representas la ley divina. Puedes comandar a otros para actuar en tu nombre y castigar a quienes desafían el orden.",
      fuente: "TCoE",
    },
    {
      id: "dominio_paz",
      nombre: "Dominio de la Paz",
      descripcion:
        "Tu fe promueve la armonía y la unión. Puedes crear vínculos entre aliados que comparten resistencia y fuerza.",
      fuente: "TCoE",
    },
    {
      id: "dominio_crepusculo",
      nombre: "Dominio del Crepúsculo",
      descripcion:
        "Habitas el límite entre la luz y la oscuridad, otorgando visión en la oscuridad y refugio crepuscular a tus aliados.",
      fuente: "TCoE",
    },
  ],

  // ─── DRUIDA ────────────────────────────────────────────────────────
  druida: [
    {
      id: "circulo_tierra",
      nombre: "Círculo de la Tierra",
      descripcion:
        "Tu magia está ligada a un terreno concreto que te otorga conjuros adicionales y recuperación arcana.",
      fuente: "PHB",
    },
    {
      id: "circulo_luna",
      nombre: "Círculo de la Luna",
      descripcion:
        "Te especializas en la Forma Salvaje. Puedes transformarte en bestias más poderosas y luchar eficazmente en forma animal.",
      fuente: "PHB",
    },
    {
      id: "circulo_suenos",
      nombre: "Círculo de los Sueños",
      descripcion:
        "Tienes una conexión profunda con los dominios feéricos. Tu magia cura, protege y permite viajar entre planos.",
      fuente: "XGtE",
    },
    {
      id: "circulo_pastor",
      nombre: "Círculo del Pastor",
      descripcion:
        "Te especializas en invocar espíritus de la naturaleza y proteger a las criaturas con las que te vinculas.",
      fuente: "XGtE",
    },
    {
      id: "circulo_esporas",
      nombre: "Círculo de las Esporas",
      descripcion:
        "Encuentras belleza en la descomposición. Usas esporas y necrosis como armas y puedes animar a los muertos.",
      fuente: "TCoE",
    },
    {
      id: "circulo_estrellas",
      nombre: "Círculo de las Estrellas",
      descripcion:
        "Lees los astros y canalizas su poder. Puedes adoptar formas estelares que potencian tu magia y percepciones.",
      fuente: "TCoE",
    },
    {
      id: "circulo_llama",
      nombre: "Círculo de la Llama",
      descripcion:
        "Dominas la dualidad del fuego: tanto su poder destructivo como su capacidad creadora y purificadora.",
      fuente: "TCoE",
    },
  ],

  // ─── EXPLORADOR ────────────────────────────────────────────────────
  explorador: [
    {
      id: "cazador",
      nombre: "Cazador",
      descripcion:
        "Aceptas el desafío de proteger la civilización contra las amenazas más peligrosas de la naturaleza.",
      fuente: "PHB",
    },
    {
      id: "senor_bestias",
      nombre: "Señor de las Bestias",
      descripcion:
        "Estableces un vínculo extraordinario con un compañero animal que lucha y explora a tu lado.",
      fuente: "PHB",
    },
    {
      id: "acechador_horizonte",
      nombre: "Acechador del Horizonte",
      descripcion:
        "Proteges el mundo material de las amenazas extraplanares, viajando entre planos para cazar invasores.",
      fuente: "XGtE",
    },
    {
      id: "asesino_monstruos",
      nombre: "Asesino de Monstruos",
      descripcion:
        "Te especializas en cazar monstruos poderosos. Tu magia y tácticas están optimizadas para criaturas únicas.",
      fuente: "XGtE",
    },
    {
      id: "errante_feerico",
      nombre: "Errante Feérico",
      descripcion:
        "Has forjado un vínculo con las fuerzas feéricas que te permite manipular la magia de los dominios encantados.",
      fuente: "TCoE",
    },
    {
      id: "caminante_enjambre",
      nombre: "Caminante del Enjambre",
      descripcion:
        "Te rodeas de un enjambre de espíritus que puedes comandar para atacar, defender y explorar.",
      fuente: "TCoE",
    },
    {
      id: "drakewarden",
      nombre: "Guardián Dracónico",
      descripcion:
        "Estableciste un vínculo con un drake que crece y evoluciona contigo, luchando a tu lado en batalla.",
      fuente: "FToD",
    },
  ],

  // ─── GUERRERO ──────────────────────────────────────────────────────
  guerrero: [
    {
      id: "campeon",
      nombre: "Campeón",
      descripcion:
        "Excelencia en el combate puro. Amplías tu rango de golpe crítico y ganas resistencia atlética superior.",
      fuente: "PHB",
    },
    {
      id: "maestro_batalla",
      nombre: "Maestro de Batalla",
      descripcion:
        "Empleas maniobras tácticas especiales con dados de superioridad para controlar el campo de batalla.",
      fuente: "PHB",
    },
    {
      id: "caballero_sobrenatural",
      nombre: "Caballero Sobrenatural",
      descripcion:
        "Complementas tu maestría marcial con conjuros arcanos, combinando espada y hechicería.",
      fuente: "PHB",
    },
    {
      id: "samurai",
      nombre: "Samurái",
      descripcion:
        "Tu espíritu inquebrantable te permite luchar con una determinación que te otorga ventaja en ataques y resistencia mental.",
      fuente: "XGtE",
    },
    {
      id: "caballero_arcano",
      nombre: "Caballero Arcano",
      descripcion:
        "Complementas tu destreza marcial con los conjuros del mago, especializándote en abjuración y evocación.",
      fuente: "PHB",
    },
    {
      id: "psi_warrior",
      nombre: "Guerrero Psiónico",
      descripcion:
        "Usas poder psiónico para escudarte, golpear con fuerza mental y mover objetos con la mente.",
      fuente: "TCoE",
    },
    {
      id: "rune_knight",
      nombre: "Caballero de las Runas",
      descripcion:
        "Inscribes runas mágicas de gigantes en tu equipo, otorgándote poderes sobrenaturales y habilidad para crecer en tamaño.",
      fuente: "TCoE",
    },
  ],

  // ─── HECHICERO ─────────────────────────────────────────────────────
  hechicero: [
    {
      id: "linaje_draconico",
      nombre: "Linaje Dracónico",
      descripcion:
        "Tu poder innato proviene de un ancestro dragón. Ganas resistencia al daño de su tipo y alas dracónicas a niveles altos.",
      fuente: "PHB",
    },
    {
      id: "magia_salvaje",
      nombre: "Magia Salvaje",
      descripcion:
        "Tu magia es caótica e impredecible. Los surges de magia salvaje pueden tener efectos aleatorios, beneficiosos o peligrosos.",
      fuente: "PHB",
    },
    {
      id: "alma_divina",
      nombre: "Alma Divina",
      descripcion:
        "Una chispa divina alimenta tu magia. Puedes acceder a conjuros de clérigo además de los de hechicero.",
      fuente: "XGtE",
    },
    {
      id: "alma_relojeria",
      nombre: "Alma de Relojería",
      descripcion:
        "Tu poder proviene de Mecanus, el plano del orden. Tu magia tiende a restaurar el equilibrio y la armonía.",
      fuente: "TCoE",
    },
    {
      id: "mente_aberrante",
      nombre: "Mente Aberrante",
      descripcion:
        "Tu magia se origina en el Lejano Reino. Ganas poderes telepáticos y la capacidad de doblegar la realidad.",
      fuente: "TCoE",
    },
    {
      id: "tormenta_tempestuosa",
      nombre: "Tormenta Tempestuosa",
      descripcion:
        "El poder de las tormentas fluye por tus venas. Puedes volar brevemente y dañar a enemigos cercanos con rayos.",
      fuente: "XGtE",
    },
    {
      id: "alma_sombras",
      nombre: "Alma de las Sombras",
      descripcion:
        "Tu poder procede del Shadowfell. Te rodeas de oscuridad y puedes invocar un sabueso de sombras.",
      fuente: "XGtE",
    },
  ],

  // ─── MAGO ──────────────────────────────────────────────────────────
  mago: [
    {
      id: "escuela_abjuracion",
      nombre: "Escuela de Abjuración",
      descripcion:
        "Te especializas en magia protectora. Creas escudos arcanos que te protegen a ti y a tus aliados.",
      fuente: "PHB",
    },
    {
      id: "escuela_conjuracion",
      nombre: "Escuela de Conjuración",
      descripcion:
        "Dominas la invocación de criaturas y objetos. Puedes teletransportarte y crear cosas de la nada.",
      fuente: "PHB",
    },
    {
      id: "escuela_adivinacion",
      nombre: "Escuela de Adivinación",
      descripcion:
        "Percibes el futuro y lo oculto. Puedes cambiar tiradas de dado con tus visiones proféticas (Portento).",
      fuente: "PHB",
    },
    {
      id: "escuela_encantamiento",
      nombre: "Escuela de Encantamiento",
      descripcion:
        "Manipulas mentes y emociones. Tus hechizos de encantamiento son más poderosos y difíciles de resistir.",
      fuente: "PHB",
    },
    {
      id: "escuela_evocacion",
      nombre: "Escuela de Evocación",
      descripcion:
        "Dominas la energía destructiva pura. Tus hechizos de daño son más potentes y puedes proteger a tus aliados.",
      fuente: "PHB",
    },
    {
      id: "escuela_ilusion",
      nombre: "Escuela de Ilusión",
      descripcion:
        "Creas engaños mágicos cada vez más realistas. Tus ilusiones pueden llegar a hacerse parcialmente reales.",
      fuente: "PHB",
    },
    {
      id: "escuela_nigromancia",
      nombre: "Escuela de Nigromancia",
      descripcion:
        "Manipulas las fuerzas de la vida y la muerte. Puedes drenar vitalidad y crear siervos no muertos.",
      fuente: "PHB",
    },
    {
      id: "escuela_transmutacion",
      nombre: "Escuela de Transmutación",
      descripcion:
        "Alteras la forma y propiedades de la materia. Puedes crear la Piedra del Transmutador con propiedades especiales.",
      fuente: "PHB",
    },
    {
      id: "mago_guerra",
      nombre: "Mago de Guerra",
      descripcion:
        "Combinas el combate marcial con la magia arcana. Usas una canción de espada que potencia tus ataques y defensa.",
      fuente: "TCoE",
    },
    {
      id: "cronurgista",
      nombre: "Cronurgista",
      descripcion:
        "Manipulas el flujo del tiempo. Puedes ralentizar enemigos, acelerar aliados y alterar momentos en combate.",
      fuente: "EGtW",
    },
  ],

  // ─── MONJE ─────────────────────────────────────────────────────────
  monje: [
    {
      id: "camino_mano_abierta",
      nombre: "Camino de la Mano Abierta",
      descripcion:
        "Dominas las técnicas de combate desarmado. Tus golpes pueden derribar, empujar o impedir reacciones.",
      fuente: "PHB",
    },
    {
      id: "camino_sombra",
      nombre: "Camino de la Sombra",
      descripcion:
        "Usas el ki para manipular las sombras. Puedes lanzar oscuridad, silencio y teletransportarte entre sombras.",
      fuente: "PHB",
    },
    {
      id: "camino_cuatro_elementos",
      nombre: "Camino de los Cuatro Elementos",
      descripcion:
        "Canalizas los elementos a través del ki para lanzar conjuros elementales como bolas de fuego y muros de piedra.",
      fuente: "PHB",
    },
    {
      id: "camino_misericordia",
      nombre: "Camino de la Misericordia",
      descripcion:
        "Dominas tanto el arte de curar como el de infligir dolor, manipulando la energía vital con tu ki.",
      fuente: "TCoE",
    },
    {
      id: "camino_alma_solar",
      nombre: "Camino del Alma Solar",
      descripcion:
        "Canalizas la energía radiante del sol a través de tu ki para lanzar rayos de luz y crear escudos ardientes.",
      fuente: "XGtE",
    },
    {
      id: "camino_kensei",
      nombre: "Camino del Kensei",
      descripcion:
        "Tu práctica marcial se centra en armas específicas que dominas como extensiones de tu cuerpo y tu ki.",
      fuente: "XGtE",
    },
    {
      id: "camino_asceta",
      nombre: "Camino del Asceta",
      descripcion:
        "A través de la meditación y el entrenamiento extremo alcanzas un estado de perfección física y espiritual.",
      fuente: "TCoE",
    },
    {
      id: "camino_muerte_larga",
      nombre: "Camino de la Muerte Larga",
      descripcion:
        "Estudias la muerte misma y extraes poder de ella. El miedo y la cercanía a la muerte potencian tu ki.",
      fuente: "SCAG",
    },
  ],

  // ─── PALADÍN ───────────────────────────────────────────────────────
  paladin: [
    {
      id: "juramento_entrega",
      nombre: "Juramento de Entrega",
      descripcion:
        "Dedicado a los ideales más nobles de justicia, virtud y orden. Eres un faro de esperanza y protección.",
      fuente: "PHB",
    },
    {
      id: "juramento_antiguos",
      nombre: "Juramento de los Antiguos",
      descripcion:
        "Proteges la luz y la vida contra las fuerzas de la oscuridad. Tu poder proviene de la naturaleza y las hadas.",
      fuente: "PHB",
    },
    {
      id: "juramento_venganza",
      nombre: "Juramento de Venganza",
      descripcion:
        "Juraste castigar a quienes cometieron pecados atroces. Tu furia sagrada se dirige contra el mal.",
      fuente: "PHB",
    },
    {
      id: "juramento_corona",
      nombre: "Juramento de la Corona",
      descripcion:
        "Sirves a la civilización y al orden legítimo. Tu deber es proteger a la sociedad y obedecer la ley.",
      fuente: "SCAG",
    },
    {
      id: "juramento_conquista",
      nombre: "Juramento de Conquista",
      descripcion:
        "Aplastas el caos con fuerza implacable. Tu aura de miedo y tu voluntad de hierro doblegan a tus enemigos.",
      fuente: "XGtE",
    },
    {
      id: "juramento_redencion",
      nombre: "Juramento de Redención",
      descripcion:
        "Crees que incluso los más malvados pueden redimirse. Usas la paz, la diplomacia y la misericordia antes que la espada.",
      fuente: "XGtE",
    },
    {
      id: "juramento_gloria",
      nombre: "Juramento de Gloria",
      descripcion:
        "Aspiras a las hazañas legendarias. Tu presencia inspira a aliados y tu destreza atlética es sobrenatural.",
      fuente: "TCoE",
    },
    {
      id: "juramento_centinela",
      nombre: "Juramento del Centinela",
      descripcion:
        "Tu juramento es proteger a quienes no pueden protegerse. Eres un guardián incansable contra el peligro.",
      fuente: "TCoE",
    },
  ],

  // ─── PÍCARO ────────────────────────────────────────────────────────
  picaro: [
    {
      id: "ladron",
      nombre: "Ladrón",
      descripcion:
        "Perfeccionas las artes del hurto y la infiltración. Ganas manos rápidas, habilidad para trepar y usar objetos mágicos.",
      fuente: "PHB",
    },
    {
      id: "asesino",
      nombre: "Asesino",
      descripcion:
        "Te especializas en la eliminación rápida. Ganas competencia con venenos, disfraz y daño devastador contra objetivos desprevenidos.",
      fuente: "PHB",
    },
    {
      id: "embaucador_arcano",
      nombre: "Embaucador Arcano",
      descripcion:
        "Complementas tu agilidad con conjuros de mago, focalizándote en encantamiento e ilusión para engañar y controlar.",
      fuente: "PHB",
    },
    {
      id: "espadachin",
      nombre: "Espadachín",
      descripcion:
        "Combinas encanto, agilidad y destreza con la espada. Provocas y esquivas con elegancia en combate.",
      fuente: "XGtE",
    },
    {
      id: "explorador_urbano",
      nombre: "Explorador Urbano",
      descripcion:
        "Tu habilidad se centra en el reconocimiento y la supervivencia, moviéndote rápido y reaccionando antes que nadie.",
      fuente: "XGtE",
    },
    {
      id: "inquisitivo",
      nombre: "Inquisitivo",
      descripcion:
        "Eres un maestro deductivo. Descubres mentiras, detectas trampas y analizas debilidades con un vistazo.",
      fuente: "XGtE",
    },
    {
      id: "fantasma",
      nombre: "Fantasma",
      descripcion:
        "Conectas con los espíritus de los muertos, adquiriendo habilidades y conocimientos de las almas que te rodean.",
      fuente: "TCoE",
    },
    {
      id: "espia_maestro",
      nombre: "Espía Maestro",
      descripcion:
        "Tu dominio es la guerra social. Controlas información, diriges aliados a distancia y manipulas situaciones.",
      fuente: "XGtE",
    },
    {
      id: "acechador_almas",
      nombre: "Acechador de Almas",
      descripcion:
        "Manifiestas cuchillas psiónicas de energía pura y usas poder mental para comunicarte telepáticamente.",
      fuente: "TCoE",
    },
  ],
};

// ─── Funciones auxiliares ────────────────────────────────────────────

/**
 * Obtiene las opciones de subclase disponibles para una clase.
 */
export function getSubclassOptions(classId: ClassId): SubclassOption[] {
  return SUBCLASS_OPTIONS[classId] ?? [];
}

/**
 * Busca una subclase por su ID.
 */
export function getSubclassById(
  classId: ClassId,
  subclassId: string,
): SubclassOption | undefined {
  return SUBCLASS_OPTIONS[classId]?.find((s) => s.id === subclassId);
}
