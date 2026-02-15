# HU-02: Creación de Personaje

## Descripción General

Historias de usuario relacionadas con el flujo de creación de un nuevo personaje de D&D 5e, incluyendo la selección de raza, clase, trasfondo, asignación de estadísticas y personalización.

---

## HU-02.1: Iniciar Creación de Personaje

**Como** jugador,
**quiero** poder iniciar la creación de un nuevo personaje desde una partida,
**para** tener un personaje asociado a esa campaña.

### Criterios de Aceptación

- Desde la pantalla de una partida sin personaje, existe un botón "Crear Personaje".
- Al pulsar, se inicia un flujo guiado paso a paso (wizard).
- El progreso se guarda automáticamente en cada paso para no perder datos si se cierra la app.
- Se puede cancelar la creación en cualquier momento (con confirmación).
- Se muestra una barra o indicador de progreso con los pasos restantes.

### Notas Técnicas

- Almacenamiento local con AsyncStorage o SQLite.
- El wizard debe ser navegable hacia adelante y hacia atrás.

---

## HU-02.2: Elegir Nombre del Personaje

**Como** jugador,
**quiero** poder asignar un nombre a mi personaje,
**para** identificarlo dentro de la partida.

### Criterios de Aceptación

- Campo de texto libre para el nombre del personaje.
- El nombre es obligatorio y debe tener al menos 1 carácter.
- Se admiten caracteres especiales, tildes y eñes.
- Longitud máxima de 50 caracteres.
- Se puede modificar más adelante desde la hoja de personaje.

---

## HU-02.3: Seleccionar Raza

**Como** jugador,
**quiero** poder elegir la raza de mi personaje de entre las razas disponibles en el SRD 5e,
**para** obtener los rasgos raciales correspondientes.

### Criterios de Aceptación

- Se muestra una lista con todas las razas disponibles del SRD 5e en español:
  - Enano (Enano de las Colinas, Enano de las Montañas)
  - Elfo (Alto Elfo, Elfo del Bosque, Elfo Oscuro/Drow)
  - Mediano (Mediano Piesligeros, Mediano Fornido)
  - Humano
  - Dracónido
  - Gnomo (Gnomo del Bosque, Gnomo de las Rocas)
  - Semielfo
  - Semiorco
  - Tiefling
- Cada raza muestra una descripción breve y sus rasgos principales.
- Al seleccionar una raza con subrazas, se despliega la selección de subraza.
- Se muestran claramente los bonificadores de estadísticas que aporta la raza.
- Se muestran los rasgos raciales (visión en la oscuridad, resistencias, competencias, etc.).
- Para el Alto Elfo, se permite elegir un truco de mago adicional.
- Para el Humano, se aplica +1 a todas las características.
- Se aplican automáticamente los idiomas que otorga la raza.

### Datos por Raza (Resumen)

| Raza | Bonificador | Velocidad | Tamaño |
|------|-------------|-----------|--------|
| Enano | CON +2 | 7,5 m (25 pies) | Mediano |
| Elfo | DES +2 | 9 m (30 pies) | Mediano |
| Mediano | DES +2 | 7,5 m (25 pies) | Pequeño |
| Humano | Todos +1 | 9 m (30 pies) | Mediano |
| Dracónido | FUE +2, CAR +1 | 9 m (30 pies) | Mediano |
| Gnomo | INT +2 | 7,5 m (25 pies) | Pequeño |
| Semielfo | CAR +2, dos a elegir +1 | 9 m (30 pies) | Mediano |
| Semiorco | FUE +2, CON +1 | 9 m (30 pies) | Mediano |
| Tiefling | CAR +2, INT +1 | 9 m (30 pies) | Mediano |

---

## HU-02.4: Seleccionar Clase

**Como** jugador,
**quiero** poder elegir la clase de mi personaje,
**para** definir sus habilidades, competencias y estilo de juego.

### Criterios de Aceptación

- Se muestra una lista con todas las clases del SRD 5e en español:
  - Bárbaro
  - Bardo
  - Brujo
  - Clérigo
  - Druida
  - Explorador (Ranger)
  - Guerrero
  - Hechicero
  - Mago
  - Monje
  - Paladín
  - Pícaro
- Cada clase muestra:
  - Descripción breve.
  - Dado de golpe.
  - Habilidad principal.
  - Tiradas de salvación competentes.
  - Competencias con armaduras y armas.
  - Habilidades a elegir (con el número correcto de opciones).
  - Equipamiento inicial (con opciones donde aplique).
- Al seleccionar una clase lanzadora de conjuros, se informa al jugador de que podrá elegir conjuros en un paso posterior.
- Se asignan automáticamente los puntos de golpe de nivel 1 (máximo del dado de golpe + modificador de CON).

### Datos por Clase (Resumen)

| Clase | Dado de Golpe | Salvaciones | Habilidad Clave |
|-------|---------------|-------------|-----------------|
| Bárbaro | d12 | FUE, CON | FUE |
| Bardo | d8 | DES, CAR | CAR |
| Brujo | d8 | SAB, CAR | CAR |
| Clérigo | d8 | SAB, CAR | SAB |
| Druida | d8 | INT, SAB | SAB |
| Explorador | d10 | FUE, DES | DES/SAB |
| Guerrero | d10 | FUE, CON | FUE/DES |
| Hechicero | d6 | CON, CAR | CAR |
| Mago | d6 | INT, SAB | INT |
| Monje | d8 | FUE, DES | DES/SAB |
| Paladín | d10 | SAB, CAR | FUE/CAR |
| Pícaro | d8 | DES, INT | DES |

---

## HU-02.5: Asignar Puntuaciones de Característica

**Como** jugador,
**quiero** poder asignar las puntuaciones de característica de mi personaje,
**para** definir sus capacidades fundamentales.

### Criterios de Aceptación

- Se muestran las 6 características: Fuerza (FUE), Destreza (DES), Constitución (CON), Inteligencia (INT), Sabiduría (SAB), Carisma (CAR).
- Se ofrecen tres métodos de asignación:
  1. **Puntuación estándar**: Se reparten los valores 15, 14, 13, 12, 10, 8 entre las características.
  2. **Compra de puntos**: Se dispone de 27 puntos para comprar puntuaciones (coste variable según la tabla del PHB).
  3. **Tirada de dados**: Se tiran 4d6 y se descartan el menor para cada característica (con opción de retirar).
  4. **Manual**: El jugador introduce los valores directamente (para cuando el DM indica valores concretos).
- Se muestran los bonificadores raciales que se aplicarán sobre las puntuaciones base.
- Se muestra el modificador resultante de cada característica en tiempo real.
- Para el Semielfo, se permite elegir cuáles dos características reciben el +1 adicional (aparte de CAR).
- No se permite avanzar sin haber asignado todas las características.
- Se muestra una tabla resumen con: puntuación base + bonificador racial = total (modificador).

### Tabla de Compra de Puntos

| Puntuación | Coste |
|------------|-------|
| 8 | 0 |
| 9 | 1 |
| 10 | 2 |
| 11 | 3 |
| 12 | 4 |
| 13 | 5 |
| 14 | 7 |
| 15 | 9 |

---

## HU-02.6: Seleccionar Trasfondo

**Como** jugador,
**quiero** poder elegir un trasfondo para mi personaje,
**para** definir su historia, competencias adicionales e idiomas.

### Criterios de Aceptación

- Se muestra una lista con los trasfondos del SRD 5e en español:
  - Acólito
  - Charlatán
  - Criminal / Espía
  - Artista
  - Héroe del Pueblo
  - Artesano Gremial
  - Ermitaño
  - Noble
  - Forastero
  - Sabio
  - Marinero / Pirata
  - Soldado
  - Huérfano (Pilluelo)
- Cada trasfondo muestra:
  - Descripción breve.
  - Competencias en habilidades que otorga.
  - Competencias con herramientas o idiomas adicionales.
  - Equipamiento inicial del trasfondo.
  - Rasgo especial del trasfondo.
- Se aplican automáticamente las competencias en habilidades.
- Si el trasfondo otorga idiomas a elegir, se muestra un selector de idiomas.

---

## HU-02.7: Elegir Competencias en Habilidades

**Como** jugador,
**quiero** poder elegir en qué habilidades es competente mi personaje,
**para** saber en qué destaca al hacer pruebas de habilidad.

### Criterios de Aceptación

- Se muestra la lista completa de 18 habilidades agrupadas por característica:
  - **FUE**: Atletismo
  - **DES**: Acrobacias, Juego de Manos, Sigilo
  - **INT**: Arcanos, Historia, Investigación, Naturaleza, Religión
  - **SAB**: Conocimiento de la Naturaleza (Supervivencia), Medicina, Percepción, Perspicacia, Trato con Animales
  - **CAR**: Engaño, Intimidación, Interpretación, Persuasión
- Se marcan automáticamente las competencias otorgadas por el trasfondo.
- Se permite elegir el número correcto de habilidades adicionales según la clase (de la lista permitida por la clase).
- No se permite seleccionar más habilidades de las permitidas.
- Se muestra el modificador total de cada habilidad (mod. de característica + bonificador de competencia si aplica).
- Si una habilidad ya viene del trasfondo y también se podría elegir por clase, se indica el conflicto y se permite elegir otra.

---

## HU-02.8: Seleccionar Conjuros Iniciales

**Como** jugador de una clase lanzadora de conjuros,
**quiero** poder elegir mis trucos y conjuros conocidos/preparados de nivel 1,
**para** empezar la partida con mi repertorio mágico definido.

### Criterios de Aceptación

- Este paso solo aparece si la clase elegida tiene capacidad de lanzar conjuros en nivel 1.
- Clases con conjuros en nivel 1: Bardo, Brujo, Clérigo, Druida, Hechicero, Mago.
- Se muestra la lista de trucos disponibles para la clase, y el número que debe elegir.
- Se muestra la lista de conjuros de nivel 1 disponibles para la clase.
- Para clases que preparan conjuros (Clérigo, Druida, Mago): se muestra la lista completa y se indica cuántos pueden preparar.
- Para clases que conocen conjuros (Bardo, Brujo, Hechicero): se indica cuántos conocen y se eligen de la lista.
- Para el Mago: se eligen los 6 conjuros del libro de conjuros y luego se preparan los que correspondan.
- Cada conjuro muestra: nombre, escuela, tiempo de lanzamiento, alcance, componentes y descripción breve.
- Se pueden ver los detalles completos de un conjuro al pulsarlo.
- Se muestran los espacios de conjuro disponibles en nivel 1.

---

## HU-02.9: Elegir Equipamiento Inicial

**Como** jugador,
**quiero** poder elegir el equipamiento inicial de mi personaje,
**para** empezar la partida con armas, armadura y objetos.

### Criterios de Aceptación

- Se muestran las opciones de equipamiento inicial según la clase elegida.
- Donde hay opciones (ej: "una espada larga o dos armas cuerpo a cuerpo"), se presenta un selector.
- Se incluye el equipamiento del trasfondo.
- Se muestra un resumen del inventario completo antes de confirmar.
- Se calcula automáticamente la Clase de Armadura basada en la armadura elegida y el modificador de DES.
- Se muestra el daño de las armas seleccionadas.
- Se calcula el peso total del equipamiento (opcional, si se usa variante de carga).

---

## HU-02.10: Definir Detalles de Personalidad

**Como** jugador,
**quiero** poder definir los rasgos de personalidad, ideales, vínculos y defectos de mi personaje,
**para** enriquecer su interpretación.

### Criterios de Aceptación

- Se muestran campos de texto para:
  - Rasgos de personalidad (2).
  - Ideales (1).
  - Vínculos (1).
  - Defectos (1).
- Se ofrecen sugerencias según el trasfondo elegido (tablas del trasfondo).
- El jugador puede escribir texto libre o elegir de las sugerencias.
- Se puede añadir una historia/trasfondo narrativo libre (campo de texto largo).
- Estos campos son opcionales y se pueden rellenar o editar más tarde.
- Campo adicional para alineamiento con selector:
  - Legal Bueno, Neutral Bueno, Caótico Bueno
  - Legal Neutral, Neutral (Auténtico), Caótico Neutral
  - Legal Malvado, Neutral Malvado, Caótico Malvado

---

## HU-02.11: Detalles Físicos y Apariencia

**Como** jugador,
**quiero** poder definir la apariencia física de mi personaje,
**para** tener una referencia visual y narrativa.

### Criterios de Aceptación

- Campos opcionales para:
  - Edad.
  - Altura.
  - Peso.
  - Color de ojos.
  - Color de pelo.
  - Color de piel.
  - Descripción física libre.
- Se muestran rangos sugeridos según la raza elegida (ej: los elfos viven cientos de años).
- Se puede subir o seleccionar una imagen como avatar del personaje.
- Todos los campos son opcionales y editables posteriormente.

---

## HU-02.12: Resumen y Confirmación

**Como** jugador,
**quiero** ver un resumen completo de mi personaje antes de confirmarlo,
**para** verificar que todo está correcto antes de empezar a jugar.

### Criterios de Aceptación

- Se muestra una pantalla de resumen con todos los datos del personaje:
  - Nombre, raza, clase, nivel 1.
  - Puntuaciones de característica y modificadores.
  - Puntos de golpe máximos.
  - Clase de Armadura.
  - Velocidad.
  - Bonificador de competencia (+2 en nivel 1).
  - Competencias (habilidades, herramientas, armaduras, armas, salvaciones).
  - Idiomas.
  - Rasgos raciales y de clase.
  - Conjuros (si aplica).
  - Equipamiento.
  - Trasfondo y personalidad.
- Se puede volver a cualquier paso anterior para hacer cambios.
- Al confirmar, se crea el personaje y se asocia a la partida.
- Se redirige a la hoja de personaje completa.

---

## Flujo del Wizard de Creación

```
1. Nombre del Personaje
       ↓
2. Selección de Raza (y subraza)
       ↓
3. Selección de Clase
       ↓
4. Asignación de Características
       ↓
5. Selección de Trasfondo
       ↓
6. Competencias en Habilidades
       ↓
7. Conjuros Iniciales (si aplica)
       ↓
8. Equipamiento Inicial
       ↓
9. Personalidad y Alineamiento
       ↓
10. Apariencia (opcional)
       ↓
11. Resumen y Confirmación
```

---

## Prioridad

| Historia | Prioridad | Complejidad |
|----------|-----------|-------------|
| HU-02.1 | Alta | Media |
| HU-02.2 | Alta | Baja |
| HU-02.3 | Alta | Alta |
| HU-02.4 | Alta | Alta |
| HU-02.5 | Alta | Alta |
| HU-02.6 | Media | Media |
| HU-02.7 | Alta | Media |
| HU-02.8 | Alta | Alta |
| HU-02.9 | Media | Media |
| HU-02.10 | Baja | Baja |
| HU-02.11 | Baja | Baja |
| HU-02.12 | Alta | Media |