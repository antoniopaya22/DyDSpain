/**
 * D20 Geometry — Shared icosahedron face calculation
 *
 * Generates the visible triangular faces of a D20 viewed from
 * slightly above center, inscribed in a circle of the given radius.
 * Used by D20Icon and DndLogo with different shade/ratio tuning.
 */

// ─── Types ───────────────────────────────────────────────────────────

export interface Point {
  x: number;
  y: number;
}

export interface D20Face {
  points: Point[];
  shade: number;
}

export interface D20Geometry {
  outerPoints: Point[];
  innerPoints: Point[];
  outerFaces: D20Face[];
  innerFaces: D20Face[];
  centerFace: Point[];
}

export interface D20GeometryOptions {
  /** Ratio of inner ring radius to outer (default: 0.58) */
  innerRadiusRatio?: number;
  /** Shade values for the 5 outer faces [top, topRight, bottomRight, bottomLeft, topLeft] */
  outerShades?: [number, number, number, number, number];
  /** Shade values for the 5 inner faces */
  innerShades?: [number, number, number, number, number];
}

// ─── Default shade values (D20Icon configuration) ────────────────────

const DEFAULT_OUTER_SHADES: [number, number, number, number, number] = [
  0.85, 0.7, 0.5, 0.55, 0.75,
];
const DEFAULT_INNER_SHADES: [number, number, number, number, number] = [
  0.6, 0.45, 0.35, 0.4, 0.55,
];

// ─── Geometry generation ─────────────────────────────────────────────

/**
 * Computes the visible faces of a D20 viewed from slightly above center.
 *
 * @param cx - Center X coordinate
 * @param cy - Center Y coordinate
 * @param radius - Outer radius of the die
 * @param options - Optional tuning for inner radius ratio and shade values
 */
export function getD20Geometry(
  cx: number,
  cy: number,
  radius: number,
  options?: D20GeometryOptions,
): D20Geometry {
  const r = radius;
  const r2 = r * (options?.innerRadiusRatio ?? 0.58);
  const outerShades = options?.outerShades ?? DEFAULT_OUTER_SHADES;
  const innerShades = options?.innerShades ?? DEFAULT_INNER_SHADES;

  // Outer vertices (pentagon shape for the outer rim)
  const outerPoints: Point[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    outerPoints.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });
  }

  // Inner vertices (rotated pentagon, smaller)
  const innerPoints: Point[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2 + Math.PI / 5;
    innerPoints.push({
      x: cx + r2 * Math.cos(angle),
      y: cy + r2 * Math.sin(angle),
    });
  }

  // Outer triangles: each connects two adjacent outer vertices and one inner vertex
  const outerFaces: D20Face[] = [];
  for (let i = 0; i < 5; i++) {
    const next = (i + 1) % 5;
    outerFaces.push({
      points: [outerPoints[i], outerPoints[next], innerPoints[i]],
      shade: outerShades[i],
    });
  }

  // Inner triangles: each connects two adjacent inner vertices and one outer vertex
  const innerFaces: D20Face[] = [];
  for (let i = 0; i < 5; i++) {
    const next = (i + 1) % 5;
    innerFaces.push({
      points: [innerPoints[i], innerPoints[next], outerPoints[next]],
      shade: innerShades[i],
    });
  }

  return {
    outerPoints,
    innerPoints,
    outerFaces,
    innerFaces,
    centerFace: innerPoints,
  };
}

/**
 * Converts an array of points to an SVG polygon points string.
 */
export function pointsToString(points: Point[]): string {
  return points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
}
