/**
 * date.ts - Date utility functions
 *
 * Extracted from NotesTab.tsx for reuse across the app.
 */

/** Format an ISO date string to a localized Spanish date/time string. */
export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}
