# HU-01 — Gestión de Partidas

## Descripción general

El usuario puede organizar sus personajes dentro de **partidas** (también llamadas campañas). Cada partida representa una mesa de juego de D&D y contiene al menos un personaje del jugador.

---

## Historias de Usuario

### HU-01.1 — Ver lista de partidas

**Como** jugador,
**quiero** ver una lista de todas mis partidas,
**para** poder acceder rápidamente a la campaña en la que quiero jugar.

**Criterios de aceptación:**

- Al abrir la aplicación se muestra la lista de partidas creadas.
- Cada partida muestra su nombre, una imagen o icono opcional, y el nombre del personaje asociado.
- Si no hay partidas, se muestra un mensaje invitando a crear una nueva.
- Las partidas se ordenan por última fecha de acceso (la más reciente primero).

---

### HU-01.2 — Crear una nueva partida

**Como** jugador,
**quiero** crear una nueva partida,
**para** organizar un nuevo personaje dentro de una campaña.

**Criterios de aceptación:**

- Existe un botón visible para crear una nueva partida.
- Al crear la partida se solicita como mínimo un **nombre** para la partida.
- Opcionalmente se puede añadir una descripción y una imagen o icono.
- Tras crear la partida, se redirige al flujo de creación/asignación de personaje.
- El nombre de la partida no puede estar vacío.

---

### HU-01.3 — Editar una partida existente

**Como** jugador,
**quiero** poder editar el nombre, descripción e imagen de una partida,
**para** mantener organizada mi información.

**Criterios de aceptación:**

- Desde la vista de detalle de la partida se puede acceder a la edición.
- Se pueden modificar: nombre, descripción e imagen/icono.
- Los cambios se guardan de forma persistente en el dispositivo.

---

### HU-01.4 — Eliminar una partida

**Como** jugador,
**quiero** poder eliminar una partida que ya no uso,
**para** mantener limpia mi lista de campañas.

**Criterios de aceptación:**

- Se puede eliminar una partida desde la lista o desde su vista de detalle.
- Antes de eliminar se muestra un diálogo de confirmación indicando que se perderá el personaje asociado.
- Al confirmar, se elimina la partida y el personaje vinculado de forma permanente.

---

### HU-01.5 — Acceder al personaje de una partida

**Como** jugador,
**quiero** pulsar sobre una partida para acceder directamente a la hoja de mi personaje,
**para** poder consultar o editar mi personaje de forma rápida.

**Criterios de aceptación:**

- Al pulsar en una partida se navega a la hoja de personaje asociada.
- Si la partida no tiene personaje aún, se redirige al flujo de creación de personaje.
- Se actualiza la fecha de último acceso de la partida.

---

### HU-01.6 — Persistencia local de datos

**Como** jugador,
**quiero** que mis partidas y personajes se guarden en el dispositivo,
**para** no perder mi progreso al cerrar la aplicación.

**Criterios de aceptación:**

- Todos los datos de partidas y personajes se almacenan de forma local (AsyncStorage, SQLite o similar).
- Al reabrir la aplicación, los datos persisten tal y como se dejaron.
- No se requiere conexión a internet para el uso básico de la aplicación.

---

## Notas técnicas

- Cada partida tendrá un identificador único (`id`).
- Modelo de datos tentativo para una partida:

| Campo          | Tipo     | Obligatorio | Descripción                          |
| -------------- | -------- | ----------- | ------------------------------------ |
| `id`           | string   | Sí          | UUID generado automáticamente        |
| `nombre`       | string   | Sí          | Nombre de la partida                 |
| `descripcion`  | string   | No          | Descripción o notas de la campaña    |
| `imagen`       | string   | No          | URI de la imagen/icono               |
| `personajeId`  | string   | No          | Referencia al personaje asociado     |
| `creadoEn`     | datetime | Sí          | Fecha de creación                    |
| `actualizadoEn`| datetime | Sí          | Fecha de última modificación/acceso  |

---

## Prioridad

🔴 **Alta** — Es la funcionalidad base sobre la que se construye todo lo demás.