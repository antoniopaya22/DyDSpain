# HU-10: Modo Master (Director de Juego)

## Descripción General

Como **Director de Juego (DM/Master)**, quiero un modo especial en la aplicación que me permita crear salas de partida, invitar jugadores y monitorizar en tiempo real el estado de sus personajes durante la sesión de juego.

---

## Historias de Usuario

### HU-10.1: Activar Modo Master

**Como** director de juego,
**quiero** poder activar el "Modo Master" dentro de una partida,
**para** acceder a las herramientas de gestión de sesión en vivo.

#### Criterios de Aceptación

- [ ] Existe una opción claramente visible para activar el Modo Master en una partida
- [ ] Al activar el modo, se muestra un panel de control específico para el DM
- [ ] El modo master es independiente por partida (puedo ser jugador en una y master en otra)
- [ ] Al desactivar el modo, se vuelve a la vista normal de partida

#### Notas Técnicas

- El rol de master se asigna a nivel de partida, no de usuario global
- Un mismo usuario puede ser master en una partida y jugador en otra

---

### HU-10.2: Crear Sala de Sesión

**Como** director de juego,
**quiero** poder crear una sala de sesión en vivo,
**para** que los jugadores de mi partida se conecten durante la sesión de juego.

#### Criterios de Aceptación

- [ ] Puedo crear una sala desde el panel de Modo Master
- [ ] La sala genera un código único e identificable para compartir con los jugadores
- [ ] La sala muestra su estado: activa, esperando jugadores, cerrada
- [ ] Puedo ponerle un nombre o descripción a la sesión (ej. "Sesión 12 - La Cripta del Rey Lich")
- [ ] La sala permanece activa mientras el master no la cierre

#### Notas Técnicas

- El código de sala debe ser corto y fácil de compartir (ej. 6 caracteres alfanuméricos)
- Considerar conexión mediante WebSockets o similar para tiempo real
- Evaluar servicios como Firebase Realtime Database, Supabase Realtime o un servidor WebSocket propio

---

### HU-10.3: Unirse a una Sala como Jugador

**Como** jugador,
**quiero** poder unirme a la sala de sesión creada por mi master introduciendo el código,
**para** compartir la información de mi personaje en tiempo real.

#### Criterios de Aceptación

- [ ] Existe una opción "Unirse a sala" accesible desde la partida
- [ ] Puedo introducir el código de sala manualmente
- [ ] Al unirme, selecciono qué personaje de esa partida quiero conectar
- [ ] Se muestra confirmación de conexión exitosa
- [ ] Si el código es inválido o la sala está cerrada, se muestra un mensaje de error claro
- [ ] Puedo desconectarme de la sala en cualquier momento

#### Notas Técnicas

- La conexión debe ser persistente mientras la app esté abierta
- Manejar reconexión automática si se pierde la conexión temporalmente

---

### HU-10.4: Panel de Monitorización en Vivo

**Como** director de juego,
**quiero** ver en tiempo real la información clave de los personajes conectados,
**para** gestionar el combate y la narrativa sin tener que preguntar constantemente a los jugadores.

#### Criterios de Aceptación

- [ ] Veo una lista/cuadrícula con todos los personajes conectados a la sala
- [ ] Para cada personaje puedo ver en tiempo real:
  - **Nombre del personaje** y nombre del jugador
  - **Puntos de golpe actuales / máximos** (con indicador visual de estado: sano, herido, crítico, inconsciente)
  - **Clase de armadura (CA)**
  - **Espacios de hechizo restantes** por nivel
  - **Nivel y clase** del personaje
  - **Condiciones/estados** activos (envenenado, paralizado, etc.)
- [ ] Los cambios que haga el jugador en su personaje se reflejan inmediatamente en mi panel
- [ ] Puedo ver un resumen compacto o expandir la vista detallada de cada personaje

#### Notas Técnicas

- Priorizar baja latencia en las actualizaciones (< 2 segundos)
- Los datos sensibles como notas privadas del jugador NO se comparten con el master
- Optimizar el ancho de banda enviando solo los deltas (cambios), no el estado completo

---

### HU-10.5: Vista Detallada de Personaje (Master)

**Como** director de juego,
**quiero** poder abrir una vista detallada de cualquier personaje conectado,
**para** consultar información más específica cuando lo necesite.

#### Criterios de Aceptación

- [ ] Al tocar/clickar en un personaje del panel, se abre su vista detallada
- [ ] En la vista detallada puedo ver:
  - Todas las estadísticas (Fuerza, Destreza, Constitución, Inteligencia, Sabiduría, Carisma)
  - Habilidades y competencias
  - Lista de hechizos preparados/conocidos
  - Inventario completo con objetos equipados destacados
  - Rasgos de raza y clase
  - Tiradas de salvación
- [ ] Puedo volver al panel general fácilmente
- [ ] La vista se actualiza en tiempo real igual que el panel

---

### HU-10.6: Gestión de Iniciativa

**Como** director de juego,
**quiero** poder gestionar el orden de iniciativa durante el combate,
**para** llevar un control organizado de los turnos.

#### Criterios de Aceptación

- [ ] Puedo iniciar un "modo combate" desde el panel de master
- [ ] Puedo introducir la tirada de iniciativa de cada personaje conectado
- [ ] Puedo añadir entradas manuales para enemigos/NPCs con nombre e iniciativa
- [ ] Se genera automáticamente una lista ordenada de mayor a menor iniciativa
- [ ] Puedo marcar de quién es el turno actual y avanzar al siguiente
- [ ] Los jugadores conectados pueden ver el orden de iniciativa y de quién es el turno
- [ ] Puedo reordenar, añadir o eliminar entradas durante el combate
- [ ] Puedo finalizar el combate y volver al modo normal

#### Notas Técnicas

- La lista de iniciativa es visible tanto para el master como para los jugadores
- Los enemigos pueden mostrarse con nombre genérico si el master lo desea (ej. "Goblin 1", "Goblin 2")

---

### HU-10.7: Enviar Notificaciones a Jugadores

**Como** director de juego,
**quiero** poder enviar mensajes o notificaciones a los jugadores conectados,
**para** comunicar información relevante durante la partida.

#### Criterios de Aceptación

- [ ] Puedo enviar un mensaje a todos los jugadores conectados
- [ ] Puedo enviar un mensaje privado a un jugador específico
- [ ] Los mensajes aparecen como notificaciones visibles en la app del jugador
- [ ] Los mensajes pueden incluir texto libre
- [ ] Existe un historial de mensajes enviados durante la sesión

#### Notas Técnicas

- Los mensajes no necesitan persistir más allá de la sesión activa (salvo preferencia futura)
- Considerar notificaciones push si la app está en segundo plano

---

### HU-10.8: Aplicar Daño o Curación desde el Master

**Como** director de juego,
**quiero** poder aplicar daño o curación directamente a los personajes conectados,
**para** agilizar el flujo de combate.

#### Criterios de Aceptación

- [ ] Desde el panel de monitorización, puedo seleccionar uno o varios personajes
- [ ] Puedo introducir una cantidad de daño a aplicar
- [ ] Puedo introducir una cantidad de curación a aplicar
- [ ] El cambio se refleja instantáneamente en la ficha del jugador
- [ ] El jugador recibe una notificación del daño/curación recibida
- [ ] Se mantiene un log de los cambios de vida realizados por el master durante la sesión

#### Notas Técnicas

- El daño aplicado por el master debe respetar las reglas (no bajar de 0 PG, etc.)
- Considerar opción de aplicar daño con tipo (cortante, fuego, etc.) para futuras resistencias

---

### HU-10.9: Notas del Master

**Como** director de juego,
**quiero** tener un espacio de notas propio dentro del Modo Master,
**para** apuntar información relevante de la sesión que los jugadores no pueden ver.

#### Criterios de Aceptación

- [ ] Existe una sección de notas accesible desde el panel de master
- [ ] Puedo crear, editar y eliminar notas
- [ ] Las notas son privadas y solo visibles para el master
- [ ] Las notas persisten entre sesiones de la misma partida
- [ ] Puedo asociar notas a personajes específicos si lo deseo

---

### HU-10.10: Historial de Sesiones

**Como** director de juego,
**quiero** poder ver un historial de las sesiones que he dirigido en una partida,
**para** llevar un registro de lo ocurrido.

#### Criterios de Aceptación

- [ ] Se registra automáticamente la fecha y hora de inicio/fin de cada sesión
- [ ] Puedo ver una lista de sesiones pasadas con su nombre y fecha
- [ ] Puedo añadir un resumen/notas a cada sesión pasada
- [ ] Se registra qué jugadores participaron en cada sesión

---

### HU-10.11: Desconexión y Reconexión

**Como** jugador conectado a una sala,
**quiero** que mi conexión se mantenga estable y se reconecte automáticamente,
**para** no perder la sincronización durante la partida.

#### Criterios de Aceptación

- [ ] Si pierdo conexión momentáneamente, la app intenta reconectarse automáticamente
- [ ] Durante la desconexión, los cambios locales se guardan y se sincronizan al reconectar
- [ ] El master ve un indicador de estado de conexión por cada jugador (conectado/desconectado)
- [ ] Si un jugador se desconecta, su último estado conocido permanece visible en el panel del master
- [ ] La app muestra al jugador su estado de conexión (conectado, reconectando, desconectado)

#### Notas Técnicas

- Implementar estrategia de reconexión con backoff exponencial
- Los cambios locales durante la desconexión se encolan y envían al reconectar
- Timeout de desconexión configurable antes de marcar al jugador como "desconectado"

---

## Flujo General del Modo Master

```
Master crea sala → Genera código → Jugadores se unen con código
                                          ↓
                            Jugadores seleccionan personaje
                                          ↓
                         Panel del Master muestra personajes
                                          ↓
                    ┌─────────────────────────────────────────┐
                    │           SESIÓN EN VIVO                │
                    │                                         │
                    │  · Monitorización de PG, CA, hechizos   │
                    │  · Gestión de iniciativa en combate      │
                    │  · Aplicar daño/curación                │
                    │  · Enviar mensajes a jugadores          │
                    │  · Notas privadas del master            │
                    │                                         │
                    │  Cambios del jugador → Master en vivo   │
                    │  Acciones del master → Jugador en vivo  │
                    │                                         │
                    └─────────────────────────────────────────┘
                                          ↓
                    Master cierra sala → Sesión guardada en historial
```

---

## Datos Compartidos en Tiempo Real

### Información visible para el Master

| Dato                          | Actualización |
| ----------------------------- | ------------- |
| Puntos de golpe (actual/máx)  | Tiempo real   |
| Clase de armadura              | Tiempo real   |
| Espacios de hechizo restantes | Tiempo real   |
| Nivel y clase                  | Tiempo real   |
| Condiciones activas            | Tiempo real   |
| Estadísticas base              | Bajo demanda  |
| Inventario                     | Bajo demanda  |
| Hechizos conocidos/preparados  | Bajo demanda  |
| Habilidades y competencias     | Bajo demanda  |

### Información NO compartida

| Dato                        | Razón                      |
| --------------------------- | -------------------------- |
| Notas privadas del jugador  | Privacidad del jugador     |
| Trasfondo secreto           | A discreción del jugador   |
| Notas del master            | Privacidad del master      |

---

## Prioridad de Implementación

| Fase | Funcionalidad                     | Prioridad |
| ---- | --------------------------------- | --------- |
| 1    | Crear/unirse a sala               | Alta      |
| 1    | Panel de monitorización básico    | Alta      |
| 2    | Vista detallada de personaje      | Alta      |
| 2    | Gestión de iniciativa             | Alta      |
| 3    | Aplicar daño/curación             | Media     |
| 3    | Mensajes/notificaciones           | Media     |
| 4    | Notas del master                  | Media     |
| 4    | Historial de sesiones             | Baja      |
| 5    | Reconexión avanzada               | Media     |

---

## Consideraciones Técnicas Generales

- **Protocolo de comunicación**: WebSockets o Firebase Realtime Database para sincronización en tiempo real
- **Autenticación de sala**: El código de sala debe ser temporal y expirable
- **Escalabilidad**: Diseñar para salas de 2-8 jugadores simultáneos (tamaño típico de una mesa de D&D)
- **Offline-first**: Los datos del personaje deben funcionar sin conexión; el modo master requiere conexión
- **Seguridad**: Validar que solo el master puede realizar acciones de master; los jugadores solo pueden modificar su propio personaje
- **Batería**: Optimizar la frecuencia de sincronización para no drenar la batería durante sesiones largas (3-5 horas típicas)