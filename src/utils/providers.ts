/**
 * Swappable providers for randomness and time.
 *
 * In production these use the native `Math.random()` and `Date`.
 * In tests, call `setRandomProvider` / `setClockProvider` to inject
 * deterministic implementations for reproducible assertions.
 *
 * @example
 * // In a test setup:
 * import { setRandomProvider, setClockProvider } from "@/utils/providers";
 * setRandomProvider(() => 0.5);
 * setClockProvider(() => "2025-01-01T00:00:00.000Z");
 */

// ─── Random ──────────────────────────────────────────────────────────

type RandomFn = () => number;

let _random: RandomFn = Math.random;

/** Returns a random number in [0, 1) via the current provider. */
export function random(): number {
  return _random();
}

/** Replace the RNG (e.g. with a seeded PRNG for tests). */
export function setRandomProvider(fn: RandomFn): void {
  _random = fn;
}

/** Reset the RNG to `Math.random`. */
export function resetRandomProvider(): void {
  _random = Math.random;
}

// ─── Clock ───────────────────────────────────────────────────────────

type ClockFn = () => string;

let _now: ClockFn = () => new Date().toISOString();

/** Returns the current ISO-8601 timestamp via the current provider. */
export function now(): string {
  return _now();
}

/** Replace the clock (e.g. with a fixed timestamp for tests). */
export function setClockProvider(fn: ClockFn): void {
  _now = fn;
}

/** Reset the clock to `new Date().toISOString()`. */
export function resetClockProvider(): void {
  _now = () => new Date().toISOString();
}
