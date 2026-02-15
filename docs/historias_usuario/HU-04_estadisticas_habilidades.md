# HU-04: Estadísticas y Habilidades

## Descripción General

Historias de usuario relacionadas con la gestión de las características (ability scores), modificadores, habilidades (skills), tiradas de salvación y bonificador de competencia del personaje.

---

## HU-04.1: Ver Características del Personaje

**Como** jugador,
**quiero** ver las seis características principales de mi personaje (Fuerza, Destreza, Constitución, Inteligencia, Sabiduría, Carisma) junto con sus modificadores,
**para** tener siempre a mano mis puntuaciones y saber qué bonificador aplico en cada situación.

### Criterios de Aceptación

- Se muestran las 6 características: Fuerza (FUE), Destreza (DES), Constitución (CON), Inteligencia (INT), Sabiduría (SAB), Carisma (CAR).
- Cada característica muestra su puntuación numérica (ej: 16).
- Cada característica muestra su modificador calculado automáticamente (ej: +3).
- El modificador se calcula como: `Math.floor((puntuación - 10) / 2)`.
- Los modificadores positivos se muestran con signo `+` y los negativos con `-`.
- La presentación es clara, compacta y accesible desde la hoja de personaje.

### Notas Técnicas

- El cálculo del modificador es una función pura reutilizable.
- Los nombres de las características deben mostrarse tanto en abreviatura como en nombre completo según el espacio disponible.

---

## HU-04.2: Asignar Características en la Creación

**Como** jugador,
**quiero** asignar los valores de mis características durante la creación del personaje usando distintos métodos,
**para** personalizar las capacidades de mi personaje según mi estilo de juego.

### Criterios de Aceptación

- Se ofrecen al menos tres métodos de asignación:
  - **Puntuación estándar**: Repartir el conjunto fijo [15, 14, 13, 12, 10, 8] entre las 6 características.
  - **Compra por puntos**: El jugador tiene 27 puntos para comprar puntuaciones según la tabla de costes del SRD (puntuaciones de 8 a 15).
  - **Tirada de dados**: Tirar 4d6 y descartar el menor para cada característica, asignando los resultados.
  - **Entrada manual**: El jugador escribe directamente los valores (para partidas con reglas caseras).
- En el método de compra por puntos se muestra el coste de cada punto y los puntos restantes.
- En el método de tirada de dados se puede repetir la tirada si el DM lo permite (configurable).
- Se aplican automáticamente los bonificadores raciales tras la asignación base.
- Se muestra un resumen con los valores finales (base + racial) antes de confirmar.

### Tabla de Compra por Puntos

| Puntuación | Coste |
|------------|-------|
| 8          | 0     |
| 9          | 1     |
| 10         | 2     |
| 11         | 3     |
| 12         | 4     |
| 13         | 5     |
| 14         | 7     |
| 15         | 9     |

---

## HU-04.3: Ver Bonificador de Competencia

**Como** jugador,
**quiero** ver mi bonificador de competencia actual,
**para** saber cuánto sumo a las tiradas en las que soy competente.

### Criterios de Aceptación

- El bonificador de competencia se muestra de forma destacada en la hoja de personaje.
- Se calcula automáticamente según el nivel del personaje:
  - Nivel 1-4: +2
  - Nivel 5-8: +3
  - Nivel 9-12: +4
  - Nivel 13-16: +5
  - Nivel 17-20: +6
- Se actualiza automáticamente al subir de nivel.
- Se muestra con el signo `+` delante.

### Notas Técnicas

- Fórmula: `Math.floor((nivel - 1) / 4) + 2`.

---

## HU-04.4: Ver Tiradas de Salvación

**Como** jugador,
**quiero** ver mis bonificadores de tiradas de salvación para cada característica,
**para** saber rápidamente qué número sumar cuando el DM me pida una salvación.

### Criterios de Aceptación

- Se muestran las 6 tiradas de salvación (una por cada característica).
- Cada tirada de salvación muestra:
  - El nombre de la característica asociada.
  - Si el personaje es competente en esa salvación (indicador visual, ej: punto relleno vs vacío).
  - El bonificador total calculado.
- El bonificador se calcula como: `modificador de característica + (competencia ? bonificador de competencia : 0)`.
- Las competencias en salvaciones vienen determinadas por la clase del personaje.
- Si algún objeto o rasgo otorga competencia adicional en salvaciones, debe reflejarse.

---

## HU-04.5: Ver Lista de Habilidades

**Como** jugador,
**quiero** ver la lista completa de habilidades con sus bonificadores,
**para** consultar rápidamente qué sumar a una tirada de habilidad.

### Criterios de Aceptación

- Se muestran las 18 habilidades del SRD con su característica asociada:
  - Acrobacias (DES)
  - Trato con Animales (SAB)
  - Arcanos (INT)
  - Atletismo (FUE)
  - Engaño (CAR)
  - Historia (INT)
  - Perspicacia (SAB)
  - Intimidación (CAR)
  - Investigación (INT)
  - Medicina (SAB)
  - Naturaleza (INT)
  - Percepción (SAB)
  - Interpretación (CAR)
  - Persuasión (CAR)
  - Religión (INT)
  - Juego de Manos (DES)
  - Sigilo (DES)
  - Supervivencia (SAB)
- Cada habilidad muestra:
  - Indicador de competencia (competente / no competente / experto).
  - El bonificador total.
- El bonificador se calcula como:
  - Sin competencia: `modificador de característica`.
  - Con competencia: `modificador de característica + bonificador de competencia`.
  - Con experiencia (expertise): `modificador de característica + (bonificador de competencia × 2)`.
- Las habilidades se ordenan alfabéticamente por defecto.
- Opcionalmente se pueden agrupar por característica asociada.

---

## HU-04.6: Gestionar Competencias en Habilidades

**Como** jugador,
**quiero** marcar en qué habilidades es competente mi personaje y en cuáles tiene experiencia (expertise),
**para** que los bonificadores se calculen correctamente.

### Criterios de Aceptación

- Al crear el personaje, se pueden seleccionar las competencias según lo que otorguen:
  - La clase (ej: el Bardo elige 3 competencias de cualquier habilidad).
  - El trasfondo (ej: el Criminal otorga Engaño y Sigilo).
  - La raza (si aplica).
- Se respeta el número máximo de competencias permitidas por cada fuente.
- Se puede marcar experiencia (expertise) en habilidades para clases que lo permitan (Bardo, Pícaro).
- La expertise solo se puede aplicar a habilidades en las que ya se es competente.
- Los cambios en competencias recalculan automáticamente todos los bonificadores afectados.
- Se indica visualmente el origen de cada competencia (clase, trasfondo, raza, dote).

---

## HU-04.7: Percepción Pasiva

**Como** jugador,
**quiero** ver mi puntuación de Percepción pasiva calculada automáticamente,
**para** que el DM pueda consultarla sin necesidad de tiradas.

### Criterios de Aceptación

- Se muestra la Percepción pasiva en un lugar visible de la hoja de personaje.
- Se calcula como: `10 + modificador de Percepción`.
- Si el personaje tiene competencia en Percepción, se incluye el bonificador de competencia en el cálculo.
- Si tiene la dote Observador (+5), se suma al total.
- Se actualiza automáticamente cuando cambian los factores que la afectan.

---

## HU-04.8: Modificar Características Temporalmente

**Como** jugador,
**quiero** poder aplicar modificadores temporales a mis características (por hechizos, objetos mágicos, etc.),
**para** reflejar los cambios que ocurren durante la partida sin alterar los valores base.

### Criterios de Aceptación

- Se puede añadir un modificador temporal a cualquier característica.
- El modificador temporal tiene un nombre/descripción (ej: "Cinturón de Fuerza de Gigante").
- El valor temporal se muestra diferenciado del valor base (ej: color distinto, icono).
- Todos los bonificadores derivados (habilidades, salvaciones, etc.) se recalculan con el valor temporal.
- Se pueden eliminar los modificadores temporales fácilmente cuando el efecto termine.
- Se puede establecer un valor fijo (ej: FUE = 19 por un objeto) en lugar de un bonificador sumado.

---

## HU-04.9: Incrementar Características al Subir de Nivel

**Como** jugador,
**quiero** que al subir de nivel se me permita incrementar mis características cuando corresponda (Mejora de Puntuación de Característica),
**para** que mi personaje se vuelva más poderoso conforme avanza.

### Criterios de Aceptación

- En los niveles 4, 8, 12, 16 y 19 (o los que correspondan a cada clase), se ofrece la opción de Mejora de Puntuación de Característica.
- El jugador puede elegir:
  - Sumar +2 a una característica (máximo 20).
  - Sumar +1 a dos características distintas (máximo 20 cada una).
  - Elegir una dote en su lugar (si se habilitan las reglas opcionales de dotes).
- No se permite superar el máximo de 20 en una característica (salvo excepciones de clase, como el Bárbaro nivel 20).
- Se muestra el valor anterior y el nuevo valor antes de confirmar.
- Los cambios se propagan a todos los bonificadores derivados.

---

## HU-04.10: Ver Resumen de Estadísticas en Combate

**Como** jugador,
**quiero** una vista rápida con las estadísticas más relevantes para el combate,
**para** agilizar las tiradas y decisiones durante un encuentro.

### Criterios de Aceptación

- Se muestra una vista compacta de combate que incluya:
  - Clase de Armadura (CA).
  - Puntos de golpe actuales / máximos.
  - Bonificador de iniciativa (modificador de DES + otros bonificadores).
  - Velocidad de movimiento.
  - Bonificador de competencia.
  - Bonificadores de ataque principales (cuerpo a cuerpo y a distancia).
  - CD de salvación de conjuros (si aplica).
- Los valores se calculan automáticamente a partir de las características y el equipamiento.
- La vista es accesible con un solo toque desde la hoja de personaje.

### Fórmulas Clave

- **CA base (sin armadura)**: `10 + modificador de DES`.
- **Iniciativa**: `modificador de DES + bonificadores adicionales`.
- **CD de conjuros**: `8 + bonificador de competencia + modificador de característica de lanzamiento`.
- **Bonificador de ataque con conjuros**: `bonificador de competencia + modificador de característica de lanzamiento`.
- **Bonificador de ataque cuerpo a cuerpo**: `bonificador de competencia + modificador de FUE (o DES si arma sutil)`.
- **Bonificador de ataque a distancia**: `bonificador de competencia + modificador de DES`.

---

## Prioridad de Implementación

| Historia | Prioridad | Dependencias |
|----------|-----------|--------------|
| HU-04.1  | Alta      | HU-02 (Creación de personaje) |
| HU-04.2  | Alta      | HU-02 |
| HU-04.3  | Alta      | HU-05 (Subir de nivel) |
| HU-04.4  | Alta      | HU-04.1, HU-04.3 |
| HU-04.5  | Alta      | HU-04.1, HU-04.3 |
| HU-04.6  | Alta      | HU-04.5, HU-02 |
| HU-04.7  | Media     | HU-04.5 |
| HU-04.8  | Media     | HU-04.1 |
| HU-04.9  | Media     | HU-04.1, HU-05 |
| HU-04.10 | Media     | HU-04.1, HU-07 (Inventario), HU-06 (Hechizos) |