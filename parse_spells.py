#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para extraer conjuros del manual de D&D y crear archivos individuales.
"""

import re
import os
import unicodedata

MANUAL_PATH = r"docs\manual.md"
OUTPUT_BASE = r"docs\conjuros"

def slugify(text):
    """Convert text to a filesystem-friendly name."""
    text = text.lower().strip()
    # Replace / with _
    text = text.replace("/", "_")
    # Normalize unicode
    text = unicodedata.normalize('NFD', text)
    text = text.encode('ascii', 'ignore').decode('ascii')
    # Replace spaces and special chars with underscores
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s-]+', '_', text)
    text = text.strip('_')
    return text

def parse_spell_level(school_line):
    """
    Parse the school/level line to determine the spell level.
    Examples:
      'Evocación (truco)' -> 0
      'Transmutación nivel 2' -> 2
      'Abjuración nivel 1 (ritual)' -> 1
      'Adivinación nivel 4 (ritual)' -> 4
    """
    school_line = school_line.strip().strip('_')
    
    if '(truco)' in school_line.lower() or 'truco' in school_line.lower():
        return 0
    
    match = re.search(r'nivel\s+(\d+)', school_line.lower())
    if match:
        return int(match.group(1))
    
    return None

def extract_spells(manual_path):
    """Extract all spells from the manual."""
    with open(manual_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    # Find the start of spell descriptions
    start_idx = None
    end_idx = None
    for i, line in enumerate(lines):
        if line.strip() == '### Descripciones de conjuros':
            start_idx = i + 1
        if start_idx and line.strip() == '### Trampas':
            end_idx = i
            break
    
    if not start_idx or not end_idx:
        print(f"Could not find spell section boundaries. start={start_idx}, end={end_idx}")
        return []
    
    spell_lines = lines[start_idx:end_idx]
    
    # These are subsections of spells, not actual spells
    NOT_SPELLS = {
        'Perfil de un objeto animado',
        'Precipitaciones',
        'Temperatura',
        'Viento',
    }
    
    # Find all spell headers (##### SpellName)
    spells = []
    current_spell_start = None
    current_spell_name = None
    
    for i, line in enumerate(spell_lines):
        # Match ##### SpellName (level 5 heading)
        match = re.match(r'^#{5}\s+(.+)$', line.strip())
        if match:
            header_name = match.group(1).strip()
            
            # Skip known subsections (they belong to the parent spell)
            if header_name in NOT_SPELLS:
                continue
            
            # Save previous spell
            if current_spell_name is not None:
                spell_content = spell_lines[current_spell_start:i]
                spells.append((current_spell_name, spell_content))
            
            current_spell_name = header_name
            current_spell_start = i
    
    # Don't forget the last spell
    if current_spell_name is not None:
        spell_content = spell_lines[current_spell_start:]
        spells.append((current_spell_name, spell_content))
    
    return spells

def parse_spell(name, raw_lines):
    """Parse a spell's raw lines into structured data."""
    # Clean up: remove empty lines at start/end, remove "Prohibida la reventa" lines
    cleaned = []
    for line in raw_lines:
        if 'Prohibida la reventa' in line:
            continue
        if 'Tienes permiso para imprimir' in line:
            continue
        cleaned.append(line)
    
    # Remove the header line itself (##### Name)
    content_lines = []
    header_found = False
    for line in cleaned:
        if not header_found and re.match(r'^#{5}\s+', line.strip()):
            header_found = True
            continue
        content_lines.append(line)
    
    # Remove triple backtick code fences that wrap some entries
    final_lines = []
    for line in content_lines:
        if line.strip() == '```':
            continue
        final_lines.append(line)
    
    # Now parse the spell info
    text = '\n'.join(final_lines)
    
    # Try to find the school/level line
    # It could be italic (_School nivel X_) or plain (School nivel X) or (School (truco))
    level = None
    school = None
    ritual = False
    
    # Pattern 1: _School nivel X_ or _School nivel X (ritual)_
    # Pattern 2: School nivel X or School (truco)
    for line in final_lines:
        stripped = line.strip().strip('_')
        if not stripped:
            continue
        
        # Check if this is a school/level line
        if re.search(r'nivel\s+\d+', stripped.lower()) or '(truco)' in stripped.lower() or 'truco' in stripped.lower():
            # Check it looks like a school line (starts with a known school)
            schools = ['Abjuración', 'Conjuración', 'Adivinación', 'Encantamiento', 
                       'Evocación', 'Ilusión', 'Nigromancia', 'Transmutación']
            for s in schools:
                if stripped.lower().startswith(s.lower()):
                    school = s
                    break
            
            if school or re.match(r'^[A-Z]\w+\s+(nivel|\(truco)', stripped):
                level = parse_spell_level(stripped)
                if 'ritual' in stripped.lower():
                    ritual = True
                # Extract school if not found yet
                if not school:
                    school_match = re.match(r'^(\w+)', stripped)
                    if school_match:
                        school = school_match.group(1)
                break
    
    # Extract specific fields
    tiempo = extract_field(final_lines, r'\*?\*?Tiempo de lanzamiento:?\*?\*?\s*(.*)')
    alcance = extract_field(final_lines, r'\*?\*?Alcance:?\*?\*?\s*(.*)')
    componentes = extract_field(final_lines, r'\*?\*?Componentes?:?\*?\*?\s*(.*)')
    duracion = extract_field(final_lines, r'\*?\*?Duración:?\*?\*?\s*(.*)')
    
    # Get description (everything after the metadata fields)
    desc_start = 0
    for i, line in enumerate(final_lines):
        if re.search(r'Duración', line):
            desc_start = i + 1
            break
    
    description_lines = final_lines[desc_start:]
    # Clean leading/trailing empty lines
    while description_lines and not description_lines[0].strip():
        description_lines.pop(0)
    while description_lines and not description_lines[-1].strip():
        description_lines.pop()
    
    description = '\n'.join(description_lines)
    
    return {
        'name': name,
        'level': level,
        'school': school,
        'ritual': ritual,
        'tiempo': tiempo,
        'alcance': alcance,
        'componentes': componentes,
        'duracion': duracion,
        'description': description
    }

def extract_field(lines, pattern):
    """Extract a field value from lines using a regex pattern."""
    for line in lines:
        match = re.search(pattern, line.strip())
        if match:
            return match.group(1).strip().rstrip('*')
    return None

def level_folder_name(level):
    """Get the folder name for a spell level."""
    if level == 0:
        return "nivel_0_trucos"
    else:
        return f"nivel_{level}"

def create_spell_file(spell_data, base_path):
    """Create a markdown file for a spell."""
    level = spell_data['level']
    if level is None:
        level = 0  # Default if we couldn't parse
        print(f"  WARNING: Could not determine level for '{spell_data['name']}', defaulting to 0")
    
    folder = os.path.join(base_path, level_folder_name(level))
    os.makedirs(folder, exist_ok=True)
    
    filename = slugify(spell_data['name']) + '.md'
    filepath = os.path.join(folder, filename)
    
    # Build the markdown content
    level_text = "Truco (nivel 0)" if level == 0 else f"Nivel {level}"
    ritual_text = " (ritual)" if spell_data['ritual'] else ""
    school_text = spell_data['school'] or "Desconocida"
    
    content = f"# {spell_data['name']}\n\n"
    content += f"**{school_text} — {level_text}{ritual_text}**\n\n"
    content += "---\n\n"
    
    if spell_data['tiempo']:
        content += f"- **Tiempo de lanzamiento:** {spell_data['tiempo']}\n"
    if spell_data['alcance']:
        content += f"- **Alcance:** {spell_data['alcance']}\n"
    if spell_data['componentes']:
        content += f"- **Componentes:** {spell_data['componentes']}\n"
    if spell_data['duracion']:
        content += f"- **Duración:** {spell_data['duracion']}\n"
    
    content += "\n---\n\n"
    content += spell_data['description'] + "\n"
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return filepath

def main():
    print("Extrayendo conjuros del manual...")
    spells_raw = extract_spells(MANUAL_PATH)
    print(f"Se encontraron {len(spells_raw)} conjuros.")
    
    # Parse each spell
    spells = []
    for name, raw_lines in spells_raw:
        spell_data = parse_spell(name, raw_lines)
        spells.append(spell_data)
    
    # Count by level
    level_counts = {}
    for s in spells:
        lvl = s['level'] if s['level'] is not None else -1
        level_counts[lvl] = level_counts.get(lvl, 0) + 1
    
    print("\nConjuros por nivel:")
    for lvl in sorted(level_counts.keys()):
        label = f"Nivel {lvl}" if lvl >= 0 else "Sin nivel"
        if lvl == 0:
            label = "Trucos (nivel 0)"
        print(f"  {label}: {level_counts[lvl]}")
    
    # Create files
    print(f"\nCreando archivos en {OUTPUT_BASE}...")
    for spell_data in spells:
        filepath = create_spell_file(spell_data, OUTPUT_BASE)
        print(f"  Creado: {filepath}")
    
    print(f"\n¡Listo! Se crearon {len(spells)} archivos de conjuros.")

if __name__ == '__main__':
    main()
