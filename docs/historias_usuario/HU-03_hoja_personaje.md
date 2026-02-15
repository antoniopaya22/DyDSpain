# HU-03: Hoja de Personaje

## Descripción General

La hoja de personaje es el corazón de la aplicación. Desde aquí el jugador puede ver y editar toda la información relevante de su personaje de D&D 5e, organizada de forma clara e intuitiva.

---

## HU-03.1: Ver resumen del personaje

**Como** jugador,
**quiero** ver un resumen general de mi personaje al abrir su hoja,
**para** tener de un vistazo la información más importante.

### Criterios de Aceptación

- Se muestra el nombre del personaje de forma prominente.
- Se muestra la raza y subraza (si aplica).
- Se muestra la clase y nivel actual.
- Se muestra la imagen/avatar del personaje (si tiene una asignada).
- Se muestran los puntos de vida actuales y máximos.
- Se muestra la clase de armadura (CA).
- Se muestra la velocidad de movimiento.
- Se muestra el bonus de competencia.
- Se muestra la iniciativa.
- Se muestra la alineamiento del personaje.
- Se muestra los puntos de experiencia actuales y los necesarios para el siguiente nivel.

### Notas Técnicas

- El resumen debe ser la primera vista al entrar en la hoja del personaje.
- Debe funcionar como panel de navegación hacia las secciones detalladas.

---

## HU-03.2: Navegación por secciones de la hoja

**Como** jugador,
**quiero** poder navegar entre las distintas secciones de mi hoja de personaje,
**para** acceder rápidamente a la información que necesito.

### Criterios de Aceptación

- Existe navegación clara entre las secciones: Resumen, Estadísticas, Hechizos, Inventario, Rasgos, Combate y Notas.
- La sección activa está visualmente diferenciada.
- La navegación es accesible desde cualquier sección.
- La transición entre secciones es fluida y rápida.

### Notas Técnicas

- Considerar tabs en la parte inferior o superior, o un sistema de scroll por secciones.
- Evaluar uso de `@react-navigation/material-top-tabs` o similar con NativeWind.

---

## HU-03.3: Editar información básica del personaje

**Como** jugador,
**quiero** poder editar la información básica de mi personaje,
**para** mantener mi hoja actualizada.

### Criterios de Aceptación

- Puedo editar el nombre del personaje.
- Puedo cambiar o añadir una imagen/avatar.
- Puedo editar el alineamiento.
- Puedo editar los rasgos de personalidad, ideales, vínculos y defectos.
- Puedo editar la edad, altura, peso, color de ojos, color de pelo y color de piel.
- Puedo editar el trasfondo (background) del personaje.
- Los cambios se guardan automáticamente o con un botón de guardar claro.
- Se muestra confirmación visual al guardar los cambios.

### Notas Técnicas

- Los campos de texto libre deben soportar multilínea donde sea necesario.
- La imagen puede ser seleccionada de la galería del dispositivo o tomada con la cámara.

---

## HU-03.4: Ver y editar puntuaciones de característica

**Como** jugador,
**quiero** ver y editar las seis puntuaciones de característica de mi personaje,
**para** tener claros mis valores y modificadores.

### Criterios de Aceptación

- Se muestran las seis características: Fuerza, Destreza, Constitución, Inteligencia, Sabiduría y Carisma.
- Para cada característica se muestra la puntuación base y el modificador calculado automáticamente.
- Puedo editar la puntuación de cada característica manualmente.
- Los modificadores se recalculan automáticamente al cambiar la puntuación: `modificador = floor((puntuación - 10) / 2)`.
- Se aplican automáticamente los bonificadores raciales si están definidos.
- Se diferencia visualmente entre la puntuación base y los bonificadores.

### Notas Técnicas

- Los modificadores positivos deben mostrarse con signo `+`.
- Considerar mostrar el desglose: base + racial + otros = total.

---

## HU-03.5: Ver y gestionar tiradas de salvación

**Como** jugador,
**quiero** ver mis bonificadores de tiradas de salvación y cuáles tengo con competencia,
**para** saber qué tirar en cada situación.

### Criterios de Aceptación

- Se listan las seis tiradas de salvación (una por cada característica).
- Se indica visualmente en cuáles tengo competencia.
- El bonificador se calcula automáticamente: modificador de característica + bonus de competencia (si aplica).
- Las competencias en salvaciones se asignan automáticamente según la clase del personaje.
- Puedo marcar/desmarcar competencias adicionales manualmente (para casos especiales como dotes).

---

## HU-03.6: Ver y gestionar habilidades

**Como** jugador,
**quiero** ver la lista completa de habilidades con sus bonificadores,
**para** saber mis probabilidades en cada tipo de tirada.

### Criterios de Aceptación

- Se listan las 18 habilidades del juego con su característica asociada:
  - Acrobacias (Des), Atletismo (Fue), Engaño (Car), Historia (Int), Interpretación (Car), Intimidación (Car), Investigación (Int), Juego de Manos (Des), Medicina (Sab), Naturaleza (Int), Percepción (Sab), Perspicacia (Sab), Persuasión (Car), Religión (Int), Sigilo (Des), Supervivencia (Sab), Trato con Animales (Sab), Arcanos (Int).
- Se indica visualmente en cuáles tengo competencia y en cuáles tengo doble competencia (pericia).
- El bonificador se calcula automáticamente: modificador de característica + bonus de competencia (si aplica, doble si pericia).
- Puedo marcar/desmarcar competencia y pericia en cada habilidad.
- Se muestra la percepción pasiva calculada: `10 + bonificador de Percepción`.

---

## HU-03.7: Gestionar rasgos y capacidades

**Como** jugador,
**quiero** ver todos los rasgos y capacidades de mi personaje organizados por origen,
**para** saber qué puedo hacer en cada momento.

### Criterios de Aceptación

- Se listan los rasgos raciales con su descripción.
- Se listan las capacidades de clase por nivel.
- Se listan las capacidades de subclase (si aplica).
- Se listan los rasgos del trasfondo.
- Se listan las dotes elegidas (si las hay).
- Cada rasgo/capacidad muestra nombre, origen (raza/clase/trasfondo/dote) y descripción.
- Los rasgos con usos limitados (por descanso corto o largo) muestran los usos restantes.
- Puedo marcar usos consumidos y restaurarlos.

### Notas Técnicas

- Los rasgos deben cargarse automáticamente según la raza, clase, subclase, trasfondo y nivel del personaje.
- Permitir añadir rasgos personalizados para casos especiales.

---

## HU-03.8: Gestionar competencias y idiomas

**Como** jugador,
**quiero** ver todas mis competencias e idiomas,
**para** saber qué herramientas, armas, armaduras e idiomas domina mi personaje.

### Criterios de Aceptación

- Se listan las competencias con armaduras.
- Se listan las competencias con armas.
- Se listan las competencias con herramientas.
- Se listan los idiomas conocidos.
- Puedo añadir y eliminar competencias e idiomas manualmente.
- Las competencias otorgadas por raza, clase y trasfondo se cargan automáticamente.

---

## HU-03.9: Gestionar monedas y riqueza

**Como** jugador,
**quiero** llevar un registro de mis monedas,
**para** saber cuánto dinero tiene mi personaje.

### Criterios de Aceptación

- Se muestran las cinco denominaciones: piezas de cobre (pc), piezas de plata (pp), piezas de electrum (pe), piezas de oro (po) y piezas de platino (ppt).
- Puedo incrementar y decrementar cada tipo de moneda.
- Puedo editar directamente la cantidad de cada moneda.
- Se muestra el valor total equivalente en piezas de oro.
- Las cantidades no pueden ser negativas.

### Conversiones

- 1 ppt = 10 po
- 1 po = 2 pe = 10 pp = 100 pc

---

## HU-03.10: Gestionar descansos

**Como** jugador,
**quiero** poder realizar descansos cortos y largos desde la hoja de personaje,
**para** restaurar recursos de forma rápida y correcta.

### Criterios de Aceptación

- Existe un botón de "Descanso Corto".
- Existe un botón de "Descanso Largo".
- Al realizar un descanso corto:
  - Se permite gastar dados de golpe para recuperar vida.
  - Se restauran las capacidades que se recuperan con descanso corto.
  - Se restauran los espacios de hechizo de Brujo (si aplica).
- Al realizar un descanso largo:
  - Se restauran todos los puntos de vida al máximo.
  - Se recuperan dados de golpe gastados (hasta la mitad del nivel total, mínimo 1).
  - Se restauran todos los espacios de hechizo.
  - Se restauran todas las capacidades que se recuperan con descanso largo.
- Se pide confirmación antes de ejecutar el descanso.
- Se muestra un resumen de lo que se ha restaurado.

---

## HU-03.11: Exportar/compartir hoja de personaje

**Como** jugador,
**quiero** poder exportar o compartir mi hoja de personaje,
**para** tenerla como respaldo o compartirla con mi master/otros jugadores.

### Criterios de Aceptación

- Puedo exportar la hoja a formato PDF con un diseño legible.
- Puedo compartir la hoja exportada mediante las opciones de compartir del dispositivo.
- Puedo exportar los datos del personaje en formato JSON para importar en otra instalación de la app.
- La exportación incluye toda la información del personaje.

### Notas Técnicas

- Usar `expo-sharing` y `expo-print` para la funcionalidad de exportación.
- El JSON exportado debe ser compatible con la función de importación de la app.

---

## HU-03.12: Historial de cambios del personaje

**Como** jugador,
**quiero** poder ver un historial de los cambios importantes de mi personaje,
**para** llevar un registro de su progresión.

### Criterios de Aceptación

- Se registra automáticamente cuando el personaje sube de nivel.
- Se registra cuando se añaden o eliminan objetos importantes.
- Se registra cuando se aprenden nuevos hechizos.
- Se registra cuando se cambian las puntuaciones de característica.
- Cada entrada del historial muestra fecha, tipo de cambio y descripción.
- Puedo añadir entradas manuales al historial.

---

## Prioridad de Implementación

| Historia | Prioridad | Complejidad |
|----------|-----------|-------------|
| HU-03.1 | 🔴 Alta | Media |
| HU-03.2 | 🔴 Alta | Baja |
| HU-03.3 | 🔴 Alta | Media |
| HU-03.4 | 🔴 Alta | Media |
| HU-03.5 | 🔴 Alta | Baja |
| HU-03.6 | 🔴 Alta | Media |
| HU-03.7 | 🟡 Media | Alta |
| HU-03.8 | 🟡 Media | Baja |
| HU-03.9 | 🟡 Media | Baja |
| HU-03.10 | 🟡 Media | Alta |
| HU-03.11 | 🟢 Baja | Media |
| HU-03.12 | 🟢 Baja | Media |

---

## Wireframe Conceptual

```
┌─────────────────────────────┐
│  ← Partida: Minas de Phandelver │
├─────────────────────────────┤
│  [Avatar]  Thorin Escudoroble   │
│  Enano de Montaña · Guerrero 5  │
│  Alineamiento: Legal Bueno      │
├─────────────────────────────┤
│  ❤️ 45/52 HP   🛡️ CA: 18       │
│  🏃 Vel: 7.5m  🎯 Init: +1     │
│  ⭐ Competencia: +3             │
│  ✨ XP: 6500 / 14000           │
├─────────────────────────────┤
│ [Resumen][Stats][Hechizos]      │
│ [Inventario][Rasgos][Notas]     │
├─────────────────────────────┤
│                                  │
│  (Contenido de la sección        │
│   seleccionada)                  │
│                                  │
├─────────────────────────────┤
│  [⚔️ Combate] [🛏️ Descanso]    │
└─────────────────────────────┘
```
