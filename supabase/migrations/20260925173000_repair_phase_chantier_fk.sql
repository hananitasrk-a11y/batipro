-- Align phase relations with the live singular chantier table.
DO $$
BEGIN
  IF to_regclass('public.phases_chantier') IS NULL THEN
    CREATE TABLE public.phases_chantier (
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
  END IF;
END
$$;

ALTER TABLE public.phases_chantier
  ADD COLUMN IF NOT EXISTS chantier_id UUID,
  ADD COLUMN IF NOT EXISTS code TEXT,
  ADD COLUMN IF NOT EXISTS nom TEXT,
  ADD COLUMN IF NOT EXISTS date_debut DATE,
  ADD COLUMN IF NOT EXISTS date_fin_prevue DATE,
  ADD COLUMN IF NOT EXISTS date_fin_reelle DATE,
  ADD COLUMN IF NOT EXISTS avancement NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS budget NUMERIC,
  ADD COLUMN IF NOT EXISTS statut TEXT DEFAULT 'planifie',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.phases_chantier
  DROP CONSTRAINT IF EXISTS phases_chantier_chantier_id_fkey;

DO $$
BEGIN
  IF to_regclass('public.chantier') IS NOT NULL THEN
    ALTER TABLE public.phases_chantier
      ADD CONSTRAINT phases_chantier_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE CASCADE;
  END IF;
END
$$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.phases_chantier TO authenticated;
ALTER TABLE public.phases_chantier ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth read phases_chantier" ON public.phases_chantier;
CREATE POLICY "auth read phases_chantier"
  ON public.phases_chantier FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth write phases_chantier" ON public.phases_chantier;
CREATE POLICY "auth write phases_chantier"
  ON public.phases_chantier FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
