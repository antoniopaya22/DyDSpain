# HU-13: Compendio SRD (Consulta de Referencia)

## Descripción General

La app incluye todo el contenido del SRD 5.1 en español (razas, clases, trasfondos, conjuros, equipamiento y dotes). El jugador debe poder consultar este contenido como material de referencia en cualquier momento, sin necesidad de tener un personaje creado. Esto convierte la app también en una herramienta de consulta rápida durante la partida.

---

## HU-13.1: Navegación del Compendio

**Como** usuario,
**quiero** acceder a un compendio organizado por categorías (Razas, Clases, Trasfondos, Conjuros, Equipamiento, Dotes),
**para** consultar reglas y contenido de D&D 5e sin tener que salir de la app.

### Criterios de Aceptación

- Existe una sección "Compendio" accesible desde el menú principal o tab de navegación.
- El compendio se organiza en las siguientes categorías:
  - **Razas** (9 razas + subrazas del SRD).
  - **Clases** (12 clases con subclases del SRD).
  - **Trasfondos** (13 trasfondos + variantes).
  - **Conjuros** (organizados por nivel 0-9).
  - **Equipamiento** (armas, armaduras, objetos de aventurero, packs).
  - **Dotes** (catálogo de dotes del SRD con prerrequisitos y efectos; solo visible si las dotes están activadas en Ajustes HU-14.3).
- Cada categoría muestra un listado con icono/nombre y opción de filtrar.
- El compendio funciona sin conexión a internet (datos locales).

---

## HU-13.2: Ficha de Raza

**Como** usuario,
**quiero** ver la ficha completa de una raza con todos sus rasgos y mecánicas,
**para** conocer sus bonificaciones y habilidades antes de elegirla para un personaje.

### Criterios de Aceptación

- La ficha de raza muestra:
  - Nombre y descripción breve.
  - Incremento de puntuación de característica (ej: Enano: +2 CON).
  - Edad, tamaño, velocidad.
  - Visión en la oscuridad (si aplica).
  - Rasgos raciales (resistencia, competencias, habilidades especiales).
  - Idiomas.
  - Subraza disponible (con rasgos adicionales).
- Se muestra un resumen visual compacto en la parte superior y detalles expandibles debajo.
- Si la raza tiene conjuros innatos (ej: Tiefling), se enlazan a las fichas de conjuro del compendio.

---

## HU-13.3: Ficha de Clase

**Como** usuario,
**quiero** ver la ficha completa de una clase con sus mecánicas, tabla de niveles y opciones de subclase,
**para** entender cómo funciona cada clase en el juego.

### Criterios de Aceptación

- La ficha de clase muestra:
  - Nombre y descripción de rol.
  - Dado de golpe.
  - Tiradas de salvación competentes.
  - Competencias en armas, armaduras, herramientas.
  - Habilidades elegibles y cantidad a elegir.
  - Equipamiento inicial.
  - Tabla de niveles (nivel 1-20) con rasgos obtenidos y, si aplica, espacios de hechizo.
  - Sección de subclase con nombre, nivel de acceso y rasgos del SRD.
  - Sección de lanzamiento de conjuros (si aplica): tipo (conocido/preparado/libro), característica de lanzamiento, trucos, etc.
- La navegación permite ir directamente a la sección de nivel actual del personaje (si se accede desde la hoja de personaje).

---

## HU-13.4: Ficha de Trasfondo

**Como** usuario,
**quiero** ver la ficha completa de un trasfondo con sus competencias, equipamiento y rasgo especial,
**para** elegir el trasfondo que mejor encaje con mi personaje.

### Criterios de Aceptación

- La ficha de trasfondo muestra:
  - Nombre y descripción temática.
  - Competencias en habilidades (2).
  - Competencias en herramientas e idiomas.
  - Equipamiento de trasfondo.
  - Oro inicial alternativo (si aplica).
  - Rasgo especial (ej: "Refugio de los Fieles" del Acólito).
  - Tablas de personalidad: rasgos, ideales, vínculos, defectos.
  - Variantes (Criminal → Espía, Noble → Caballero, etc.) con diferencias.

---

## HU-13.5: Ficha de Conjuro

**Como** usuario,
**quiero** ver la ficha completa de un conjuro con todos sus detalles mecánicos,
**para** entender cómo funciona y decidir si lo quiero para mi personaje.

### Criterios de Aceptación

- La ficha de conjuro muestra:
  - Nombre del conjuro.
  - Escuela de magia e indicador de nivel (0 = truco, 1-9).
  - Tiempo de lanzamiento.
  - Alcance.
  - Componentes (V, S, M — con descripción del material si aplica).
  - Duración (y si requiere concentración).
  - Descripción completa del efecto.
  - Escalado a niveles superiores (si aplica).
  - Si es ritual (marcador visual).
  - Clases que pueden usarlo (obtenido del mapeo clase↔conjuro).
- Se puede marcar un conjuro como "favorito" para acceso rápido.

---

## HU-13.6: Buscador Global del Compendio

**Como** usuario,
**quiero** buscar rápidamente cualquier contenido del compendio por nombre o palabra clave,
**para** encontrar información sin navegar por categorías.

### Criterios de Aceptación

- Existe una barra de búsqueda en la parte superior del compendio.
- La búsqueda opera sobre todas las categorías simultáneamente.
- Los resultados se agrupan por categoría (Razas, Clases, Conjuros, etc.).
- La búsqueda funciona con coincidencia parcial (ej: "bola" encuentra "Bola de Fuego").
- Se muestran como máximo 20 resultados con paginación o scroll infinito.
- La búsqueda es instantánea (filtrado local, sin red).

---

## HU-13.7: Filtros Avanzados de Conjuros

**Como** usuario,
**quiero** filtrar conjuros por nivel, escuela, clase y si son rituales o de concentración,
**para** encontrar rápidamente el conjuro que necesito.

### Criterios de Aceptación

- Se pueden aplicar los siguientes filtros (combinables):
  - **Nivel**: 0 (trucos), 1, 2, 3, 4, 5, 6, 7, 8, 9.
  - **Escuela**: Abjuración, Conjuración, Adivinación, Encantamiento, Evocación, Ilusión, Nigromancia, Transmutación.
  - **Clase**: Bardo, Brujo, Clérigo, Druida, Explorador, Hechicero, Mago, Paladín.
  - **Ritual**: Sí / No.
  - **Concentración**: Sí / No.
  - **Componentes**: V, S, M.
- Los filtros se aplican en tiempo real.
- Se muestra un contador de resultados (ej: "42 conjuros encontrados").
- Las selecciones de filtro se pueden limpiar de un solo toque.

---

## HU-13.8: Tablas de Equipamiento de Referencia

**Como** usuario,
**quiero** consultar las tablas de armas, armaduras y equipamiento de aventurero,
**para** conocer las propiedades, costes y pesos de los objetos del juego.

### Criterios de Aceptación

- Se muestran las tablas del SRD:
  - **Armas cuerpo a cuerpo sencillas y marciales**: nombre, coste, daño, peso, propiedades.
  - **Armas a distancia sencillas y marciales**: nombre, coste, daño, peso, alcance, propiedades.
  - **Armaduras ligeras, medias y pesadas**: nombre, coste, CA, fuerza requerida, desventaja en sigilo, peso.
  - **Escudos**.
  - **Equipamiento de aventurero**: nombre, coste, peso.
  - **Packs de equipamiento** (Pack de explorador, Pack de sacerdote, etc.): contenido y coste.
- Se puede ordenar cada tabla por nombre, coste o peso.
- Se puede buscar dentro de cada tabla.

### Notas Técnicas

- Las tablas de equipamiento deberán mantenerse como datos estáticos en la app hasta que se amplíe el SRD con más equipamiento.

---

## Modelo de Datos (Referencia)

```text
EntradaCompendio {
  id: UUID
  tipo: "raza" | "clase" | "trasfondo" | "conjuro" | "equipamiento"
  nombre: string
  contenido: JSON   // Estructura varía según tipo
  palabras_clave: string[]   // Para búsqueda eficiente
}

FavoritoCompendio {
  id: UUID
  usuario_id: UUID | null
  entrada_id: UUID
  tipo: "raza" | "clase" | "trasfondo" | "conjuro" | "equipamiento"
  fecha_agregado: Date
}
```

---

## Wireframe (Conceptual)

```
┌───────────────────────────────────┐
│        🔍 Buscar en compendio...  │
├───────────────────────────────────┤
│  ⚔️ Razas    │  🛡️ Clases        │
│  📜 Trasfondos│  ✨ Conjuros      │
│  🎒 Equipam. │  🎖️ Dotes         │
│  ⭐ Favoritos │                    │
├───────────────────────────────────┤
│                                   │
│   [ Contenido de la categoría    │
│     seleccionada con listado     │
│     filtrable y fichas           │
│     desplegables ]               │
│                                   │
└───────────────────────────────────┘
```

---

## Prioridad de Implementación

| Historia | Prioridad | Complejidad |
|----------|-----------|-------------|
| HU-13.1 Navegación compendio | 🔴 Alta | Media |
| HU-13.2 Ficha de raza | 🔴 Alta | Baja |
| HU-13.3 Ficha de clase | 🔴 Alta | Alta |
| HU-13.4 Ficha de trasfondo | 🟡 Media | Baja |
| HU-13.5 Ficha de conjuro | 🔴 Alta | Media |
| HU-13.6 Buscador global | 🟡 Media | Media |
| HU-13.7 Filtros de conjuros | 🟡 Media | Media |
| HU-13.8 Tablas de equipamiento | 🟢 Baja | Media |

---

## Dependencias

- **HU-06**: Gestión de hechizos (las fichas del compendio alimentan la selección de conjuros del personaje).
- **HU-07**: Inventario (las tablas de equipamiento alimentan el inventario del personaje).
- **HU-02**: Creación de personaje (las fichas de raza/clase/trasfondo se usan durante la creación).
- **HU-14**: Ajustes (el toggle de dotes activas controla la visibilidad de la categoría Dotes en el compendio).
- **HU-15**: Dotes (el catálogo de dotes del compendio alimenta la selección de dotes durante la subida de nivel).
- **Datos SRD locales**: Todo el contenido se carga de los archivos Markdown/JSON del SRD incluidos en la app.
