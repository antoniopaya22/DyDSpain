# Historias de Usuario — DyMEs

Este directorio contiene todas las historias de usuario de la aplicación **DyMEs**, organizadas por módulo funcional.

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
| HU-10 | [Modo Master (DM)](./HU-10_modo_master.md) | Selección de modo Jugador/Master, campañas del DM, seguimiento en tiempo real vía Supabase (Premium) |
| HU-11 | [Tirador de Dados](./HU-11_tirador_dados.md) | Tirador de dados integrado con fórmulas, presets, ventaja/desventaja e historial |
| HU-12 | [Recursos y Habilidades de Clase](./HU-12_recursos_clase.md) | Gestión de recursos limitados por clase (Furia, Ki, Inspiración, etc.) |
| HU-13 | [Compendio SRD](./HU-13_compendio_srd.md) | Consulta de referencia del SRD 5.1: razas, clases, trasfondos, conjuros, equipamiento y dotes |
| HU-14 | [Ajustes y Configuración](./HU-14_ajustes_app.md) | Tema visual, reglas opcionales, unidades, exportar/importar datos |
| HU-15 | [Dotes (Feats)](./HU-15_dotes.md) | Catálogo de dotes, elección en subida de nivel y efectos mecánicos |

## Convenciones

- Cada historia sigue el formato: **"Como [rol], quiero [acción], para [beneficio]"**.
- Los criterios de aceptación se listan con checkboxes para facilitar el seguimiento.
- Las prioridades se indican como: 🔴 Alta | 🟡 Media | 🟢 Baja.
- Cada historia tiene un identificador único con el formato `HU-XX-YY` (módulo-número).

## Mapa de Dependencias

```
HU-01 Partidas
  │
  ▼
HU-02 Creación ──► HU-04 Estadísticas ──► HU-05 Subir Nivel
  │                   │                       │    │
  │                   │                       │    ▼
  │                   │                       │  HU-15 Dotes
  │                   │                       │    │
  │                   ▼                       ▼    ▼
  │               HU-08 Vida/Combate ◄── HU-12 Recursos Clase
  │                   │
  ▼                   ▼
HU-06 Hechizos ◄─────┘
  │
  ▼
HU-07 Inventario
  │
  ▼
HU-03 Hoja Personaje ──► HU-09 Notas
  │
  ▼
HU-11 Tirador Dados
  │
  ▼
HU-13 Compendio SRD ◄── HU-14 Ajustes App ──► HU-10 Modo Master (Premium)
                                                  │
                                                  ▼
                                          HU-01 + HU-03 + Supabase
```

## Resumen de Prioridades por Módulo

| Módulo | Prioridad Global | Fase |
|--------|-----------------|------|
| HU-01 Gestión de Partidas | 🔴 Alta | MVP |
| HU-02 Creación de Personaje | 🔴 Alta | MVP |
| HU-03 Hoja de Personaje | 🔴 Alta | MVP |
| HU-04 Estadísticas y Habilidades | 🔴 Alta | MVP |
| HU-05 Subir de Nivel | 🔴 Alta | MVP |
| HU-06 Gestión de Hechizos | 🔴 Alta | MVP |
| HU-07 Inventario y Equipamiento | 🔴 Alta | MVP |
| HU-08 Vida y Combate | 🔴 Alta | MVP |
| HU-09 Notas | 🟡 Media | MVP |
| HU-10 Modo Master (DM) | 🔴 Alta | Post-MVP (Premium) |
| HU-11 Tirador de Dados | 🔴 Alta | MVP |
| HU-12 Recursos de Clase | 🔴 Alta | MVP |
| HU-13 Compendio SRD | 🟡 Media | MVP |
| HU-14 Ajustes y Configuración | 🟡 Media | MVP |
| HU-15 Dotes (Feats) | 🟡 Media | Post-MVP |

## Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **React Native** | Framework principal |
| **Expo** | Toolchain y build |
| **NativeWind** | Estilos (Tailwind CSS para React Native) |
| **Supabase** | Base de datos en la nube, autenticación y sincronización en tiempo real (Modo Master) |

## Referencia

- [SRD 5.1 en Español (PDF)](../SRD_CC_v5.1_ES.pdf)
- [SRD 5.1 en Español (Web)](https://srd.nosolorol.com/DD5/index.html)