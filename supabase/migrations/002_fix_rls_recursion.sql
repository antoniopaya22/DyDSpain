-- ============================================================
-- DyMEs — Fix infinite RLS recursion (42P17)
-- ============================================================
-- The original policies on campanas_master and campana_jugadores
-- referenced each other via sub-selects, causing PostgreSQL
-- error 42P17 "infinite recursion detected in policy for
-- relation campanas_master".
--
-- This migration:
--   1. Creates SECURITY DEFINER helper functions that bypass RLS.
--   2. Drops the old circular policies.
--   3. Recreates them using the helpers.
-- ============================================================

-- ─── 1. SECURITY DEFINER helpers ─────────────────────────────

CREATE OR REPLACE FUNCTION public.is_campaign_master(campaign_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.campanas_master
    WHERE id = campaign_id AND master_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_campaign_player(campaign_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.campana_jugadores
    WHERE campana_id = campaign_id AND jugador_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_master_of_personaje(p_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campana_jugadores cj
    JOIN public.campanas_master cm ON cm.id = cj.campana_id
    WHERE cj.personaje_id = p_id
      AND cm.master_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── 2. Drop old circular policies ──────────────────────────

DROP POLICY IF EXISTS "Players can read joined campaigns"  ON public.campanas_master;
DROP POLICY IF EXISTS "Master manages campaign players"    ON public.campana_jugadores;
DROP POLICY IF EXISTS "Master can read linked personajes"  ON public.personajes;

-- ─── 3. Recreate with helper functions ──────────────────────

CREATE POLICY "Players can read joined campaigns"
  ON public.campanas_master FOR SELECT
  USING (public.is_campaign_player(id));

CREATE POLICY "Master manages campaign players"
  ON public.campana_jugadores FOR ALL
  USING (public.is_campaign_master(campana_id));

CREATE POLICY "Master can read linked personajes"
  ON public.personajes FOR SELECT
  USING (public.is_master_of_personaje(id));
