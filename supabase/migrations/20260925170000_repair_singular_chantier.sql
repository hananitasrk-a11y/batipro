-- Repair the live singular chantier table used by the application.
-- The project migrations historically created chantiers, but this database exposes chantier.
DO $$
BEGIN
  IF to_regclass('public.chantiers') IS NOT NULL
     AND to_regclass('public.chantier') IS NULL THEN
    ALTER TABLE public.chantiers RENAME TO chantier;
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.chantier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT,
  nom TEXT NOT NULL,
  client_id UUID,
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

ALTER TABLE public.chantier
  ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS code TEXT,
  ADD COLUMN IF NOT EXISTS nom TEXT,
  ADD COLUMN IF NOT EXISTS client_id UUID,
  ADD COLUMN IF NOT EXISTS adresse TEXT,
  ADD COLUMN IF NOT EXISTS ville TEXT,
  ADD COLUMN IF NOT EXISTS date_debut DATE,
  ADD COLUMN IF NOT EXISTS date_fin_prevue DATE,
  ADD COLUMN IF NOT EXISTS date_fin_reelle DATE,
  ADD COLUMN IF NOT EXISTS statut TEXT DEFAULT 'en_cours',
  ADD COLUMN IF NOT EXISTS montant_marche NUMERIC,
  ADD COLUMN IF NOT EXISTS avancement NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS chef_chantier TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

UPDATE public.chantier SET id = gen_random_uuid() WHERE id IS NULL;
UPDATE public.chantier SET created_at = now() WHERE created_at IS NULL;
UPDATE public.chantier SET updated_at = now() WHERE updated_at IS NULL;

ALTER TABLE public.chantier
  ALTER COLUMN id SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.chantier'::regclass
      AND contype = 'p'
  ) THEN
    ALTER TABLE public.chantier ADD CONSTRAINT chantier_pkey PRIMARY KEY (id);
  END IF;
END
$$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chantier TO authenticated;

NOTIFY pgrst, 'reload schema';

ALTER TABLE public.chantier ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'chantier'
      AND policyname = 'auth read chantier'
  ) THEN
    CREATE POLICY "auth read chantier"
      ON public.chantier FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'chantier'
      AND policyname = 'auth write chantier'
  ) THEN
    CREATE POLICY "auth write chantier"
      ON public.chantier FOR ALL TO authenticated
      USING (true) WITH CHECK (true);
  END IF;
END
$$;
