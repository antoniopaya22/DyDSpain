# HU-06: Gestión de Hechizos

## Descripción General

Historias de usuario relacionadas con el sistema de hechizos: aprendizaje, consulta, preparación, uso de espacios de hechizo y trucos.

---

## HU-06.1: Ver lista de hechizos disponibles por clase y nivel

**Como** jugador,
**quiero** poder consultar todos los hechizos disponibles para mi clase y nivel actual,
**para** saber qué hechizos puedo aprender o preparar.

### Criterios de Aceptación

- [ ] Se muestra una lista de hechizos filtrada por la clase del personaje.
- [ ] Los hechizos se organizan por nivel de hechizo (trucos, nivel 1, nivel 2, etc.).
- [ ] Solo se muestran hechizos de niveles a los que el personaje tiene acceso según su nivel de clase.
- [ ] Se puede buscar hechizos por nombre.
- [ ] Se puede filtrar por escuela de magia (Abjuración, Conjuración, Adivinación, Encantamiento, Evocación, Ilusión, Nigromancia, Transmutación).
- [ ] Cada hechizo muestra un resumen rápido: nombre, nivel, escuela y si es ritual o no.

### Notas Técnicas

- Los datos de hechizos se cargan desde la base de datos local de la SRD 5.1 en español.
- Clases con acceso a hechizos: Bardo, Brujo, Clérigo, Druida, Explorador, Hechicero, Mago, Paladín.
- Cada clase tiene su propia lista de hechizos disponibles.

---

## HU-06.2: Ver detalle de un hechizo

**Como** jugador,
**quiero** poder ver la información completa de cualquier hechizo,
**para** entender exactamente qué hace antes de aprenderlo o usarlo.

### Criterios de Aceptación

- [ ] Se muestra toda la información del hechizo:
  - Nombre.
  - Nivel (truco, 1º, 2º, ..., 9º).
  - Escuela de magia.
  - Tiempo de lanzamiento.
  - Alcance.
  - Componentes (Verbal, Somático, Material — con descripción del material si aplica).
  - Duración.
  - Si requiere concentración.
  - Si es un ritual.
  - Descripción completa del efecto.
  - Efecto a niveles superiores (si aplica).
  - Clases que pueden usarlo.
- [ ] La descripción se muestra con formato legible (negrita, cursiva, listas, tablas si las hay).
- [ ] Se puede marcar un hechizo como "favorito" para acceso rápido.

---

## HU-06.3: Aprender hechizos (clases con hechizos conocidos)

**Como** jugador de una clase con hechizos conocidos (Bardo, Brujo, Hechicero, Explorador),
**quiero** poder seleccionar los hechizos que mi personaje conoce,
**para** reflejar las elecciones permanentes de hechizos de mi personaje.

### Criterios de Aceptación

- [ ] Se muestra cuántos hechizos conocidos tiene el personaje y cuántos puede tener según su nivel.
- [ ] Se pueden añadir hechizos a la lista de conocidos desde la lista de hechizos disponibles.
- [ ] Se impide añadir más hechizos de los permitidos por nivel de clase.
- [ ] Se muestra cuántos trucos conoce y cuántos puede tener.
- [ ] Se pueden intercambiar hechizos conocidos al subir de nivel (según las reglas de la clase).
- [ ] Los hechizos conocidos se distinguen visualmente de los no conocidos en las listas.

### Notas Técnicas

- Número de hechizos conocidos varía por clase y nivel:
  - **Bardo**: según tabla de la clase.
  - **Brujo**: según tabla de la clase.
  - **Hechicero**: según tabla de la clase.
  - **Explorador**: según tabla de la clase.

---

## HU-06.4: Preparar hechizos (clases con hechizos preparados)

**Como** jugador de una clase con hechizos preparados (Clérigo, Druida, Mago, Paladín),
**quiero** poder seleccionar qué hechizos tengo preparados cada día,
**para** gestionar mi selección diaria de hechizos.

### Criterios de Aceptación

- [ ] Se muestra cuántos hechizos puede preparar el personaje (nivel de clase + modificador de característica de lanzamiento).
- [ ] Se pueden marcar/desmarcar hechizos como preparados desde la lista de hechizos disponibles.
- [ ] Se impide preparar más hechizos de los permitidos.
- [ ] Los hechizos de dominio/círculo/juramento (según subclase) se muestran como siempre preparados y no cuentan para el límite.
- [ ] Los trucos no necesitan preparación y siempre están disponibles.
- [ ] Para el **Mago**, solo se pueden preparar hechizos del libro de hechizos (ver HU-06.5).
- [ ] Se puede "resetear" la preparación (desmarcar todos) para empezar de cero.

### Notas Técnicas

- Fórmula de hechizos preparados:
  - **Clérigo**: nivel de Clérigo + modificador de Sabiduría (mínimo 1).
  - **Druida**: nivel de Druida + modificador de Sabiduría (mínimo 1).
  - **Mago**: nivel de Mago + modificador de Inteligencia (mínimo 1).
  - **Paladín**: nivel de Paladín / 2 + modificador de Carisma (mínimo 1).

---

## HU-06.5: Libro de hechizos del Mago

**Como** jugador de un Mago,
**quiero** gestionar el libro de hechizos de mi personaje,
**para** llevar un registro de todos los hechizos que he copiado y aprendido.

### Criterios de Aceptación

- [ ] El Mago tiene un "libro de hechizos" donde se registran los hechizos aprendidos.
- [ ] Al crear un Mago de nivel 1, empieza con 6 hechizos de nivel 1 a elegir.
- [ ] Al subir de nivel, se añaden automáticamente 2 hechizos gratuitos de un nivel al que tenga acceso.
- [ ] Se pueden añadir hechizos adicionales al libro manualmente (simulando copiar pergaminos o libros encontrados).
- [ ] Se muestra el coste en oro y tiempo de copiar un hechizo (50 po y 2 horas por nivel de hechizo).
- [ ] Solo se pueden preparar hechizos que estén en el libro (los trucos no necesitan estar en el libro).
- [ ] El libro se visualiza de forma diferenciada del resto de hechizos.

---

## HU-06.6: Gestionar espacios de hechizo

**Como** jugador,
**quiero** poder ver y gastar mis espacios de hechizo,
**para** llevar el control de cuántos hechizos puedo lanzar antes de descansar.

### Criterios de Aceptación

- [ ] Se muestran los espacios de hechizo totales y disponibles por cada nivel de hechizo.
- [ ] Los espacios de hechizo se calculan automáticamente según la clase y nivel del personaje.
- [ ] Se puede marcar un espacio como gastado al lanzar un hechizo (con un toque o clic).
- [ ] Se puede recuperar un espacio gastado (por si se marca por error).
- [ ] Se pueden recuperar todos los espacios (simulando un descanso largo).
- [ ] Los trucos no gastan espacios de hechizo y esto queda claro en la interfaz.
- [ ] Se muestra un indicador visual claro del estado de los espacios (llenos/vacíos).

### Notas Técnicas

- Los espacios de hechizo se determinan por la tabla de la clase del personaje.
- Para multiclase, se usa la tabla de lanzador multiclase de la SRD.
- Considerar niveles de lanzador:
  - **Lanzador completo** (Bardo, Clérigo, Druida, Hechicero, Mago): nivel de clase completo.
  - **Medio lanzador** (Paladín, Explorador): nivel de clase / 2 (redondeado abajo).
  - **Lanzador de pacto** (Brujo): sistema diferente con menos espacios pero de mayor nivel, se recuperan en descanso corto.

---

## HU-06.7: Espacios de hechizo del Brujo (Magia de Pacto)

**Como** jugador de un Brujo,
**quiero** gestionar mis espacios de hechizo de pacto de forma separada,
**para** reflejar que mi magia funciona diferente al resto de clases.

### Criterios de Aceptación

- [ ] Los espacios de hechizo del Brujo se muestran de forma diferenciada.
- [ ] Todos los espacios de pacto son del mismo nivel (determinado por la tabla de la clase).
- [ ] El número de espacios de pacto es reducido (según tabla de la clase, máximo 4).
- [ ] Se incluye un botón de "Descanso Corto" que recupera todos los espacios de pacto.
- [ ] Se indica claramente el nivel de los espacios de pacto.
- [ ] Si el Brujo tiene niveles en otra clase lanzadora (multiclase), los espacios de pacto se muestran separados de los espacios de hechizo normales.
- [ ] Los hechizos de pacto siempre se lanzan al nivel del espacio de pacto (no inferior).

---

## HU-06.8: Lanzar hechizos con seguimiento

**Como** jugador,
**quiero** poder "lanzar" un hechizo desde la app y que se gaste automáticamente el espacio correspondiente,
**para** agilizar el seguimiento durante el combate.

### Criterios de Aceptación

- [ ] Desde la lista de hechizos preparados/conocidos, se puede tocar un hechizo para "lanzarlo".
- [ ] Al lanzar, se pide seleccionar a qué nivel se quiere lanzar (si se puede lanzar a nivel superior).
- [ ] Se gasta automáticamente un espacio de hechizo del nivel seleccionado.
- [ ] Si no quedan espacios del nivel necesario, se avisa al jugador.
- [ ] Si el hechizo requiere concentración, se marca que el personaje está concentrándose en ese hechizo.
- [ ] Si ya se estaba concentrando en otro hechizo, se avisa y se permite cambiar la concentración.
- [ ] Los trucos se pueden lanzar sin gastar espacios (botón de lanzar siempre disponible).
- [ ] Los hechizos rituales se pueden lanzar como ritual (sin gastar espacio, +10 minutos de tiempo de lanzamiento).

---

## HU-06.9: Seguimiento de concentración

**Como** jugador,
**quiero** que la app me recuerde en qué hechizo estoy concentrándome,
**para** no olvidar los efectos activos ni la restricción de concentración.

### Criterios de Aceptación

- [ ] Se muestra un indicador visible en la pantalla principal cuando el personaje se está concentrando en un hechizo.
- [ ] Se muestra el nombre del hechizo en el que se concentra y su duración máxima.
- [ ] Se puede finalizar la concentración manualmente.
- [ ] Al intentar lanzar otro hechizo de concentración, se avisa que se perderá la concentración actual.
- [ ] Solo se puede mantener concentración en un hechizo a la vez.

---

## HU-06.10: Invocaciones y habilidades mágicas especiales

**Como** jugador de una clase con habilidades mágicas especiales (invocaciones sobrenaturales del Brujo, metamagia del Hechicero, etc.),
**quiero** poder ver y gestionar esas habilidades,
**para** tener todo mi arsenal mágico en un solo lugar.

### Criterios de Aceptación

- [ ] Se muestra una sección de "habilidades mágicas especiales" cuando la clase/subclase lo requiera.
- [ ] Para el **Brujo**: se listan las invocaciones sobrenaturales elegidas con su descripción.
- [ ] Para el **Hechicero**: se muestran los puntos de hechicería disponibles/gastados y las opciones de metamagia elegidas.
- [ ] Se pueden gastar/recuperar puntos de hechicería.
- [ ] El Hechicero puede convertir espacios de hechizo en puntos de hechicería y viceversa (según las reglas).
- [ ] Para el **Clérigo/Paladín**: se muestra Canalizar Divinidad con sus usos restantes.
- [ ] Para el **Druida**: se muestra Forma Salvaje con sus usos restantes.

---

## HU-06.11: Descansos y recuperación de recursos mágicos

**Como** jugador,
**quiero** poder realizar descansos cortos y largos desde la app,
**para** recuperar automáticamente los recursos mágicos apropiados.

### Criterios de Aceptación

- [ ] Existe un botón de "Descanso Corto" que:
  - Recupera los espacios de pacto del Brujo.
  - Recupera habilidades que se recargan en descanso corto (según clase/subclase).
  - Permite gastar dados de golpe para recuperar vida (ver HU-08).
- [ ] Existe un botón de "Descanso Largo" que:
  - Recupera todos los espacios de hechizo.
  - Recupera todos los puntos de hechicería del Hechicero.
  - Recupera todos los usos de Canalizar Divinidad.
  - Recupera todos los usos de Forma Salvaje.
  - Recupera la vida al máximo.
  - Recupera dados de golpe gastados (la mitad del total, mínimo 1).
  - Finaliza cualquier concentración activa.
- [ ] Se pide confirmación antes de ejecutar un descanso.
- [ ] Se muestra un resumen de qué recursos se han recuperado tras el descanso.

---

## HU-06.12: Característica de lanzamiento de hechizos

**Como** jugador,
**quiero** ver de forma clara mi CD de salvación de conjuros y mi bonificador de ataque con conjuros,
**para** tener esos valores a mano durante el juego.

### Criterios de Aceptación

- [ ] Se muestra la **CD de salvación de conjuros** calculada automáticamente: 8 + bonificador de competencia + modificador de la característica de lanzamiento.
- [ ] Se muestra el **bonificador de ataque con conjuros**: bonificador de competencia + modificador de la característica de lanzamiento.
- [ ] La característica de lanzamiento se determina automáticamente por la clase:
  - **Inteligencia**: Mago.
  - **Sabiduría**: Clérigo, Druida, Explorador.
  - **Carisma**: Bardo, Brujo, Hechicero, Paladín.
- [ ] Estos valores se actualizan automáticamente al cambiar las puntuaciones de característica o el nivel.
- [ ] Se muestran de forma prominente en la sección de hechizos.

---

## Prioridad

| Historia | Prioridad | Complejidad |
|----------|-----------|-------------|
| HU-06.1  | Alta      | Media       |
| HU-06.2  | Alta      | Baja        |
| HU-06.3  | Alta      | Media       |
| HU-06.4  | Alta      | Media       |
| HU-06.5  | Media     | Media       |
| HU-06.6  | Alta      | Media       |
| HU-06.7  | Media     | Media       |
| HU-06.8  | Media     | Alta        |
| HU-06.9  | Media     | Baja        |
| HU-06.10 | Baja      | Alta        |
| HU-06.11 | Alta      | Media       |
| HU-06.12 | Alta      | Baja        |

---

## Dependencias

- **HU-02**: Creación de personaje (necesario para saber clase y nivel).
- **HU-04**: Estadísticas y habilidades (necesario para calcular CD y bonificador de ataque con conjuros).
- **HU-05**: Subir de nivel (afecta espacios de hechizo, hechizos conocidos, etc.).
- **HU-08**: Vida y combate (los descansos también afectan la vida).
- **Base de datos de hechizos**: Se necesita tener cargada toda la información de hechizos de la SRD 5.1 en español.