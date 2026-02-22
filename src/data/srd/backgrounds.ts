/**
 * Datos SRD de trasfondos de D&D 5e en español.
 * Incluye los 13 trasfondos del SRD con competencias, idiomas, equipo y rasgos.
 */

import type { BackgroundId, SkillKey } from "@/types/character";
import type { CustomBackgroundConfig } from "@/types/creation";
import { random } from "@/utils/providers";

// ─── Tipos de datos de trasfondo ─────────────────────────────────────

export interface BackgroundPersonality {
  traits: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
}

export interface BackgroundData {
  id: BackgroundId;
  nombre: string;
  descripcion: string;
  /** Competencias en habilidades que otorga */
  skillProficiencies: SkillKey[];
  /** Competencias con herramientas que otorga */
  toolProficiencies: string[];
  /** Opciones de herramientas a elegir (ej: "un tipo de juego") */
  toolChoices?: string[];
  toolChoiceCount?: number;
  /** Número de idiomas adicionales que otorga */
  extraLanguages: number;
  /** Equipo inicial que otorga */
  equipment: string[];
  /** Monedas de oro iniciales */
  startingGold: number;
  /** Nombre del rasgo especial del trasfondo */
  featureName: string;
  /** Descripción del rasgo especial */
  featureDescription: string;
  /** Características de personalidad sugeridas */
  personality: BackgroundPersonality;
  /** Variante del trasfondo, si existe */
  variant?: {
    nombre: string;
    descripcion: string;
  };
  /** Icono representativo (emoji) */
  icon: string;
}

// ─── Datos de trasfondos ─────────────────────────────────────────────

export const BACKGROUNDS: Record<BackgroundId, BackgroundData> = {
  // ─── ACÓLITO ───────────────────────────────────────────────────────
  acolito: {
    id: "acolito",
    nombre: "Acólito",
    descripcion:
      "Has dedicado tu vida al servicio de un templo consagrado a un dios o a un panteón concretos. Intermedias entre el reino de lo sagrado y el mundo mortal, y realizas rituales religiosos y ofreces sacrificios para que los fieles puedan ser partícipes de la presencia divina.",
    skillProficiencies: ["perspicacia", "religion"],
    toolProficiencies: [],
    extraLanguages: 2,
    equipment: [
      "Símbolo sagrado (regalo de ordenación)",
      "Devocionario o rueda de oraciones",
      "5 varas de incienso",
      "Vestiduras",
      "Muda de ropas comunes",
    ],
    startingGold: 15,
    featureName: "Refugio del Fiel",
    featureDescription:
      "Como acólito, mereces el respeto de todos aquellos que profesan tu fe y estás capacitado para celebrar las ceremonias religiosas de tu dios. Puedes esperar que tus compañeros y tú recibáis sanación y cuidados sin coste alguno en templos, santuarios u otros lugares consagrados a tu fe. Aquellos que compartan tu religión te mantendrán con un nivel de vida modesto.",
    personality: {
      traits: [
        "Idolatro a cierto héroe de mi fe, por lo que siempre pongo sus hazañas como ejemplo.",
        "Soy capaz de lograr la concordia entre los enemigos más acérrimos, empatizando con ellos en mi búsqueda constante de la paz.",
        "Veo presagios en cada suceso o acción. Los dioses intentan hablarnos, tan solo debemos escuchar.",
        "Nada puede apagar mi actitud optimista.",
        "Cito textos sagrados y proverbios, a veces erróneamente, en prácticamente cada situación.",
        "Soy tolerante (o intolerante) a otras fes y respeto (o condeno) su adoración a otros dioses.",
        "He disfrutado la comida, bebida y lujos de la alta sociedad típicos de la élite de mi templo. La vida sin comodidades me irrita.",
        "Llevo tanto tiempo en el templo que tengo muy poca experiencia práctica tratando con quienes no pertenecen a él.",
      ],
      ideals: [
        "Tradición. Las tradiciones ancestrales de adoración y sacrificio deben preservarse y respetarse (legal).",
        "Caridad. Siempre trato de ayudar a quienes lo necesitan, sin importar lo que pueda costarme (bueno).",
        "Cambio. Debemos impulsar los cambios que los dioses intentan traer al mundo incesantemente (caótico).",
        "Poder. Confío en que algún día alcanzaré la cima de la jerarquía religiosa de mi fe (legal).",
        "Fe. Confío en que mi dios guiará mis actos. Tengo fe en que, si me esfuerzo, las cosas me irán bien (legal).",
        "Aspiración. Intento mostrarme digno del favor de mi dios al actuar según sus enseñanzas (cualquiera).",
      ],
      bonds: [
        "Moriría por recuperar una antigua reliquia de mi fe, que se extravió hace mucho.",
        "Algún día me vengaré de la corrupta jerarquía del templo, que me tildó de hereje.",
        "Le debo la vida al sacerdote que me acogió cuando murieron mis padres.",
        "Todo lo que hago es por la gente humilde.",
        "Haría lo que fuera por proteger el templo en el que serví.",
        "Pienso proteger un texto sagrado que mis enemigos consideran herético y quieren destruir.",
      ],
      flaws: [
        "Soy exigente con los demás, pero todavía más conmigo mismo.",
        "Confío demasiado en los miembros poderosos de la jerarquía de mi templo.",
        "A veces mi piedad me lleva a confiar ciegamente en quienes profesan mi misma fe.",
        "Soy de pensamiento inflexible.",
        "Sospecho de los desconocidos y espero lo peor de ellos.",
        "En cuanto elijo un objetivo, me obsesiono tanto con él que ignoro los demás aspectos de mi vida.",
      ],
    },
    icon: "⛪",
  },

  // ─── CHARLATÁN ─────────────────────────────────────────────────────
  charlatan: {
    id: "charlatan",
    nombre: "Charlatán",
    descripcion:
      "Siempre has tenido facilidad para tratar con la gente. Sabes qué les hace sonreír, qué les convence y a qué le tienen miedo. Utilizas este talento para manipularlos y conseguir lo que deseas.",
    skillProficiencies: ["engano", "juego_de_manos"],
    toolProficiencies: ["Kit de disfraz", "Kit de falsificación"],
    extraLanguages: 0,
    equipment: [
      "Muda de ropas finas",
      "Kit de disfraz",
      "Herramientas de estafa (diez botellas tapadas con líquidos de colores, un conjunto de dados trucados, una baraja de cartas marcadas o un anillo de sello de un duque imaginario)",
    ],
    startingGold: 15,
    featureName: "Identidad Falsa",
    featureDescription:
      "Has creado una segunda identidad que incluye documentación, conocidos establecidos y disfraces que te permiten asumir esa personalidad. Además, puedes falsificar documentos, incluyendo papeles oficiales y cartas personales, siempre y cuando hayas visto un ejemplo del tipo de documento o la letra que intentas copiar.",
    personality: {
      traits: [
        "Caigo de pie en cualquier situación. Siempre encuentro la manera de sacar provecho.",
        "Me meto en un lío y luego me escabullo con una sonrisa.",
        "Adulo a todo el mundo para conseguir lo que quiero.",
        "Soy un jugador nato y no puedo resistirme a arriesgarme.",
        "Miento sobre casi todo, incluso cuando no hay motivo para hacerlo.",
        "El sarcasmo y los insultos son mi lenguaje favorito.",
        "Llevo siempre encima un amuleto de la suerte o talismán.",
        "Mi primera reacción ante un problema es hablar antes que pelear.",
      ],
      ideals: [
        "Independencia. Soy un espíritu libre; nadie me dice lo que tengo que hacer (caótico).",
        "Justicia. Nunca me aprovecho de quien no puede permitírselo (legal).",
        "Caridad. Distribuyo el dinero que obtengo entre la gente que de verdad lo necesita (bueno).",
        "Creatividad. Nunca repito la misma estafa dos veces (caótico).",
        "Amistad. Las posesiones materiales van y vienen. Los vínculos de amistad duran para siempre (bueno).",
        "Aspiración. Estoy decidido a convertirme en algo grande (cualquiera).",
      ],
      bonds: [
        "Estafé a la persona equivocada y debo esforzarme para asegurarme de que no vuelva a cruzarse en mi camino.",
        "Le debo todo a mi mentor, una persona horrible que probablemente se esté pudriendo en alguna mazmorra.",
        "En algún lugar tengo un hijo que no me conoce. Quiero que el mundo sea mejor para él o ella.",
        "Alguien poderoso mató a alguien que me importaba. Algún día me vengaré.",
        "Estafé a alguien que no se lo merecía y quiero enmendar mis errores.",
        "Conseguí un dinero importante de un modo que me avergüenza.",
      ],
      flaws: [
        "No puedo resistirme a una cara bonita.",
        "Siempre tengo deudas. Gasto mis ganancias ilícitas en lujos decadentes más rápido de lo que las consigo.",
        "Estoy convencido de que nadie puede engañarme de la misma forma que yo engaño a los demás.",
        "Soy codicioso sin remedio. No puedo evitarlo.",
        "No puedo resistirme a una estafa, aunque ponga en riesgo mi seguridad.",
        "Escapo ante la primera señal de problemas.",
      ],
    },
    icon: "🎭",
  },

  // ─── CRIMINAL ──────────────────────────────────────────────────────
  criminal: {
    id: "criminal",
    nombre: "Criminal",
    descripcion:
      "Eres un criminal con experiencia y un buen historial de delitos a tus espaldas. Has pasado mucho tiempo entre otros criminales y sigues teniendo contactos dentro del mundo del hampa.",
    skillProficiencies: ["engano", "sigilo"],
    toolProficiencies: ["Herramientas de ladrón"],
    toolChoices: [
      "Juego de cartas",
      "Juego de dados",
      "Juego de tablero",
    ],
    toolChoiceCount: 1,
    extraLanguages: 0,
    equipment: [
      "Palanca",
      "Muda de ropas oscuras y comunes con capucha",
    ],
    startingGold: 15,
    featureName: "Contacto Criminal",
    featureDescription:
      "Tienes un contacto fiable y de confianza que actúa como tu enlace con una red criminal. Sabes cómo enviar y recibir mensajes de tu contacto, incluso a grandes distancias. En concreto, conoces a los mensajeros locales, a los maestros de las caravanas corruptos y a los marineros sospechosos que pueden entregar mensajes por ti.",
    variant: {
      nombre: "Espía",
      descripcion:
        "Aunque tus capacidades no son muy diferentes a las de un ladrón o un contrabandista, las aprendiste y practicaste en un contexto muy distinto: como agente de espionaje.",
    },
    personality: {
      traits: [
        "Siempre tengo un plan para cuando las cosas van mal.",
        "Siempre estoy calmado, pase lo que pase. Nunca elevo la voz ni dejo que mis emociones me controlen.",
        "Lo primero que hago al llegar a un sitio nuevo es fijarme en todo lo que tenga valor o que pueda robar.",
        "Prefiero hacerme un amigo nuevo que un enemigo.",
        "No confío rápidamente. Los que parecen más justos suelen tener más que ocultar.",
        "No me importa el riesgo. Nunca me planteo las probabilidades.",
        "La mejor forma de que haga algo es decirme que no puedo hacerlo.",
        "Salto a la menor provocación.",
      ],
      ideals: [
        "Honor. No robo a mis compañeros de profesión (legal).",
        "Libertad. Las cadenas están hechas para romperse, al igual que quienes las forjan (caótico).",
        "Caridad. Robo a los ricos para dárselo a quienes realmente lo necesitan (bueno).",
        "Codicia. Haré lo que haga falta para hacerme rico (malvado).",
        "Pueblo. Soy leal a mis amigos, no a ideales. Todos los demás pueden irse por un tubo (neutral).",
        "Redención. Hay una chispa de bondad en todos. Solo hay que encontrarla (bueno).",
      ],
      bonds: [
        "Estoy intentando pagar una vieja deuda con un generoso benefactor.",
        "Mis ganancias ilícitas son para mantener a mi familia.",
        "Me quitaron algo importante y pretendo robarlo de vuelta.",
        "Llegaré a ser el mejor ladrón que jamás haya existido.",
        "La culpa por un crimen terrible que cometí me persigue todavía.",
        "Alguien a quien quería murió por culpa de un error que cometí. No volverá a suceder.",
      ],
      flaws: [
        "Cuando veo algo valioso, no puedo pensar en otra cosa que en cómo robarlo.",
        "Ante un problema, mi primera opción siempre es la violencia directa.",
        "No hay nada en el mundo que me guste más que el dinero.",
        "Traiciono a quien confía en mí si me conviene.",
        "Un plan inocente se convierte en algo mucho peor porque no puedo dejar de planificar.",
        "Me resulta imposible ignorar un secreto.",
      ],
    },
    icon: "🗡️",
  },

  // ─── ARTISTA ───────────────────────────────────────────────────────
  artista: {
    id: "artista",
    nombre: "Artista",
    descripcion:
      "Prosperas ante un público. Sabes cómo atraer la atención, entretener e incluso inspirar a los demás. Tu poesía puede conmover el corazón de quienes te escuchan, despertar su dolor o avivar su ira. Tu música eleva los ánimos o sume en el llanto. Tu danza cautiva, tu humor hiere en lo más vivo.",
    skillProficiencies: ["acrobacias", "interpretacion"],
    toolProficiencies: ["Kit de disfraz"],
    toolChoices: [
      "Laúd",
      "Flauta",
      "Lira",
      "Cuerno",
      "Viola",
      "Tambor",
      "Dulcémele",
      "Gaita",
      "Chirimía",
      "Zanfona",
    ],
    toolChoiceCount: 1,
    extraLanguages: 0,
    equipment: [
      "Instrumento musical (uno de tu elección)",
      "El favor de un admirador (carta de amor, mechón de pelo o baratija)",
      "Disfraz",
      "Muda de ropas comunes",
    ],
    startingGold: 15,
    featureName: "A Petición del Público",
    featureDescription:
      "Siempre puedes encontrar un lugar donde actuar, ya sea una posada, una taberna, un circo, un teatro o la corte de un noble. En ese tipo de establecimientos recibes alojamiento y comida gratis con un nivel de vida modesto o cómodo (según la calidad del local), siempre y cuando actúes cada noche. Además, tu actuación te hará conocido entre los lugareños.",
    variant: {
      nombre: "Gladiador",
      descripcion:
        "Un gladiador es tan artista como cualquier juglar o animador circense, entrenado para hacer de la violencia un espectáculo que la gente disfruta. Reemplaza el instrumento musical por un arma inusual pero llamativa (tridente, red, etc.).",
    },
    personality: {
      traits: [
        "Conozco una historia relevante para cada situación.",
        "Cuando llego a un lugar nuevo, recopilo los rumores locales y difundo los chismes.",
        "Soy un romántico empedernido, siempre en busca de esa persona especial.",
        "Nadie puede estar enfadado conmigo o a mi alrededor durante mucho tiempo, ya que puedo calmar cualquier tensión.",
        "Me encanta un buen insulto, incluso cuando va dirigido a mí.",
        "Me pongo agresivo si alguien no aprecia mi arte.",
        "Cambio mi estado de ánimo o mi actitud tan rápido como cambio la tonalidad de una canción.",
        "Cuando estoy en un sitio nuevo, siempre investigo quién manda allí.",
      ],
      ideals: [
        "Belleza. Cuando actúo, hago que el mundo sea mejor que antes (bueno).",
        "Tradición. Las historias, leyendas y canciones del pasado no deben olvidarse jamás (legal).",
        "Creatividad. El mundo necesita nuevas ideas y acciones atrevidas (caótico).",
        "Codicia. Solo estoy en esto por el dinero y la fama (malvado).",
        "Pueblo. Me gusta ver las sonrisas en los rostros de mi audiencia (neutral).",
        "Honestidad. El arte debe reflejar el alma. Tiene que venir de dentro y revelar quiénes somos realmente (cualquiera).",
      ],
      bonds: [
        "Mi instrumento es mi posesión más preciada y me recuerda a alguien que amé.",
        "Alguien me robó mi preciado instrumento y algún día lo recuperaré.",
        "Quiero ser famoso, cueste lo que cueste.",
        "Idolatro a un héroe del pasado e intento que mis actos estén a su altura.",
        "Haré cualquier cosa para probar que soy superior a mi odiado rival.",
        "Haría lo que fuera por los demás miembros de mi antigua compañía.",
      ],
      flaws: [
        "Haré cualquier cosa para ganar fama y renombre.",
        "Soy un esnob que mira con desprecio a quienes no pueden apreciar las artes.",
        "Un escándalo me impide volver a casa. Ese tipo de problemas me persigue a donde quiera que voy.",
        "Me burlé de un noble una vez y aún espero la respuesta. Fue un error que quizá se repita.",
        "Tengo debilidad por los vicios de la ciudad.",
        "En secreto, creo que nadie está a la altura de mi grandeza.",
      ],
    },
    icon: "🎭",
  },

  // ─── HÉROE DEL PUEBLO ──────────────────────────────────────────────
  heroe_del_pueblo: {
    id: "heroe_del_pueblo",
    nombre: "Héroe del Pueblo",
    descripcion:
      "Vienes de un origen humilde, pero estás destinado a mucho más. La gente de tu pueblo ya te considera un héroe, y tu destino te impulsa a enfrentar a los tiranos y monstruos que amenazan a la gente común.",
    skillProficiencies: ["supervivencia", "trato_con_animales"],
    toolProficiencies: [],
    toolChoices: [
      "Herramientas de albañil",
      "Herramientas de herrero",
      "Herramientas de carpintero",
      "Herramientas de zapatero",
      "Herramientas de curtidor",
      "Herramientas de alfarero",
      "Suministros de cervecero",
      "Herramientas de cocinero",
      "Herramientas de soplador de vidrio",
      "Herramientas de joyero",
      "Herramientas de pintor",
      "Herramientas de tallador de madera",
      "Herramientas de tejedor",
      "Herramientas de cartógrafo",
    ],
    toolChoiceCount: 1,
    extraLanguages: 0,
    equipment: [
      "Herramientas de artesano (un juego de tu elección)",
      "Pala",
      "Olla de hierro",
      "Muda de ropas comunes",
    ],
    startingGold: 10,
    featureName: "Hospitalidad Rústica",
    featureDescription:
      "Dado que procedes de las filas del pueblo llano, te resulta fácil integrarte con la gente común. Puedes encontrar un lugar donde esconderte, descansar o recuperarte entre la gente, a menos que hayas demostrado ser un peligro para ellos. Te protegerán de la ley o de cualquiera que te busque, aunque no arriesgarán sus vidas por ti.",
    personality: {
      traits: [
        "Juzgo a la gente por sus actos, no por sus palabras.",
        "Si alguien está en apuros, siempre estoy dispuesto a ayudar.",
        "Cuando me propongo algo, lo cumplo, sin importar lo que se interponga.",
        "Tengo un fuerte sentido de la justicia e intento siempre encontrar la solución más equitativa.",
        "Confío en mis propias capacidades y hago lo que puedo para que los demás confíen en las suyas.",
        "Pensar no es uno de mis puntos fuertes. Tiendo a actuar primero y pensar después.",
        "Abuso de las palabras rimbombantes para aparentar ser más culto.",
        "Me aburro con facilidad. ¿Cuándo empezamos con la acción?",
      ],
      ideals: [
        "Respeto. La gente merece ser tratada con dignidad y respeto (bueno).",
        "Justicia. Ningún tirano debería oprimir al pueblo (legal).",
        "Libertad. No se debe obligar a nadie a hacer lo que no quiere (caótico).",
        "Poder. Si me hago fuerte, podré tomar lo que quiera (malvado).",
        "Sinceridad. No tiene sentido fingir ser quien no soy (neutral).",
        "Destino. Nada ni nadie puede apartarme de mi llamada superior (cualquiera).",
      ],
      bonds: [
        "Tengo una familia, pero no sé dónde está. Espero encontrarla algún día.",
        "Trabajé la tierra, amo la tierra y protegeré la tierra.",
        "Un noble orgulloso me dio una vez una paliza terrible y me vengaré de cualquier matón que se cruce conmigo.",
        "Mis herramientas son un símbolo de mi vida anterior y las llevo para no olvidar mis orígenes.",
        "Protejo a los que no pueden protegerse a sí mismos.",
        "Ojalá mi amor de la infancia hubiera venido conmigo a perseguir mi destino.",
      ],
      flaws: [
        "El tirano que gobierna mi tierra no se detendrá ante nada para verme muerto.",
        "Estoy convencido de la importancia de mi destino y no me fijo en mis defectos o en los riesgos que corro.",
        "Las personas que conocí en mi infancia me tienen por un cobarde y me avergüenzo de ello.",
        "Tengo debilidad por los vicios de la ciudad, sobre todo la bebida.",
        "En secreto, creo que las cosas irían mucho mejor si yo pudiera mandar.",
        "Tengo problemas para confiar en mis aliados.",
      ],
    },
    icon: "🦸",
  },

  // ─── ARTESANO GREMIAL ──────────────────────────────────────────────
  artesano_gremial: {
    id: "artesano_gremial",
    nombre: "Artesano Gremial",
    descripcion:
      "Fuiste miembro de un gremio de artesanos y adquiriste una habilidad especial durante tus años de aprendizaje. Eres un especialista en un campo concreto y estás estrechamente vinculado a otros artesanos.",
    skillProficiencies: ["perspicacia", "persuasion"],
    toolProficiencies: [],
    toolChoices: [
      "Herramientas de albañil",
      "Herramientas de herrero",
      "Herramientas de carpintero",
      "Herramientas de zapatero",
      "Herramientas de curtidor",
      "Herramientas de alfarero",
      "Suministros de cervecero",
      "Herramientas de cocinero",
      "Herramientas de soplador de vidrio",
      "Herramientas de joyero",
      "Herramientas de pintor",
      "Herramientas de tallador de madera",
      "Herramientas de tejedor",
      "Herramientas de cartógrafo",
    ],
    toolChoiceCount: 1,
    extraLanguages: 1,
    equipment: [
      "Herramientas de artesano (un juego de tu elección)",
      "Carta de presentación de tu gremio",
      "Muda de ropas de viaje",
    ],
    startingGold: 15,
    featureName: "Membresía del Gremio",
    featureDescription:
      "Como miembro establecido de un gremio, puedes contar con ciertos beneficios de tu membresía. Tus compañeros gremiales te proporcionarán alojamiento y comida si es necesario y pagarán por tu funeral si llega el caso. En algunas ciudades, la casa del gremio ofrece un lugar central para reunirse con otros miembros. Los gremios suelen tener una enorme influencia política.",
    personality: {
      traits: [
        "Creo que cualquier cosa que valga la pena hacer merece hacerse bien. No puedo evitar ser perfeccionista.",
        "Soy un esnob que mira con desprecio a quienes no pueden apreciar las artes finas.",
        "Siempre quiero saber cómo funcionan las cosas y qué hace que la gente actúe como lo hace.",
        "Tengo una frase ingeniosa para cada ocasión y la uso constantemente.",
        "Soy maleducado con la gente que no respeta el trabajo manual honesto.",
        "Me encanta hablar de mi profesión durante horas.",
        "No me separo fácilmente de mi dinero y regateo implacablemente para conseguir el mejor precio.",
        "Soy bien conocido por mi trabajo y quiero asegurarme de que todo el mundo lo aprecie.",
      ],
      ideals: [
        "Comunidad. Todo el mundo tiene la obligación de fortalecer los lazos de la comunidad (legal).",
        "Generosidad. Mi talento me fue dado para que pueda beneficiar al mundo (bueno).",
        "Libertad. Todo el mundo debería ser libre de perseguir sus propios medios de vida (caótico).",
        "Codicia. Solo estoy aquí para ganar dinero (malvado).",
        "Pueblo. Me importan las personas a las que ayudo, no los ideales (neutral).",
        "Aspiración. Trabajo duro para ser el mejor en mi oficio (cualquiera).",
      ],
      bonds: [
        "El taller donde aprendí mi oficio es el lugar más importante del mundo para mí.",
        "Creé una gran obra para alguien y luego descubrí que no era digno de recibirla. Todavía la busco.",
        "Le debo mucho al gremio por haberme convertido en quien soy.",
        "Persigo la riqueza para asegurar el amor de alguien.",
        "Algún día volveré a mi gremio y demostraré que soy el mejor artesano de todos.",
        "Me vengaré de las fuerzas malignas que destruyeron mi lugar de trabajo y arruinaron mi modo de vida.",
      ],
      flaws: [
        "Haré cualquier cosa por obtener un objeto raro o de valor incalculable.",
        "Me convenzo rápidamente de que la gente intenta engañarme.",
        "Nadie debe saber jamás que una vez robé las arcas del gremio.",
        "Nunca estoy satisfecho con lo que tengo: siempre quiero más.",
        "Mataría por obtener un título nobiliario.",
        "Soy terriblemente celoso de cualquiera que supere mi trabajo. Haré lo que sea para superar a un rival.",
      ],
    },
    icon: "🔨",
  },

  // ─── ERMITAÑO ──────────────────────────────────────────────────────
  ermitano: {
    id: "ermitano",
    nombre: "Ermitaño",
    descripcion:
      "Viviste durante un tiempo prolongado en reclusión, ya fuera en una comunidad aislada, como un monasterio, o completamente solo, quizás como ermitaño. Este período de apartada contemplación tuvo un gran efecto sobre ti.",
    skillProficiencies: ["medicina", "religion"],
    toolProficiencies: ["Kit de herboristería"],
    extraLanguages: 1,
    equipment: [
      "Estuche de pergaminos lleno de notas de tus estudios u oraciones",
      "Manta de invierno",
      "Muda de ropas comunes",
      "Kit de herboristería",
    ],
    startingGold: 5,
    featureName: "Descubrimiento",
    featureDescription:
      "La tranquila reclusión de tu largo retiro te dio acceso a un descubrimiento único e importantísimo. La naturaleza exacta de esta revelación depende de la naturaleza de tu retiro. Podría ser una gran verdad sobre el cosmos, las deidades, seres extraplanarios o las fuerzas de la naturaleza. Podría ser un lugar que nadie más haya visto jamás, un hecho olvidado hace mucho o una reliquia desenterrada del pasado.",
    personality: {
      traits: [
        "He estado aislado tanto tiempo que hablo poco, prefiriendo los gestos y los gruñidos esporádicos.",
        "Estoy tremendamente tranquilo, incluso en medio del desastre.",
        "El líder de mi comunidad tenía algo de sabio que aún estoy intentando comprender.",
        "Siento una tremenda empatía por todos los que sufren.",
        "Soy ajeno a la etiqueta y las expectativas sociales.",
        "Conecto todo lo que me sucede con un esquema cósmico más amplio.",
        "A menudo me pierdo en mis propios pensamientos y contemplaciones, desconectándome de mi entorno.",
        "Estoy trabajando en una gran teoría filosófica y adoro compartir mis ideas.",
      ],
      ideals: [
        "Bien Mayor. Mi don es para compartirlo con el mundo, no para mi propio beneficio (bueno).",
        "Lógica. Las emociones no deben nublar nuestro sentido de lo verdadero y lo justo, ni nuestro pensamiento lógico (legal).",
        "Espíritu Libre. La indagación y la curiosidad son los pilares del progreso (caótico).",
        "Poder. La soledad y la contemplación son caminos hacia el poder místico u oculto (malvado).",
        "Vivir y Dejar Vivir. Entrometerse en los asuntos de los demás solo causa problemas (neutral).",
        "Autoconocimiento. Si te conoces a ti mismo, no necesitas saber nada más (cualquiera).",
      ],
      bonds: [
        "Nada es más importante que los demás miembros de mi ermita, orden o asociación.",
        "Entré en reclusión para esconderme de los que aún podrían estar buscándome.",
        "Estoy buscando la iluminación espiritual.",
        "Entré en reclusión porque amaba a alguien a quien no podía tener.",
        "Si mi descubrimiento sale a la luz, podría causar la destrucción del mundo.",
        "Mi aislamiento me dio un gran conocimiento de un mal que solo yo puedo destruir.",
      ],
      flaws: [
        "Ahora que he vuelto al mundo, disfruto de sus placeres en exceso.",
        "Albergo pensamientos oscuros y sanguinarios que mi aislamiento y meditación no pudieron erradicar.",
        "Soy dogmático en mis ideas.",
        "Dejo que mi necesidad de ganar debates eclipse la amistad y la armonía.",
        "Arriesgaría demasiado para descubrir un fragmento perdido de conocimiento.",
        "Me gusta guardar secretos y no los comparto con nadie.",
      ],
    },
    icon: "🏔️",
  },

  // ─── NOBLE ─────────────────────────────────────────────────────────
  noble: {
    id: "noble",
    nombre: "Noble",
    descripcion:
      "Entiendes la riqueza, el poder y los privilegios. Llevas un título nobiliario y tu familia posee tierras, recolecta impuestos y ejerce una influencia política significativa.",
    skillProficiencies: ["historia", "persuasion"],
    toolProficiencies: [],
    toolChoices: [
      "Juego de cartas",
      "Juego de dados",
      "Juego de tablero",
    ],
    toolChoiceCount: 1,
    extraLanguages: 1,
    equipment: [
      "Muda de ropas finas",
      "Anillo de sello",
      "Pergamino con el árbol genealógico",
    ],
    startingGold: 25,
    featureName: "Posición Privilegiada",
    featureDescription:
      "Gracias a tu cuna noble, la gente tiende a pensar lo mejor de ti. Eres bienvenido en la alta sociedad y se asume que tienes derecho a estar donde estés. La gente común se esfuerza en complacerte y la gente de clase alta te trata como un miembro de su misma esfera social. Puedes solicitar una audiencia con un noble local si lo necesitas.",
    variant: {
      nombre: "Caballero",
      descripcion:
        "Un caballero ya ha jurado servir a un señor que le ha otorgado un título. Reemplaza el juego de tipo de juego con un estandarte heráldico.",
    },
    personality: {
      traits: [
        "Mi elocuente adulación hace que todas las personas con las que hablo se sientan las más maravillosas e importantes del mundo.",
        "La gente común me quiere por mi amabilidad y generosidad.",
        "Nadie podría dudar al ver mi porte regio de que estoy por encima del populacho.",
        "Me tomo un gran cuidado en vestir siempre lo mejor y en seguir las últimas tendencias.",
        "No me gusta ensuciarme las manos y no haré ninguna tarea que no me corresponda.",
        "A pesar de mi cuna noble, no me considero superior a los demás. Todos compartimos la misma sangre.",
        "Mi favor, una vez perdido, se pierde para siempre.",
        "Si me haces daño, te destrozaré, arruinaré tu nombre y salaré tus tierras.",
      ],
      ideals: [
        "Respeto. El respeto se me debe por mi posición, pero todas las personas, sin importar su estación, merecen ser tratadas con dignidad (bueno).",
        "Responsabilidad. Es mi deber respetar la autoridad de los que están por encima de mí, así como los que están por debajo deben respetar la mía (legal).",
        "Independencia. Debo demostrar que puedo valerme por mí mismo sin el consentimiento de mi familia (caótico).",
        "Poder. Si consigo más poder, nadie podrá decirme lo que tengo que hacer (malvado).",
        "Familia. La sangre manda (cualquiera).",
        "Nobleza Obliga. Es mi deber proteger y cuidar a la gente que está por debajo de mí (bueno).",
      ],
      bonds: [
        "Haré frente a cualquier desafío para ganar la aprobación de mi familia.",
        "La alianza de mi casa con otra familia noble debe mantenerse a toda costa.",
        "Nada es más importante que los demás miembros de mi familia.",
        "Estoy enamorado de la heredera de una familia que mi familia desprecia.",
        "Mi lealtad a mi soberano es inquebrantable.",
        "La gente común debe verme como un héroe del pueblo.",
      ],
      flaws: [
        "En secreto creo que todos están por debajo de mí.",
        "Escondo un secreto realmente escandaloso que podría arruinar a mi familia para siempre.",
        "Oigo insultos y desaires ocultos en cada palabra que me dirigen y me enfurezco con facilidad.",
        "Tengo un deseo insaciable de placeres carnales.",
        "De hecho, el mundo gira a mi alrededor.",
        "Con mis palabras y acciones a menudo avergüenzo a mi familia.",
      ],
    },
    icon: "👑",
  },

  // ─── FORASTERO ─────────────────────────────────────────────────────
  forastero: {
    id: "forastero",
    nombre: "Forastero",
    descripcion:
      "Creciste en los parajes salvajes, lejos de la civilización y de las comodidades de la ciudad y la tecnología. Has presenciado la migración de las manadas más grandes que los bosques, has sobrevivido a condiciones meteorológicas extremas y has disfrutado de la soledad de ser la única criatura pensante en kilómetros a la redonda.",
    skillProficiencies: ["atletismo", "supervivencia"],
    toolProficiencies: [],
    toolChoices: [
      "Laúd",
      "Flauta",
      "Lira",
      "Cuerno",
      "Viola",
      "Tambor",
      "Dulcémele",
      "Gaita",
      "Chirimía",
      "Zanfona",
    ],
    toolChoiceCount: 1,
    extraLanguages: 1,
    equipment: [
      "Bastón",
      "Trampa para cazar",
      "Trofeo de un animal que mataste",
      "Muda de ropas de viaje",
    ],
    startingGold: 10,
    featureName: "Vagabundo",
    featureDescription:
      "Tienes una memoria excelente para los mapas y la geografía, y puedes recordar siempre la disposición general del terreno, los asentamientos y otros elementos a tu alrededor. Además, puedes encontrar comida y agua fresca para ti y hasta cinco personas más cada día, siempre y cuando la tierra ofrezca bayas, caza menor, agua y cosas similares.",
    personality: {
      traits: [
        "Me mueve la sed de aventura que me sacó de mi hogar.",
        "Vigilo a mis amigos como si fueran una camada de cachorros recién nacidos.",
        "Una vez corrí 40 kilómetros sin parar para advertir a mi clan de la aproximación de una horda de orcos. Volvería a hacerlo si fuera necesario.",
        "Tengo una lección para cada situación, extraída de la observación de la naturaleza.",
        "No le doy importancia a la gente de ciudad. No sobrevivirían una hora en la espesura.",
        "Me siento cómodo entre los animales. La gente me confunde.",
        "Fui, de hecho, criado por lobos.",
        "Recojo todo lo que encuentro por el camino: plumas, piedras, conchas, hojas.",
      ],
      ideals: [
        "Cambio. La vida es como las estaciones, en constante cambio, y debemos cambiar con ella (caótico).",
        "Bien Mayor. Es responsabilidad de todos contribuir al bien de toda la tribu (bueno).",
        "Honor. Si me deshonro, también deshonro a todo mi clan (legal).",
        "Poder. El más fuerte está hecho para gobernar (malvado).",
        "Naturaleza. El mundo natural es más importante que todas las obras de la civilización (neutral).",
        "Gloria. Debo ganar gloria en batalla, para mí y para mi clan (cualquiera).",
      ],
      bonds: [
        "Mi familia, clan o tribu es lo más importante de mi vida, incluso cuando están lejos.",
        "Vengaré a mi tribu por una amenaza que la diezmó.",
        "Debo traer una gran presa de caza para ganarme el respeto de mi pueblo.",
        "Sufrí una visión terrible de una catástrofe venidera y haré lo que sea para evitarla.",
        "Es mi deber proveer hijos que sustenten a mi tribu.",
        "Algún día regresaré a mi pueblo y demostraré que soy digno.",
      ],
      flaws: [
        "Soy demasiado enamoradizo de las cosas que ofrece la civilización.",
        "Mi lenguaje y mis costumbres resultan groseros para los civilizados.",
        "No tengo respeto por las leyes o las costumbres que no sean las de mi tribu.",
        "La violencia es mi respuesta para casi todos los desafíos.",
        "No me fío de la magia. Prefiero que las cosas se hagan con las manos.",
        "Soy lento para confiar en los miembros de otras razas, tribus y sociedades.",
      ],
    },
    icon: "🌲",
  },

  // ─── SABIO ─────────────────────────────────────────────────────────
  sabio: {
    id: "sabio",
    nombre: "Sabio",
    descripcion:
      "Pasaste años aprendiendo los secretos del multiverso. Rebuscaste en manuscritos, estudiaste pergaminos y escuchaste a los mayores expertos en las materias que más te interesan.",
    skillProficiencies: ["arcanos", "historia"],
    toolProficiencies: [],
    extraLanguages: 2,
    equipment: [
      "Frasco de tinta negra",
      "Pluma",
      "Cuchillo pequeño",
      "Carta de un colega difunto con una pregunta que aún no has podido responder",
      "Muda de ropas comunes",
    ],
    startingGold: 10,
    featureName: "Investigador",
    featureDescription:
      "Cuando intentas aprender o recordar un dato, si no conoces esa información, sabes dónde y de quién puedes obtenerla. Normalmente, esta información proviene de una biblioteca, un scriptorium, una universidad u otro sabio o persona culta. Tu DM podría dictaminar que el conocimiento que buscas está escondido en un lugar casi inaccesible o que, sencillamente, no puede encontrarse.",
    personality: {
      traits: [
        "Utilizo palabras rebuscadas que transmiten la imagen de una gran erudición.",
        "He leído todos los libros de las bibliotecas más grandes del mundo, o al menos me gusta presumir de ello.",
        "Estoy acostumbrado a ayudar a los que no son tan listos como yo, y con paciencia explico cualquier cosa a cualquiera.",
        "No hay nada que me guste más que un buen misterio.",
        "Estoy dispuesto a escuchar todos los argumentos de una discusión antes de emitir mi propio juicio.",
        "Yo… hablo… despacio… cuando… me… dirijo… a… idiotas… que es… casi… todo el mundo… comparado… conmigo.",
        "Soy tremendamente torpe en las situaciones sociales.",
        "Estoy convencido de que la gente siempre intenta robarme mis secretos.",
      ],
      ideals: [
        "Conocimiento. El camino al poder y la superación personal pasa por el conocimiento (neutral).",
        "Belleza. Lo que es bello nos señala lo que es verdad (bueno).",
        "Lógica. Las emociones no deben nublar nuestro pensamiento lógico (legal).",
        "Sin Límites. Nada debería frenar las posibilidades infinitas inherentes a toda la existencia (caótico).",
        "Poder. El conocimiento es el camino al poder y la dominación (malvado).",
        "Superación Personal. El objetivo de una vida de estudio es la mejora de uno mismo (cualquiera).",
      ],
      bonds: [
        "Es mi deber proteger a mis estudiantes.",
        "Poseo un texto antiguo que contiene secretos terribles que no deben caer en las manos equivocadas.",
        "Trabajo para preservar una biblioteca, universidad, scriptorium o monasterio.",
        "El trabajo de mi vida es una serie de tomos relacionados con un campo específico del saber.",
        "Llevo toda la vida buscando la respuesta a cierta pregunta.",
        "Vendí mi alma por conocimiento. Espero realizar grandes hazañas para recuperarla.",
      ],
      flaws: [
        "Me distraigo con facilidad ante la promesa de información.",
        "La mayoría de la gente grita y corre cuando ve un demonio. Yo me detengo a tomar notas sobre su anatomía.",
        "Desvelar un misterio antiguo bien vale el precio de una civilización.",
        "Prefiero soluciones complicadas a las simples.",
        "Hablo sin pensar, lo que provoca que insulte a otros sin querer.",
        "No puedo guardar un secreto aunque mi vida dependa de ello.",
      ],
    },
    icon: "📚",
  },

  // ─── MARINERO ──────────────────────────────────────────────────────
  marinero: {
    id: "marinero",
    nombre: "Marinero",
    descripcion:
      "Navegaste en un buque marítimo durante años. En ese tiempo, te enfrentaste a tormentas de primer orden, a monstruos de las profundidades y a aquellos que pretendían hundir tu embarcación hasta el fondo sin dejar rastro.",
    skillProficiencies: ["atletismo", "percepcion"],
    toolProficiencies: [
      "Herramientas de navegante",
      "Vehículos (agua)",
    ],
    extraLanguages: 0,
    equipment: [
      "Cabilla (garrote)",
      "15 metros de cuerda de seda",
      "Amuleto de la suerte (conejo, piedrecita o similar)",
      "Muda de ropas comunes",
    ],
    startingGold: 10,
    featureName: "Pasaje de Barco",
    featureDescription:
      "Cuando lo necesites, puedes asegurarte un pasaje gratuito en un velero para ti y tus compañeros de aventuras. Podrás viajar en el barco en el que serviste o en otro que conozcas (siempre que te lleve adonde quieres ir). Como estás pidiendo un favor, no puedes fijar un horario. Tu DM determinará cuánto se tarda en llegar. A cambio del pasaje gratuito, se espera que tú y tus compañeros ayudéis a la tripulación durante el viaje.",
    variant: {
      nombre: "Pirata",
      descripcion:
        "Pasaste tu juventud bajo la influencia de un temible pirata, un despiadado saqueador que te enseñó a sobrevivir en un mundo de tiburones y salvajes. El rasgo cambia a Mala Reputación: la gente te teme por tus actos.",
    },
    personality: {
      traits: [
        "Mis amigos saben que pueden contar conmigo, pase lo que pase.",
        "Trabajo duro para poder pasármelo bien cuando haya terminado.",
        "Me encanta navegar a nuevos puertos y hacer amigos ante una jarra de cerveza.",
        "Estiro la verdad por el bien de una buena historia.",
        "Para mí, una pelea de taberna es una forma estupenda de conocer una nueva ciudad.",
        "Nunca falto a una apuesta.",
        "Mi lenguaje es tan soez como un nido de otyugh. Maldigo como un marinero.",
        "Me gusta que un trabajo esté bien hecho, especialmente si puedo convencer a otro para que lo haga.",
      ],
      ideals: [
        "Respeto. Lo que mantiene unido a un barco es el respeto mutuo entre el capitán y la tripulación (bueno).",
        "Justicia. Todos hacemos el trabajo, así que todos compartimos las recompensas (legal).",
        "Libertad. El mar es la libertad: la libertad de ir a cualquier parte y hacer cualquier cosa (caótico).",
        "Poder. Soy un depredador y los demás barcos en el mar son mi presa (malvado).",
        "Pueblo. Me importa mi tripulación, no los ideales (neutral).",
        "Aspiración. Algún día seré dueño de mi propio barco y trazaré mi propio destino (cualquiera).",
      ],
      bonds: [
        "Soy leal ante todo a mi capitán; todo lo demás va después.",
        "El barco es lo más importante: la tripulación y sus capitanes van y vienen.",
        "Siempre recordaré mi primer viaje largo.",
        "En un puerto, tengo un amor al que no puedo corresponder.",
        "Me estafaron con mi parte del botín y quiero recuperar lo que me deben.",
        "Los piratas despiadados mataron a mi capitán y a mis compañeros de tripulación, saquearon nuestro barco y me dejaron a mi suerte. La venganza será mía.",
      ],
      flaws: [
        "Sigo las órdenes, incluso cuando creo que están equivocadas.",
        "Diré lo que sea para evitar hacer trabajo extra.",
        "Una vez que empiezo a beber, es difícil que pare.",
        "No puedo evitar birlar cosas aquí y allá.",
        "Mi orgullo probablemente me conducirá a la perdición.",
        "No puedo resistirme a una cara bonita.",
      ],
    },
    icon: "⚓",
  },

  // ─── SOLDADO ───────────────────────────────────────────────────────
  soldado: {
    id: "soldado",
    nombre: "Soldado",
    descripcion:
      "La guerra ha sido tu vida desde que puedes recordar. Te entrenaste de joven, estudiaste el uso de las armas y las armaduras y aprendiste técnicas básicas de supervivencia, incluyendo cómo mantenerte con vida en el campo de batalla.",
    skillProficiencies: ["atletismo", "intimidacion"],
    toolProficiencies: ["Vehículos (tierra)"],
    toolChoices: [
      "Juego de cartas",
      "Juego de dados",
      "Juego de tablero",
    ],
    toolChoiceCount: 1,
    extraLanguages: 0,
    equipment: [
      "Insignia de rango",
      "Trofeo tomado de un enemigo caído (daga, hoja rota o trozo de estandarte)",
      "Juego de dados de hueso o baraja de cartas",
      "Muda de ropas comunes",
    ],
    startingGold: 10,
    featureName: "Rango Militar",
    featureDescription:
      "Tienes un rango militar de tu carrera como soldado. Los soldados leales a tu antigua organización militar aún reconocen tu autoridad e influencia, y te muestran deferencia si son de un rango inferior. Puedes invocar tu rango para ejercer influencia sobre otros soldados y para requisar equipo o caballos simples para uso temporal. También puedes acceder a fortalezas y campamentos militares amigos.",
    personality: {
      traits: [
        "Siempre soy educado y respetuoso.",
        "Tengo cicatrices que me traen recuerdos horribles de una batalla.",
        "Me enfrento a los problemas directamente. La solución directa y sencilla es la mejor.",
        "Disfruto estando entre otros soldados y contando historias de batallas pasadas.",
        "Puedo fijar la mirada en un oso lechuza sin pestañear.",
        "La cortesía es ajena para mí. Prefiero resolver conflictos a puñetazos.",
        "Protejo ferozmente a aquellos que me importan.",
        "A nadie se le ocurriría encargarse de mis tareas; las termino a la perfección.",
      ],
      ideals: [
        "Bien Mayor. Nuestra suerte es dar la vida en defensa de los demás (bueno).",
        "Responsabilidad. Hago lo que debo y obedezco a la autoridad legítima (legal).",
        "Independencia. Cuando la gente sigue ciegamente las órdenes, acepta una especie de tiranía (caótico).",
        "Poder. En la vida, como en la guerra, gana el más fuerte (malvado).",
        "Vivir y Dejar Vivir. Los ideales no merecen que se mate o se vaya a la guerra por ellos (neutral).",
        "Nación. Mi ciudad, nación o pueblo es lo único que importa (cualquiera).",
      ],
      bonds: [
        "Aún daría mi vida por las personas con las que serví.",
        "Alguien me salvó la vida en el campo de batalla. A día de hoy, nunca dejaré atrás a un amigo.",
        "Mi honor es mi vida.",
        "Nunca olvidaré la aplastante derrota que sufrió mi compañía ni a los enemigos que la provocaron.",
        "Los que luchan a mi lado son los que vale la pena proteger.",
        "Lucho por aquellos que no pueden luchar por sí mismos.",
      ],
      flaws: [
        "El enemigo monstruoso que afronté en la batalla aún me produce escalofríos de terror.",
        "Tengo poco respeto por quien no sea un guerrero probado.",
        "Cometí un terrible error en batalla que costó muchas vidas y haría lo que fuera para que siguiera en secreto.",
        "Mi odio por mis enemigos es ciego e irracional.",
        "Obedezco la ley, incluso si la ley causa sufrimiento.",
        "Preferiría comer mi armadura antes que admitir que estoy equivocado.",
      ],
    },
    icon: "⚔️",
  },

  // ─── HUÉRFANO ──────────────────────────────────────────────────────
  huerfano: {
    id: "huerfano",
    nombre: "Huérfano",
    descripcion:
      "Creciste solo en las calles de una ciudad, huérfano y pobre. No tenías a nadie que cuidara de ti ni te proporcionara lo necesario, así que aprendiste a valerte por ti mismo. Luchaste ferozmente por la comida y vigilaste constantemente a los demás ladronzuelos que pudieran robarte.",
    skillProficiencies: ["juego_de_manos", "sigilo"],
    toolProficiencies: ["Kit de disfraz", "Herramientas de ladrón"],
    extraLanguages: 0,
    equipment: [
      "Cuchillo pequeño",
      "Mapa de la ciudad en la que creciste",
      "Mascota ratón",
      "Recuerdo de tus padres",
      "Muda de ropas comunes",
    ],
    startingGold: 10,
    featureName: "Secretos de la Ciudad",
    featureDescription:
      "Conoces los pasajes secretos que recorren la jungla urbana y que te permiten desplazarte por la ciudad el doble de rápido de lo que tu velocidad de viaje permitiría normalmente. Puedes encontrar refugio, comida y, cuando sea necesario, atención médica básica entre mendigos, ladrones y huérfanos.",
    personality: {
      traits: [
        "Escondo comida y baratijas en mis bolsillos.",
        "Hago muchas preguntas.",
        "Me gusta meterme en sitios estrechos donde nadie más puede alcanzarme.",
        "Duermo con la espalda pegada a una pared o a un árbol, con todo lo que poseo envuelto en un hatillo entre mis brazos.",
        "Como como un cerdo y tengo malos modales.",
        "Creo que cualquiera que sea amable conmigo esconde intenciones malvadas.",
        "No me gustan los baños.",
        "Digo las cosas sin rodeos, aunque moleste a los demás.",
      ],
      ideals: [
        "Respeto. Todas las personas, ricas o pobres, merecen respeto (bueno).",
        "Comunidad. Tenemos que cuidar los unos de los otros, porque nadie más lo hará (legal).",
        "Cambio. Los de abajo se elevarán y los de arriba caerán. El cambio es la naturaleza de las cosas (caótico).",
        "Retribución. Los ricos necesitan que les enseñen cómo es la vida y la muerte en los barrios pobres (malvado).",
        "Pueblo. Ayudo a las personas que me ayudan: así es como sobrevivimos (neutral).",
        "Aspiración. Voy a demostrar que soy digno de una vida mejor (cualquiera).",
      ],
      bonds: [
        "Mi ciudad es mi hogar y lucharé por defenderla.",
        "Patrocino un orfanato para evitar que otros sufran lo que yo he sufrido.",
        "Le debo mi supervivencia a otro huérfano que me enseñó a vivir en las calles.",
        "Tengo una deuda que nunca podré pagar con la persona que se apiadó de mí.",
        "Escapé de mi vida de pobreza robando a un mercader, y me siento culpable por ello.",
        "Nadie más debería tener que pasar por las dificultades que he soportado.",
      ],
      flaws: [
        "Si estoy en desventaja numérica, me largo. No tiene sentido morir.",
        "El oro me parece mucho dinero y haré casi cualquier cosa por unas monedas más.",
        "Nunca confiaré completamente en otra persona. Solo puedo confiar en mí mismo.",
        "Prefiero matar a alguien mientras duerme antes que en un combate justo.",
        "No es robar si yo lo necesito más que ellos.",
        "Las personas que no pueden cuidar de sí mismas no merecen que las ayuden.",
      ],
    },
    icon: "🏚️",
  },
  // ─── PEÓN DE BRUJALUZ (Expansión — El Brujaluz Más Allá) ─────────
  peon_brujaluz: {
    id: "peon_brujaluz",
    nombre: "Peón de Brujaluz",
    descripcion:
      "Has trabajado en el Carnaval de la Brujaluz, una feria itinerante que viaja entre el mundo mortal y el Feywild. Seas acróbata, mago de feria, payaso o tramoyista, la vida del carnaval te ha enseñado a montar y desmontar rápidamente, a improvisar ante cualquier contratiempo y a ganarte a un público difícil con tu encanto y destreza.",
    skillProficiencies: ["acrobacias", "interpretacion"],
    toolProficiencies: ["Herramientas de carpintero"],
    toolChoices: ["Kit de disfraz", "Instrumento musical (a elegir)"],
    toolChoiceCount: 1,
    extraLanguages: 1,
    equipment: [
      "Martillo de carpintero",
      "Disfraz de feria",
      "Carpa pequeña plegable",
      "Recuerdo del carnaval (pluma iridiscente, entrada mágica, etc.)",
      "Bolsa con 8 po",
    ],
    startingGold: 8,
    featureName: "Montar el Espectáculo",
    featureDescription:
      "Puedes montar un campamento o carpa en la mitad del tiempo habitual. Además, cuando realizas una prueba de Interpretación para entretener a una audiencia, tienes ventaja en la tirada. Los trabajadores de ferias y carnavales te reconocen como uno de los suyos y te ofrecen alojamiento y comida básica.",
    personality: {
      traits: [
        "Siempre estoy ensayando algún truco o acrobacia, incluso cuando no es necesario.",
        "No puedo evitar sonreír cuando veo a alguien disfrutar de un espectáculo.",
        "Hablo con un tono dramático y exagerado, como si siempre estuviera en escena.",
        "Me resulta imposible quedarme quieto; siempre estoy moviéndome o haciendo malabares.",
        "Trato cada situación como una actuación y busco arrancar aplausos.",
        "Guardo una colección de objetos curiosos que he recogido en el carnaval.",
        "Me pongo nervioso si paso demasiado tiempo sin una audiencia a quien entretener.",
        "Siempre encuentro una forma de convertir el trabajo duro en algo divertido.",
      ],
      ideals: [
        "Diversión. La risa es la mejor magia que existe (bueno).",
        "Libertad. El camino abierto y una carpa son todo lo que necesito (caótico).",
        "Comunidad. El carnaval es una familia, y la familia se protege (legal).",
        "Codicia. Cada espectáculo es una oportunidad para llenar los bolsillos (malvado).",
        "Creatividad. Siempre busco nuevas formas de asombrar al público (caótico).",
        "Tradición. El espectáculo debe continuar, pase lo que pase (neutral).",
      ],
      bonds: [
        "El Carnaval de la Brujaluz es mi hogar y haré lo que sea por protegerlo.",
        "Perdí a alguien querido durante una actuación. Nunca lo olvidaré.",
        "Mi disfraz de feria es lo más valioso que poseo; tiene un significado muy especial.",
        "Debo un favor a quien me dio mi primer empleo en el carnaval.",
        "Busco a un compañero que desapareció una noche bajo la luz feérica.",
        "Llevo la marca de un accidente que sufrí durante un espectáculo. Me recuerda mis límites.",
      ],
      flaws: [
        "No puedo resistirme a un buen reto, aunque sea peligroso.",
        "Miento con facilidad, incluso cuando la verdad me beneficiaría más.",
        "Soy adicto a la atención y me deprimo cuando me ignoran.",
        "Tiendo a subestimar los peligros reales, creyendo que todo es parte del espectáculo.",
        "Robo cosas pequeñas sin darme cuenta; es un viejo hábito del carnaval.",
        "Confío demasiado en las apariencias y me engañan con facilidad.",
      ],
    },
    icon: "🎪",
  },
  // ─── EXTRAVIADO FEÉRICO (Expansión — El Brujaluz Más Allá) ────────
  extraviado_feerico: {
    id: "extraviado_feerico",
    nombre: "Extraviado Feérico",
    descripcion:
      "De niño te perdiste en el Feywild, el plano de las hadas, y pasaste lo que parecieron años —o quizá solo instantes— en un reino donde el tiempo, la lógica y las emociones funcionan de manera distinta. Cuando regresaste al mundo mortal, descubriste que habías cambiado: ves cosas que otros no ven, sientes la magia en el aire y nunca has dejado de añorar aquel lugar extraño y maravilloso.",
    skillProficiencies: ["engano", "supervivencia"],
    toolProficiencies: [],
    extraLanguages: 2,
    equipment: [
      "Ropas que cambian sutilmente de color con la luz",
      "Piedra de toque feérica (pequeño objeto del Feywild)",
      "Frasquito de polvo de hada (decorativo)",
      "Diario de sueños feéricos",
      "Bolsa con 5 po",
    ],
    startingGold: 5,
    featureName: "Toque Feérico",
    featureDescription:
      "Puedes lanzar el truco druidcraft o prestidigitación a voluntad (sin gasto de espacio de conjuro). Además, tienes ventaja en las pruebas de Perspicacia y Engaño cuando tratas con criaturas feéricas. Las criaturas del Feywild te reconocen como alguien marcado por su plano y tienden a tratarte con curiosidad antes que con hostilidad.",
    personality: {
      traits: [
        "Hablo con animales y plantas como si pudieran entenderme… y a veces creo que lo hacen.",
        "Se me olvida que las reglas del mundo mortal son diferentes a las del Feywild.",
        "Me distraigo con facilidad ante cualquier cosa hermosa o brillante.",
        "A veces digo verdades incómodas sin darme cuenta de que son inapropiadas.",
        "Sueño despierto con frecuencia, y mis sueños parecen más reales que la vigilia.",
        "No comprendo del todo las costumbres sociales y a menudo cometo errores de etiqueta.",
        "Cuento historias sobre el Feywild que nadie cree, pero que son absolutamente ciertas.",
        "Me invade la nostalgia cuando veo luciérnagas, setas luminosas o la luz de la luna llena.",
      ],
      ideals: [
        "Asombro. El mundo está lleno de maravillas, y quiero descubrirlas todas (bueno).",
        "Libertad. Nadie debería estar atado a un señor feérico ni a ningún amo (caótico).",
        "Cautela. Aprendí en el Feywild que cada acuerdo tiene un precio oculto (legal).",
        "Poder. El conocimiento feérico me da una ventaja sobre los demás (malvado).",
        "Equilibrio. El mundo mortal y el Feywild deben coexistir en armonía (neutral).",
        "Redención. Debo deshacer el daño causado por mi tiempo en el Feywild (bueno).",
      ],
      bonds: [
        "Un ser feérico conoce mi nombre verdadero, y eso me ata a una deuda terrible.",
        "Dejé atrás a alguien querido en el Feywild y no descansaré hasta volver.",
        "El objeto feérico que llevo conmigo es lo único que me conecta con mi pasado.",
        "Un archifey me ofreció un trato que aún no he cumplido.",
        "Mi familia mortal me buscó durante años. Les debo una explicación.",
        "Llevo conmigo polvo de hada que me recuerda que hay belleza incluso en lo peligroso.",
      ],
      flaws: [
        "No distingo bien entre mentiras y verdad; en el Feywild todo es relativo.",
        "Me resulta imposible romper una promesa, incluso una hecha bajo engaño.",
        "Desconfío profundamente de cualquiera que me ofrezca algo «gratis».",
        "A veces desaparezco durante horas, perdido en ensoñaciones feéricas.",
        "Tengo un miedo irracional al hierro frío, como si fuera una criatura feérica.",
        "Mi vínculo con el Feywild me hace parecer extraño e inquietante ante los demás.",
      ],
    },
    icon: "🦋",
  },
  // ─── PERSONALIZADA (placeholder, datos reales vienen del editor) ───
  personalizada: {
    id: "personalizada",
    nombre: "Personalizada",
    descripcion: "Un trasfondo personalizado creado por el jugador.",
    skillProficiencies: [],
    toolProficiencies: [],
    extraLanguages: 0,
    equipment: [],
    startingGold: 0,
    featureName: "",
    featureDescription: "",
    personality: { traits: [], ideals: [], bonds: [], flaws: [] },
    icon: "✏️",
  },
};

// ─── Construir BackgroundData desde datos custom ─────────────────────

/**
 * Construye un BackgroundData a partir de la configuración de un trasfondo personalizado.
 */
export function buildBackgroundDataFromCustom(
  config: CustomBackgroundConfig,
): BackgroundData {
  return {
    id: "personalizada",
    nombre: config.nombre || "Personalizada",
    descripcion: config.descripcion,
    skillProficiencies: config.skillProficiencies,
    toolProficiencies: config.toolProficiencies,
    extraLanguages: config.extraLanguages,
    equipment: config.equipment,
    startingGold: config.startingGold,
    featureName: config.featureName,
    featureDescription: config.featureDescription,
    personality: { traits: [], ideals: [], bonds: [], flaws: [] },
    icon: "✏️",
  };
}

// ─── Funciones auxiliares ────────────────────────────────────────────

/**
 * Obtiene los datos completos de un trasfondo por su ID.
 */
export function getBackgroundData(backgroundId: BackgroundId): BackgroundData {
  return BACKGROUNDS[backgroundId];
}

/**
 * Devuelve la lista de trasfondos SRD como un array ordenado para selección.
 * No incluye "personalizada".
 */
export function getBackgroundList(): BackgroundData[] {
  return Object.values(BACKGROUNDS).filter((bg) => bg.id !== "personalizada");
}

/**
 * Obtiene las habilidades que otorga un trasfondo.
 */
export function getBackgroundSkills(backgroundId: BackgroundId): SkillKey[] {
  return BACKGROUNDS[backgroundId].skillProficiencies;
}

/**
 * Devuelve un rasgo de personalidad aleatorio del trasfondo.
 */
export function getRandomPersonalityTrait(backgroundId: BackgroundId): string {
  const traits = BACKGROUNDS[backgroundId].personality.traits;
  return traits[Math.floor(random() * traits.length)];
}

/**
 * Devuelve un ideal aleatorio del trasfondo.
 */
export function getRandomIdeal(backgroundId: BackgroundId): string {
  const ideals = BACKGROUNDS[backgroundId].personality.ideals;
  return ideals[Math.floor(random() * ideals.length)];
}

/**
 * Devuelve un vínculo aleatorio del trasfondo.
 */
export function getRandomBond(backgroundId: BackgroundId): string {
  const bonds = BACKGROUNDS[backgroundId].personality.bonds;
  return bonds[Math.floor(random() * bonds.length)];
}

/**
 * Devuelve un defecto aleatorio del trasfondo.
 */
export function getRandomFlaw(backgroundId: BackgroundId): string {
  const flaws = BACKGROUNDS[backgroundId].personality.flaws;
  return flaws[Math.floor(random() * flaws.length)];
}

/**
 * Genera un conjunto aleatorio de personalidad completo para un trasfondo.
 */
export function generateRandomPersonality(backgroundId: BackgroundId): {
  trait: string;
  ideal: string;
  bond: string;
  flaw: string;
} {
  return {
    trait: getRandomPersonalityTrait(backgroundId),
    ideal: getRandomIdeal(backgroundId),
    bond: getRandomBond(backgroundId),
    flaw: getRandomFlaw(backgroundId),
  };
}

/**
 * Iconos de trasfondos indexados por ID.
 */
export const BACKGROUND_ICONS: Record<BackgroundId, string> = {
  acolito: "⛪",
  charlatan: "🎭",
  criminal: "🗡️",
  artista: "🎶",
  heroe_del_pueblo: "🦸",
  artesano_gremial: "🔨",
  ermitano: "🏔️",
  noble: "👑",
  forastero: "🌲",
  sabio: "📚",
  marinero: "⚓",
  soldado: "⚔️",
  huerfano: "🏚️",
  peon_brujaluz: "🎪",
  extraviado_feerico: "🦋",
  personalizada: "✏️",
};

/**
 * IDs de trasfondos de expansión (no SRD).
 */
export const EXPANSION_BACKGROUND_IDS: BackgroundId[] = [
  "peon_brujaluz",
  "extraviado_feerico",
];
