# Historias de Usuario — D&D Español

Este directorio contiene todas las historias de usuario de la aplicación **D&D Español** (DyD Esp), organizadas por módulo funcional.

## Índice de Documentos

| Código | Documento | Descripción |
|--------|-----------|-------------|
| HU-01 | [Gestión de Partidas](./HU-01_gestion_partidas.md) | Crear, editar, eliminar y listar partidas/campañas |
| HU-02 | [Creación de Personaje](./HU-02_creacion_personaje.md) | Flujo completo de creación de un nuevo personaje |
| HU-03 | [Hoja de Personaje](./HU-03_hoja_personaje.md) | Visualización y edición de la hoja de personaje |
| HU-04 | [Estadísticas y Habilidades](./HU-04_estadisticas_habilidades.md) | Puntuaciones de característica, habilidades, salvaciones y competencias |
| HU-05 | [Subir de Nivel](./HU-05_subir_de_nivel.md) | Progresión de nivel, mejoras y elecciones al subir |
| HU-06 | [Gestión de Hechizos](./HU-06_gestion_hechizos.md) | Hechizos conocidos/preparados, espacios de hechizo, descripciones |
| HU-07 | [Inventario y Equipamiento](./HU-07_inventario_equipamiento.md) | Objetos, armas, armaduras, equipo y gestión de carga |
| HU-08 | [Vida y Combate](./HU-08_vida_combate.md) | Puntos de golpe, clase de armadura, tiradas de salvación, descansos |
| HU-09 | [Notas](./HU-09_notas.md) | Sistema de notas libres por personaje y por partida |
| HU-10 | [Modo Master (DM)](./HU-10_modo_master.md) | Sala en vivo para el Director de Juego con visión de los personajes |

## Convenciones

- Cada historia sigue el formato: **"Como [rol], quiero [acción], para [beneficio]"**.
- Los criterios de aceptación se listan con checkboxes para facilitar el seguimiento.
- Las prioridades se indican como: 🔴 Alta | 🟡 Media | 🟢 Baja.
- Cada historia tiene un identificador único con el formato `HU-XX-YY` (módulo-número).

## Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **React Native** | Framework principal |
| **Expo** | Toolchain y build |
| **NativeWind** | Estilos (Tailwind CSS para React Native) |

## Referencia

- [SRD 5.1 en Español (PDF)](../SRD_CC_v5.1_ES.pdf)
- [SRD 5.1 en Español (Web)](https://srd.nosolorol.com/DD5/index.html)