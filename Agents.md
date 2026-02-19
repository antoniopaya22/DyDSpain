# Agents.md — Instrucciones para Agentes IA

Instrucciones de contexto para agentes de IA (GitHub Copilot, Cursor, etc.) que trabajen en este proyecto.

---

## Proyecto

**D&D Español** — Aplicación móvil y web para gestionar personajes y partidas de Dungeons & Dragons 5ª Edición, completamente en español.

## Stack

- **React Native 0.81** + **Expo 54** + **Expo Router 6** (file-based routing)
- **TypeScript 5.9** (strict mode)
- **Zustand 5** (estado global, sin middleware — persistencia manual con AsyncStorage)
- **NativeWind 4.1** + **Tailwind CSS 3.4** (estilos)
- **React Native Reanimated 4.1** (animaciones)
- **React Native SVG 15** (gráficos vectoriales)

## Estructura del Proyecto

```
app/            → Rutas (Expo Router file-based)
src/
  components/   → Componentes organizados por dominio (campaigns, character, combat, compendium, creation, dice, inventory, notes, settings, ui)
  constants/    → Constantes del juego (habilidades, hechizos, objetos, notas)
  data/srd/     → Base de datos SRD completa (razas, clases, conjuros, trasfondos, subclases)
  hooks/        → Hooks personalizados (useTheme, useDialog, useToast, useEntranceAnimation, etc.)
  stores/       → Stores Zustand (campaignStore, characterStore/, creationStore, settingsStore)
  types/        → Definiciones TypeScript (character, campaign, creation, spell, item, notes)
  utils/        → Funciones utilitarias puras (dice, character, combat, spells, inventory, storage, theme)
docs/           → Documentación (historias de usuario, manual SRD, estructura del código)
```

Referencia detallada: ver `docs/Code_Structure.md`.

## Convenciones de Código

### Idioma
- **Todo en español:** UI, nombres de enum, IDs de tipo, datos del juego, constantes, comentarios de alto nivel.
- **Código en inglés:** Nombres de funciones, variables, props y componentes siguen convenciones estándar en inglés.
- Los hechizos mantienen `nombreOriginal` con el nombre en inglés.

### Naming
- **Componentes:** PascalCase, archivos `.tsx` con el mismo nombre (`CampaignCard.tsx` → `export default CampaignCard`)
- **Hooks:** camelCase con prefijo `use` (`useTheme`, `useDialog`)
- **Stores:** camelCase con prefijo `use` (`useCampaignStore`, `useCharacterStore`)
- **Utils/Constants:** camelCase para funciones, UPPER_SNAKE_CASE para constantes (`calcModifier`, `ABILITY_NAMES`)
- **Types:** PascalCase para interfaces/types, PascalCase para enums (`Character`, `AbilityKey`, `MagicSchool`)

### Imports
- Usar path aliases: `@/`, `@components/`, `@hooks/`, `@stores/`, `@types/`, `@utils/`, `@data/`, `@constants/`
- Preferir importar tipos desde `@/types/<dominio>` (re-exportan constantes y utils relacionados)

### Componentes
- Organizados por dominio en `src/components/<dominio>/`
- Cada carpeta tiene un `index.ts` con barrel exports
- Componentes reutilizables van en `src/components/ui/`
- Componentes decorativos temáticos en `src/components/ui/decorations/`

### Estado
- Zustand v5 sin middleware
- Persistencia manual con AsyncStorage y claves prefijadas `dyd:`
- El character store usa 8 slices de dominio en `src/stores/characterStore/`
- Nuevos slices: crear archivo, definir tipo (state + actions), integrar en `index.ts`

### Estilos
- Usar NativeWind (clases de Tailwind) en componentes
- Para colores: siempre usar `useTheme()` → `colors.tokenName`, nunca hardcodear colores
- Tema dual (claro/oscuro) con ~60+ tokens semánticos
- Paleta personalizada en `tailwind.config.js`: `primary`, `dark`, `gold`

### Animaciones
- Preferir la API `Animated` de React Native para la mayoría de animaciones de UI
- Usar hooks: `useEntranceAnimation()`, `usePulseAnimation()`
- Reanimated disponible para casos avanzados

### Testing
- `utils/providers.ts` permite inyectar `random()` y `now()` deterministas
- Las funciones de `characterBuilderHelpers.ts` son puras y testeables independientemente

## Patrones Clave

1. **Slices de dominio:** El character store se compone de 8 slices independientes (CRUD, combat, progression, magic, classResource, inventory, notes, rest)
2. **Patrón estrategia:** `classResourceStrategies.ts` para recursos de clase diversos (Ki, Ira, etc.)
3. **Re-exportación:** Los archivos de tipos re-exportan constantes y utils: `import { Character, calcModifier } from "@/types/character"`
4. **Wizard con borrador:** Creación de personaje en 11 pasos con auto-guardado en AsyncStorage
5. **Diálogos/Toasts:** Hooks imperativos (`useDialog`, `useToast`) en lugar de `Alert.alert`

## Al Generar Código

- Respetar el idioma: datos y strings de UI en español, lógica/código en inglés
- Seguir la organización por dominio existente
- Usar los path aliases configurados (`@/`)
- No crear archivos innecesarios
- Usar el sistema de temas (`useTheme()`) — no hardcodear colores
- Al extender el character store, crear un nuevo slice siguiendo el patrón existente
- Al añadir pantallas, seguir la convención de Expo Router
- Al añadir datos SRD, exportar desde `src/data/srd/index.ts`
- Typear todo con TypeScript strict
