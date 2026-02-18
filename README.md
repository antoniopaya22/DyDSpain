# D&D Español — Companion App para D&D 5e

Aplicación móvil de acompañamiento para **Dungeons & Dragons 5ª Edición**, completamente en español. Basada en el SRD 5.1, permite gestionar partidas, crear personajes paso a paso, llevar hojas de personaje completas, lanzar dados y consultar un compendio de reglas.

> **Referencia SRD:** https://srd.nosolorol.com/DD5/index.html

---

## Características principales

### Gestión de partidas
- Crear, editar y eliminar campañas con imagen personalizada.
- Vincular y desvincular personajes a cada campaña.
- Ordenar campañas por último acceso; búsqueda rápida.

### Creación de personajes (asistente de 11 pasos)
1. **Nombre** del personaje
2. **Raza** — 9 razas con subrazas (Enano, Elfo, Mediano, Humano, Dracónido, Gnomo, Semielfo, Semiorco, Tiefling)
3. **Clase** — 12 clases (Bárbaro, Bardo, Brujo, Clérigo, Druida, Explorador, Guerrero, Hechicero, Mago, Monje, Paladín, Pícaro)
4. **Puntuaciones de característica** — Array estándar, compra por puntos, tirada de dados o entrada manual; bonificadores raciales automáticos
5. **Trasfondo** — 13 trasfondos con tablas de personalidad
6. **Habilidades** — Selección de competencias (clase + trasfondo + raza)
7. **Conjuros** — Trucos y conjuros iniciales para lanzadores
8. **Equipo** — Equipo inicial según clase y trasfondo
9. **Personalidad** — Rasgos, ideales, vínculos, defectos, historia; 9 alineamientos
10. **Apariencia** — Edad, altura, peso, colores, avatar
11. **Resumen** — Revisión y confirmación

Guardado automático de borrador para recuperación.

### Hoja de personaje (5 pestañas)
| Pestaña | Contenido |
|---|---|
| **General** | Info básica, puntuaciones de característica, bonificador de competencia, velocidad, personalidad, apariencia |
| **Combate** | PG (actuales/máx/temporales), dados de golpe, salvaciones de muerte, CA, condiciones, concentración, registro de combate |
| **Habilidades** | Gestión de conjuros, espacios de conjuro, conjuros preparados/conocidos |
| **Inventario** | Objetos, monedas, equipo, peso/carga |
| **Notas** | Notas de texto libre por personaje |

### Subida de nivel
- Seguimiento de PX con detección automática de nivel.
- Ganancia de PG (fija o tirada).
- Mejoras de puntuación de característica en niveles de ASI.
- Selección de subclase al nivel correspondiente.
- Aprendizaje de conjuros al subir de nivel.
- Historial de niveles.

### Conjuros
- Base de datos completa del SRD (niveles 0–9, 8 escuelas de magia).
- Componentes (V, S, M con coste/consumo), tiempo de lanzamiento, duración, alcance.
- Seguimiento de concentración.
- Listas de conjuros conocidos, preparados y libro de conjuros (Mago).
- Espacios de conjuro, Magia de Pacto (Brujo) y puntos de hechicería (Hechicero).

### Inventario y equipo
- Gestión de objetos con sistema de rareza (Común → Artefacto).
- Categorías: armas, armaduras, herramientas.
- Monedas (pc, pp, pe, po, pl) y reglas de carga.

### Combate y puntos de golpe
- PG actuales, máximos y temporales.
- Dados de golpe y salvaciones de muerte.
- Clase de armadura, velocidades, resistencias/inmunidades/vulnerabilidades.
- 15 condiciones rastreables, concentración, registro de combate.

### Recursos de clase
- Seguimiento de recursos específicos (Ki, Ira, Segundo Aliento, Inspiración Bárdica, etc.).
- Recuperación basada en descansos cortos y largos.

### Tirador de dados
- Botón flotante (FAB) en la hoja de personaje.
- Dados estándar: d4, d6, d8, d10, d12, d20, d100.
- Expresiones de dados (ej. `2d6+3`).
- Detección de crítico/pifia en d20.
- Tiradas con ventaja/desventaja.
- Historial de tiradas.

### Compendio SRD
- Navegador con 3 pestañas: Razas, Clases, Trasfondos.
- Búsqueda global y tarjetas expandibles con detalle completo.

### Ajustes
- **Tema:** Oscuro / Claro / Automático (sistema).
- **Unidades:** Imperial (pies/libras) o Métrico (metros/kg).
- **Reglas opcionales:** Dotes en lugar de ASI, multiclase, PG fijos, compra por puntos, carga detallada.
- **Gestión de datos:** Eliminar todos los datos (doble confirmación).

---

## Stack tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| [Expo](https://expo.dev) | SDK 54 | Toolchain y sistema de build |
| React Native | 0.81.5 | Framework UI multiplataforma |
| React | 19.1.0 | Librería de UI |
| Expo Router | ~6.0.23 | Navegación basada en archivos |
| NativeWind | ^4.1.23 | Tailwind CSS para React Native |
| Zustand | ^5.0.0 | Gestión de estado |
| AsyncStorage | 2.2.0 | Persistencia local |
| TypeScript | ~5.9.2 | Tipado estático |
| React Native Reanimated | ~4.1.1 | Animaciones |

**New Architecture** habilitada (`"newArchEnabled": true`).

---

## Estructura del proyecto

```
app/                        # Pantallas (Expo Router file-based routing)
├── index.tsx               # Inicio — lista de campañas
├── compendium.tsx          # Compendio SRD
├── settings.tsx            # Ajustes
└── campaigns/
    ├── new.tsx             # Nueva campaña
    └── [id]/
        ├── index.tsx       # Detalle de campaña
        └── character/
            ├── sheet.tsx   # Hoja de personaje (5 pestañas)
            └── create/     # Asistente de creación (11 pasos)

src/
├── components/             # Componentes reutilizables
│   ├── ui/                 # Badge, Toast, Dialog, SearchBar, GradientButton, etc.
│   ├── character/          # Pestañas de hoja: Overview, Combat, Abilities, Inventory, Notes
│   ├── dice/               # DiceFAB, DiceRoller
│   ├── creation/           # Componentes del asistente de creación
│   ├── campaigns/          # Componentes de campañas
│   └── ...                 # combat, spells, inventory, notes, master
├── stores/                 # Zustand stores
│   ├── campaignStore.ts    # CRUD de campañas
│   ├── creationStore.ts    # Asistente de creación con auto-guardado
│   ├── settingsStore.ts    # Tema, unidades, reglas opcionales
│   └── characterStore/     # Store modular (8 slices)
├── data/srd/               # Datos del SRD (razas, clases, conjuros, trasfondos, etc.)
├── types/                  # Tipos TypeScript (character, spell, campaign, item, notes)
├── hooks/                  # useTheme, useDialog
├── constants/              # Constantes (habilidades)
└── utils/                  # Tema, dados, almacenamiento

docs/                       # Documentación e historias de usuario
```

### Arquitectura del Character Store (modular)

El store de personaje está compuesto por **8 domain slices** con Zustand:

| Slice | Responsabilidad |
|---|---|
| `characterCrudSlice` | Cargar/guardar/limpiar + getters computados |
| `combatSlice` | PG, dados de golpe, salvaciones de muerte, condiciones |
| `progressionSlice` | PX, subida de nivel |
| `magicSlice` | Espacios de conjuro, Magia de Pacto, puntos de hechicería |
| `classResourceSlice` | Ki, Ira, Segundo Aliento (patrón Strategy) |
| `inventorySlice` | Objetos y monedas |
| `notesSlice` | Notas CRUD |
| `restSlice` | Orquestación de descanso corto y largo |

---

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npx expo start

# Ejecutar en Android
npx expo start --android

# Ejecutar en iOS
npx expo start --ios

# Ejecutar en web
npx expo start --web
```

### Build con EAS

```bash
# Preview (APK para Android)
eas build --profile preview --platform android

# Producción (AAB para Android)
eas build --profile production --platform android
```

---

## Contenido SRD incluido

| Categoría | Detalle |
|---|---|
| **Razas** | 9 razas con subrazas, rasgos, bonificadores, idiomas |
| **Clases** | 12 clases con rasgos, equipo, lanzamiento de conjuros, dados de golpe |
| **Subclases** | Opciones de subclase con rasgos por nivel |
| **Trasfondos** | 13 trasfondos con tablas de personalidad, habilidades, herramientas, idiomas |
| **Conjuros** | Base de datos completa del SRD (niveles 0–9) con descripciones en español |
| **Progresión** | Umbrales de PX, niveles de ASI, tablas de rasgos de clase |

---

## Tema y personalización

La app soporta **tema oscuro, claro y automático** (según sistema) con ~80+ tokens semánticos de color. El `tailwind.config.js` incluye paletas temáticas de D&D: colores por puntuación de característica, estado de PG, rareza de objetos y escuelas de magia.

---

## Licencia

El contenido del SRD 5.1 es propiedad de Wizards of the Coast y se distribuye bajo la [OGL 1.0a](https://www.opengamingfoundation.org/ogl.html).
