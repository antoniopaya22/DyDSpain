/**
 * Unit conversion utilities for D&D measurements.
 * Extracted from settingsStore for separation of concerns.
 */

import type { UnitSystem } from "@/stores/settingsStore";

/**
 * Convierte pies a la unidad configurada.
 * Si el sistema es métrico, convierte a metros.
 * Si es imperial, devuelve pies tal cual.
 */
export function convertirDistancia(pies: number, unidades: UnitSystem): { valor: number; unidad: string } {
  if (unidades === "metrico") {
    // Conversión estándar D&D: 5 pies = 1.5 m
    const metros = (pies / 5) * 1.5;
    return { valor: Number.parseFloat(metros.toFixed(1)), unidad: "m" };
  }
  return { valor: pies, unidad: "pies" };
}

/**
 * Convierte libras a la unidad configurada.
 * Si el sistema es métrico, convierte a kg.
 * Si es imperial, devuelve libras tal cual.
 */
export function convertirPeso(libras: number, unidades: UnitSystem): { valor: number; unidad: string } {
  if (unidades === "metrico") {
    const kg = libras * 0.45;
    return { valor: Number.parseFloat(kg.toFixed(1)), unidad: "kg" };
  }
  return { valor: libras, unidad: "lb" };
}
