# HU-10: Modo Master (Director de Juego)

## Descripción General

La aplicación ofrece dos modos de uso seleccionables al inicio: **Modo Jugador (Player)** y **Modo Master**. El Modo Master es una **característica premium (de pago)** que permite al Director de Juego gestionar campañas, añadir jugadores mediante un código identificador y visualizar en tiempo real las hojas de personaje de sus jugadores, sincronizadas a través de **Supabase**.

---

## Historias de Usuario

### HU-10.1: Selección de Modo al Inicio

**Como** usuario,
**quiero** elegir entre "Modo Jugador" y "Modo Master" al abrir la aplicación por primera vez,
**para** acceder a las funcionalidades correspondientes a mi rol en la mesa de juego.

#### Criterios de Aceptación

- [ ] Al abrir la app por primera vez (o sin modo seleccionado), se muestra una pantalla de selección con dos opciones: **Modo Jugador** y **Modo Master**.
- [ ] Cada opción tiene un icono representativo, nombre y breve descripción de sus funcionalidades.
- [ ] El Modo Master muestra una insignia o etiqueta de **"Premium"** visible.
- [ ] La selección se guarda de forma persistente y se recuerda en siguientes aperturas.
- [ ] Se puede cambiar de modo en cualquier momento desde la pantalla de Ajustes (HU-14).
- [ ] Al seleccionar Modo Jugador, se accede al flujo normal de la app (gestión de partidas, personajes, etc.).
- [ ] Al seleccionar Modo Master, se verifica si el usuario tiene la suscripción premium activa antes de continuar.

#### Notas Técnicas

- Almacenar el modo seleccionado en almacenamiento local (AsyncStorage / Zustand).
- La verificación premium puede realizarse contra un flag en el perfil del usuario en Supabase.
- Considerar una animación o transición visual que refuerce la diferencia entre ambos modos.

---

### HU-10.2: Suscripción Premium para Modo Master

**Como** usuario,
**quiero** poder suscribirme al plan premium para desbloquear el Modo Master,
**para** acceder a las herramientas de Director de Juego.

#### Criterios de Aceptación

- [ ] Al intentar activar el Modo Master sin suscripción, se muestra una pantalla de información del plan premium con las funcionalidades incluidas.
- [ ] Se ofrece un botón de suscripción que redirige al flujo de compra in-app (App Store / Google Play).
- [ ] Tras la compra exitosa, el modo se desbloquea inmediatamente sin reiniciar la app.
- [ ] El estado de suscripción se sincroniza con el perfil del usuario en Supabase.
- [ ] Si la suscripción caduca o se cancela, el Modo Master se bloquea mostrando un aviso claro, pero los datos de las campañas del master se conservan.
- [ ] Existe una opción para restaurar compras.

#### Notas Técnicas

- Utilizar `expo-in-app-purchases` o `react-native-iap` para gestionar las compras.
- Almacenar el estado de suscripción tanto localmente (caché) como en Supabase (fuente de verdad).
- Validar los recibos de compra en el servidor (Supabase Edge Functions) para evitar fraudes.

---

### HU-10.3: Pantalla Principal del Modo Master

**Como** Master,
**quiero** ver una pantalla principal adaptada a mi rol con mis campañas,
**para** gestionar mis partidas como Director de Juego.

#### Criterios de Aceptación

- [ ] La pantalla principal en Modo Master muestra una lista de campañas creadas por el master.
- [ ] Cada campaña muestra: nombre, imagen/icono opcional, número de jugadores conectados y fecha de última sesión.
- [ ] Se puede crear, editar y eliminar campañas (similar a HU-01, pero orientado al master).
- [ ] Si no hay campañas, se muestra un mensaje invitando a crear una nueva.
- [ ] La interfaz tiene un estilo visual diferenciado (colores, iconografía) para distinguirla del Modo Jugador.

#### Notas Técnicas

- Reutilizar la estructura de datos de campaña (HU-01) extendida con campos específicos del master.
- Las campañas del master se almacenan tanto localmente como en Supabase.

---

### HU-10.4: Crear y Gestionar Campañas como Master

**Como** Master,
**quiero** crear campañas y configurar sus detalles,
**para** tener organizada la información de cada mesa de juego que dirijo.

#### Criterios de Aceptación

- [ ] Puedo crear una nueva campaña con: nombre (obligatorio), descripción (opcional) e imagen/icono (opcional).
- [ ] Puedo editar los datos de una campaña existente.
- [ ] Puedo eliminar una campaña con diálogo de doble confirmación (se elimina la relación con los jugadores, no sus personajes).
- [ ] La campaña se sincroniza con Supabase al crearla/editarla para que sea accesible en tiempo real.
- [ ] Cada campaña tiene un identificador único generado automáticamente.

#### Notas Técnicas

- Modelo de datos para campaña del master:

| Campo             | Tipo     | Obligatorio | Descripción                                  |
|-------------------|----------|-------------|----------------------------------------------|
| `id`              | UUID     | Sí          | Identificador único de la campaña            |
| `master_id`       | UUID     | Sí          | ID del usuario master (ref. a auth.users)    |
| `nombre`          | string   | Sí          | Nombre de la campaña                         |
| `descripcion`     | string   | No          | Descripción o notas de la campaña            |
| `imagen`          | string   | No          | URI de la imagen/icono                       |
| `jugadores`       | UUID[]   | No          | Lista de IDs de jugadores vinculados         |
| `creado_en`       | datetime | Sí          | Fecha de creación                            |
| `actualizado_en`  | datetime | Sí          | Fecha de última modificación                 |

---

### HU-10.5: Identificador de Jugador (Código para Compartir)

**Como** jugador (en Modo Jugador),
**quiero** tener un identificador único que pueda compartir con mi Master,
**para** que pueda añadirme a su campaña y ver mi personaje en tiempo real.

#### Criterios de Aceptación

- [ ] Cada usuario en Modo Jugador tiene un **código de jugador** único visible en su perfil o en la pantalla de ajustes.
- [ ] El código es corto, legible y fácil de dictar/copiar (ej. 6-8 caracteres alfanuméricos, como `A7K3MX`).
- [ ] Existe un botón para **copiar** el código al portapapeles.
- [ ] Existe un botón para **compartir** el código mediante la hoja de compartir del sistema (WhatsApp, mensaje, etc.).
- [ ] El código se genera al crear la cuenta del usuario en Supabase y es permanente.
- [ ] Se muestra el nombre del jugador junto al código para verificar la identidad.

#### Notas Técnicas

- El código puede ser un hash corto derivado del UUID del usuario, o un código generado independientemente y almacenado en la tabla `profiles` de Supabase.
- Garantizar unicidad del código con una constraint UNIQUE en la base de datos.
- Considerar un formato legible que evite ambigüedades (sin `0/O`, `1/l/I`).

---

### HU-10.6: Añadir Jugadores a una Campaña

**Como** Master,
**quiero** añadir jugadores a mi campaña introduciendo su código de jugador,
**para** vincularlos y poder ver sus personajes en tiempo real.

#### Criterios de Aceptación

- [ ] Desde la vista de una campaña, existe un botón "Añadir jugador".
- [ ] Se abre un formulario donde el master introduce el código del jugador.
- [ ] Al introducir un código válido, se muestra el **nombre del jugador** para confirmar antes de añadirlo.
- [ ] Si el código es inválido o no existe, se muestra un mensaje de error claro.
- [ ] Al confirmar, el jugador queda vinculado a la campaña.
- [ ] El jugador puede estar vinculado a múltiples campañas de diferentes masters.
- [ ] Se muestra la lista de jugadores actuales de la campaña con opción de eliminarlos.
- [ ] Al eliminar un jugador de la campaña, se desvincula pero sus datos de personaje permanecen intactos en su cuenta.

#### Notas Técnicas

- Tabla intermedia en Supabase para la relación campaña-jugador:

| Campo           | Tipo     | Descripción                                  |
|-----------------|----------|----------------------------------------------|
| `campana_id`    | UUID     | Referencia a la campaña del master           |
| `jugador_id`    | UUID     | Referencia al usuario jugador                |
| `personaje_id`  | UUID     | Referencia al personaje del jugador (puede ser null hasta que se asigne) |
| `unido_en`      | datetime | Fecha en que se añadió                       |

- Utilizar Row Level Security (RLS) en Supabase para que el master solo pueda leer (no modificar) los datos de los personajes de sus jugadores.

---

### HU-10.7: Selección de Personaje por el Jugador

**Como** jugador vinculado a una campaña de un Master,
**quiero** seleccionar qué personaje comparto con esa campaña,
**para** que el Master vea la ficha correcta del personaje que estoy jugando.

#### Criterios de Aceptación

- [ ] Cuando un Master añade a un jugador a su campaña, el jugador recibe una notificación o indicador visible en su app.
- [ ] El jugador puede ver las campañas de Master a las que está vinculado (sección especial en su interfaz).
- [ ] Para cada campaña, el jugador selecciona cuál de sus personajes compartir.
- [ ] El jugador puede cambiar el personaje compartido en cualquier momento.
- [ ] El jugador puede dejar de compartir (desvincularse) de una campaña de Master si lo desea.

#### Notas Técnicas

- Los datos del personaje se sincronizan con Supabase cuando el jugador confirma compartir.
- Cualquier cambio que el jugador haga en su personaje (local) se refleja en Supabase automáticamente.

---

### HU-10.8: Vista en Tiempo Real de Personajes (Panel del Master)

**Como** Master,
**quiero** ver las hojas de personaje de mis jugadores actualizadas en tiempo real,
**para** tener siempre la información actualizada durante la sesión sin preguntar a cada jugador.

#### Criterios de Aceptación

- [ ] Al abrir una campaña, el master ve una lista con los personajes vinculados de sus jugadores.
- [ ] Para cada personaje se muestra una **tarjeta resumen** con:
  - Nombre del personaje y nombre del jugador.
  - Clase y nivel.
  - Puntos de golpe actuales / máximos (con indicador visual: sano, herido, crítico, inconsciente).
  - Clase de armadura (CA).
  - Espacios de hechizo restantes por nivel (si aplica).
  - Condiciones/estados activos (envenenado, paralizado, etc.).
  - Recursos de clase consumidos (Furia, Ki, Canalizar divinidad, etc.).
- [ ] Al pulsar en una tarjeta, se abre la **vista completa** de la hoja de personaje (misma vista que el jugador en Modo Jugador, pero en modo solo lectura).
- [ ] Los datos se actualizan en **tiempo real** cuando el jugador modifica su personaje.
- [ ] Se muestra un indicador de "última actualización" por cada personaje.
- [ ] Si un jugador no ha estado activo recientemente, se muestra un indicador de estado (ej. "Desconectado").

#### Notas Técnicas

- Utilizar **Supabase Realtime** (suscripciones a cambios en la base de datos) para recibir actualizaciones en vivo.
- Enviar solo deltas (cambios parciales) para optimizar el ancho de banda.
- Los datos privados del jugador (notas personales) **no** se comparten con el master.
- La vista de hoja de personaje del master es **solo lectura**: el master no puede modificar los personajes.
- Priorizar baja latencia (< 2 segundos para reflejar cambios).

---

### HU-10.9: Sincronización de Datos con Supabase

**Como** usuario (jugador o master),
**quiero** que mis datos se sincronicen automáticamente con la nube,
**para** que la información esté siempre actualizada entre dispositivos y sea accesible para el Master.

#### Criterios de Aceptación

- [ ] Los datos del personaje del jugador se sincronizan con Supabase cuando:
  - Se crea o modifica un personaje compartido con una campaña de Master.
  - Se producen cambios en PG, espacios de hechizo, inventario, condiciones, recursos de clase, etc.
- [ ] La sincronización funciona en segundo plano sin bloquear la interfaz del usuario.
- [ ] Si no hay conexión a internet, los cambios se almacenan localmente y se sincronizan cuando se recupere la conexión (offline-first).
- [ ] Los conflictos de sincronización se resuelven con la estrategia **"last write wins"** (la última escritura prevalece).
- [ ] Se muestra un indicador sutil del estado de sincronización (sincronizado ✓, sincronizando ↻, pendiente ⏳).

#### Notas Técnicas

- Implementar una cola de sincronización local para manejar el modo offline.
- Utilizar Supabase JS Client con suscripciones Realtime para push/pull de datos.
- Esquema Supabase principal:

```text
auth.users
  └── profiles (id, nombre, codigo_jugador, es_premium, modo_actual)

personajes (id, usuario_id, datos_personaje JSONB, actualizado_en)
  └── sincronizado con la app local del jugador

campanas_master (id, master_id, nombre, descripcion, imagen, creado_en)
  └── campana_jugadores (campana_id, jugador_id, personaje_id, unido_en)
```

- Row Level Security (RLS):
  - Un jugador solo puede leer/escribir sus propios personajes.
  - Un master puede leer (no escribir) los personajes vinculados a sus campañas.
  - Un master solo puede gestionar sus propias campañas.

---

## Modelo de Datos (Referencia)

```text
Profile {
  id: UUID                     // auth.users.id
  nombre: string               // Nombre del usuario
  codigo_jugador: string       // Código único compartible (ej. "A7K3MX")
  es_premium: boolean          // Si tiene suscripción premium activa
  modo_actual: "jugador" | "master"  // Último modo seleccionado
  creado_en: datetime
  actualizado_en: datetime
}

CampanaMaster {
  id: UUID
  master_id: UUID              // Referencia al perfil del master
  nombre: string
  descripcion: string | null
  imagen: string | null
  creado_en: datetime
  actualizado_en: datetime
}

CampanaJugador {
  campana_id: UUID             // Referencia a CampanaMaster
  jugador_id: UUID             // Referencia al perfil del jugador
  personaje_id: UUID | null    // Personaje que el jugador comparte
  unido_en: datetime
}

PersonajeSincronizado {
  id: UUID
  usuario_id: UUID             // Dueño del personaje
  datos: JSONB                 // Snapshot completo del personaje
  actualizado_en: datetime
}
```

---

## Prioridad de Implementación

| Historia | Prioridad | Complejidad |
|----------|-----------|-------------|
| HU-10.1 Selección de modo | 🔴 Alta | Baja |
| HU-10.2 Suscripción premium | 🔴 Alta | Alta |
| HU-10.3 Pantalla principal master | 🔴 Alta | Media |
| HU-10.4 Crear/gestionar campañas | 🔴 Alta | Media |
| HU-10.5 Identificador de jugador | 🔴 Alta | Baja |
| HU-10.6 Añadir jugadores | 🔴 Alta | Media |
| HU-10.7 Selección de personaje | 🟡 Media | Media |
| HU-10.8 Vista tiempo real | 🔴 Alta | Alta |
| HU-10.9 Sincronización Supabase | 🔴 Alta | Alta |

---

## Dependencias

- **HU-01**: Gestión de partidas (estructura base de campañas).
- **HU-03**: Hoja de personaje (vista que se replica para el master en solo lectura).
- **HU-04**: Estadísticas y habilidades (datos visibles en el panel del master).
- **HU-06**: Hechizos (espacios de hechizo visibles en el panel del master).
- **HU-08**: Vida y combate (PG y condiciones visibles en el panel del master).
- **HU-12**: Recursos de clase (estados de recursos visibles en el panel del master).
- **HU-14**: Ajustes (cambio de modo entre Jugador y Master).

---

## Wireframe Conceptual

```
┌─────────────────────────────────────────────┐
│           ¿Cómo quieres usar la app?        │
│                                             │
│   ┌─────────────┐     ┌─────────────┐       │
│   │  ⚔️ Jugador  │     │  👑 Master  │       │
│   │             │     │  ★ Premium  │       │
│   │ Crea y      │     │ Dirige      │       │
│   │ gestiona    │     │ campañas y  │       │
│   │ tus         │     │ monitoriza  │       │
│   │ personajes  │     │ jugadores   │       │
│   └─────────────┘     └─────────────┘       │
└─────────────────────────────────────────────┘

┌─ Panel del Master ──────────────────────────┐
│ Campaña: "La Maldición de Strahd"           │
│ Jugadores: 4                                │
│                                             │
│ ┌──────────────────┐ ┌──────────────────┐   │
│ │ 🛡️ Thorin         │ │ 🧙 Elara          │   │
│ │ Guerrero Nv.5    │ │ Maga Nv.5        │   │
│ │ PG: 38/45 ██░░  │ │ PG: 22/22 ████  │   │
│ │ CA: 18           │ │ CA: 12           │   │
│ │ Hechizos: —      │ │ Hechizos: 2/4    │   │
│ │                  │ │ Nv1: ●●○○        │   │
│ └──────────────────┘ └──────────────────┘   │
│                                             │
│ ┌──────────────────┐ ┌──────────────────┐   │
│ │ 🗡️ Kael           │ │ ✝️ Seren          │   │
│ │ Pícaro Nv.5      │ │ Clérigo Nv.5     │   │
│ │ PG: 8/30 █░░░   │ │ PG: 35/35 ████  │   │
│ │ CA: 15           │ │ CA: 18           │   │
│ │ Att. furtivo: ✓  │ │ Canal Div: 1/2   │   │
│ │ ⚠️ Envenenado     │ │ Hechizos: 1/4    │   │
│ └──────────────────┘ └──────────────────┘   │
│                                             │
│ [+ Añadir Jugador]                          │
└─────────────────────────────────────────────┘
```
