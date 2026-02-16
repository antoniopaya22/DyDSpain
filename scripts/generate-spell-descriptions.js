/**
 * Script to parse docs/conjuros markdown files and generate
 * src/data/srd/spellDescriptions.ts with spell metadata and descriptions.
 *
 * Usage: node scripts/generate-spell-descriptions.js
 */

const fs = require("fs");
const path = require("path");

const CONJUROS_DIR = path.join(__dirname, "..", "docs", "conjuros");
const OUTPUT_FILE = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "srd",
  "spellDescriptions.ts"
);

function parseMdFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  let tiempo = "";
  let alcance = "";
  let componentes = "";
  let duracion = "";
  let descripcion = "";

  // Find the metadata lines (between first and second ---)
  let separatorCount = 0;
  let descStartIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "---") {
      separatorCount++;
      if (separatorCount === 2) {
        descStartIndex = i + 1;
      }
      continue;
    }

    // Parse metadata between the two separators
    if (separatorCount === 1) {
      const match = line.match(/^\-\s*\*\*(.+?):\*\*\s*(.+)$/);
      if (match) {
        const key = match[1].trim().toLowerCase();
        const value = match[2].trim();
        if (key.includes("tiempo")) tiempo = value;
        else if (key.includes("alcance")) alcance = value;
        else if (key.includes("componentes")) componentes = value;
        else if (key.includes("duración") || key.includes("duracion"))
          duracion = value;
      }
    }
  }

  // Extract description: everything after the second ---
  if (descStartIndex > 0) {
    const rawDesc = lines
      .slice(descStartIndex)
      .join("\n")
      .trim()
      // Remove markdown bold/italic markers
      .replace(/\*\*_|_\*\*/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "");

    // Join lines within each paragraph (single newlines become spaces),
    // but keep paragraph breaks (double newlines become single newlines).
    descripcion = rawDesc
      .split(/\n{2,}/)
      .map((para) => para.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
      .filter((p) => p.length > 0)
      .join("\n");
  }

  return { tiempo, alcance, componentes, duracion, descripcion };
}

function main() {
  const spellMap = {};
  const levelDirs = fs.readdirSync(CONJUROS_DIR).sort();

  for (const dir of levelDirs) {
    const dirPath = path.join(CONJUROS_DIR, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const id = file.replace(".md", "");
      const filePath = path.join(dirPath, file);
      const parsed = parseMdFile(filePath);
      spellMap[id] = parsed;
    }
  }

  // Sort by ID for deterministic output
  const sortedIds = Object.keys(spellMap).sort();

  // Generate TypeScript
  let ts = `/**
 * Descripciones y metadatos de conjuros extraídos de docs/conjuros.
 * Generado automáticamente por scripts/generate-spell-descriptions.js
 * NO EDITAR MANUALMENTE.
 */

export interface SpellDescription {
  /** Tiempo de lanzamiento */
  tiempo: string;
  /** Alcance */
  alcance: string;
  /** Componentes */
  componentes: string;
  /** Duración */
  duracion: string;
  /** Descripción del efecto */
  descripcion: string;
}

const SPELL_DESCRIPTIONS: Record<string, SpellDescription> = {\n`;

  for (const id of sortedIds) {
    const s = spellMap[id];
    const esc = (str) =>
      str
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n");

    ts += `  "${id}": {\n`;
    ts += `    tiempo: "${esc(s.tiempo)}",\n`;
    ts += `    alcance: "${esc(s.alcance)}",\n`;
    ts += `    componentes: "${esc(s.componentes)}",\n`;
    ts += `    duracion: "${esc(s.duracion)}",\n`;
    ts += `    descripcion: "${esc(s.descripcion)}",\n`;
    ts += `  },\n`;
  }

  ts += `};\n\n`;
  ts += `/**\n * Obtiene la descripción completa de un conjuro por su ID.\n */\n`;
  ts += `export function getSpellDescription(id: string): SpellDescription | undefined {\n`;
  ts += `  return SPELL_DESCRIPTIONS[id];\n`;
  ts += `}\n`;

  fs.writeFileSync(OUTPUT_FILE, ts, "utf-8");
  console.log(
    `Generated ${OUTPUT_FILE} with ${sortedIds.length} spell descriptions.`
  );
}

main();
