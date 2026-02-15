# HU-14: Ajustes y Configuración de la App

## Descripción General

La app necesita una sección de ajustes que permita al usuario personalizar su experiencia: tema visual, unidades de medida, opciones de accesibilidad, gestión de datos (exportar/importar/borrar) y preferencias de juego como reglas opcionales. Esto garantiza una experiencia adaptable y control sobre los datos almacenados.

---

## HU-14.1: Pantalla de Ajustes General

**Como** usuario,
**quiero** acceder a una pantalla de ajustes centralizada,
**para** configurar las opciones de la app en un solo lugar.

### Criterios de Aceptación

- Existe un icono/botón de ajustes (⚙️) accesible desde la pantalla principal.
- La pantalla de ajustes se organiza en secciones:
  - Apariencia
  - Juego
  - Datos
  - Acerca de
- Cada sección es expandible o se accede por navegación interna.

---

## HU-14.2: Tema Visual (Claro / Oscuro)

**Como** usuario,
**quiero** elegir entre un tema claro y uno oscuro,
**para** usar la app cómodamente en cualquier condición de luz.

### Criterios de Aceptación

- Se ofrecen 3 opciones: **Claro**, **Oscuro**, **Automático** (sigue el tema del sistema).
- El cambio de tema se aplica de forma inmediata sin reiniciar la app.
- El tema seleccionado se guarda en almacenamiento local y persiste entre sesiones.
- Todos los componentes de la app respetan el tema elegido: fondos, textos, iconos, botones, modales.

### Notas Técnicas

- Utilizar NativeWind con `dark:` para gestionar los estilos de tema oscuro.
- Usar `useColorScheme()` de React Native para detectar el tema del sistema.

---

## HU-14.3: Reglas Opcionales

**Como** jugador,
**quiero** activar o desactivar reglas opcionales del juego,
**para** que la app refleje las reglas que usa mi grupo de partida.

### Criterios de Aceptación

- Se ofrecen toggles para las siguientes reglas opcionales:
  - **Dotes** (Feats): Activar/desactivar el sistema de dotes en lugar de ASI (HU-15).
  - **Multiclase**: Permitir multiclase en la creación/subida de nivel (fuera del SRD básico, pero preparado).
  - **Puntos de vida fijos vs tirada**: Elegir si al subir de nivel los PG se calculan con el valor fijo o se tira el dado (HU-05).
  - **Compra de puntos de característica**: Permitir el sistema de compra de puntos en vez de tirada o array estándar (HU-02).
  - **Encumbrance detallada**: Activar reglas de carga y peso estrictas vs la regla simplificada.
- Al cambiar una regla, se muestra una advertencia si afecta a personajes existentes.
- Los toggles se guardan como preferencias globales y se pueden sobreescribir por partida (HU-01).

---

## HU-14.4: Unidades de Medida

**Como** usuario,
**quiero** elegir el sistema de unidades (imperial o métrico),
**para** que los valores de distancia, peso y alcance se muestren en unidades familiares.

### Criterios de Aceptación

- Se ofrecen 2 opciones: **Imperial** (pies, libras) y **Métrico** (metros, kilogramos).
- Al cambiar, todas las fichas, conjuros, equipamiento y hojas de personaje se actualiza automáticamente:
  - 1 pie = 0,3 m (redondeo a 1,5 m para 5 pies, 9 m para 30 pies, etc.).
  - 1 libra = 0,45 kg.
- Los datos base se almacenan siempre en imperial (estándar de D&D); la conversión es solo visual.
- La opción seleccionada se guarda y persiste.

---

## HU-14.5: Gestión de Datos (Exportar / Importar)

**Como** usuario,
**quiero** exportar e importar los datos de mis personajes y partidas,
**para** hacer copias de seguridad o trasladarlos a otro dispositivo.

### Criterios de Aceptación

- **Exportar**:
  - Se puede exportar un personaje individual o todos los datos de la app.
  - El formato de exportación es JSON legible.
  - Se genera un archivo descargable o compartible (ej: `personaje_Gandalf_2024-01-15.json`).
  - Se incluye: personaje, notas, inventario, conjuros preparados, recursos, historial de nivel.
- **Importar**:
  - Se puede importar un archivo JSON como nuevo personaje o reemplazar uno existente.
  - Se valida la integridad del archivo antes de importar.
  - Si hay un conflicto (mismo nombre de personaje), se pregunta al usuario si quiere reemplazar, renombrar o cancelar.
- Se muestra una barra de progreso durante la operación.

---

## HU-14.6: Borrar Datos

**Como** usuario,
**quiero** poder borrar un personaje individual o todos los datos de la app,
**para** comenzar de cero o liberar almacenamiento.

### Criterios de Aceptación

- Se puede eliminar un personaje individual desde la lista de personajes o desde ajustes.
- Existe la opción "Borrar todos los datos" en ajustes que elimina personajes, partidas, notas y configuración.
- Ambas acciones requieren doble confirmación:
  - Primera: modal de confirmación con texto descriptivo.
  - Segunda: escribir "BORRAR" o similar para datos globales.
- Tras el borrado, se muestra confirmación y se redirige a la pantalla inicial.

---

## HU-14.7: Acerca de la App

**Como** usuario,
**quiero** ver información sobre la app como versión, licencia SRD y créditos,
**para** conocer la versión que estoy usando y las atribuciones legales.

### Criterios de Aceptación

- La sección "Acerca de" muestra:
  - **Nombre de la app** y versión actual.
  - **Nota legal SRD**: referencia a la licencia OGL 1.0a / CC BY 4.0 del SRD 5.1.
  - **Créditos** al desarrollador.
  - **Enlace** al repositorio o página del proyecto (si es público).
  - **Librerías y tecnologías**: React Native, Expo, NativeWind, etc.

---

## HU-14.8: Notificaciones y Recordatorios

**Como** jugador,
**quiero** recibir recordatorios opcionales sobre mi partida,
**para** no olvidar las sesiones programadas.

### Criterios de Aceptación

- Se puede activar/desactivar notificaciones locales.
- Si una partida tiene fecha de sesión programada (HU-01), se envía un recordatorio configurable (1 hora antes, 1 día antes, etc.).
- El permiso de notificaciones se solicita al usuario la primera vez (opt-in).
- Si las notificaciones están desactivadas a nivel de sistema, se muestra un enlace a los ajustes del dispositivo.

### Notas Técnicas

- Usar `expo-notifications` para notificaciones locales.
- No se requiere backend/push para esta funcionalidad.

---

## Modelo de Datos (Referencia)

```text
AjustesApp {
  id: "singleton"
  tema: "claro" | "oscuro" | "auto"
  unidades: "imperial" | "metrico"
  notificaciones_activas: boolean
  recordatorio_anticipacion: number   // minutos antes de sesión
  reglas_opcionales: {
    dotes_activas: boolean
    multiclase: boolean
    pv_fijos: boolean                 // true = valor fijo, false = tirar dado
    compra_puntos: boolean
    encumbrance_detallada: boolean
  }
  ultimo_backup: Date | null
}
```

---

## Prioridad de Implementación

| Historia | Prioridad | Complejidad |
|----------|-----------|-------------|
| HU-14.1 Pantalla de ajustes | 🔴 Alta | Baja |
| HU-14.2 Tema claro/oscuro | 🔴 Alta | Baja |
| HU-14.3 Reglas opcionales | 🟡 Media | Media |
| HU-14.4 Unidades de medida | 🟢 Baja | Media |
| HU-14.5 Exportar/Importar | 🟡 Media | Alta |
| HU-14.6 Borrar datos | 🔴 Alta | Baja |
| HU-14.7 Acerca de la app | 🟢 Baja | Baja |
| HU-14.8 Notificaciones | 🟢 Baja | Media |

---

## Dependencias

- **HU-01**: Gestión de partidas (recordatorios de sesiones).
- **HU-02**: Creación de personaje (reglas opcionales afectan opciones disponibles: compra de puntos, multiclase).
- **HU-05**: Subir de nivel (PV fijos vs tirada, dotes vs ASI).
- **HU-15**: Dotes (toggle de activación).
- **NativeWind**: Framework CSS para tema oscuro.
- **expo-notifications**: Para recordatorios locales.
