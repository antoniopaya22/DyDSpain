-- ============================================================
-- DyMEs — Character Codes for Sharing (personaje-level)
-- ============================================================
-- Adds a unique short code to each personaje so players can
-- share a specific character (not just their user) with the
-- master. The master enters this code to add the player AND
-- their character to the campaign in one step.
-- ============================================================

-- ─── 1. Helper: generate a unique 8-char character code ─────

CREATE OR REPLACE FUNCTION generate_character_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- No 0/O, 1/I/l
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ─── 2. Add column with default ─────────────────────────────

ALTER TABLE public.personajes
  ADD COLUMN IF NOT EXISTS codigo_personaje TEXT DEFAULT generate_character_code();

-- Back-fill existing rows
UPDATE public.personajes
SET codigo_personaje = generate_character_code()
WHERE codigo_personaje IS NULL;

-- Make NOT NULL + UNIQUE after back-fill
ALTER TABLE public.personajes
  ALTER COLUMN codigo_personaje SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_personajes_codigo
  ON public.personajes(codigo_personaje);

-- ─── 3. RLS: allow anyone to look up a personaje by code ────
-- (The master needs to find the character when entering the code)

CREATE POLICY "Anyone can search personajes by code"
  ON public.personajes FOR SELECT
  USING (true);
