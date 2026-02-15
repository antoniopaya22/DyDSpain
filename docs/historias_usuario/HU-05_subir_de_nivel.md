# HU-05: Subir de Nivel

## Descripción General

Historias de usuario relacionadas con el sistema de progresión de nivel del personaje, incluyendo la mejora de estadísticas, obtención de nuevos rasgos de clase, hechizos y puntos de golpe.

---

## HU-05.1: Subir de nivel manualmente

**Como** jugador,
**quiero** poder subir de nivel a mi personaje cuando el DM me lo indique,
**para** reflejar la progresión de mi personaje en la partida.

### Criterios de Aceptación

- Existe un botón o acción clara de "Subir de nivel" en la hoja de personaje.
- Al pulsar, se inicia un flujo guiado paso a paso para configurar el nuevo nivel.
- Se muestra el nivel actual y el nivel al que se va a subir.
- Se solicita confirmación antes de aplicar los cambios definitivamente.
- El nivel del personaje se incrementa en 1 tras completar el flujo.
- El bonificador de competencia se actualiza automáticamente si corresponde al nuevo nivel (según la tabla de progresión).

### Notas

- En D&D 5e los niveles van del 1 al 20.
- El bonificador de competencia cambia en los niveles 1 (+2), 5 (+3), 9 (+4), 13 (+5) y 17 (+6).

---

## HU-05.2: Aumentar puntos de golpe al subir de nivel

**Como** jugador,
**quiero** que al subir de nivel se me permita elegir o tirar mis nuevos puntos de golpe,
**para** aumentar la vida máxima de mi personaje correctamente.

### Criterios de Aceptación

- Al subir de nivel, se presenta la opción de obtener puntos de golpe de dos maneras:
  - **Tirar dado**: se lanza el dado de golpe correspondiente a la clase (d6, d8, d10 o d12) y se suma el modificador de Constitución.
  - **Valor fijo**: se toma el valor medio del dado (redondeado hacia arriba) más el modificador de Constitución.
- Se muestra claramente cuál es el dado de golpe de la clase del personaje.
- Se muestra el modificador de Constitución actual.
- El mínimo de puntos de golpe ganados por nivel es siempre 1 (incluso si el modificador de Constitución es muy negativo).
- Los puntos de golpe máximos del personaje se actualizan automáticamente tras la elección.
- Se muestra un resumen: "Has ganado X puntos de golpe. Tu vida máxima pasa de Y a Z".

### Notas

- Dados de golpe por clase:
  - **d6**: Hechicero, Mago.
  - **d8**: Bardo, Clérigo, Druida, Monje, Pícaro, Brujo.
  - **d10**: Explorador, Guerrero, Paladín.
  - **d12**: Bárbaro.

---

## HU-05.3: Elegir mejoras de puntuación de característica

**Como** jugador,
**quiero** poder distribuir mis mejoras de puntuación de característica cuando me correspondan por nivel,
**para** mejorar las estadísticas de mi personaje.

### Criterios de Aceptación

- Cuando el personaje alcanza un nivel que otorga Mejora de Puntuación de Característica (normalmente niveles 4, 8, 12, 16 y 19), se presenta automáticamente la opción en el flujo de subida de nivel.
- Se permite elegir entre:
  - Subir una característica en +2 puntos.
  - Subir dos características distintas en +1 punto cada una.
- Ninguna característica puede superar el valor de 20 mediante esta mejora (se muestra un aviso si se intenta).
- Se muestran las puntuaciones actuales de todas las características para facilitar la decisión.
- Los modificadores derivados se recalculan automáticamente tras aplicar la mejora.
- Se muestra un resumen de los cambios antes de confirmar.

### Notas

- Algunas clases obtienen esta mejora en niveles adicionales (por ejemplo, el Guerrero en los niveles 6 y 14, y el Pícaro en el nivel 10).
- En futuras versiones se podrían implementar dotes como alternativa a la mejora de puntuación.

---

## HU-05.4: Obtener nuevos rasgos de clase al subir de nivel

**Como** jugador,
**quiero** ver qué nuevos rasgos y habilidades de clase obtengo al subir de nivel,
**para** conocer y registrar las nuevas capacidades de mi personaje.

### Criterios de Aceptación

- Al subir de nivel, se muestra una lista de todos los rasgos de clase nuevos que se obtienen en ese nivel.
- Cada rasgo incluye su nombre y una descripción completa en español.
- Los rasgos se añaden automáticamente a la hoja de personaje del jugador.
- Si un rasgo existente mejora o cambia (por ejemplo, Ataque Adicional), se actualiza la descripción.
- Se pueden consultar los rasgos obtenidos después de completar la subida de nivel, desde la sección de rasgos del personaje.

### Notas

- Los rasgos de clase están definidos en las tablas de progresión de cada clase del SRD 5.1 en español.

---

## HU-05.5: Elegir subclase al alcanzar el nivel correspondiente

**Como** jugador,
**quiero** poder elegir mi subclase (arquetipo, dominio, tradición, etc.) cuando alcance el nivel requerido,
**para** especializar a mi personaje.

### Criterios de Aceptación

- Cuando el personaje alcanza el nivel en el que debe elegir subclase, se presenta la selección como parte del flujo de subida de nivel.
- Se muestran todas las subclases disponibles del SRD para la clase del personaje, con nombre y descripción.
- Una vez elegida, la subclase queda registrada y visible en la hoja de personaje.
- En niveles posteriores donde la subclase otorga rasgos adicionales, estos se añaden automáticamente.
- La subclase no se puede cambiar una vez seleccionada (salvo edición manual por el jugador si lo desea).

### Notas

- Niveles de elección de subclase por clase:
  - **Nivel 1**: Clérigo (Dominio Divino), Hechicero (Origen de Hechicero), Brujo (Patrón de Ultratierra).
  - **Nivel 2**: Druida (Círculo Druídico), Mago (Tradición Arcana).
  - **Nivel 3**: Bárbaro (Camino Primigenio), Bardo (Colegio de Bardos), Guerrero (Arquetipo Marcial), Monje (Tradición Monástica), Paladín (Juramento Sagrado), Pícaro (Arquetipo de Pícaro), Explorador (Arquetipo de Explorador).

---

## HU-05.6: Aprender nuevos hechizos al subir de nivel

**Como** jugador lanzador de conjuros,
**quiero** poder elegir los nuevos hechizos que aprendo al subir de nivel,
**para** ampliar el repertorio mágico de mi personaje.

### Criterios de Aceptación

- Si la clase del personaje es lanzadora de conjuros, al subir de nivel se muestra la opción de aprender nuevos hechizos (si corresponde según la tabla de la clase).
- Se indica cuántos hechizos nuevos puede aprender el personaje en ese nivel.
- Se muestra la lista de hechizos disponibles filtrada por:
  - Clase del personaje.
  - Nivel de conjuro al que tiene acceso según su nivel de clase.
- Cada hechizo en la lista muestra al menos: nombre, nivel, escuela y una descripción breve.
- Se pueden seleccionar los hechizos hasta completar el cupo disponible.
- Los hechizos elegidos se añaden a la lista de hechizos conocidos del personaje.
- Para clases que preparan conjuros (Clérigo, Druida, Paladín), se actualiza la lista de conjuros disponibles para preparar.
- Se indica si se desbloquean nuevos niveles de espacio de conjuro.

### Notas

- Tipos de magia por clase:
  - **Hechizos conocidos** (eligen hechizos fijos): Bardo, Explorador, Hechicero, Brujo.
  - **Hechizos preparados** (eligen cada día de una lista completa): Clérigo, Druida, Paladín.
  - **Libro de conjuros** (añaden hechizos al libro y preparan de ahí): Mago.
- El Mago gana 2 hechizos gratuitos en su libro de conjuros por cada nivel de Mago.

---

## HU-05.7: Intercambiar hechizos conocidos al subir de nivel

**Como** jugador de una clase con hechizos conocidos (Bardo, Hechicero, Explorador, Brujo),
**quiero** poder intercambiar un hechizo conocido por otro al subir de nivel,
**para** adaptar mi repertorio mágico a mis necesidades actuales.

### Criterios de Aceptación

- Al subir de nivel, se ofrece la opción de intercambiar **un** hechizo conocido por otro de la lista de la clase.
- El nuevo hechizo debe ser de un nivel para el que el personaje tenga espacios de conjuro.
- Se muestra la lista de hechizos actuales del personaje para elegir cuál reemplazar.
- Se muestra la lista de hechizos disponibles para elegir el reemplazo.
- El intercambio es opcional; el jugador puede saltárselo.
- Se muestra un resumen: "Has reemplazado [hechizo antiguo] por [hechizo nuevo]".

### Notas

- Esta mecánica aplica solo a las clases que tienen "hechizos conocidos" y lo especifican en su descripción.

---

## HU-05.8: Actualización automática de espacios de conjuro

**Como** jugador lanzador de conjuros,
**quiero** que mis espacios de conjuro se actualicen automáticamente al subir de nivel,
**para** no tener que consultarlo manualmente en las tablas.

### Criterios de Aceptación

- Al subir de nivel, los espacios de conjuro se recalculan según la tabla de progresión de la clase.
- Se muestra un resumen de los cambios: espacios nuevos o incrementados por nivel de conjuro.
- Si se desbloquea un nuevo nivel de conjuro, se destaca de forma visual.
- Los espacios de conjuro actualizados se reflejan inmediatamente en la hoja de personaje.
- Para el Brujo, se actualiza correctamente su sistema de espacios de conjuro especial (todos del mismo nivel, se recuperan en descanso corto).

### Notas

- Las tablas de espacios de conjuro son distintas para:
  - Lanzadores completos (Bardo, Clérigo, Druida, Hechicero, Mago): hasta nivel de conjuro 9.
  - Lanzadores medios (Explorador, Paladín): hasta nivel de conjuro 5, empiezan en nivel 2.
  - Brujo (sistema de Magia de Pacto): espacios limitados pero de nivel alto.

---

## HU-05.9: Resumen completo de la subida de nivel

**Como** jugador,
**quiero** ver un resumen completo de todos los cambios al finalizar el proceso de subida de nivel,
**para** tener claro qué ha cambiado en mi personaje.

### Criterios de Aceptación

- Al finalizar el flujo de subida de nivel, se muestra una pantalla de resumen con todos los cambios aplicados:
  - Nivel anterior → Nivel nuevo.
  - Puntos de golpe ganados y nueva vida máxima.
  - Bonificador de competencia (si cambió).
  - Mejoras de puntuación de característica (si aplica).
  - Nuevos rasgos de clase obtenidos.
  - Subclase elegida (si aplica).
  - Nuevos hechizos aprendidos (si aplica).
  - Hechizos intercambiados (si aplica).
  - Nuevos espacios de conjuro (si aplica).
- Se puede confirmar o revisar antes de cerrar el resumen.
- Los cambios ya están aplicados en la hoja de personaje al cerrar el resumen.

---

## HU-05.10: Historial de niveles

**Como** jugador,
**quiero** poder consultar un historial de las decisiones que tomé en cada subida de nivel,
**para** recordar qué elegí y cuándo.

### Criterios de Aceptación

- Existe una sección accesible desde la hoja de personaje que muestra el historial de niveles.
- Por cada nivel se muestra:
  - Número de nivel.
  - Puntos de golpe ganados (y método: tirada o valor fijo).
  - Mejoras de características aplicadas (si hubo).
  - Rasgos de clase obtenidos.
  - Hechizos aprendidos o intercambiados.
  - Subclase elegida (si fue en ese nivel).
- El historial es solo de consulta, no permite deshacer niveles.

---

## HU-05.11: Multiclase (futuro)

**Como** jugador avanzado,
**quiero** poder subir de nivel en una clase diferente a mi clase principal,
**para** crear personajes multiclase.

### Criterios de Aceptación

- Al subir de nivel, se ofrece la opción de elegir en qué clase subir.
- Se verifican los requisitos mínimos de característica para multiclasear (según las reglas del SRD).
- Si no se cumplen los requisitos, se muestra un aviso y no se permite la multiclase.
- Los puntos de golpe se calculan con el dado de golpe de la nueva clase.
- Las competencias otorgadas por multiclase se aplican correctamente (son un subconjunto de las de la clase base).
- Los espacios de conjuro se calculan según las reglas de lanzador multiclase si ambas clases son lanzadoras.
- Los rasgos de cada clase se gestionan por separado.

### Notas

- Esta es una funcionalidad avanzada que se implementará en fases posteriores.
- Requisitos de multiclase (puntuación mínima de 13):
  - Bárbaro: Fuerza.
  - Bardo: Carisma.
  - Clérigo: Sabiduría.
  - Druida: Sabiduría.
  - Explorador: Destreza y Sabiduría.
  - Guerrero: Fuerza o Destreza.
  - Hechicero: Carisma.
  - Mago: Inteligencia.
  - Monje: Destreza y Sabiduría.
  - Paladín: Fuerza y Carisma.
  - Pícaro: Destreza.
  - Brujo: Carisma.

---

## Prioridad de Implementación

| Historia | Prioridad | Fase |
|----------|-----------|------|
| HU-05.1 - Subir de nivel manualmente | Alta | MVP |
| HU-05.2 - Aumentar puntos de golpe | Alta | MVP |
| HU-05.3 - Mejoras de puntuación de característica | Alta | MVP |
| HU-05.4 - Nuevos rasgos de clase | Alta | MVP |
| HU-05.5 - Elegir subclase | Alta | MVP |
| HU-05.6 - Aprender nuevos hechizos | Alta | MVP |
| HU-05.7 - Intercambiar hechizos | Media | MVP |
| HU-05.8 - Actualización de espacios de conjuro | Alta | MVP |
| HU-05.9 - Resumen de subida de nivel | Media | MVP |
| HU-05.10 - Historial de niveles | Baja | Post-MVP |
| HU-05.11 - Multiclase | Baja | Futuro |