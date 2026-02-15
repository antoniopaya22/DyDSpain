# HU-09: Notas del Personaje y de Partida

## Descripción General

El jugador necesita un sistema flexible de notas para registrar información importante durante sus partidas: nombres de NPCs, lugares visitados, misiones, pistas, y cualquier otro detalle relevante para la aventura.

---

## HU-09.1: Crear Nota

**Como** jugador,
**quiero** poder crear notas de texto libre asociadas a mi personaje,
**para** registrar información importante durante la partida.

### Criterios de Aceptación

- Puedo crear una nueva nota desde la sección de notas de mi personaje.
- Cada nota tiene un **título** (obligatorio) y un **contenido** (texto libre).
- Se registra automáticamente la **fecha de creación**.
- La nota queda asociada al personaje activo en la partida actual.
- El contenido admite texto largo sin límite práctico de caracteres.

### Notas Técnicas

- Almacenamiento local con persistencia.
- El editor de texto debe ser cómodo para móvil (teclado completo, scroll suave).

---

## HU-09.2: Editar Nota

**Como** jugador,
**quiero** poder editar mis notas existentes,
**para** corregir o ampliar la información registrada.

### Criterios de Aceptación

- Puedo abrir cualquier nota existente y modificar su título y contenido.
- Se registra la **fecha de última modificación**.
- Los cambios se guardan al confirmar o al salir del editor.
- Si salgo sin guardar, se me pregunta si quiero descartar los cambios.

---

## HU-09.3: Eliminar Nota

**Como** jugador,
**quiero** poder eliminar notas que ya no necesito,
**para** mantener organizada mi lista de notas.

### Criterios de Aceptación

- Puedo eliminar una nota individual.
- Se muestra un diálogo de confirmación antes de borrar.
- La eliminación es permanente.
- La lista de notas se actualiza inmediatamente tras la eliminación.

---

## HU-09.4: Listar y Buscar Notas

**Como** jugador,
**quiero** ver una lista de todas mis notas y poder buscar entre ellas,
**para** encontrar rápidamente la información que necesito.

### Criterios de Aceptación

- Se muestra una lista de notas ordenada por **fecha de última modificación** (más recientes primero).
- Cada elemento de la lista muestra el título, una vista previa del contenido (primeras líneas) y la fecha.
- Hay un campo de **búsqueda** que filtra notas por título y contenido.
- Si no hay notas, se muestra un mensaje indicativo con opción de crear una.

---

## HU-09.5: Categorizar Notas con Etiquetas

**Como** jugador,
**quiero** poder asignar etiquetas o categorías a mis notas,
**para** organizarlas por temas (NPCs, Lugares, Misiones, Objetos, Lore, etc.).

### Criterios de Aceptación

- Al crear o editar una nota, puedo asignarle una o varias **etiquetas**.
- Existen etiquetas predefinidas:
  - 🧑 **NPC**
  - 📍 **Lugar**
  - ⚔️ **Misión**
  - 🔮 **Objeto**
  - 📖 **Lore / Historia**
  - 💡 **Pista**
  - 💰 **Comercio**
  - 📝 **General**
- Puedo crear **etiquetas personalizadas**.
- Puedo filtrar la lista de notas por etiqueta.
- Las etiquetas se muestran visualmente junto al título de la nota (badges de color).

---

## HU-09.6: Fijar Notas Importantes

**Como** jugador,
**quiero** poder fijar notas importantes en la parte superior de la lista,
**para** tener siempre a mano la información más relevante.

### Criterios de Aceptación

- Puedo marcar/desmarcar una nota como **fijada** (pin).
- Las notas fijadas aparecen siempre en la parte superior de la lista, separadas visualmente.
- Dentro de las notas fijadas, se mantiene el orden por fecha de modificación.
- Se indica visualmente que la nota está fijada (icono de pin o similar).

---

## HU-09.7: Notas de Sesión (Diario de Aventura)

**Como** jugador,
**quiero** poder crear notas de sesión con un formato especial de diario,
**para** llevar un registro cronológico de lo que ocurre en cada sesión de juego.

### Criterios de Aceptación

- Existe un tipo especial de nota: **Entrada de Diario / Sesión**.
- Cada entrada de diario incluye:
  - **Número de sesión** (auto-incremental o manual).
  - **Fecha de la sesión** (editable, por defecto la fecha actual).
  - **Título / Resumen** de la sesión.
  - **Contenido** libre.
- Las entradas de diario se listan en orden cronológico.
- Se puede acceder al diario de aventura como una vista separada de las notas generales.

---

## HU-09.8: Notas Compartidas con el Master (Modo Master)

**Como** jugador,
**quiero** poder marcar ciertas notas como visibles para el Master,
**para** que pueda consultarlas si es necesario durante la partida.

**Como** Master,
**quiero** poder enviar notas a los jugadores de mi sala,
**para** comunicarles información narrativa, descripciones o pistas.

### Criterios de Aceptación

- El jugador puede marcar una nota como **"Visible para el Master"**.
- El Master, desde su panel, puede ver las notas compartidas de cada jugador conectado.
- El Master puede crear una nota y enviarla a **uno, varios o todos** los jugadores de la sala.
- Las notas recibidas del Master aparecen con una marca visual especial (icono de pergamino o similar).
- Las notas del Master son de solo lectura para el jugador receptor.
- Requiere conexión activa a la sala del Master para el envío/recepción.

---

## HU-09.9: Notas Rápidas

**Como** jugador,
**quiero** poder crear notas rápidas desde cualquier pantalla de la app,
**para** no perder tiempo navegando cuando necesito apuntar algo en medio de la partida.

### Criterios de Aceptación

- Existe un **botón flotante** (FAB) o acceso rápido accesible desde las pantallas principales.
- Al pulsarlo se abre un mini-editor con campo de texto.
- La nota rápida se guarda con un título auto-generado (ej: "Nota rápida - 15/03/2025 21:34").
- Puedo editar el título y añadir etiquetas después.
- El flujo es: pulsar botón → escribir → guardar. Máximo 3 toques.

---

## Modelo de Datos (Referencia)

```text
Nota {
  id: UUID
  personaje_id: UUID
  partida_id: UUID
  titulo: string
  contenido: string
  etiquetas: string[]
  fijada: boolean
  tipo: "general" | "diario"
  numero_sesion: number | null        // Solo para tipo "diario"
  fecha_sesion: date | null           // Solo para tipo "diario"
  visible_para_master: boolean
  enviada_por_master: boolean
  master_remitente_id: UUID | null
  fecha_creacion: datetime
  fecha_modificacion: datetime
}
```

---

## Prioridad de Implementación

| Historia | Prioridad | Complejidad |
|----------|-----------|-------------|
| HU-09.1 Crear nota | 🔴 Alta | Baja |
| HU-09.2 Editar nota | 🔴 Alta | Baja |
| HU-09.3 Eliminar nota | 🔴 Alta | Baja |
| HU-09.4 Listar y buscar | 🔴 Alta | Media |
| HU-09.5 Etiquetas | 🟡 Media | Media |
| HU-09.6 Fijar notas | 🟡 Media | Baja |
| HU-09.7 Diario de sesión | 🟡 Media | Media |
| HU-09.8 Notas compartidas | 🟠 Media-Baja | Alta |
| HU-09.9 Notas rápidas | 🟡 Media | Baja |