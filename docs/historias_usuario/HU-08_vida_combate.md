# HU-08: Vida y Combate

## Descripción General

Historias de usuario relacionadas con la gestión de puntos de golpe, daño, curación, condiciones de estado y todo lo relativo al seguimiento del combate desde la hoja de personaje.

---

## HU-08.1: Ver Puntos de Golpe Actuales y Máximos

**Como** jugador,
**quiero** ver claramente mis puntos de golpe actuales y máximos en la hoja de personaje,
**para** saber en todo momento el estado de salud de mi personaje.

### Criterios de Aceptación

- Se muestran los PG actuales y los PG máximos en formato `actual / máximo` (ej: `25 / 34`).
- Los PG se muestran de forma prominente y fácilmente visible en la hoja de personaje.
- Se muestra una barra de vida visual que representa el porcentaje de PG restantes.
- La barra cambia de color según el porcentaje:
  - **Verde**: 75% - 100%.
  - **Amarillo**: 50% - 74%.
  - **Naranja**: 25% - 49%.
  - **Rojo**: 1% - 24%.
  - **Gris/Negro**: 0% (inconsciente).
- Los PG máximos se calculan automáticamente según la clase, nivel y modificador de Constitución.

### Notas Técnicas

- Los PG máximos base se calculan: dado de golpe de la clase a nivel 1 (máximo) + modificador de Constitución, y por cada nivel adicional se suma la tirada o el promedio del dado de golpe + modificador de Constitución.
- Permitir al usuario elegir entre usar el promedio o introducir el resultado de la tirada al subir de nivel.
- Si el modificador de Constitución cambia, los PG máximos deben recalcularse retroactivamente.

---

## HU-08.2: Modificar Puntos de Golpe (Daño y Curación)

**Como** jugador,
**quiero** poder aplicar daño y curación a mi personaje de forma rápida,
**para** actualizar mi vida durante el combate sin perder tiempo.

### Criterios de Aceptación

- Existe un botón o control para **aplicar daño** (resta PG).
- Existe un botón o control para **aplicar curación** (suma PG).
- Al pulsar cualquiera de los dos, se abre un campo numérico para introducir la cantidad.
- Los PG no pueden bajar de 0 ni superar el máximo.
- Se puede usar un teclado numérico rápido o un campo de entrada directa.
- Los cambios se aplican inmediatamente y se reflejan en la barra de vida.
- Se muestra una breve animación o indicador visual al recibir daño (rojo) o curación (verde).

### Notas Técnicas

- Considerar gestos rápidos: deslizar hacia abajo para daño, hacia arriba para curación.
- Guardar un historial reciente de cambios de PG por si se comete un error.

---

## HU-08.3: Puntos de Golpe Temporales

**Como** jugador,
**quiero** poder añadir y gestionar puntos de golpe temporales,
**para** reflejar efectos de hechizos o habilidades que me otorgan PG extra.

### Criterios de Aceptación

- Existe un campo separado para los PG temporales.
- Los PG temporales se muestran visualmente diferenciados (color distinto en la barra de vida, por ejemplo azul).
- Al recibir daño, los PG temporales se reducen primero antes de afectar a los PG normales.
- Los PG temporales no se acumulan: si se reciben nuevos PG temporales, el jugador elige quedarse con los actuales o los nuevos (no se suman).
- Los PG temporales no se pueden recuperar con curación.
- Se puede establecer y eliminar PG temporales manualmente.

### Notas Técnicas

- Los PG temporales se muestran como un segmento adicional en la barra de vida (ej: barra azul por encima de la verde).
- Al aplicar daño, el sistema debe restar primero de los PG temporales automáticamente.

---

## HU-08.4: Dados de Golpe y Descanso Corto

**Como** jugador,
**quiero** poder usar mis dados de golpe durante un descanso corto para recuperar PG,
**para** gestionar mis recursos de curación entre combates.

### Criterios de Aceptación

- Se muestran los dados de golpe disponibles y el total (ej: `3 / 5 d10`).
- Durante un descanso corto, el jugador puede elegir cuántos dados de golpe gastar.
- Al gastar un dado de golpe, se simula la tirada (o se permite introducir el resultado manual).
- Se suma el modificador de Constitución al resultado de cada dado de golpe gastado.
- El resultado mínimo de curación por dado es 0 (no puede ser negativo, pero un modificador negativo puede reducirlo).
- Los PG curados se suman automáticamente (sin exceder el máximo).
- Los dados de golpe gastados se descuentan del total disponible.

### Notas Técnicas

- El tipo de dado de golpe depende de la clase del personaje:
  - **d6**: Hechicero, Mago.
  - **d8**: Bardo, Clérigo, Druida, Monje, Pícaro, Brujo.
  - **d10**: Guerrero, Paladín, Explorador.
  - **d12**: Bárbaro.
- Para personajes multiclase, se deben rastrear los dados de golpe de cada clase por separado.

---

## HU-08.5: Descanso Largo

**Como** jugador,
**quiero** poder realizar un descanso largo que restaure mis recursos,
**para** preparar a mi personaje para la siguiente jornada de aventuras.

### Criterios de Aceptación

- Existe un botón de "Descanso Largo" accesible desde la hoja de personaje.
- Al realizar un descanso largo:
  - Los PG se restauran al máximo.
  - Se recupera la mitad de los dados de golpe gastados (mínimo 1).
  - Se restauran todos los espacios de hechizo gastados.
  - Se resetean las habilidades que se recuperan con descanso largo (según clase).
- Se pide confirmación antes de aplicar el descanso largo.
- Se muestra un resumen de lo que se ha recuperado tras el descanso.

### Notas Técnicas

- Los dados de golpe recuperados se redondean hacia abajo (mitad del total de dados de golpe del personaje, mínimo 1).
- El descanso largo también debería limpiar condiciones temporales que se resuelvan con descanso (a criterio del jugador/DM).

---

## HU-08.6: Descanso Corto

**Como** jugador,
**quiero** poder realizar un descanso corto desde la hoja de personaje,
**para** gastar dados de golpe y recuperar habilidades que se restauran con descanso corto.

### Criterios de Aceptación

- Existe un botón de "Descanso Corto" accesible desde la hoja de personaje.
- Al realizar un descanso corto:
  - Se ofrece al jugador gastar dados de golpe para curarse (ver HU-08.4).
  - Se restauran las habilidades que se recuperan con descanso corto (según clase).
  - Se restauran los espacios de hechizo del Brujo (Magia de Pacto).
- Se pide confirmación antes de aplicar el descanso corto.
- Se muestra un resumen de lo que se ha recuperado.

---

## HU-08.7: Clase de Armadura

**Como** jugador,
**quiero** ver y gestionar mi Clase de Armadura (CA),
**para** saber lo difícil que es que me golpeen en combate.

### Criterios de Aceptación

- La CA se muestra de forma prominente en la hoja de personaje, junto a los PG.
- La CA se calcula automáticamente según la armadura equipada, escudo y modificadores de Destreza.
- Si no lleva armadura, la CA base es `10 + modificador de Destreza`.
- Si tiene habilidades especiales que modifiquen la CA (ej: Defensa sin Armadura del Bárbaro o Monje), se aplican automáticamente.
- El jugador puede añadir bonificadores adicionales manualmente (objetos mágicos, hechizos, etc.).
- Se muestra un desglose de cómo se calcula la CA (ej: "Cota de mallas (16) + Escudo (+2) = 18").

### Cálculos de CA por Tipo de Armadura

- **Sin armadura**: 10 + mod. Destreza.
- **Armadura ligera**: Armadura base + mod. Destreza.
- **Armadura intermedia**: Armadura base + mod. Destreza (máx. +2).
- **Armadura pesada**: Armadura base (sin mod. Destreza).
- **Escudo**: +2 a la CA.
- **Defensa sin Armadura (Bárbaro)**: 10 + mod. Destreza + mod. Constitución.
- **Defensa sin Armadura (Monje)**: 10 + mod. Destreza + mod. Sabiduría.

---

## HU-08.8: Iniciativa

**Como** jugador,
**quiero** ver mi bonificador de iniciativa y poder tirar iniciativa rápidamente,
**para** determinar mi turno en combate de forma ágil.

### Criterios de Aceptación

- El bonificador de iniciativa se muestra en la hoja de personaje.
- La iniciativa base es el modificador de Destreza.
- Se aplican bonificadores adicionales de rasgos o dotes (ej: Alerta +5).
- Existe un botón para "Tirar Iniciativa" que simula 1d20 + bonificador.
- Se muestra el resultado de la tirada de forma clara y grande.
- El resultado se puede editar manualmente (por si el jugador prefiere usar dados físicos).

---

## HU-08.9: Tiradas de Salvación contra Muerte

**Como** jugador,
**quiero** poder registrar mis tiradas de salvación contra muerte cuando mi personaje cae a 0 PG,
**para** determinar si mi personaje se estabiliza o muere.

### Criterios de Aceptación

- Cuando los PG llegan a 0, se activa automáticamente el modo de "Tiradas de Salvación contra Muerte".
- Se muestran 3 casillas de éxito y 3 casillas de fracaso.
- El jugador puede marcar éxitos y fracasos manualmente o tirar automáticamente (1d20).
  - **1-9**: Fracaso.
  - **10-19**: Éxito.
  - **20 (crítico)**: El personaje recupera 1 PG y vuelve en sí.
  - **1 (pifia)**: Cuenta como 2 fracasos.
- Con 3 éxitos, el personaje se estabiliza (sigue a 0 PG pero no muere).
- Con 3 fracasos, el personaje muere.
- Si el personaje recibe curación mientras está a 0 PG, se resetean las tiradas y los PG suben según la curación recibida.
- Si el personaje recibe daño a 0 PG, cuenta como un fracaso (o dos si es crítico).
- Se muestra una alerta o indicador visual claro cuando el personaje está inconsciente/muriendo.

### Notas Técnicas

- El estado de "muriendo" debe ser visualmente dramático (fondo rojo, icono de calavera, etc.).
- Al estabilizarse, se muestra un indicador de que el personaje está estable pero inconsciente.

---

## HU-08.10: Condiciones de Estado

**Como** jugador,
**quiero** poder marcar las condiciones de estado que afectan a mi personaje,
**para** recordar qué penalizaciones o efectos tengo activos durante el combate.

### Criterios de Aceptación

- Se pueden activar/desactivar las siguientes condiciones:
  - Agarrado
  - Asustado
  - Aturdido
  - Cegado
  - Derribado
  - Encantado
  - Ensordecido
  - Envenenado
  - Hechizado
  - Incapacitado
  - Inconsciente
  - Invisible
  - Paralizado
  - Petrificado
  - Restringido
- Cada condición muestra un icono representativo junto al nombre.
- Al pulsar sobre una condición activa, se muestra la descripción de sus efectos mecánicos.
- Las condiciones activas se muestran como iconos en la parte superior de la hoja de personaje.
- Se pueden añadir notas a cada condición (ej: "por hechizo de Sujetar Persona, concentración del mago enemigo").

---

## HU-08.11: Velocidad de Movimiento

**Como** jugador,
**quiero** ver mi velocidad de movimiento en la hoja de personaje,
**para** saber cuánto me puedo mover en mi turno de combate.

### Criterios de Aceptación

- Se muestra la velocidad base del personaje en pies (y opcionalmente en casillas de 5 pies).
- La velocidad base se determina por la raza del personaje.
- Se aplican modificadores de clase (ej: Movimiento sin Armadura del Monje).
- Se aplican modificadores de armadura (armadura pesada puede reducir velocidad si no se cumple requisito de Fuerza).
- Se muestran tipos de movimiento adicionales si los hay:
  - Velocidad de trepar.
  - Velocidad de nadar.
  - Velocidad de volar.
- El jugador puede añadir bonificadores o penalizadores manuales.

---

## HU-08.12: Historial de Combate

**Como** jugador,
**quiero** ver un registro de los cambios de PG y eventos de combate recientes,
**para** poder revisar o deshacer acciones si me equivoco.

### Criterios de Aceptación

- Se mantiene un historial de las últimas acciones de combate (daño recibido, curación, uso de dados de golpe, etc.).
- Cada entrada del historial muestra:
  - Tipo de acción (daño, curación, PG temporales, etc.).
  - Cantidad.
  - Fecha y hora.
  - PG resultantes tras la acción.
- Se puede deshacer la última acción (con confirmación).
- El historial se puede limpiar manualmente.
- El historial se reinicia al iniciar una nueva sesión de juego (o se puede consultar el de sesiones anteriores).

---

## HU-08.13: Resistencias y Vulnerabilidades

**Como** jugador,
**quiero** poder registrar las resistencias, inmunidades y vulnerabilidades de mi personaje a tipos de daño,
**para** aplicar correctamente las reducciones o aumentos de daño en combate.

### Criterios de Aceptación

- Se pueden marcar resistencias, inmunidades y vulnerabilidades a los siguientes tipos de daño:
  - Ácido
  - Contundente
  - Cortante
  - Frío
  - Fuego
  - Fuerza
  - Necrótico
  - Perforante
  - Psíquico
  - Radiante
  - Relámpago
  - Trueno
  - Veneno
- Las resistencias/inmunidades/vulnerabilidades de raza se aplican automáticamente.
- Al aplicar daño, si el personaje tiene resistencia al tipo de daño, se sugiere aplicar la mitad (redondeando hacia abajo).
- Si tiene vulnerabilidad, se sugiere aplicar el doble.
- Si tiene inmunidad, se sugiere aplicar 0.
- El jugador puede ignorar la sugerencia y aplicar la cantidad que desee.

---

## HU-08.14: Tiradas de Ataque Rápidas

**Como** jugador,
**quiero** poder realizar tiradas de ataque rápidas desde la hoja de personaje,
**para** resolver ataques en combate de forma ágil.

### Criterios de Aceptación

- Desde las armas equipadas se puede pulsar un botón de "Atacar".
- Se tira automáticamente 1d20 + bonificador de ataque del arma.
- El bonificador de ataque se calcula:
  - **Arma cuerpo a cuerpo**: mod. Fuerza + bonificador de competencia (si es competente).
  - **Arma a distancia**: mod. Destreza + bonificador de competencia (si es competente).
  - **Arma con propiedad Sutil**: el jugador elige entre mod. Fuerza o Destreza.
- Se muestra el resultado de la tirada de forma clara.
- Se indica si es un golpe crítico (20 natural) o pifia (1 natural).
- Si el ataque impacta, se ofrece tirar el daño automáticamente.
- La tirada de daño usa el dado del arma + modificador correspondiente.
- En un crítico, se tiran los dados de daño dobles.

---

## Resumen de Historias

| ID | Historia | Prioridad |
|---|---|---|
| HU-08.1 | Ver PG actuales y máximos | 🔴 Crítica |
| HU-08.2 | Aplicar daño y curación | 🔴 Crítica |
| HU-08.3 | PG temporales | 🟡 Alta |
| HU-08.4 | Dados de golpe y descanso corto | 🟡 Alta |
| HU-08.5 | Descanso largo | 🟡 Alta |
| HU-08.6 | Descanso corto | 🟡 Alta |
| HU-08.7 | Clase de Armadura | 🔴 Crítica |
| HU-08.8 | Iniciativa | 🟡 Alta |
| HU-08.9 | Tiradas de salvación contra muerte | 🟡 Alta |
| HU-08.10 | Condiciones de estado | 🟢 Media |
| HU-08.11 | Velocidad de movimiento | 🟡 Alta |
| HU-08.12 | Historial de combate | 🟢 Media |
| HU-08.13 | Resistencias y vulnerabilidades | 🟢 Media |
| HU-08.14 | Tiradas de ataque rápidas | 🟢 Media |

---

## Dependencias

- **HU-02**: Creación de personaje (raza y clase determinan PG base, CA, velocidad, resistencias).
- **HU-04**: Estadísticas (modificadores de Constitución, Destreza, Fuerza y Sabiduría afectan directamente al combate).
- **HU-05**: Subir de nivel (los PG máximos y dados de golpe dependen del nivel).
- **HU-06**: Hechizos (espacios de hechizo se restauran con descansos).
- **HU-07**: Inventario (armas y armaduras afectan CA y ataques).