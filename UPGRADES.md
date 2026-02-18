# 🛠️ Plan de Limpieza de Código — DnD Español

> **Fecha**: Febrero 2026  
> **Estado actual**: ~45.000 líneas de TypeScript/TSX en `src/` y `app/`  
> **Archivos críticos (>1000 líneas)**: 11 archivos  
> **Objetivo**: Aplicar principios de Clean Code, SRP, DRY y patrones de diseño

---

## Resumen Ejecutivo

| Métrica | Actual | Objetivo |
|---------|--------|----------|
| Archivos >1000 líneas | 11 | 0 |
| Archivos >500 líneas | 25 | <10 |
| Componentes por archivo (máx.) | 14 (FantasyDecorations) | ≤3 |
| Funciones >100 líneas | ~~~20~~ → ~12 | 0 |
| Stores monolíticos | ~~1 (characterStore: 1798 lín.)~~ → 0 | 5-6 stores especializados ✅ |
| Directorios vacíos | 7 | 0 |
| Duplicación de código | Alta | Mínima |

---

## Nivel 1 — CRÍTICO 🔴

> Problemas arquitectónicos que afectan mantenibilidad, escalabilidad y riesgo de bugs.

### 1.1 ~~Descomponer `characterStore.ts` (1798 líneas) — God Store~~ ✅ COMPLETADO

**Problema**: Un único store Zustand gestiona 9+ dominios: CRUD de personaje, experiencia/nivel, HP, dados de golpe, salvaciones de muerte, condiciones, descansos, rasgos, recursos de clase, huecos de hechizo, inventario y notas.  
**Violación**: Principio de Responsabilidad Única (SRP). Cualquier cambio en inventario puede romper lógica de combate.

**Solución aplicada**: Patrón **Zustand Slices** — el store se compone desde 8 archivos de dominio en `src/stores/characterStore/`. La API pública es idéntica (zero breaking changes).

**Acciones**:
- [x] Crear `characterStore/combatSlice.ts` — HP, HP temporal, salvaciones de muerte, condiciones, concentración, rasgos
- [x] Crear `characterStore/progressionSlice.ts` — XP, `levelUp()`, `resetToLevel1()`, historial de niveles
- [x] Crear `characterStore/magicSlice.ts` — huecos de hechizo, huecos de pacto, puntos de hechicería
- [x] Crear `characterStore/inventorySlice.ts` — items, monedas, transacciones
- [x] Crear `characterStore/notesSlice.ts` — notas, etiquetas
- [x] Crear `characterStore/classResourceSlice.ts` — Ki, rabia, segundo aliento, etc.
- [x] Crear `characterStore/characterCrudSlice.ts` — CRUD y getters computados
- [x] Crear `characterStore/restSlice.ts` — descanso corto y largo (orquesta combat, magic, resources)
- [x] Crear `characterStore/helpers.ts` — `updateCharacterAndPersist()`, `createCombatLogEntry()`, constantes, tipos internos
- [x] Crear `characterStore/types.ts` — interfaces de cada slice + tipo combinado `CharacterStore`
- [x] Crear `characterStore/index.ts` — composición con `create<CharacterStore>()` + re-exports
- [x] Extraer helper `updateCharacterAndPersist(get, set, patch)` — patrón duplicado ~30 veces
- [x] Extraer constante `COMBAT_LOG_MAX = 100` — número mágico duplicado en 8 ubicaciones

**Resultado**: 2106 líneas → 11 archivos de ~100-350 líneas cada uno. 0 errores TypeScript.  
**Archivos afectados**: `src/stores/characterStore/` (nuevo directorio), todos los componentes `character/*.tsx` (sin cambios)
**Completado**: Febrero 2026

---

### ~~1.2 Dividir `LevelUpModal.tsx` (3452 líneas) — God Component~~ ✅ COMPLETADO

**Problema**: Un solo componente con 30+ hooks `useState`, 8 funciones `render*` de 200-850 líneas, funciones anidadas dentro de funciones (`renderSpellsStep` → `toggleSpell` → `renderSpellCard` → `buildSpellCards`).  
**Violación**: SRP, composición de componentes, rendimiento (funciones recreadas en cada render).

**Acciones**:
- [x] Extraer hook `useLevelUpWizard.ts` — toda la lógica de navegación, validación y estado del wizard
- [x] Crear `SummaryStep.tsx` (~260 líneas actuales)
- [x] Crear `HPStep.tsx` (~424 líneas)
- [x] Crear `ASIStep.tsx` (~333 líneas)
- [x] Crear `SpellsStep.tsx` (~830 líneas)
- [x] Crear `SubclassStep.tsx` (~500 líneas)
- [x] Crear `MetamagicStep.tsx` (~270 líneas)
- [x] Crear `ConfirmStep.tsx` (~290 líneas)
- [ ] Mover `ABILITY_COLORS` a `src/constants/abilities.ts` (duplicado en OverviewTab)
- [ ] Eliminar colores `rgba(...)` hardcodeados → usar tokens del tema

**Resultado**: 3648 líneas → 1 shell (~310 lín.) + 7 steps (~200-830 lín. c/u) + 1 hook (~530 lín.). 0 errores TypeScript.  
**Archivos afectados**: `src/components/character/LevelUpModal.tsx` (shell), `src/components/character/levelup/` (nuevo directorio con 8 archivos)  
**Completado**: Febrero 2026

---

### 1.3 Dividir `AbilitiesTab.tsx` (2156 líneas) — Datos en componente UI

### ~~1.3 Dividir `AbilitiesTab.tsx` (2156 líneas) — Datos en componente UI~~ ✅ COMPLETADO

**Problema**: ~500 líneas de datos de juego (`getBarbaroAbilities`, `getMonjeAbilities`, etc.) embebidas en un archivo de componente. El componente principal tiene 1487 líneas con IIFEs en JSX.  
**Violación**: Separación de concerns (datos ≠ presentación), DRY.

**Acciones**:
- [x] Mover `getBarbaroAbilities()`, `getGuerreroAbilities()`, `getMonjeAbilities()`, `getPicaroAbilities()`, `getClassAbilities()` → `src/data/srd/classAbilities.ts`
- [x] Crear `ClassResourceSlots.tsx` — gestión visual de recursos de clase
- [x] Crear `SpellcastingSection.tsx` — información de lanzamiento, slots, trucos, conjuros, concentración, magia de pacto, puntos de hechicería y metamagia
- [x] Crear `ClassAbilitiesSection.tsx` — header + habilidades de clase expandibles con recursos/escalado/costes
- [x] Crear `CharacterTraitsSection.tsx` — rasgos y capacidades con TraitCard
- [x] Mover `SPELL_LEVEL_COLORS` y `CLASS_ABILITY_THEME` a `src/constants/abilities.ts`
- [ ] Unificar `SpellCard` duplicado (existe en AbilitiesTab y LevelUpModal)
- [ ] Eliminar IIFEs en JSX → extraer funciones helper o sub-componentes

**Resultado**: 2329 líneas → 1 shell (~280 lín.) + 4 secciones (~200-870 lín. c/u) + 1 data file (~500 lín.) + 1 constants file (~30 lín.). 0 errores TypeScript.  
**Archivos afectados**: `src/components/character/AbilitiesTab.tsx` (shell), `src/components/character/abilities/` (nuevo directorio), `src/data/srd/classAbilities.ts`, `src/constants/abilities.ts`  
**Completado**: Febrero 2026

---

### ~~1.4 Función `levelUp()` de 270 líneas y `buildCharacter()` de 310 líneas~~ ✅ COMPLETADO

**Problema**: Las dos funciones más largas del proyecto. `levelUp()` maneja HP, ASI, rasgos, subclase, magia, recursos de clase y persistencia en un solo bloque. `buildCharacter()` construye un personaje completo desde cero.  
**Violación**: SRP, testabilidad. Imposible probar unitariamente cada aspecto.

**Solución aplicada**: Funciones puras extraídas a archivos independientes. `levelUp()` reducido de ~290 a ~80 líneas de orquestación. `buildCharacter()` reducido de ~290 a ~120 líneas. `createDefaultClassResources()` refactorizado con patrón Strategy/Registry.

**Acciones**:
- [x] Descomponer `levelUp()` en: `applyHPGain()`, `applyASI()`, `buildNewTraits()`, `buildSubclassTraits()`, `buildLevelRecord()`, `applyMagicProgression()` → `characterStore/levelUpHelpers.ts` (355 lín.)
- [x] Descomponer `buildCharacter()` en: `buildAbilityScoresDetailed()`, `buildSkillProficiencies()`, `buildCharacterTraits()`, `buildProficiencies()`, `buildInitialSpells()` → `stores/characterBuilderHelpers.ts` (304 lín.)
- [x] Eliminar `require()` dinámico dentro de `levelUp()` → import estático de `getSubclassOptions` en `levelUpHelpers.ts`
- [x] Extraer lógica de `createDefaultClassResources()` → patrón Strategy/Registry en `characterStore/classResourceStrategies.ts` (107 lín.)

**Archivos creados**: `characterStore/levelUpHelpers.ts`, `stores/characterBuilderHelpers.ts`, `characterStore/classResourceStrategies.ts`  
**Archivos modificados**: `progressionSlice.ts` (505 → 266 lín.), `creationStore.ts` (929 → 675 lín.), `helpers.ts` (233 → 166 lín.)  
**Completado**: Febrero 2026

---

### 1.5 ~~Bug reactivo en `OverviewTab.tsx` — `useCharacterStore.getState()` en render~~ ✅ COMPLETADO

**Problema**: Se usa `useCharacterStore.getState()` dentro de funciones de render (`renderSavingThrows`, `renderSkills`), evitando el sistema de suscripción de React. El componente **no se re-renderiza** cuando cambian `getSavingThrowBonus` o `getSkillBonus`.  
**Violación**: Reglas de React/Zustand, bug funcional.

**Acciones**:
- [x] Reemplazar `useCharacterStore.getState()` por uso del hook `useCharacterStore()` en el nivel superior del componente
- [x] Auditar todos los componentes para encontrar otros usos incorrectos de `.getState()` en render

**Completado**: Febrero 2026

---

## Nivel 2 — ALTO 🟠

> Problemas de estructura y duplicación que dificultan el mantenimiento diario.

### 2.1 Dividir `FantasyDecorations.tsx` (1876 líneas) — 14 componentes en 1 archivo

**Problema**: `DragonDivider`, `SwordDivider`, `ShieldFrame`, `RunicBorder`, `ParchmentCard`, `DndBackdrop`, `TorchGlow`, `CastleHeader`, `ScrollBanner`, `MagicCircle`, `CornerOrnament`, `OrnateFrame`, `FloatingParticles`, `SingleParticle` — todos en un solo fichero.  
**Violación**: SRP, principio de archivo único por componente.

**Acciones**:
- [ ] Crear directorio `src/components/ui/decorations/`
- [ ] Extraer cada componente a su propio archivo
- [ ] Crear barrel `src/components/ui/decorations/index.ts`
- [ ] Extraer abstracciones compartidas si las hay (ej. `SvgDividerBase`)

**Estimación**: 1 día

---

### 2.2 Separar tipos, constantes y utilidades (actualmente mezclados)

**Problema**: Los archivos de tipos (`spell.ts`, `item.ts`, `notes.ts`, `character.ts`) mezclan interfaces, tablas de datos constantes (~500 líneas en `spell.ts`) y funciones utilitarias. La carpeta `src/constants/` está **vacía**.  
**Violación**: Separación de concerns, cohesión.

**Acciones**:
- [ ] **`src/types/`** — Solo `type`, `interface`, `enum`. Sin constantes ni funciones.
- [ ] **`src/constants/abilities.ts`** — `ABILITY_NAMES`, `ABILITY_COLORS`, skill definitions
- [ ] **`src/constants/combat.ts`** — `CONDITION_NAMES`, `DAMAGE_TYPES`, `ALL_CONDITIONS`
- [ ] **`src/constants/spells.ts`** — `FULL_CASTER_SLOTS`, `HALF_CASTER_SLOTS`, `WARLOCK_PACT_SLOTS`, `CANTRIPS_KNOWN`, `SPELLS_KNOWN`, `MAGIC_SCHOOL_NAMES`, `MAGIC_SCHOOL_ICONS`
- [ ] **`src/constants/items.ts`** — `COIN_COLORS`, `CATEGORY_OPTIONS`, name/icon/color maps de items
- [ ] **`src/constants/icons.ts`** — `RACE_ICONS`, `CLASS_ICONS`, `BACKGROUND_ICONS`
- [ ] **`src/utils/spellFormatters.ts`** — `formatSpellDuration`, `formatCastingTime`, `formatSpellRange`
- [ ] **`src/utils/inventory.ts`** — `calcArmorClass`, `calcWeaponAttackBonus`, `calcTotalWeight`
- [ ] **`src/utils/notes.ts`** — `filterNotes`, `sortNotes`, `getNotePreview`, `createDefaultNote`
- [ ] **`src/utils/units.ts`** — `convertirDistancia`, `convertirPeso` (actualmente en settingsStore)
- [ ] Extraer `CharacterCreationDraft` de `character.ts` → `types/creation.ts`

**Estimación**: 2 días

---

### 2.3 Eliminar duplicación de lógica de dados en `DiceRoller.tsx`

**Problema**: `DiceRoller.tsx` (1262 lín.) reimplementa `randomInt`, `rollDie`, `parseDieType`, `parseFormula`, `executeFormula` (~160 líneas) que ya existen en `src/utils/dice.ts`.  
**Violación**: DRY. Bugs corregidos en un sitio no se propagan al otro.

**Acciones**:
- [ ] Eliminar funciones duplicadas de `DiceRoller.tsx`
- [ ] Importar desde `@/utils/dice`
- [ ] Dividir componente: `DiceRoller.tsx` (UI), `DiceResult.tsx`, `DiceHistory.tsx`
- [ ] Convertir inline styles a `StyleSheet.create()`

**Estimación**: 1 día

---

### 2.4 Duplicación de geometría D20 entre `DndLogo.tsx` y `D20Icon.tsx`

**Problema**: `getD20Faces()` (DndLogo) y `getD20Geometry()` (D20Icon) son funciones casi idénticas que calculan vértices de pentágono, caras con sombras y polígono central.

**Acciones**:
- [ ] Crear `src/utils/d20Geometry.ts` con la implementación unificada
- [ ] Importar en ambos componentes
- [ ] Dividir `DndLogo.tsx` (824 lín.) en: `DndLogo.tsx`, `InlineDndLogo.tsx`, `MinimalD20Logo.tsx`

**Estimación**: 0.5 días

---

### 2.5 `showToast()` duplicado en 3+ archivos

**Problema**: Función `showToast()` copiada literalmente en `AbilitiesTab.tsx`, `NotesTab.tsx`, `InventoryTab.tsx`... más un `showToastLegacy` muerto en `CombatTab.tsx`.

**Acciones**:
- [ ] Unificar uso de `useToast` hook existente en todos los componentes
- [ ] Eliminar todas las copias locales de `showToast()`
- [ ] Eliminar código muerto: `showToastLegacy` en CombatTab

**Estimación**: 0.5 días

---

### 2.6 ~~Dividir `NotesTab.tsx` (1088 lín.) e `InventoryTab.tsx` (994 lín.)~~ ✅ COMPLETADO

**Acciones**:
- [x] `NotesTab.tsx` → `NotesTab.tsx` + `NoteEditorModal.tsx` + `NoteCard.tsx` + `NoteFilterBar.tsx` + `QuickNoteBar.tsx`
- [x] `InventoryTab.tsx` → `InventoryTab.tsx` + `InventoryItemCard.tsx` + `AddItemModal.tsx` + `CoinTransactionModal.tsx`
- [x] `CombatTab.tsx` (818 lín.) → `CombatTab.tsx` + `HPTracker.tsx` + `DeathSavesTracker.tsx` + `HitDiceSection.tsx` + `ConditionsSection.tsx` + `CombatLog.tsx`
- [x] Mover `formatDate()` fuera de NotesTab → `src/utils/date.ts`
- [x] Unificar `TraitCard` (dos implementaciones distintas en OverviewTab y AbilitiesTab) → `src/components/character/TraitCard.tsx`

**Resultado**: NotesTab 1154→~280 lín., InventoryTab 1061→~310 lín., CombatTab 874→~270 lín. TraitCard unificado. 0 errores TypeScript.

---

### 2.7 Dividir screens principales (`compendium.tsx`, `index.tsx`, `settings.tsx`) — ✅ COMPLETADO

**Problema**: Pantallas de 750-1215 líneas con múltiples componentes inline y funciones render.

**Acciones**:
- [x] `index.tsx` (1082 lín.) → ~340 lín. + `CampaignCard.tsx` + `HomeEmptyState.tsx` + `StatsRow.tsx` en `src/components/campaigns/`
- [x] `settings.tsx` (786 lín.) → ~200 lín. + `ThemeSection.tsx` + `RulesSection.tsx` + `UnitsSection.tsx` + `DataSection.tsx` + `AboutSection.tsx` en `src/components/settings/`
- [x] `compendium.tsx` (1214 lín.) → ~250 lín. + `RaceCard.tsx` + `ClassCard.tsx` + `BackgroundCard.tsx` + `compendiumStyles.ts` + `compendiumUtils.ts` en `src/components/compendium/`
- [x] Corregidos errores TS pre-existentes: `BackgroundData` property names, `getAllRaceTraits`/`getSubraceData` argument count

**Resultado**: index 1082→340, settings 786→200, compendium 1214→250 líneas. 14 archivos nuevos creados. 0 errores TS.

**Estimación**: 2 días

---

## Nivel 3 — MEDIO 🟡

> Mejoras de calidad, consistencia y mantenibilidad a medio plazo.

### 3.1 ~~Crear hook `useEntranceAnimation()` — Boilerplate duplicado en 6+ screens~~ ✅ COMPLETADO

**Acciones**:
- [x] Crear `src/hooks/useEntranceAnimation.ts` que retorne `{ opacity, translateY, containerStyle }`
- [x] Reemplazar boilerplate en `index.tsx`, `compendium.tsx`, `settings.tsx`, `campaigns/new.tsx`
- [x] Crear `src/hooks/usePulseAnimation.ts` (usado en ExperienceSection)

**Resultado**: 2 hooks nuevos. ~60 líneas de boilerplate eliminadas de 4 pantallas + 1 componente. 0 errores TS.

---

### 3.2 ~~Separar `useDialog.ts` (483 lín.) — 3 hooks en 1 archivo~~ ✅ COMPLETADO

**Acciones**:
- [x] `src/hooks/useDialog.ts` trimmed a solo el dialog hook (re-exporta los otros para backward compat)
- [x] Crear `src/hooks/useToast.ts`
- [x] Crear `src/hooks/useWebTransition.ts`
- [x] Crear `src/hooks/index.ts` barrel export

**Resultado**: 3 hooks separados + barrel export. useDialog.ts 483→~120 lín. 0 errores TS.

---

### 3.3 ~~Tema-ificar componentes con colores hardcodeados~~ ✅ COMPLETADO (parcial)

**Acciones**:
- [x] Auditar todos los archivos en busca de colores hex/rgba hardcodeados (~460 instancias en 39 archivos)
- [x] Extender `ThemeColors` con tokens semánticos: `accentPink`, `accentIndigo`, `backdrop`
- [x] Crear helper `withAlpha(color: string, opacity: number): string` en `theme.ts`
- [x] `WebTransition.tsx`: 17 colores hardcodeados → tokens del tema
- [x] `DiceRoller.tsx`: 3 colores hardcodeados → tokens del tema (`accentPink`, `accentIndigo`, `backdrop`)
- [ ] ~450 colores restantes en 37 archivos (la mayoría en pantallas de creación y componentes decorativos que ya usan `useTheme()` con fallbacks en StyleSheet)

**Resultado**: `withAlpha` helper + 3 tokens nuevos. WebTransition y DiceRoller ahora 100% tematizados. Resto es trabajo incremental.

---

### 3.4 ~~Datos SRD: mover `spellDescriptions.ts` a JSON y reorganizar~~ ✅ COMPLETADO

**Acciones**:
- [x] Dividir `subclassFeatures.ts` (5970 lín.) por clase: 12 archivos en `subclassFeatures/` + `types.ts` + `index.ts`
- [x] Exportar `spellDescriptions` y `subclassFeatures` desde `src/data/srd/index.ts`
- [x] Tipar `SrdSpell.escuela` con `SrdMagicSchool` (type literal union) en vez de `string`

**Resultado**: Monolito de 5970 lín. → 14 archivos modulares. Barrel exports completos. Tipado estricto de escuelas. 0 errores TS.
**Nota**: `spellDescriptions.ts` se mantiene como `.ts` (no JSON) — el wrapper no justifica la complejidad adicional.

---

### 3.5 ~~Eliminar duplicación de datos entre archivos SRD~~ ✅ COMPLETADO

**Acciones**:
- [x] `classes.ts` establecido como fuente única de verdad para `casterType` y `spellcastingAbility`
- [x] `CLASS_CASTER_TYPE`, `SPELLCASTING_ABILITY` y `CLASS_SPELL_PREPARATION` derivados dinámicamente de `CLASSES`
- [x] Features de nivel 1 unificados (classes.ts como fuente)

**Resultado**: 3 diccionarios hardcodeados eliminados, derivados de CLASSES. 0 errores TS.

---

### 3.6 ~~Añadir manejo de errores a acciones async del store~~ ✅ COMPLETADO

**Acciones**:
- [x] Creado `safeSetItem<T>(key, value, tag)` wrapper centralizado en `helpers.ts` — try/catch + console.error
- [x] 57 llamadas `setItem` sin protección reemplazadas por `safeSetItem` en 8 slices del character store
- [x] Estrategia: UI optimista (set() primero), log-only en fallo de persistencia (estado en memoria válido para la sesión)
- [x] `creationStore`: try/catch añadido a `startCreation` y `startRecreation`

**Resultado**: 100% de acciones async protegidas. Wrapper centralizado facilita añadir retry/toast en el futuro. 0 errores TS.

---

### 3.7 ~~Desacoplar stores — Cross-Store Coupling~~ ✅ COMPLETADO

**Acciones**:
- [x] Creado `characterStore.deleteAllCharacterData(characterId)` — elimina CHARACTER, INVENTORY, NOTES, MAGIC_STATE, SPELL_FAVORITES, CLASS_RESOURCES via `Promise.allSettled`
- [x] Creado `deleteCreationDraft(campaignId)` exportado desde `creationStore.ts`
- [x] `campaignStore.deleteCampaign()` refactorizado: 13 líneas de manipulación directa → 2 llamadas delegadas
- [x] Revisadas otras dependencias inter-store (sin más coupling encontrado)

**Resultado**: campaignStore ya no conoce claves de storage ajenas. Patrón delegación limpio. 0 errores TS.

---

## Nivel 4 — BAJO 🟢

> Mejoras de calidad de código, consistencia y buenas prácticas.

### 4.1 Eliminar código muerto y directorios vacíos

**Acciones**:
- [ ] Eliminar `showToastLegacy` en `CombatTab.tsx`
- [ ] Revisar y limpiar StyleSheets con reglas no usadas (especialmente `index.tsx` con ~340 líneas de estilos)
- [ ] Eliminar o documentar directorios vacíos: `components/campaigns/`, `components/combat/`, `components/inventory/`, `components/master/`, `components/notes/`, `components/spells/`
- [ ] Eliminar tipo `Esc` no usado en `spells.ts` (o usarlo para tipar `escuela`)

**Estimación**: 0.5 días

---

### 4.2 Patrón render-function → componentes React reales

**Problema**: En todo el proyecto se usa el patrón `const renderXxx = () => (...)` como funciones internas. Estas no pueden ser memoizadas con `React.memo`, se recrean en cada render, no pueden usar hooks independientemente y no son testableS por separado.

**Acciones**:
- [ ] Convertir todas las `renderXxx` en componentes React con nombre propio
- [ ] Aplicar `React.memo()` donde sea apropiado (listas, cards)
- [ ] Eliminar IIFEs en JSX → funciones helper o sub-componentes

**Estimación**: Integrado en las tareas de extracción anteriores

---

### 4.3 Añadir barrel exports a directorios de componentes

**Acciones**:
- [ ] Crear `src/components/character/index.ts`
- [ ] Crear `src/components/dice/index.ts`
- [ ] Crear `src/components/creation/index.ts`
- [ ] Crear `src/hooks/index.ts`
- [ ] Actualizar imports en todo el proyecto para usar barrels

**Estimación**: 0.5 días

---

### 4.4 Refactors menores de código

**Acciones**:
- [ ] Unificar `rollWithAdvantage` / `rollWithDisadvantage` en `dice.ts` → una sola función parametrizada
- [ ] Extraer `typeConfig` fuera de `renderCombatLog` en CombatTab (recreado en cada render)
- [ ] Reemplazar `[0, 1, 2]` por `Array.from({ length: MAX_DEATH_SAVES })` en CombatTab
- [ ] Extraer `createDefaultClassResources()` de characterStore → patrón strategy con registro por clase
- [ ] Reemplazar número mágico `999` para rage ilimitada → constante `UNLIMITED_RESOURCE`
- [ ] Corregir posible typo `getNotPreview` → `getNotePreview` en notes.ts
- [ ] Eliminar `setPvFijos` redundante en settingsStore (duplica `setOptionalRule("pvFijos", ...)`)

**Estimación**: 1 día

---

### 4.5 Inyección de dependencias para testabilidad

**Problema**: `Math.random()` usado directamente en stores para tiradas y descansos. `new Date().toISOString()` embebido en cada acción. Esto hace las funciones no deterministas e imposibles de testear.

**Acciones**:
- [ ] Crear abstracciones: `RandomProvider` y `ClockProvider`
- [ ] Inyectar en stores via parámetros o contexto
- [ ] Permite mock en tests

**Estimación**: 1 día

---

## Resumen de Estimaciones

| Nivel | Descripción | Tareas | Est. Total |
|-------|-------------|--------|------------|
| 🔴 Crítico | Arquitectura, God stores/components, bugs | 5 | 10-12 días |
| 🟠 Alto | Duplicación, separación de concerns | 7 | 9-10 días |
| 🟡 Medio | Hooks, temas, datos, errores | 7 | 7-8 días |
| 🟢 Bajo | Limpieza, barrels, refactors menores | 5 | 3-4 días |
| **Total** | | **24** | **~30 días** |

---

## Orden de Ejecución Recomendado

```
Fase 1 (Semana 1-2): Cimientos
├── 1.5  ✅ Bug reactivo OverviewTab (1h)
├── 1.1  ✅ Descomponer characterStore
├── 2.2  Separar tipos/constantes/utilidades
└── 2.5  Unificar showToast duplicado

Fase 2 (Semana 2-3): Componentes Críticos
├── 1.2  ✅ Dividir LevelUpModal
├── 1.3  ✅ Dividir AbilitiesTab
├── 1.4  ✅ Descomponer levelUp() y buildCharacter()
└── 2.3  Eliminar duplicación en DiceRoller

Fase 3 (Semana 3-4): Componentes Secundarios
├── 2.1  ✅ Dividir FantasyDecorations
├── 2.6  ✅ Dividir NotesTab, InventoryTab, CombatTab
├── 2.7  ✅ Dividir screens principales
└── 2.4  ✅ Unificar geometría D20

Fase 4 (Semana 4-5): Calidad y Consistencia
├── 3.1  Hook useEntranceAnimation
├── 3.2  Separar useDialog.ts
├── 3.3  Tema-ificar colores hardcodeados
├── 3.4  Reorganizar datos SRD
├── 3.5  Eliminar duplicación datos SRD
├── 3.6  Manejo de errores async
└── 3.7  Desacoplar stores

Fase 5 (Semana 5): Pulido
├── 4.1  Eliminar código muerto
├── 4.2  Convertir render-functions
├── 4.3  Barrel exports
├── 4.4  Refactors menores
└── 4.5  Inyección de dependencias
```

---

## Notas

- **No romper funcionalidad**: Cada refactor debe ser un PR independiente con tests manuales.
- **Archivos dato puro** (`classes.ts`, `backgrounds.ts`, `races.ts`): No requieren refactor urgente — son grandes pero su naturaleza es ser repositorios de datos estáticos.
- **Archivo gold-standard**: `src/utils/dice.ts` — bien documentado, funciones puras, testable. Usar como referencia de estilo.
- **Prioridad real**: Empezar siempre por 1.5 (bug reactivo) ya que es un fix de 1 hora con impacto funcional directo.
