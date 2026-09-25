-- Repair migration for databases where the production phases migration was skipped.
-- The live app schema exposes public.chantier (singular); do not recreate the legacy public.chantiers table.
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

CREATE TABLE IF NOT EXISTS public.phases_chantier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chantier_id UUID,
  code TEXT,
  nom TEXT NOT NULL,
  date_debut DATE,
  date_fin_prevue DATE,
  date_fin_reelle DATE,
  avancement NUMERIC DEFAULT 0,
  budget NUMERIC,
  statut TEXT DEFAULT 'planifie',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF to_regclass('public.chantier') IS NOT NULL THEN
    ALTER TABLE public.phases_chantier
      DROP CONSTRAINT IF EXISTS phases_chantier_chantier_id_fkey;

    ALTER TABLE public.phases_chantier
      ADD CONSTRAINT phases_chantier_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE CASCADE;
  END IF;
END
$$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.phases_chantier TO authenticated;
GRANT ALL ON public.phases_chantier TO service_role;

ALTER TABLE public.phases_chantier ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'phases_chantier'
      AND policyname = 'auth read phases_chantier'
  ) THEN
    CREATE POLICY "auth read phases_chantier"
      ON public.phases_chantier FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'phases_chantier'
      AND policyname = 'auth write phases_chantier'
  ) THEN
    CREATE POLICY "auth write phases_chantier"
      ON public.phases_chantier FOR ALL TO authenticated
      USING (true) WITH CHECK (true);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_phases_chantier_chantier_id
  ON public.phases_chantier(chantier_id);

DO $$
BEGIN
  IF to_regprocedure('public.set_updated_at()') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_trigger
       WHERE tgname = 'trg_phases_chantier_updated'
         AND tgrelid = 'public.phases_chantier'::regclass
     ) THEN
    CREATE TRIGGER trg_phases_chantier_updated
      BEFORE UPDATE ON public.phases_chantier
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END
$$;

NOTIFY pgrst, 'reload schema';
