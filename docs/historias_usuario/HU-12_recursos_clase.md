# HU-12: Recursos y Habilidades de Clase

## Descripción General

Cada clase de D&D 5e posee recursos únicos con usos limitados (por descanso corto, largo o especiales) que deben gestionarse durante la partida. Estos recursos escalan con el nivel del personaje y tienen mecánicas diferentes entre sí. La app debe permitir ver, gastar, recuperar y rastrear todos estos recursos de forma clara e intuitiva.

---

## HU-12.1: Panel de Recursos del Personaje

**Como** jugador,
**quiero** ver un panel con todos los recursos limitados de mi personaje,
**para** saber de un vistazo cuántos usos me quedan de cada habilidad.

### Criterios de Aceptación

- En la hoja de personaje existe una sección "Recursos" visible y accesible.
- Se muestran todos los recursos con usos limitados, agrupados por origen (clase, subclase, raza, objetos).
- Cada recurso muestra:
  - Nombre del recurso.
  - Usos restantes / usos totales (ej: `2 / 3`).
  - Indicador visual de tipo "dots" o barra (ej: ● ● ○ para 2 de 3).
  - Tipo de recuperación (descanso corto, descanso largo, especial).
- Los recursos agotados se muestran visualmente diferenciados (atenuados o en rojo).
- Se puede pulsar en un recurso para ver su descripción completa.

### Notas Técnicas

- Los recursos se cargan automáticamente según la clase, subclase, nivel y raza del personaje.
- Permitir recursos personalizados para objetos mágicos u otros efectos.

---

## HU-12.2: Gastar y Recuperar Recursos

**Como** jugador,
**quiero** poder gastar y recuperar usos de mis recursos con un solo toque,
**para** llevar el control durante el combate sin perder tiempo.

### Criterios de Aceptación

- Al pulsar un recurso activo, se descuenta un uso.
- Se puede restaurar un uso pulsando un botón de "+" o deshaciendo el gasto.
- Si el recurso está en 0, al intentar gastarlo se muestra un aviso de "recurso agotado".
- Los descansos (corto y largo) restauran automáticamente los recursos correspondientes:
  - **Descanso corto**: Ki del Monje, espacios de pacto del Brujo, Tomar Aliento del Guerrero, etc.
  - **Descanso largo**: Furias del Bárbaro, Inspiración Bárdica (si < nivel 5), Canalizar Divinidad, Forma Salvaje, Imponer las Manos, etc.
- Se muestra un resumen de los recursos recuperados tras cada descanso.

---

## HU-12.3: Furia del Bárbaro

**Como** jugador de un Bárbaro,
**quiero** gestionar mi Furia con sus usos y efectos,
**para** saber cuántas furias me quedan y qué bonificadores tengo activos.

### Criterios de Aceptación

- Se muestran los usos de Furia restantes / totales según el nivel:
  - Nivel 1-2: 2 usos
  - Nivel 3-5: 3 usos
  - Nivel 6-11: 4 usos
  - Nivel 12-16: 5 usos
  - Nivel 17-19: 6 usos
  - Nivel 20: Ilimitadas
- Al activar Furia, se marca como "activa" con indicador visual (ej: icono de llama).
- Mientras la Furia está activa, se muestra:
  - **Daño extra de Furia**: +2 (niveles 1-8), +3 (niveles 9-15), +4 (nivel 16+).
  - **Resistencia** a daño contundente, cortante y perforante.
  - Recordatorio: no puede lanzar conjuros ni concentrarse.
- Se puede desactivar la Furia manualmente.
- Las Furias se recuperan tras descanso largo.

---

## HU-12.4: Inspiración Bárdica

**Como** jugador de un Bardo,
**quiero** gestionar mi Inspiración Bárdica,
**para** saber cuántos usos me quedan y qué dado otorgo a los aliados.

### Criterios de Aceptación

- Se muestran los usos restantes / totales (usos = modificador de Carisma, mínimo 1).
- Se muestra el tipo de dado que otorga la Inspiración, que escala con el nivel:
  - Nivel 1-4: d6
  - Nivel 5-9: d8
  - Nivel 10-14: d10
  - Nivel 15+: d12
- El tipo de recuperación cambia según el nivel:
  - Nivel 1-4: se recupera con **descanso largo**.
  - Nivel 5+: se recupera con **descanso corto o largo** (Fuente de Inspiración).
- Al gastar un uso, se puede tirar el dado automáticamente desde el tirador integrado (HU-11).

---

## HU-12.5: Puntos de Ki del Monje

**Como** jugador de un Monje,
**quiero** gestionar mi reserva de puntos de Ki,
**para** saber cuántos puedo gastar en habilidades especiales.

### Criterios de Aceptación

- Se muestran los puntos de Ki restantes / totales (total = nivel de Monje, desde nivel 2).
- Se puede gastar Ki en incrementos de 1 punto.
- Se muestra una lista de las habilidades que cuestan Ki:
  - **Lluvia de Golpes**: 1 Ki (2 ataques desarmados adicionales como acción bonus).
  - **Defensa Paciente**: 1 Ki (acción de Esquivar como acción bonus).
  - **Paso del Viento**: 1 Ki (acción de Retirada o Carrera como acción bonus + salto doble).
  - **Golpe Aturdidor** (nivel 5+): 1 Ki (salvación de CON o aturdido).
  - Habilidades adicionales de la tradición monástica.
- Los puntos de Ki se recuperan al completo con un **descanso corto o largo**.

---

## HU-12.6: Puntos de Hechicería y Metamagia del Hechicero

**Como** jugador de un Hechicero,
**quiero** gestionar mis puntos de hechicería y opciones de Metamagia,
**para** modificar mis conjuros y convertir recursos mágicos.

### Criterios de Aceptación

- Se muestran los puntos de hechicería restantes / totales (total = nivel de Hechicero, desde nivel 2).
- Se muestra la lista de opciones de Metamagia elegidas (2 a nivel 3, +1 a nivel 10, +1 a nivel 17) con su coste en puntos:
  - Conjuro Cuidadoso (1 pt)
  - Conjuro Distante (1 pt)
  - Conjuro Potenciado (1 pt)
  - Conjuro Extendido (1 pt)
  - Conjuro Intensificado (3 pts)
  - Conjuro Rápido (2 pts)
  - Conjuro Sutil (1 pt)
  - Conjuro Duplicado (varía: nivel del conjuro en pts, o 1 si truco)
- Se permite **convertir espacios de hechizo en puntos de hechicería** y viceversa:
  - Espacio → Puntos: nivel del espacio = puntos ganados.
  - Puntos → Espacio: según tabla (2 pts → nivel 1, 3 → nivel 2, 5 → nivel 3, 6 → nivel 4, 7 → nivel 5). Máximo nivel 5.
- Los puntos de hechicería se recuperan con **descanso largo**.

---

## HU-12.7: Imponer las Manos del Paladín

**Como** jugador de un Paladín,
**quiero** gestionar mi reserva de Imponer las Manos,
**para** curar aliados o curar enfermedades de forma granular.

### Criterios de Aceptación

- Se muestran los puntos de curación restantes / totales (total = nivel de Paladín × 5).
- Se puede gastar cualquier cantidad de puntos (de 1 al máximo restante) en una sola acción.
- Se muestra la opción de gastar 5 puntos para curar una enfermedad o neutralizar un veneno (en lugar de curar PG).
- La reserva se recupera al completo con un **descanso largo**.

---

## HU-12.8: Canalizar Divinidad del Clérigo y Paladín

**Como** jugador de un Clérigo o Paladín,
**quiero** gestionar mis usos de Canalizar Divinidad,
**para** saber cuántas veces puedo usar mis habilidades de canalización.

### Criterios de Aceptación

- Se muestran los usos restantes / totales:
  - **Clérigo**: 1 uso (nivel 2), 2 usos (nivel 6), 3 usos (nivel 18).
  - **Paladín**: 1 uso (nivel 3).
- Se muestra el listado de opciones de Canalizar Divinidad disponibles según la clase y el dominio/juramento:
  - **Clérigo (cualquier dominio)**: Expulsar Muertos Vivientes.
  - **Clérigo (Dominio de la Vida)**: Preservar Vida (curar 5 × nivel de Clérigo repartidos entre aliados).
  - **Paladín (Juramento de Entrega)**: Arma Sagrada (+mod. CAR a ataques) / Expulsar lo Impío.
- Se recupera con **descanso corto o largo**.

---

## HU-12.9: Forma Salvaje del Druida

**Como** jugador de un Druida,
**quiero** gestionar mis usos de Forma Salvaje,
**para** transformarme en bestias durante el combate o la exploración.

### Criterios de Aceptación

- Se muestran los usos restantes / totales (2 usos).
- Se indica el nivel máximo de DG de las bestias disponibles según el nivel del Druida:
  - Nivel 2: DG ≤ 1/4, sin velocidad de nadar/volar.
  - Nivel 4: DG ≤ 1/2, sin velocidad de volar.
  - Nivel 8: DG ≤ 1.
- Al activar Forma Salvaje, se puede registrar la bestia elegida con sus PG temporales.
- Se recupera con **descanso corto o largo**.

### Notas Técnicas

- El catálogo de bestias está fuera del alcance del SRD básico; permitir entrada manual de estadísticas de bestia.

---

## HU-12.10: Castigo Divino del Paladín

**Como** jugador de un Paladín,
**quiero** poder aplicar Castigo Divino al impactar en cuerpo a cuerpo,
**para** gastar un espacio de hechizo y añadir daño radiante extra.

### Criterios de Aceptación

- Tras impactar con un ataque cuerpo a cuerpo, se ofrece la opción de "Castigar" (Castigo Divino).
- Al activarlo, se pide seleccionar el nivel del espacio de hechizo a gastar.
- Se calcula el daño extra: 2d8 + 1d8 por nivel de espacio por encima de 1º (máximo 5d8). +1d8 adicional si el objetivo es muerto viviente o infernal.
- Se gasta el espacio de hechizo seleccionado automáticamente.
- Se puede tirar el daño desde el tirador integrado (HU-11).

### Notas Técnicas

- Castigo Divino NO es un conjuro; no requiere preparación, solo consumir un espacio de hechizo al impactar.

---

## HU-12.11: Recuperación Arcana del Mago

**Como** jugador de un Mago,
**quiero** poder usar Recuperación Arcana una vez al día tras un descanso corto,
**para** recuperar algunos espacios de hechizo gastados.

### Criterios de Aceptación

- Se muestra un botón "Recuperación Arcana" disponible 1 vez al día.
- Al activarlo, el jugador elige qué espacios de hechizo recuperar.
- La suma de los niveles de los espacios recuperados debe ser ≤ ⌈nivel de Mago / 2⌉.
- No se pueden recuperar espacios de nivel 6 o superior.
- Tras usarlo, se marca como gastado hasta el próximo descanso largo.

---

## HU-12.12: Recursos con Escalado por Nivel (Genérico)

**Como** jugador,
**quiero** que los recursos de mi personaje se actualicen automáticamente al subir de nivel,
**para** no tener que ajustarlos manualmente.

### Criterios de Aceptación

- Al subir de nivel, los totales de recursos se recalculan automáticamente:
  - Furias del Bárbaro, Ki del Monje, Puntos de Hechicería del Hechicero, Imponer las Manos del Paladín, etc.
- Si un recurso cambia su tipo de recuperación (ej: Inspiración Bárdica pasa de descanso largo a corto en nivel 5), se actualiza automáticamente.
- Si un recurso escala en poder (ej: dado de Inspiración d6→d8, daño de Furia +2→+3), se muestra el valor actualizado.
- Se muestran los nuevos recursos adquiridos al subir de nivel en el resumen de subida (HU-05.9).

---

## HU-12.13: Recursos Personalizados

**Como** jugador,
**quiero** poder crear recursos personalizados con nombre, máximo de usos y tipo de recuperación,
**para** rastrear efectos de objetos mágicos, bendiciones del DM u otros recursos especiales.

### Criterios de Aceptación

- Se puede crear un recurso personalizado con:
  - Nombre (obligatorio).
  - Número máximo de usos.
  - Tipo de recuperación: descanso corto, descanso largo, diario, manual.
  - Descripción (opcional).
- Los recursos personalizados aparecen en el panel de recursos junto a los automáticos.
- Se pueden editar y eliminar.

---

## Modelo de Datos (Referencia)

```text
RecursoClase {
  id: UUID
  personaje_id: UUID
  nombre: string                    // Ej: "Furia", "Inspiración Bárdica", "Puntos de Ki"
  origen: "clase" | "subclase" | "raza" | "objeto" | "personalizado"
  clase_origen: string | null       // Ej: "Bárbaro", "Bardo"
  usos_actuales: number
  usos_maximos: number              // Se recalcula según nivel
  tipo_recurso: "usos" | "pool"    // "usos" = discreto (Furia), "pool" = granular (Ki, Imponer las Manos)
  recuperacion: "descanso_corto" | "descanso_largo" | "diario" | "manual" | "especial"
  activo: boolean                   // Para recursos activables (Furia activa)
  dado_asociado: string | null      // Ej: "d6" para Inspiración Bárdica
  valor_escala: string | null       // JSON con escalado por nivel
  descripcion: string | null
}
```

---

## Referencia: Recursos por Clase

| Clase | Recurso | Total | Recuperación | Escala |
|-------|---------|-------|-------------|--------|
| Bárbaro | Furia | 2→Ilimitada | Descanso largo | Usos + daño extra |
| Bardo | Inspiración Bárdica | Mod. CAR | Largo (Corto lv5+) | Dado d6→d12 |
| Bardo | Canción de Descanso | Ilimitada | — | Dado d6→d12 |
| Clérigo | Canalizar Divinidad | 1→3 | Descanso corto | Usos |
| Druida | Forma Salvaje | 2 | Descanso corto | DG máximo bestia |
| Guerrero | Tomar Aliento | 1 | Descanso corto | Curación escala con nivel |
| Guerrero | Acción Súbita | 1→2 | Descanso corto/largo | Usos (lv17+: 2) |
| Hechicero | Puntos de Hechicería | = nivel | Descanso largo | Lineal |
| Mago | Recuperación Arcana | 1/día | Descanso largo | Niveles recuperados |
| Monje | Puntos de Ki | = nivel | Descanso corto | Lineal |
| Paladín | Imponer las Manos | 5 × nivel | Descanso largo | Lineal |
| Paladín | Castigo Divino | Espacios hechizo | — | Daño escala |
| Paladín | Canalizar Divinidad | 1 | Descanso corto | — |
| Paladín | Sentidos Divinos | 1 + mod. CAR | Descanso largo | — |
| Pícaro | Ataque Furtivo | Ilimitado (1/turno) | — | 1d6→10d6 |

---

## Prioridad de Implementación

| Historia | Prioridad | Complejidad |
|----------|-----------|-------------|
| HU-12.1 Panel de recursos | 🔴 Alta | Media |
| HU-12.2 Gastar y recuperar | 🔴 Alta | Media |
| HU-12.3 Furia del Bárbaro | 🔴 Alta | Media |
| HU-12.4 Inspiración Bárdica | 🟡 Media | Baja |
| HU-12.5 Ki del Monje | 🟡 Media | Baja |
| HU-12.6 Hechicería/Metamagia | 🟡 Media | Alta |
| HU-12.7 Imponer las Manos | 🟡 Media | Baja |
| HU-12.8 Canalizar Divinidad | 🟡 Media | Baja |
| HU-12.9 Forma Salvaje | 🟡 Media | Media |
| HU-12.10 Castigo Divino | 🟡 Media | Media |
| HU-12.11 Recuperación Arcana | 🟢 Baja | Baja |
| HU-12.12 Escalado por nivel | 🔴 Alta | Media |
| HU-12.13 Recursos personalizados | 🟢 Baja | Baja |

---

## Dependencias

- **HU-02**: Creación de personaje (clase y subclase determinan los recursos).
- **HU-03**: Hoja de personaje (sección donde se muestran los recursos).
- **HU-04**: Estadísticas (modificadores afectan cálculos como usos de Inspiración = mod. CAR).
- **HU-05**: Subir de nivel (recursos escalan y aparecen nuevos al subir).
- **HU-06**: Gestión de hechizos (Castigo Divino gasta espacios, Hechicería convierte espacios↔puntos).
- **HU-08**: Vida y combate (descansos restauran recursos).
- **HU-11**: Tirador de dados (tirar dados asociados a recursos: Inspiración, daño de Furia, etc.).
