# HU-07: Inventario y Equipamiento

## Descripción General

Historias de usuario relacionadas con la gestión del inventario del personaje, incluyendo objetos, armas, armaduras, equipamiento y economía.

---

## HU-07.1: Ver inventario completo

**Como** jugador,
**quiero** ver una lista completa de todos los objetos que lleva mi personaje,
**para** saber qué tengo disponible en todo momento.

### Criterios de Aceptación

- Se muestra una lista de todos los objetos del personaje.
- Cada objeto muestra su nombre, cantidad y peso.
- Se muestra el peso total transportado.
- Se muestra la capacidad de carga máxima del personaje (Fuerza × 15 en libras).
- Se indica visualmente si el personaje está sobrecargado.
- Los objetos se pueden ordenar por nombre, peso o tipo.
- Se puede buscar/filtrar objetos por nombre.

### Notas Técnicas

- La capacidad de carga depende de la puntuación de Fuerza.
- Algunas razas o rasgos pueden modificar la capacidad de carga (ej: Poderosa Complexión).
- Los umbrales de carga son:
  - **Carga normal**: hasta Fuerza × 15 lb.
  - **Sobrecargado**: por encima de Fuerza × 15 lb (velocidad reducida, desventajas).

---

## HU-07.2: Añadir objeto al inventario

**Como** jugador,
**quiero** añadir objetos a mi inventario,
**para** registrar lo que mi personaje encuentra o compra durante la partida.

### Criterios de Aceptación

- Se puede añadir un objeto seleccionándolo de un catálogo predefinido (SRD).
- Se puede crear un objeto personalizado con nombre, descripción, peso y valor.
- Se puede especificar la cantidad del objeto.
- Al añadir desde el catálogo, se auto-rellenan las propiedades del objeto.
- Se puede añadir un objeto rápidamente escribiendo solo el nombre (campos opcionales por defecto).

### Catálogo de Objetos (SRD)

El catálogo incluye las siguientes categorías:
- Armas
- Armaduras y escudos
- Equipo de aventurero
- Herramientas
- Monturas y vehículos
- Kits y packs de equipo

---

## HU-07.3: Gestionar equipamiento activo

**Como** jugador,
**quiero** marcar qué objetos tengo equipados (armas, armadura, escudo, etc.),
**para** que se reflejen automáticamente en mis estadísticas de combate.

### Criterios de Aceptación

- Se puede marcar un arma como "equipada" (hasta 2: una en cada mano, o una a dos manos).
- Se puede marcar una armadura como "equipada" (solo una a la vez).
- Se puede marcar un escudo como "equipado" (solo uno a la vez, ocupa una mano).
- Al equipar una armadura, la CA del personaje se recalcula automáticamente.
- Al equipar un escudo, se suma +2 a la CA automáticamente.
- Al equipar un arma, aparece disponible en las opciones de ataque.
- Se muestra una sección diferenciada de "Equipado" vs "Mochila/Inventario".
- Se valida la competencia: si el personaje no es competente con la armadura, se muestra un aviso (desventaja en pruebas de Fuerza y Destreza, no puede lanzar conjuros).

### Notas Técnicas

- Cálculo de CA según tipo de armadura:
  - **Sin armadura**: 10 + modificador de Destreza.
  - **Armadura ligera**: base + modificador de Destreza.
  - **Armadura intermedia**: base + modificador de Destreza (máx. +2).
  - **Armadura pesada**: base fija (sin modificador de Destreza).
  - **Escudo**: +2 a la CA actual.

---

## HU-07.4: Ver detalle de un objeto

**Como** jugador,
**quiero** ver toda la información detallada de un objeto de mi inventario,
**para** conocer sus propiedades, peso, valor y descripción completa.

### Criterios de Aceptación

- Se muestra el nombre del objeto.
- Se muestra la descripción completa.
- Se muestra el peso y valor (en monedas de oro).
- Para armas, se muestra:
  - Tipo de daño (cortante, contundente, perforante, etc.).
  - Dado(s) de daño (ej: 1d8).
  - Propiedades (ligera, pesada, sutil, arrojadiza, munición, alcance, a dos manos, versátil, etc.).
  - Alcance (normal y largo si aplica).
  - Si es cuerpo a cuerpo o a distancia.
- Para armaduras, se muestra:
  - CA base que otorga.
  - Tipo (ligera, intermedia, pesada).
  - Requisito de Fuerza mínima (si aplica).
  - Si impone desventaja en Sigilo.
  - Tiempo para ponérsela/quitársela.
- Para objetos mágicos, se muestra:
  - Rareza (común, poco común, raro, muy raro, legendario).
  - Requiere sintonización (sí/no).
  - Propiedades mágicas y efectos.

---

## HU-07.5: Gestionar armas

**Como** jugador,
**quiero** tener un registro detallado de mis armas y ver rápidamente mis bonificadores de ataque y daño,
**para** agilizar el combate.

### Criterios de Aceptación

- Cada arma muestra:
  - Bonificador de ataque = competencia (si es competente) + modificador de Fuerza o Destreza.
  - Daño = dado de daño + modificador de Fuerza o Destreza.
  - Tipo de daño.
- Las armas de combate cuerpo a cuerpo usan Fuerza por defecto.
- Las armas a distancia usan Destreza por defecto.
- Las armas con propiedad **Sutil** pueden usar Fuerza o Destreza (se usa el mayor automáticamente, o se permite elegir).
- Las armas con propiedad **Versátil** muestran el daño a una mano y a dos manos.
- Las armas con propiedad **Munición** permiten llevar un contador de munición.
- Se puede hacer una "tirada de ataque" rápida (con botón de dado) que genere el resultado.

### Armas del SRD

#### Armas sencillas cuerpo a cuerpo

| Arma | Daño | Peso | Propiedades |
|------|------|------|-------------|
| Bastón | 1d6 contundente | 4 lb | Versátil (1d8) |
| Clava | 1d4 contundente | 2 lb | Ligera |
| Daga | 1d4 perforante | 1 lb | Ligera, sutil, arrojadiza (20/60) |
| Gran clava | 1d8 contundente | 10 lb | A dos manos |
| Hacha de mano | 1d6 cortante | 2 lb | Ligera, arrojadiza (20/60) |
| Jabalina | 1d6 perforante | 2 lb | Arrojadiza (30/120) |
| Maza | 1d6 contundente | 4 lb | — |
| Martillo ligero | 1d4 contundente | 2 lb | Ligera, arrojadiza (20/60) |
| Hoz | 1d4 cortante | 2 lb | Ligera |
| Lanza | 1d6 perforante | 3 lb | Arrojadiza (20/60), versátil (1d8) |

#### Armas sencillas a distancia

| Arma | Daño | Peso | Propiedades |
|------|------|------|-------------|
| Arco corto | 1d6 perforante | 2 lb | Munición (80/320), a dos manos |
| Ballesta ligera | 1d8 perforante | 5 lb | Munición (80/320), recarga, a dos manos |
| Dardo | 1d4 perforante | ¼ lb | Sutil, arrojadiza (20/60) |
| Honda | 1d4 contundente | — | Munición (30/120) |

#### Armas marciales cuerpo a cuerpo

| Arma | Daño | Peso | Propiedades |
|------|------|------|-------------|
| Alabarda | 1d10 cortante | 6 lb | Pesada, alcance, a dos manos |
| Cimitarra | 1d6 cortante | 3 lb | Ligera, sutil |
| Espada corta | 1d6 perforante | 2 lb | Ligera, sutil |
| Espada larga | 1d8 cortante | 3 lb | Versátil (1d10) |
| Estoque | 1d8 perforante | 2 lb | Sutil |
| Gran espada | 2d6 cortante | 6 lb | Pesada, a dos manos |
| Gran hacha | 1d12 cortante | 7 lb | Pesada, a dos manos |
| Hacha de batalla | 1d8 cortante | 4 lb | Versátil (1d10) |
| Lanza de caballería | 1d12 perforante | 6 lb | Alcance, especial |
| Látigo | 1d4 cortante | 3 lb | Sutil, alcance |
| Lucero del alba | 1d8 perforante | 4 lb | — |
| Mangual | 1d8 contundente | 2 lb | — |
| Martillo de guerra | 1d8 contundente | 2 lb | Versátil (1d10) |
| Maza de armas | 2d6 contundente | 10 lb | Pesada, a dos manos |
| Pica | 1d10 perforante | 18 lb | Pesada, alcance, a dos manos |
| Tridente | 1d6 perforante | 4 lb | Arrojadiza (20/60), versátil (1d8) |

#### Armas marciales a distancia

| Arma | Daño | Peso | Propiedades |
|------|------|------|-------------|
| Arco largo | 1d8 perforante | 2 lb | Munición (150/600), pesada, a dos manos |
| Ballesta de mano | 1d6 perforante | 3 lb | Munición (30/120), ligera, recarga |
| Ballesta pesada | 1d10 perforante | 18 lb | Munición (100/400), pesada, recarga, a dos manos |
| Cerbatana | 1 perforante | 1 lb | Munición (25/100), recarga |
| Red | — | 3 lb | Especial, arrojadiza (5/15) |

---

## HU-07.6: Gestionar armaduras

**Como** jugador,
**quiero** gestionar mis armaduras y ver cómo afectan a mi CA y otras estadísticas,
**para** elegir la mejor protección según la situación.

### Criterios de Aceptación

- Se muestra la CA resultante al equipar cada armadura.
- Se indica si la armadura impone desventaja en Sigilo.
- Se indica si el personaje cumple el requisito de Fuerza mínima.
- Se puede cambiar de armadura fácilmente.
- Se recalcula la CA automáticamente al cambiar de armadura.

### Armaduras del SRD

#### Armaduras ligeras

| Armadura | CA | Sigilo | Peso | Precio |
|----------|----|--------|------|--------|
| Acolchada | 11 + mod. Destreza | Desventaja | 8 lb | 5 po |
| Cuero | 11 + mod. Destreza | — | 10 lb | 10 po |
| Cuero tachonado | 12 + mod. Destreza | — | 13 lb | 45 po |

#### Armaduras intermedias

| Armadura | CA | Sigilo | Peso | Precio |
|----------|----|--------|------|--------|
| Pieles | 12 + mod. Destreza (máx. +2) | — | 12 lb | 10 po |
| Cota de mallas (shirt) | 13 + mod. Destreza (máx. +2) | — | 20 lb | 50 po |
| Coraza | 14 + mod. Destreza (máx. +2) | — | 20 lb | 400 po |
| Semiplacas | 15 + mod. Destreza (máx. +2) | Desventaja | 40 lb | 750 po |

#### Armaduras pesadas

| Armadura | CA | Fuerza mín. | Sigilo | Peso | Precio |
|----------|----|-------------|--------|------|--------|
| Anillas | 14 | — | Desventaja | 40 lb | 30 po |
| Cota de mallas (mail) | 16 | FUE 13 | Desventaja | 55 lb | 75 po |
| Bandas | 17 | FUE 15 | Desventaja | 60 lb | 200 po |
| Placas | 18 | FUE 15 | Desventaja | 65 lb | 1500 po |

#### Escudo

| Escudo | CA | Peso | Precio |
|--------|----|------|--------|
| Escudo | +2 | 6 lb | 10 po |

---

## HU-07.7: Gestionar monedas y economía

**Como** jugador,
**quiero** llevar un registro de las monedas que tiene mi personaje,
**para** saber cuánto dinero tengo y poder comprar objetos.

### Criterios de Aceptación

- Se muestran las monedas separadas por tipo:
  - **MC** – Monedas de cobre
  - **MP** – Monedas de plata
  - **ME** – Monedas de electro
  - **MO** – Monedas de oro
  - **MPl** – Monedas de platino
- Se puede sumar o restar monedas de cada tipo fácilmente (botones +/-).
- Se muestra el valor total equivalente en monedas de oro.
- Se puede "convertir" monedas entre tipos.
- El peso de las monedas se suma al inventario (50 monedas = 1 lb).
- Se lleva un historial opcional de transacciones.

### Tasas de Conversión

| Moneda | MC | MP | ME | MO | MPl |
|--------|----|----|----|----|-----|
| Cobre (MC) | 1 | 1/10 | 1/50 | 1/100 | 1/1000 |
| Plata (MP) | 10 | 1 | 1/5 | 1/10 | 1/100 |
| Electro (ME) | 50 | 5 | 1 | 1/2 | 1/20 |
| Oro (MO) | 100 | 10 | 2 | 1 | 1/10 |
| Platino (MPl) | 1000 | 100 | 20 | 10 | 1 |

---

## HU-07.8: Eliminar o modificar objetos

**Como** jugador,
**quiero** poder eliminar objetos de mi inventario o modificar sus cantidades,
**para** reflejar cuando uso, pierdo, vendo o descarto algo.

### Criterios de Aceptación

- Se puede eliminar un objeto del inventario (con confirmación).
- Se puede modificar la cantidad de un objeto.
- Se puede editar las propiedades de un objeto personalizado.
- Al reducir la cantidad a 0, se pregunta si se quiere eliminar el objeto.
- Se puede "usar" un objeto consumible (reduce cantidad en 1).
- Los objetos con cantidad 0 se pueden ocultar opcionalmente.

---

## HU-07.9: Objetos mágicos y sintonización

**Como** jugador,
**quiero** gestionar mis objetos mágicos y sus sintonizaciones,
**para** llevar un control de los límites de sintonización y los efectos activos.

### Criterios de Aceptación

- Se puede marcar un objeto como "mágico" y asignarle una rareza.
- Se puede marcar un objeto mágico como "sintonizado".
- Se muestra un contador de sintonizaciones activas (máximo 3 por defecto).
- Si se intenta sintonizar un cuarto objeto, se muestra un aviso y se pide descartar una sintonización existente.
- Los efectos de los objetos sintonizados se reflejan en las estadísticas del personaje.
- Se puede añadir una descripción personalizada de los efectos mágicos del objeto.

---

## HU-07.10: Packs de equipo predefinidos

**Como** jugador,
**quiero** poder seleccionar packs de equipo predefinidos al crear mi personaje,
**para** no tener que añadir cada objeto individualmente.

### Criterios de Aceptación

- Se muestran los packs de equipo disponibles en el SRD.
- Al seleccionar un pack, se añaden todos sus objetos al inventario automáticamente.
- Se puede ver el contenido del pack antes de seleccionarlo.
- Se puede deshacer la adición del pack completo.

### Packs del SRD

| Pack | Precio | Contenido resumido |
|------|--------|--------------------|
| Pack de explorador de mazmorras | 12 po | Mochila, palanca, martillo, 10 pitones, 10 antorchas, yesquero, 10 días de raciones, odre, 50 pies de cuerda de cáñamo |
| Pack de diplomático | 39 po | Cofre, 2 estuches para mapas, ropa fina, tinta, pluma, lámpara, 2 frascos de aceite, 5 hojas de papel, vial de perfume, cera de sellar, jabón |
| Pack de entretenedor | 40 po | Mochila, saco de dormir, 2 trajes, 5 velas, 5 días de raciones, odre, kit de disfraz |
| Pack de explorador | 10 po | Mochila, saco de dormir, kit de cocina, yesquero, 10 antorchas, 10 días de raciones, odre, 50 pies de cuerda de cáñamo |
| Pack de sacerdote | 19 po | Mochila, manta, 10 velas, yesquero, caja de limosnas, 2 bloques de incienso, incensario, vestiduras, 2 días de raciones, odre |
| Pack de estudioso | 40 po | Mochila, libro de saber, tinta, pluma, 10 hojas de pergamino, bolsita de arena, cuchillo pequeño |
| Pack de ladrón | 16 po | Mochila, bolsa de 1000 bolas de rodamiento, 10 pies de cuerda, campana, 5 velas, palanca, martillo, 10 pitones, linterna con capucha, 2 frascos de aceite, 5 días de raciones, yesquero, odre, 50 pies de cuerda de cáñamo |

---

## Prioridad de Implementación

| Historia | Prioridad | Complejidad |
|----------|-----------|-------------|
| HU-07.1 Ver inventario | 🔴 Alta | Media |
| HU-07.2 Añadir objeto | 🔴 Alta | Media |
| HU-07.3 Equipamiento activo | 🔴 Alta | Alta |
| HU-07.4 Detalle de objeto | 🟡 Media | Baja |
| HU-07.5 Gestionar armas | 🔴 Alta | Alta |
| HU-07.6 Gestionar armaduras | 🔴 Alta | Media |
| HU-07.7 Monedas y economía | 🟡 Media | Baja |
| HU-07.8 Eliminar/modificar objetos | 🔴 Alta | Baja |
| HU-07.9 Objetos mágicos | 🟡 Media | Media |
| HU-07.10 Packs de equipo | 🟢 Baja | Baja |

---

## Wireframe Conceptual

```
┌─────────────────────────────────┐
│         ⚔️ INVENTARIO           │
├─────────────────────────────────┤
│ 💰 Monedas                     │
│ MC: 45 | MP: 12 | MO: 8        │
│ Total: ~9.65 po                 │
├─────────────────────────────────┤
│ ⚖️ Peso: 67/150 lb             │
│ [████████░░░░░░░░░░░░] 45%     │
├─────────────────────────────────┤
│ 🛡️ EQUIPADO                    │
│ ┌─────────┐ ┌─────────┐        │
│ │ Espada  │ │ Cota de │        │
│ │ larga   │ │ mallas  │        │
│ │ 1d8+3   │ │ CA: 16  │        │
│ └─────────┘ └─────────┘        │
├─────────────────────────────────┤
│ 🎒 MOCHILA          [+ Añadir] │
│ 🔍 Buscar...                   │
│                                 │
│ • Antorcha ×5          (5 lb)   │
│ • Cuerda de cáñamo ×1  (10 lb) │
│ • Poción de curación ×2 (1 lb) │
│ • Raciones ×8          (16 lb) │
│ • Yesquero ×1          (1 lb)  │
│ • ...                           │
└─────────────────────────────────┘
```
