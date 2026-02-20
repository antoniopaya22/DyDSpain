# Estructura del Código — DyMEs

Guía completa de la organización del código para desarrolladores que quieran continuar o contribuir al proyecto.

---

## Tabla de Contenidos

- [Visión General](#visión-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Routing (Expo Router)](#routing-expo-router)
- [Estado Global (Zustand)](#estado-global-zustand)
- [Componentes](#componentes)
- [Tipos](#tipos)
- [Constantes](#constantes)
- [Utilidades](#utilidades)
- [Hooks Personalizados](#hooks-personalizados)
- [Datos SRD](#datos-srd)
- [Estilos y Temas](#estilos-y-temas)
- [Configuración del Proyecto](#configuración-del-proyecto)
- [Patrones Destacados](#patrones-destacados)

---

## Visión General

Aplicación móvil y web para gestionar personajes y partidas de **Dungeons & Dragons 5ª Edición** completamente en español. Permite crear personajes paso a paso, gestionar campañas, consultar el SRD (System Reference Document), tirar dados, y llevar el control de combate, inventario, hechizos y notas.

---

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| **React Native** | 0.81 | Framework UI multiplataforma |
| **Expo** | 54 | Tooling, build, runtime |
| **Expo Router** | 6 | Navegación basada en archivos |
| **TypeScript** | 5.9 | Tipado estático |
| **Zustand** | 5 | Estado global |
| **NativeWind** | 4.1 | Tailwind CSS para React Native |
| **Tailwind CSS** | 3.4 | Utilidades de estilo |
| **AsyncStorage** | 2.2 | Persistencia local |
| **React Native Reanimated** | 4.1 | Animaciones avanzadas |
| **React Native SVG** | 15.12 | Gráficos vectoriales (iconos D20, etc.) |

---

## Estructura de Carpetas

```
DyDSpain/
├── app/                    → Rutas de la aplicación (Expo Router)
├── src/
│   ├── components/         → Componentes React organizados por dominio
│   │   ├── campaigns/      → Pantalla principal (lista de campañas)
│   │   ├── character/      → Hoja de personaje y sus tabs
│   │   ├── combat/         → Tracker de combate
│   │   ├── compendium/     → Compendio SRD
│   │   ├── creation/       → Wizard de creación de personaje
│   │   ├── dice/           → Tirador de dados
│   │   ├── inventory/      → Gestión de inventario
│   │   ├── notes/          → Sistema de notas
│   │   ├── settings/       → Secciones de ajustes
│   │   └── ui/             → Biblioteca de componentes reutilizables (~30+)
│   ├── constants/          → Constantes del juego (habilidades, hechizos, objetos...)
│   ├── data/srd/           → Base de datos SRD completa (razas, clases, conjuros...)
│   ├── hooks/              → Hooks personalizados (tema, diálogos, animaciones...)
│   ├── stores/             → Stores Zustand (campañas, personaje, creación, ajustes)
│   ├── types/              → Definiciones TypeScript
│   └── utils/              → Funciones utilitarias puras
├── assets/                 → Recursos estáticos (imágenes, fuentes)
├── docs/                   → Documentación (historias de usuario, manual SRD)
├── scripts/                → Scripts de generación (iconos, descripciones de hechizos)
├── global.css              → Estilos globales (entry point de NativeWind)
├── tailwind.config.js      → Configuración de Tailwind con paleta temática D&D
├── app.json                → Configuración de Expo
├── eas.json                → Configuración de EAS Build
└── tsconfig.json           → TypeScript con path aliases (@/*)
```

---

## Routing (Expo Router)

La navegación se basa en la estructura de archivos dentro de `app/`. Cada archivo `.tsx` es una pantalla.

```
app/
├── _layout.tsx              → Layout raíz: ErrorBoundary + carga de settings + splash screen
├── index.tsx                → Pantalla inicial: lista de campañas, búsqueda, crear/eliminar
├── compendium.tsx           → Compendio SRD: razas, clases y trasfondos con tabs y búsqueda
├── settings.tsx             → Ajustes: tema, reglas, unidades, gestión de datos, acerca de
└── campaigns/
    ├── _layout.tsx          → Stack para campañas (slide_from_right)
    ├── new.tsx              → Formulario para crear nueva campaña
    └── [id]/
        ├── _layout.tsx      → Stack para detalle de campaña
        ├── index.tsx        → Detalle de campaña: tarjetas de acción, acciones rápidas
        └── character/
            ├── _layout.tsx  → Stack para personaje (slide_from_bottom)
            ├── sheet.tsx    → Hoja de personaje: 5 tabs + botón flotante de dados
            └── create/
                ├── _layout.tsx      → Stack del wizard de creación (11 pasos)
                ├── index.tsx        → Paso 1: Nombre
                ├── race.tsx         → Paso 2: Raza y subraza
                ├── class.tsx        → Paso 3: Clase
                ├── abilities.tsx    → Paso 4: Puntuaciones de característica
                ├── background.tsx   → Paso 5: Trasfondo
                ├── skills.tsx       → Paso 6: Competencias en habilidades
                ├── spells.tsx       → Paso 7: Hechizos iniciales (si lanzador)
                ├── equipment.tsx    → Paso 8: Equipamiento inicial
                ├── personality.tsx  → Paso 9: Personalidad y alineamiento
                ├── appearance.tsx   → Paso 10: Apariencia (opcional)
                └── summary.tsx      → Paso 11: Resumen y confirmación
```

### Transiciones de Navegación

| Transición | Uso |
|---|---|
| `slide_from_right` | Navegación estándar entre pantallas |
| `slide_from_bottom` | Ajustes, hoja de personaje, sub-navegación |
| `fade` | Paso de confirmación del wizard de creación |

---

## Estado Global (Zustand)

Todos los stores usan **Zustand v5** con persistencia manual vía `AsyncStorage` (sin middleware — funciones `persist*` explícitas).

### Stores Principales

| Store | Archivo | Responsabilidad |
|---|---|---|
| `useCampaignStore` | `stores/campaignStore.ts` | CRUD de campañas, vincular/desvincular personajes, orden por último acceso, borrado en cascada |
| `useSettingsStore` | `stores/settingsStore.ts` | Tema (claro/oscuro/auto), unidades (imperial/métrico), reglas opcionales (dotes, multiclase, HP fijo, point buy, carga), notificaciones |
| `useCreationStore` | `stores/creationStore.ts` | Wizard de 11 pasos con auto-guardado de borrador, validación por paso, ensamblado final con `buildCharacter()` |
| `useCharacterStore` | `stores/characterStore/index.ts` | Store compuesto de **8 slices de dominio** (ver tabla siguiente) |

### Slices del Character Store

El store de personaje se dividió en 8 slices especializados para mantener la mantenibilidad (reemplazando un monolito de +2100 líneas):

| Slice | Archivo | Propósito |
|---|---|---|
| `characterCrudSlice` | `characterCrudSlice.ts` | Cargar/guardar/eliminar personaje, getters computados (modificadores, bonificaciones, CA) |
| `combatSlice` | `combatSlice.ts` | Gestión de PG, dados de golpe, salvaciones de muerte, condiciones, concentración |
| `progressionSlice` | `progressionSlice.ts` | XP, subir de nivel (métodos de PG, ASI, subclase, hechizos), resetear a nivel 1 |
| `magicSlice` | `magicSlice.ts` | Espacios de conjuro (lanzador completo/medio/pacto), puntos de hechicería |
| `classResourceSlice` | `classResourceSlice.ts` | Recursos de clase (Ki, Ira, Segundo Aliento, etc.) vía patrón estrategia |
| `inventorySlice` | `inventorySlice.ts` | CRUD de objetos, equipar/desequipar, transacciones de monedas |
| `notesSlice` | `notesSlice.ts` | CRUD de notas, notas rápidas, etiquetas personalizadas, fijar/desfijar |
| `restSlice` | `restSlice.ts` | Descansos cortos y largos (coordina PG, dados de golpe, espacios de conjuro, recursos) |

**Archivos de soporte:**
- `helpers.ts` — Funciones auxiliares del store
- `classResourceStrategies.ts` — Estrategias por clase para recursos específicos
- `levelUpHelpers.ts` — Lógica de subida de nivel
- `characterBuilderHelpers.ts` — Funciones puras para construir puntuaciones, competencias, rasgos y hechizos iniciales desde los datos del wizard

---

## Componentes

Organizados por **dominio funcional**, no por tipo. Cada carpeta tiene un `index.ts` con barrel exports.

### `components/campaigns/`
Componentes de la pantalla principal.
- `CampaignCard` — Tarjeta de campaña con info resumida
- `HomeEmptyState` — Estado vacío cuando no hay campañas
- `StatsRow` — Fila de estadísticas rápidas

### `components/character/`
Contenido de la hoja de personaje, dividido en tabs.
- `OverviewTab` — Resumen general del personaje
- `CombatTab` — Tab de combate
- `AbilitiesTab` — Tab de hechizos y habilidades
- `InventoryTab` — Tab de inventario
- `NotesTab` — Tab de notas
- `ExperienceSection` — Sección de XP
- `LevelUpModal` — Modal de subida de nivel
- `TraitCard` — Tarjeta de rasgo
- `abilities/` — Sub-componentes: `CantripsSection`, `CharacterTraitsSection`, `ClassAbilitiesSection`, `ClassResourceSlots`, `SpellcastingSection`
- `levelup/` — Pasos del wizard de subida de nivel: `ASIStep`, `ConfirmStep`, `HPStep`, `MetamagicStep`, `SpellsStep`, `SubclassStep`, `SummaryStep` + `useLevelUpWizard.ts`

### `components/combat/`
Sub-componentes de combate.
- `HPTracker` — Tracker de puntos de golpe
- `HitDiceSection` — Dados de golpe
- `DeathSavesTracker` — Salvaciones de muerte
- `ConditionsSection` — Condiciones activas
- `CombatLog` — Registro de combate

### `components/compendium/`
Tarjetas para el compendio SRD.
- `RaceCard`, `ClassCard`, `BackgroundCard` — Tarjetas informativas
- `compendiumStyles.ts` — Estilos compartidos
- `compendiumUtils.ts` — Utilidades del compendio

### `components/dice/`
Tirador de dados.
- `DiceFAB` — Botón flotante para abrir el tirador
- `DiceRoller` — Modal/panel del tirador de dados

### `components/inventory/`
Gestión de inventario.
- `InventoryItemCard` — Tarjeta de objeto
- `AddItemModal` — Modal para añadir objetos
- `CoinTransactionModal` — Modal de transacciones de monedas

### `components/notes/`
Sistema de notas.
- `NoteCard` — Tarjeta de nota
- `NoteEditorModal` — Editor de notas
- `NoteFilterBar` — Barra de filtros
- `QuickNoteBar` — Barra de notas rápidas

### `components/settings/`
Secciones de la pantalla de ajustes.
- `ThemeSection`, `RulesSection`, `UnitsSection`, `DataSection`, `AboutSection`

### `components/ui/`
**Biblioteca de componentes reutilizables** (~30+ componentes). Incluye:

| Componente | Descripción |
|---|---|
| `AnimatedPressable` | Botón con animación de escala (variantes: `DndButton`, `IconButton`) |
| `Badge` | Insignia con color |
| `CollapsibleSection` | Sección colapsable (`CollapsibleCard`) |
| `ConfirmDialog` | Diálogo de confirmación (reemplaza `Alert.alert`) |
| `D20Icon` | Icono D20 SVG (`D20Badge`, `D20Watermark`) |
| `EmptyState` | Estado vacío genérico |
| `FadeInView` | Animación de entrada (`StaggeredList`, `ScaleFadeIn`) |
| `GlowCard` | Tarjeta con resplandor (`InfoCard`, `StatCard`) |
| `GradientButton` | Botón con gradiente |
| `GradientHeader` | Cabecera con gradiente (`CompactHeader`, `HeroHeader`) |
| `ScreenContainer` | Wrapper con gradiente de fondo |
| `SearchBar` | Barra de búsqueda |
| `SectionDivider` | Divisor (`SubtleDivider`, `OrnateDivider`, `SectionHeaderDivider`) |
| `SegmentedTabs` | Tabs segmentados |
| `Toast` | Notificación toast |

#### `components/ui/decorations/`
**14 componentes decorativos temáticos de D&D** para una experiencia inmersiva:
`CastleHeader`, `CornerOrnament`, `DndBackdrop`, `DragonDivider`, `FloatingParticles`, `MagicCircle`, `OrnateFrame`, `ParchmentCard`, `RunicBorder`, `ScrollBanner`, `ShieldFrame`, `SwordDivider`, `TorchGlow`.

---

## Tipos

Todos los tipos están en `src/types/` con un barrel export desde `index.ts`. Los archivos de tipos re-exportan sus constantes y utilidades relacionadas para una importación unificada.

| Archivo | Contenido |
|---|---|
| `campaign.ts` | `Campaign`, `CreateCampaignInput`, `UpdateCampaignInput` |
| `character.ts` | Modelo core del personaje (~430 líneas): `AbilityKey`, `SkillKey`, `RaceId`, `ClassId`, `BackgroundId`, `Alignment`, `AbilityScores`, `HitPoints`, `DeathSaves`, `ArmorClassDetail`, `Trait`, `Personality`, `Appearance`, `Character`, etc. |
| `creation.ts` | `CharacterCreationDraft` — Estado del wizard con campos por paso |
| `spell.ts` | `Spell`, `CharacterSpell`, `SpellSlots`, `PactMagicSlots`, `SorceryPoints`, `MetamagicOption`. Enums: `MagicSchool`, `SpellLevel`, `CastingTimeUnit`, etc. |
| `item.ts` | `InventoryItem`, `WeaponDetails`, `ArmorDetails`, `Coins`, `CoinTransaction`, `Inventory`. Categorías, raridades, tipos de arma/armadura |
| `notes.ts` | `Note`, `NoteTag`, `NoteFilters`. Tipos: `general`, `diario`. 8 etiquetas predefinidas (NPC, lugar, misión, etc.) |

### Patrón de Re-exportación

```typescript
// Ejemplo: src/types/character.ts re-exporta todo lo relacionado
export { calcModifier, calcProficiencyBonus } from "@/utils/character";
export { ABILITY_NAMES, SKILLS } from "@/constants/character";
```

Esto permite importar todo desde un único punto:
```typescript
import { Character, calcModifier, ABILITY_NAMES } from "@/types/character";
```

---

## Constantes

Definidas en `src/constants/`, contienen todos los datos estáticos del juego **en español**.

| Archivo | Contenido |
|---|---|
| `character.ts` | `ABILITY_NAMES`, `ABILITY_ABBR`, `SKILLS` (18 habilidades mapeadas a características), `ALIGNMENT_NAMES` (9 alineamientos), `CONDITION_NAMES` (15 condiciones) |
| `spells.ts` | `MAGIC_SCHOOL_NAMES/ICONS`, `FULL_CASTER_SLOTS`, `HALF_CASTER_SLOTS`, `WARLOCK_PACT_SLOTS`, `CANTRIPS_KNOWN`, `SPELLS_KNOWN`, `SPELLCASTING_ABILITY`, `METAMAGIC_NAMES/COSTS/DESCRIPTIONS` |
| `items.ts` | `ITEM_CATEGORY_NAMES/ICONS`, `WEAPON_TYPE_NAMES`, `ARMOR_TYPE_NAMES`, `ITEM_RARITY_NAMES/COLORS`, `COIN_NAMES/RATES`, `EQUIPMENT_PACK_IDS` |
| `notes.ts` | `NOTE_TYPE_NAMES`, `PREDEFINED_TAG_NAMES/ICONS/COLORS` (8 etiquetas con emojis y colores) |
| `abilities.ts` | `ABILITY_COLORS`, `ABILITY_KEYS`, `SPELL_LEVEL_COLORS`, `CLASS_ABILITY_THEME` |

---

## Utilidades

Funciones puras en `src/utils/`, organizadas por dominio.

| Archivo | Funciones Principales |
|---|---|
| `character.ts` | `calcModifier`, `calcProficiencyBonus`, `hitDieValue`, `formatModifier` |
| `combat.ts` | `getHpColor`, `getHpLabel`, `ALL_CONDITIONS` |
| `dice.ts` | Motor de dados completo: `rollDie`, `rollDice`, `roll` (parser NdX+M), `rollD20`, `rollWithAdvantage/Disadvantage`, `rollAbilityScore` (4d6 drop lowest), `rollInitiative`, `rollAttack`, `rollDeathSave` |
| `spells.ts` | `calcPreparedSpells`, `calcSpellSaveDC`, `calcSpellAttackBonus`, `getSpellSlots`, `formatSpellComponents/Duration/CastingTime/Range` |
| `inventory.ts` | Cálculos de peso/carga, CA por armadura, ataques de arma, `createDefaultInventory`, conversión de monedas |
| `notes.ts` | `createDefaultNote`, `createQuickNote`, `filterNotes`, `sortNotes`, `getNotePreview` |
| `storage.ts` | Wrapper tipado sobre AsyncStorage: `setItem<T>`, `getItem<T>`, `removeItem`. Claves con prefijo `dyd:` |
| `theme.ts` | `ThemeColors` (~60+ tokens semánticos), `DARK_THEME`, tema claro, `getThemeColors()` |
| `providers.ts` | Inyección de dependencias para testing: `random()` y `now()` intercambiables |
| `units.ts` | `convertirDistancia` (pies↔metros), `convertirPeso` (libras↔kg) |
| `date.ts` | `formatDate` |
| `d20Geometry.ts` | Geometría de icosaedro para renderizado SVG del D20 |
| `creationStepTheme.ts` | Overrides de tema por paso del wizard de creación |

---

## Hooks Personalizados

Definidos en `src/hooks/` con barrel export desde `index.ts`.

| Hook | Propósito |
|---|---|
| `useTheme()` | Resuelve el tema activo desde settings + color scheme del sistema. Retorna `{ colors, mode, isDark, rawSetting }`. Maneja modo "auto". |
| `useDialog()` | API imperativa para diálogos: `showDestructive`, `showConfirm`, `showSuccess`, `showError`, `showAlert`. Retorna `dialogProps` para `<ConfirmDialog>`. |
| `useToast()` | API imperativa para toasts: `showSuccess`, `showError`, `showToast`. Retorna `toastProps` para `<Toast>`. |
| `useWebTransition()` | Abre URLs externas con transición visual. Retorna `webTransitionProps` + `openUrl`. |
| `useEntranceAnimation()` | Animación de entrada fade + slide-up configurable (delay, duración, distancia, easing). |
| `usePulseAnimation()` | Animación de pulso en bucle (escala + opacidad de resplandor). Configurable. |

---

## Datos SRD

Base de datos completa del SRD 5e en español, ubicada en `src/data/srd/`.

```
src/data/srd/
├── index.ts                → Barrel export de todo el SRD
├── races.ts                → 9 razas con subrazas, bonificaciones, rasgos, iconos
├── classes.ts              → 12 clases con configuración de lanzamiento, equipo, PG base
├── backgrounds.ts          → 13 trasfondos con personalidades aleatorias
├── leveling.ts             → Tablas de XP, niveles ASI, rasgos de clase por nivel (1-20)
├── subclasses.ts           → Opciones de subclase por clase
├── subclassFeatures/       → Rasgos de subclase (13 archivos, uno por clase)
│   ├── barbaro.ts
│   ├── bardo.ts
│   ├── brujo.ts
│   ├── clerigo.ts
│   ├── druida.ts
│   ├── explorador.ts
│   ├── guerrero.ts
│   ├── hechicero.ts
│   ├── mago.ts
│   ├── monje.ts
│   ├── paladin.ts
│   ├── picaro.ts
│   └── index.ts
├── spells.ts               → Base de datos de conjuros SRD
├── spellDescriptions.ts    → Descripciones de conjuros (auto-generado)
└── classAbilities.ts       → Datos de habilidades específicas de clase
```

**Cobertura completa:** 9 razas SRD + subrazas, 12 clases + subclases, 13 trasfondos con tablas de personalidad, base de datos de conjuros, tablas de progresión de nivel 1 al 20.

---

## Estilos y Temas

### Sistema de Temas

- **Dual theme:** Claro y oscuro con ~60+ tokens semánticos de color en `ThemeColors`
- **Auto mode:** Detecta el color scheme del sistema
- **Hook `useTheme()`:** Centraliza el acceso al tema: `const { colors, isDark } = useTheme()`
- **Sin colores hardcodeados:** Todos los componentes usan `colors.tokenName`

### NativeWind + Tailwind

- **NativeWind 4.1:** Permite usar clases de Tailwind en React Native
- **Paleta personalizada** en `tailwind.config.js`: `primary` (rojo D&D), `dark` (fondo temático), `gold` (dorado/pergamino)
- **Dark mode:** Clase `dark:` de Tailwind sincronizada con el tema

### Componentes Decorativos

14 componentes en `ui/decorations/` para una estética de fantasía D&D: dragones, espadas, antorchas, runas, pergaminos, escudos, partículas flotantes, etc.

---

## Configuración del Proyecto

| Archivo | Propósito |
|---|---|
| `app.json` | Expo 54. nombre "DyMEs", bundle ID `com.dymes.app`, solo portrait, splash oscuro (#17160F), new architecture habilitada |
| `eas.json` | EAS Build: `preview` (APK), `production` (app-bundle). CLI ≥18.0.1 |
| `metro.config.js` | Config estándar de Expo Metro + `withNativeWind` (entry: `./global.css`) |
| `babel.config.js` | `babel-preset-expo` + `nativewind/babel` |
| `tsconfig.json` | TypeScript strict con path aliases: `@/*` → `./src/*`, `@components/*`, `@hooks/*`, etc. |
| `tailwind.config.js` | Dark mode por clase, contenido en `app/` y `src/`, paleta temática D&D |

### Path Aliases

```jsonc
{
  "@/*":          "./src/*",
  "@components/*": "./src/components/*",
  "@constants/*":  "./src/constants/*",
  "@hooks/*":      "./src/hooks/*",
  "@stores/*":     "./src/stores/*",
  "@types/*":      "./src/types/*",
  "@utils/*":      "./src/utils/*",
  "@data/*":       "./src/data/*"
}
```

---

## Patrones Destacados

### 1. Separación por Dominio (Slices)
El character store se divide en 8 slices de dominio independientes, cada uno con su propia responsabilidad. Esto facilita el mantenimiento y permite trabajar en un aspecto sin afectar a los demás.

### 2. Patrón Estrategia para Recursos de Clase
`classResourceStrategies.ts` implementa un patrón estrategia para manejar recursos diversos (Ki, Ira, Segundo Aliento, etc.) con una API unificada.

### 3. Inyección de Dependencias para Testing
`providers.ts` permite intercambiar `random()` y `now()` por implementaciones deterministas en tests.

### 4. Re-exportación Unificada
Cada archivo de tipos re-exporta sus constantes y utilidades relacionadas, permitiendo importar todo desde un punto: `import { Character, calcModifier, ABILITY_NAMES } from "@/types/character"`.

### 5. Todo en Español
Todos los strings de UI, valores de enum, IDs de tipo y datos están en español. Los hechizos mantienen `nombreOriginal` con el nombre en inglés.

### 6. Persistencia Manual
AsyncStorage con claves namespaced (`dyd:`) y funciones `persist*` explícitas en lugar de middleware de Zustand.

### 7. Wizard con Borrador
El wizard de creación (11 pasos) auto-guarda un borrador en AsyncStorage. Soporta "re-creación" (resetear un personaje existente a nivel 1 conservando inventario).

### 8. Animaciones Atmosféricas
Uso extensivo de `Animated` API de React Native para: entradas fade+slide, pulso de resplandor, feedback de presión con spring, listas escalonadas. Efectos temáticos: `TorchGlow`, `FloatingParticles`, `D20Watermark`.

### 9. Sistema de Diálogos/Toasts
`ConfirmDialog` personalizado reemplaza `Alert.alert` para consistencia cross-platform. Hooks imperativos (`useDialog`, `useToast`) con API de `showDestructive`/`showSuccess`/`showError`.

### 10. Geometría del D20
`d20Geometry.ts` genera vértices y caras de un icosaedro para renderizar iconos D20 en SVG.

---

## Cómo Contribuir

### Agregar una nueva pantalla
1. Crear archivo `.tsx` en `app/` siguiendo la convención de Expo Router
2. Añadir componentes en `src/components/<dominio>/`
3. Exportarlos desde el `index.ts` del dominio

### Agregar un nuevo tipo de dato
1. Definir tipos en `src/types/<dominio>.ts`
2. Crear constantes en `src/constants/<dominio>.ts`
3. Crear utilidades en `src/utils/<dominio>.ts`
4. Re-exportar desde el archivo de tipos

### Extender el character store
1. Crear un nuevo slice en `src/stores/characterStore/`
2. Definir el tipo del slice (state + actions)
3. Integrarlo en `index.ts` del character store

### Agregar datos SRD
1. Añadir datos en `src/data/srd/`
2. Exportar desde `src/data/srd/index.ts`
3. Documentar en `docs/manual/` si corresponde
