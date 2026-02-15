# HU-15: Dotes (Feats)

## Descripción General

Las dotes son una regla opcional de D&D 5e que permite a un personaje adquirir habilidades especiales en lugar de incrementar sus puntuaciones de característica (ASI) al alcanzar ciertos niveles. La app debe ofrecer un catálogo de dotes del SRD, permitir al jugador elegir dotes durante la subida de nivel y aplicar sus efectos mecánicos al personaje.

> **Nota**: Las dotes son una regla opcional. Esta funcionalidad solo está disponible si el toggle "Dotes activas" está activado en Ajustes (HU-14.3).

---

## HU-15.1: Catálogo de Dotes

**Como** jugador,
**quiero** consultar un catálogo con todas las dotes disponibles del SRD,
**para** conocer sus efectos y requisitos antes de elegir una.

### Criterios de Aceptación

- Existe una sección "Dotes" dentro del Compendio (HU-13) o accesible durante la subida de nivel.
- Se listan las dotes del SRD 5.1 con:
  - Nombre de la dote.
  - Prerrequisito (si lo tiene, ej: "Fuerza 13 o más", "Competencia con armadura pesada").
  - Descripción completa de los beneficios.
- Las dotes que el personaje no puede tomar (por no cumplir prerrequisitos) se muestran atenuadas con indicación del motivo.
- Se puede buscar y filtrar por nombre.

### Dotes del SRD 5.1

| Dote | Prerrequisito |
|------|--------------|
| Alerta | — |
| Atleta | — |
| Actor | — |
| Cargador | — |
| Combatiente con Escudo Maestro | — |
| Competencia con Armadura Ligera | — |
| Competencia con Armadura Media | Comp. armadura ligera |
| Competencia con Armadura Pesada | Comp. armadura media |
| Competencia con Armas Marciales | Comp. armas sencillas |
| Diestro | — |
| Durable | — |
| Experto en Agarrar | — |
| Gran Maestro de Armas | — |
| Inspirador | — |
| Luchador con Arma a Dos Manos | — |
| Luchador con Arma Ligera (Doble Empuñadura) | — |
| Mago de Guerra | Capacidad de lanzar al menos un conjuro |
| Observador | — |
| Resistente | — |
| Tirador Certero | — |
| Tough (Curtido) | — |

> La lista puede variar según la traducción al español del SRD; se incluirán las dotes oficiales disponibles.

---

## HU-15.2: Elegir Dote al Subir de Nivel

**Como** jugador,
**quiero** poder elegir una dote en lugar de un ASI cuando mi personaje alcanza un nivel de ASI,
**para** personalizar mi personaje con habilidades únicas.

### Criterios de Aceptación

- En los niveles de ASI (normalmente 4, 8, 12, 16, 19 — varía por clase), si las dotes están activadas, se ofrece al jugador:
  - Opción A: **Incrementar características** (ASI estándar: +2 a una o +1 a dos).
  - Opción B: **Elegir una dote**.
- Si elige dote, se muestra el catálogo filtrado a dotes disponibles (que cumplan prerrequisitos).
- Al seleccionar una dote, se muestra un resumen de sus beneficios antes de confirmar.
- Tras confirmar, la dote se añade al personaje y no se puede elegir de nuevo (cada dote solo se toma una vez).
- Una dote elegida se muestra en la hoja de personaje con una marca visual.

### Notas Técnicas

- La elección Dote vs ASI debe integrarse con el flujo de HU-05 (subir de nivel).

---

## HU-15.3: Aplicar Efectos Mecánicos de la Dote

**Como** jugador,
**quiero** que los efectos mecánicos de una dote se apliquen automáticamente a mi personaje,
**para** que mis estadísticas reflejen los beneficios sin ajustes manuales.

### Criterios de Aceptación

- Los efectos de cada dote se aplican correctamente. Ejemplos:
  - **Alerta**: +5 a Iniciativa, no puede ser sorprendido, otros no ganan ventaja por estar ocultos.
  - **Atleta**: +1 FUE o DES, ponerse de pie cuesta solo 5 pies de movimiento, trepar no reduce velocidad.
  - **Tough (Curtido)**: PG máximos +2 por nivel (retroactivo y futuro).
  - **Resistente**: +1 a una característica + competencia en la salvación de esa característica.
  - **Mago de Guerra**: Ventaja en concentración, conjuros somáticos con manos ocupadas, truco extra.
  - **Observador**: +5 a Percepción Pasiva y Investigación Pasiva, leer labios, +1 INT o SAB.
- Si la dote otorga +1 a una característica, se pide al jugador que elija cuál (si hay opciones).
- Los bonificadores se reflejan en la hoja de personaje (HU-03 / HU-04).
- Se muestra qué dotes tiene el personaje y sus efectos en la sección correspondiente.

### Notas Técnicas

- Los efectos de dotes son variados (bonificadores a stats, nuevas capacidades, competencias). No todos se pueden automatizar completamente. En esos casos, se muestra el texto descriptivo como recordatorio.

---

## HU-15.4: Lista de Dotes del Personaje

**Como** jugador,
**quiero** ver en la hoja de personaje todas las dotes que he adquirido,
**para** recordar qué beneficios tengo y cuándo los obtuve.

### Criterios de Aceptación

- En la hoja de personaje existe una sección "Dotes" (o "Feats").
- Cada dote muestra:
  - Nombre.
  - Nivel en que fue adquirida.
  - Resumen de beneficios (expandible a descripción completa).
  - Si aplicó bonificador a característica, cuál fue la elección.
- Si el personaje no tiene dotes, se muestra un mensaje indicando que puede elegir dotes en niveles de ASI (si las dotes están activadas).

---

## Modelo de Datos (Referencia)

```text
Dote {
  id: UUID
  nombre: string
  descripcion: string
  prerrequisito: string | null
  efectos: [{
    tipo: "bonus_stat" | "bonus_iniciativa" | "bonus_hp" | "competencia" | "capacidad" | "otro"
    stat: string | null          // Ej: "FUE", "DES", "iniciativa"
    valor: number | null         // Ej: 1, 5, 2
    eleccion: boolean            // true si el jugador elige qué stat
    opciones_stat: string[]      // ["FUE", "DES"] para dotes con elección
    descripcion: string          // Texto del efecto para capacidades no automatizables
  }]
}

DotePersonaje {
  id: UUID
  personaje_id: UUID
  dote_id: UUID
  nivel_adquirido: number
  elecciones: {                  // Decisiones tomadas por el jugador
    stat_elegido: string | null  // Ej: "SAB" para Resistente
  }
}
```

---

## Prioridad de Implementación

| Historia | Prioridad | Complejidad |
|----------|-----------|-------------|
| HU-15.1 Catálogo de dotes | 🟡 Media | Baja |
| HU-15.2 Elegir dote en subida nivel | 🟡 Media | Media |
| HU-15.3 Aplicar efectos mecánicos | 🟡 Media | Alta |
| HU-15.4 Lista dotes del personaje | 🟡 Media | Baja |

---

## Dependencias

- **HU-04**: Estadísticas (las dotes modifican stats, salvaciones, HP, etc.).
- **HU-05**: Subir de nivel (la elección Dote vs ASI ocurre durante la subida).
- **HU-13**: Compendio (catálogo de dotes como contenido de referencia).
- **HU-14**: Ajustes (toggle para activar/desactivar dotes como regla opcional).
