-- ============================================================
-- DyMEs — Supabase Schema Migration
-- Master Mode (HU-10) + Data Sync (HU-10.9)
-- ============================================================
-- Run this migration against your Supabase project via the
-- SQL editor or `supabase db push`.
-- ============================================================

-- ─── Extension for generating short player codes ─────────────
-- (pgcrypto is already enabled by default in Supabase)

-- ─── Helper: generate a unique 6-char player code ───────────
CREATE OR REPLACE FUNCTION generate_player_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- No 0/O, 1/I/l
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ─── Profiles ────────────────────────────────────────────────
-- One row per auth.users entry. Created automatically via trigger.

CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre        TEXT NOT NULL DEFAULT '',
  avatar_url    TEXT,
  codigo_jugador TEXT NOT NULL UNIQUE DEFAULT generate_player_code(),
  es_premium    BOOLEAN NOT NULL DEFAULT FALSE,
  modo_actual   TEXT NOT NULL DEFAULT 'jugador' CHECK (modo_actual IN ('jugador', 'master')),
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast player-code lookups
CREATE INDEX IF NOT EXISTS idx_profiles_codigo ON public.profiles(codigo_jugador);

-- Auto-create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Personajes sincronizados ────────────────────────────────
-- Stores the full character JSON for real-time sharing.

CREATE TABLE IF NOT EXISTS public.personajes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  datos          JSONB NOT NULL DEFAULT '{}',
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_personajes_usuario ON public.personajes(usuario_id);

-- ─── Campañas del Master ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.campanas_master (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nombre         TEXT NOT NULL,
  descripcion    TEXT,
  imagen         TEXT,
  creado_en      TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campanas_master ON public.campanas_master(master_id);

-- ─── Relación campaña ↔ jugador ──────────────────────────────

CREATE TABLE IF NOT EXISTS public.campana_jugadores (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campana_id    UUID NOT NULL REFERENCES public.campanas_master(id) ON DELETE CASCADE,
  jugador_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  personaje_id  UUID REFERENCES public.personajes(id) ON DELETE SET NULL,
  unido_en      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(campana_id, jugador_id)
);

CREATE INDEX IF NOT EXISTS idx_campana_jugadores_campana ON public.campana_jugadores(campana_id);
CREATE INDEX IF NOT EXISTS idx_campana_jugadores_jugador ON public.campana_jugadores(jugador_id);

-- ─── Campañas locales sincronizadas ──────────────────────────
-- Mirrors the local campaign store to Supabase for backup.

CREATE TABLE IF NOT EXISTS public.campanas_jugador (
  id             UUID PRIMARY KEY,
  usuario_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nombre         TEXT NOT NULL,
  descripcion    TEXT,
  imagen         TEXT,
  personaje_id   UUID,
  creado_en      TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campanas_jugador_usuario ON public.campanas_jugador(usuario_id);

-- ─── Updated-at triggers ─────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_personajes_updated
  BEFORE UPDATE ON public.personajes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_campanas_master_updated
  BEFORE UPDATE ON public.campanas_master
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_campanas_jugador_updated
  BEFORE UPDATE ON public.campanas_jugador
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═════════════════════════════════════════════════════════════
-- Helper functions (SECURITY DEFINER — bypass RLS to avoid
-- infinite recursion between campanas_master ↔ campana_jugadores)
-- ═════════════════════════════════════════════════════════════

-- Returns TRUE when the current user is the master of the given campaign.
-- Used by campana_jugadores RLS without triggering campanas_master RLS.
CREATE OR REPLACE FUNCTION public.is_campaign_master(campaign_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.campanas_master
    WHERE id = campaign_id AND master_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Returns TRUE when the current user is a player in the given campaign.
-- Used by campanas_master RLS without triggering campana_jugadores RLS.
CREATE OR REPLACE FUNCTION public.is_campaign_player(campaign_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.campana_jugadores
    WHERE campana_id = campaign_id AND jugador_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Returns TRUE when the current user is the master of the campaign that
-- owns the given personaje (via campana_jugadores). Used by personajes RLS.
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

-- ═════════════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- ═════════════════════════════════════════════════════════════

-- ── Profiles ──
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Anyone can look up a profile by codigo_jugador (for adding to campaigns)
CREATE POLICY "Anyone can search profiles by code"
  ON public.profiles FOR SELECT
  USING (true);

-- ── Personajes ──
ALTER TABLE public.personajes ENABLE ROW LEVEL SECURITY;

-- Owner can do everything
CREATE POLICY "Owner full access to personajes"
  ON public.personajes FOR ALL
  USING (auth.uid() = usuario_id);

-- Master can read characters linked to their campaigns
-- Uses SECURITY DEFINER helper to avoid cross-table RLS recursion.
CREATE POLICY "Master can read linked personajes"
  ON public.personajes FOR SELECT
  USING (public.is_master_of_personaje(id));

-- ── Campañas Master ──
ALTER TABLE public.campanas_master ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master full access to own campaigns"
  ON public.campanas_master FOR ALL
  USING (auth.uid() = master_id);

-- Players can read campaigns they belong to.
-- Uses SECURITY DEFINER helper to avoid recursion with campana_jugadores.
CREATE POLICY "Players can read joined campaigns"
  ON public.campanas_master FOR SELECT
  USING (public.is_campaign_player(id));

-- ── Campaña-Jugadores ──
ALTER TABLE public.campana_jugadores ENABLE ROW LEVEL SECURITY;

-- Master can manage players in their campaigns.
-- Uses SECURITY DEFINER helper to avoid recursion with campanas_master.
CREATE POLICY "Master manages campaign players"
  ON public.campana_jugadores FOR ALL
  USING (public.is_campaign_master(campana_id));

-- Players can read and update their own membership
CREATE POLICY "Players can read own membership"
  ON public.campana_jugadores FOR SELECT
  USING (auth.uid() = jugador_id);

CREATE POLICY "Players can update own membership"
  ON public.campana_jugadores FOR UPDATE
  USING (auth.uid() = jugador_id);

-- ── Campañas Jugador (local sync) ──
ALTER TABLE public.campanas_jugador ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner full access to campanas_jugador"
  ON public.campanas_jugador FOR ALL
  USING (auth.uid() = usuario_id);

-- ═════════════════════════════════════════════════════════════
-- Enable Realtime on tables that need live updates
-- ═════════════════════════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE public.personajes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campana_jugadores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campanas_master;
