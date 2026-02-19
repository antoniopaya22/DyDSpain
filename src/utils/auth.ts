/**
 * Auth utilities — Error translation and helpers for Supabase auth.
 *
 * Maps common Supabase English error messages to Spanish equivalents.
 */

// ─── Error Translation Map ──────────────────────────────────────────

/**
 * Pairs of [regex pattern, Spanish translation].
 * Patterns are tested in order; first match wins.
 */
const AUTH_ERROR_MAP: ReadonlyArray<[RegExp, string]> = [
  // Login
  [/invalid login credentials/i, "Correo o contraseña incorrectos"],
  [/email not confirmed/i, "Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada."],
  [/invalid claim: missing sub/i, "Sesión inválida. Inicia sesión de nuevo."],

  // Sign-up
  [/user already registered/i, "Ya existe una cuenta con este correo electrónico"],
  [/password should be at least (\d+) characters/i, "La contraseña debe tener al menos $1 caracteres"],
  [/signup is disabled/i, "El registro está desactivado temporalmente"],
  [
    /unable to validate email address: invalid format/i,
    "El formato del correo electrónico no es válido",
  ],
  [/a user with this email address has already been registered/i, "Ya existe una cuenta con este correo electrónico"],

  // Rate limiting
  [/email rate limit exceeded/i, "Demasiados intentos. Espera unos minutos antes de volver a intentarlo."],
  [/rate limit exceeded/i, "Demasiados intentos. Espera unos minutos antes de volver a intentarlo."],
  [
    /for security purposes,? you can only request this after (\d+) seconds?/i,
    "Por seguridad, espera $1 segundos antes de volver a intentarlo.",
  ],
  [
    /over_email_send_rate_limit/i,
    "Demasiados correos enviados. Espera unos minutos.",
  ],

  // Session / token
  [/session expired/i, "Tu sesión ha expirado. Inicia sesión de nuevo."],
  [/refresh token is not found/i, "Sesión no encontrada. Inicia sesión de nuevo."],
  [/invalid refresh token/i, "Sesión inválida. Inicia sesión de nuevo."],
  [/token expired/i, "Tu sesión ha expirado. Inicia sesión de nuevo."],

  // OAuth
  [/provider is not enabled/i, "Este método de inicio de sesión no está disponible"],
  [/oauth error/i, "Error al iniciar sesión con el proveedor externo"],

  // Network / generic
  [/network/i, "Error de conexión. Comprueba tu conexión a internet."],
  [/fetch failed/i, "Error de conexión. Comprueba tu conexión a internet."],
  [/timeout/i, "La operación ha tardado demasiado. Inténtalo de nuevo."],
];

// ─── Translator ─────────────────────────────────────────────────────

/**
 * Translate a Supabase auth error message to Spanish.
 * Falls back to the original message if no match is found.
 */
export function translateAuthError(message: string): string {
  for (const [pattern, translation] of AUTH_ERROR_MAP) {
    const match = pattern.exec(message);
    if (match) {
      // Replace $1, $2, etc. with captured groups
      return translation.replaceAll(/\$(\d+)/g, (_, index) => match[Number(index)] ?? "");
    }
  }
  return message;
}
