# HU-11: Tirador de Dados

## Descripción General

D&D gira en torno a las tiradas de dados. La aplicación debe ofrecer un tirador de dados integrado, accesible desde cualquier pantalla, que permita tiradas rápidas (habilidades, ataque, daño, salvaciones) y tiradas personalizadas con cualquier fórmula. El tirador debe tener en cuenta ventaja/desventaja y mantener un historial de tiradas recientes.

---

## HU-11.1: Acceso Rápido al Tirador de Dados

**Como** jugador,
**quiero** poder abrir el tirador de dados desde cualquier pantalla de la app,
**para** hacer tiradas rápidamente sin tener que navegar a una sección concreta.

### Criterios de Aceptación

- Existe un **botón flotante** (FAB) con un icono de dado visible en las pantallas principales (hoja de personaje, inventario, hechizos, combate).
- Al pulsarlo se abre un panel o modal con el tirador de dados.
- El tirador se puede cerrar fácilmente para volver a lo que estaba haciendo.
- El panel no bloquea la navegación; se puede consultar la hoja mientras el resultado está visible.

### Notas Técnicas

- Considerar un bottom sheet o modal semitransparente que no oculte toda la pantalla.
- El FAB debe respetar las guías de diseño de NativeWind / Tailwind.

---

## HU-11.2: Tirada Personalizada con Fórmula

**Como** jugador,
**quiero** poder introducir una fórmula de dados cualquiera (ej: `2d6+3`, `4d6kh3`, `1d20+5`),
**para** resolver cualquier tirada que el DM me pida.

### Criterios de Aceptación

- Se muestra un campo de texto donde el jugador puede escribir una fórmula de dados.
- Fórmulas soportadas:
  - `NdX` — Tirar N dados de X caras (ej: `2d6`, `1d20`, `4d8`).
  - `NdX+M` / `NdX-M` — Con modificador fijo (ej: `1d20+5`, `2d6-1`).
  - `NdXkhY` — Tirar N dados y quedarse con los Y más altos (ej: `4d6kh3` para generar estadísticas).
  - `NdXkl Y` — Tirar N dados y quedarse con los Y más bajos.
  - Combinaciones múltiples: `1d8+2d6+3`.
- Al pulsar "Tirar", se muestra:
  - El resultado de cada dado individual.
  - El total final.
  - La fórmula utilizada.
- Se puede repetir la última tirada con un solo toque.
- Los dados descartados (en fórmulas `kh`/`kl`) se muestran tachados o atenuados.

### Notas Técnicas

- Implementar un parser de fórmulas de dados con soporte para operadores `+`, `-`, `kh`, `kl`.
- Usar `Math.random()` o `crypto.getRandomValues()` para la generación de números aleatorios.

---

## HU-11.3: Dados Rápidos (Presets)

**Como** jugador,
**quiero** tener botones de acceso directo para los dados más comunes (d4, d6, d8, d10, d12, d20, d100),
**para** tirar un dado con un solo toque sin escribir fórmulas.

### Criterios de Aceptación

- Se muestran botones para cada tipo de dado: **d4**, **d6**, **d8**, **d10**, **d12**, **d20**, **d100** (percentil).
- Al pulsar un dado se tira inmediatamente y se muestra el resultado.
- Se puede ajustar la cantidad de dados antes de tirar (ej: 2d6).
- Se puede añadir un modificador rápido (ej: +3).
- El resultado se muestra con una animación breve y satisfactoria.

---

## HU-11.4: Ventaja y Desventaja

**Como** jugador,
**quiero** poder tirar con ventaja o desventaja en un solo toque,
**para** aplicar esta mecánica fundamental de D&D 5e de forma rápida.

### Criterios de Aceptación

- Existe un selector o toggle con tres estados: **Normal**, **Ventaja**, **Desventaja**.
- En **ventaja**: se tiran 2d20 y se muestra el resultado más alto como resultado principal. El otro resultado se muestra atenuado.
- En **desventaja**: se tiran 2d20 y se muestra el resultado más bajo como resultado principal.
- En **normal**: se tira 1d20.
- Ventaja/desventaja aplica solo a tiradas de d20 (ataques, habilidades, salvaciones).
- Tras tirar, el selector vuelve a "Normal" automáticamente (para evitar errores).

---

## HU-11.5: Tiradas Predefinidas del Personaje

**Como** jugador,
**quiero** tener tiradas predefinidas basadas en las estadísticas de mi personaje,
**para** tirar habilidades, salvaciones y ataques sin calcular nada manualmente.

### Criterios de Aceptación

- Desde la sección de habilidades, al pulsar una habilidad se puede tirar directamente `1d20 + bonificador`.
- Desde la sección de tiradas de salvación, al pulsar una salvación se puede tirar `1d20 + bonificador`.
- Desde el inventario (armas equipadas), al pulsar un arma se puede tirar:
  - **Tirada de ataque**: `1d20 + bonificador de ataque`.
  - **Tirada de daño**: `dado de daño + modificador`.
- Desde la lista de conjuros, para conjuros con ataque: se puede tirar `1d20 + bonificador de ataque con conjuros`.
- Todas las tiradas predefinidas respetan ventaja/desventaja si está activada.
- Se muestra el nombre de la tirada junto al resultado (ej: "Percepción: 18 (d20[15] + 3)").

### Notas Técnicas

- Los bonificadores se leen de los datos del personaje activo.
- Las tiradas predefinidas deben usar el mismo componente visual que las tiradas personalizadas.

---

## HU-11.6: Historial de Tiradas

**Como** jugador,
**quiero** ver un historial de mis tiradas recientes,
**para** poder consultarlas si necesito recordar un resultado o resolver dudas.

### Criterios de Aceptación

- Se mantiene un historial de las últimas tiradas (mínimo 20, idealmente 50).
- Cada entrada del historial muestra:
  - Fórmula utilizada o nombre de la tirada predefinida.
  - Resultado de cada dado individual.
  - Total final.
  - Fecha y hora.
- El historial es accesible desde el panel del tirador de dados.
- Se puede limpiar el historial manualmente.
- El historial está asociado al personaje/partida activa.
- Las tiradas con ventaja/desventaja se indican visualmente.

---

## HU-11.7: Tiradas Críticas y Pifias

**Como** jugador,
**quiero** que la app destaque visualmente los resultados de 20 natural y 1 natural en tiradas de d20,
**para** celebrar los críticos y lamentar las pifias de forma inmersiva.

### Criterios de Aceptación

- Un resultado de **20 natural** en d20 se muestra con un efecto visual especial (color dorado, animación de brillo, texto "¡CRÍTICO!").
- Un resultado de **1 natural** en d20 se muestra con un efecto visual especial (color rojo, texto "¡PIFIA!").
- En tiradas de daño con crítico, se muestra la opción de tirar los dados de daño dobles automáticamente.
- Los efectos visuales son breves y no disruptivos (no bloquean la app).

---

## HU-11.8: Compartir Tirada con el Master

**Como** jugador conectado a una sala,
**quiero** poder compartir el resultado de una tirada con el master,
**para** que pueda verificarlo sin necesidad de dictar el resultado.

### Criterios de Aceptación

- Existe un botón "Compartir" en cada resultado de tirada.
- Al compartir, el resultado se envía a la sala del master con el nombre del personaje, la fórmula y el resultado completo.
- El master ve la tirada en su panel de monitorización.
- La tirada compartida es de solo lectura para el master.
- Solo funciona si el jugador está conectado a una sala activa.

---

## Modelo de Datos (Referencia)

```text
TiradaDados {
  id: UUID
  personaje_id: UUID
  partida_id: UUID
  formula: string              // Ej: "1d20+5", "4d6kh3"
  nombre: string | null        // Ej: "Percepción", "Ataque con espada larga"
  tipo: "personalizada" | "habilidad" | "salvacion" | "ataque" | "daño" | "iniciativa"
  ventaja: "normal" | "ventaja" | "desventaja"
  resultados_dados: number[]   // Resultado de cada dado individual
  dados_descartados: number[]  // Dados eliminados por kh/kl
  modificador: number          // Modificador total aplicado
  total: number                // Resultado final
  es_critico: boolean          // 20 natural en d20
  es_pifia: boolean            // 1 natural en d20
  compartida_sala: boolean     // Si se envió al master
  fecha: datetime
}
```

---

## Prioridad de Implementación

| Historia | Prioridad | Complejidad |
|----------|-----------|-------------|
| HU-11.1 Acceso rápido | 🔴 Alta | Baja |
| HU-11.2 Fórmula personalizada | 🔴 Alta | Media |
| HU-11.3 Dados rápidos | 🔴 Alta | Baja |
| HU-11.4 Ventaja/Desventaja | 🔴 Alta | Baja |
| HU-11.5 Tiradas predefinidas | 🔴 Alta | Media |
| HU-11.6 Historial | 🟡 Media | Baja |
| HU-11.7 Críticos y pifias | 🟡 Media | Baja |
| HU-11.8 Compartir con master | 🟢 Baja | Media |

---

## Dependencias

- **HU-03**: Hoja de personaje (necesario para tiradas predefinidas).
- **HU-04**: Estadísticas y habilidades (bonificadores de habilidad y salvación).
- **HU-07**: Inventario (bonificadores de ataque y daño de armas).
- **HU-06**: Hechizos (bonificador de ataque con conjuros).
- **HU-08**: Vida y combate (tiradas de iniciativa, salvaciones contra muerte).

---

## Wireframe Conceptual

```
┌──────────────────────────────────┐
│         🎲 TIRADOR DE DADOS      │
├──────────────────────────────────┤
│  Fórmula: [  1d20+5          ]   │
│                                   │
│  ○ Normal  ● Ventaja  ○ Desvent. │
│                                   │
│  [ d4 ][ d6 ][ d8 ][ d10 ]      │
│  [ d12][ d20][ d100]            │
│                                   │
│        [  🎲 TIRAR  ]            │
├──────────────────────────────────┤
│                                   │
│        ✨ ¡CRÍTICO! ✨            │
│      d20[20] + 5 = 25            │
│                                   │
│     [Tirar de nuevo] [Compartir] │
├──────────────────────────────────┤
│  📜 Historial reciente           │
│  · Percepción: 18 (d20[15]+3)   │
│  · Ataque espada: 22 (d20[17]+5)│
│  · Daño: 11 (1d8[8]+3)          │
│  · Salvación CON: 9 (d20[4]+5)  │
└──────────────────────────────────┘
```
