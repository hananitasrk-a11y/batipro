-- Repair migration for projects where the production migration was not applied.
CREATE TABLE IF NOT EXISTS public.chantiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT,
  nom TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  adresse TEXT,
  ville TEXT,
  date_debut DATE,
  date_fin_prevue DATE,
  date_fin_reelle DATE,
  statut TEXT DEFAULT 'en_cours',
  montant_marche NUMERIC,
  avancement NUMERIC DEFAULT 0,
  chef_chantier TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chantiers TO authenticated;
GRANT ALL ON public.chantiers TO service_role;

ALTER TABLE public.chantiers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'chantiers'
      AND policyname = 'auth read chantiers'
  ) THEN
    CREATE POLICY "auth read chantiers"
      ON public.chantiers FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'chantiers'
      AND policyname = 'auth write chantiers'
  ) THEN
    CREATE POLICY "auth write chantiers"
      ON public.chantiers FOR ALL TO authenticated
      USING (true) WITH CHECK (true);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_chantiers_statut ON public.chantiers(statut);
CREATE INDEX IF NOT EXISTS idx_chantiers_client_id ON public.chantiers(client_id);
