-- Repair the Taches & planning table for the live singular chantier schema.
DO $$
BEGIN
  IF to_regclass('public.taches_chantier') IS NULL THEN
    CREATE TABLE public.taches_chantier (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      chantier_id UUID,
      phase_id UUID,
      libelle TEXT NOT NULL,
      responsable TEXT,
      date_debut DATE,
      date_fin_prevue DATE,
      date_fin_reelle DATE,
      avancement NUMERIC DEFAULT 0,
      statut TEXT DEFAULT 'a_faire',
      priorite TEXT DEFAULT 'normale',
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  END IF;
END
$$;

ALTER TABLE public.taches_chantier
  ADD COLUMN IF NOT EXISTS chantier_id UUID,
  ADD COLUMN IF NOT EXISTS phase_id UUID,
  ADD COLUMN IF NOT EXISTS libelle TEXT,
  ADD COLUMN IF NOT EXISTS responsable TEXT,
  ADD COLUMN IF NOT EXISTS date_debut DATE,
  ADD COLUMN IF NOT EXISTS date_fin_prevue DATE,
  ADD COLUMN IF NOT EXISTS date_fin_reelle DATE,
  ADD COLUMN IF NOT EXISTS avancement NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS statut TEXT DEFAULT 'a_faire',
  ADD COLUMN IF NOT EXISTS priorite TEXT DEFAULT 'normale',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.taches_chantier
  DROP CONSTRAINT IF EXISTS taches_chantier_chantier_id_fkey,
  DROP CONSTRAINT IF EXISTS taches_chantier_phase_id_fkey;

DO $$
BEGIN
  IF to_regclass('public.chantier') IS NOT NULL THEN
    ALTER TABLE public.taches_chantier
      ADD CONSTRAINT taches_chantier_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE CASCADE;
  END IF;
  IF to_regclass('public.phases_chantier') IS NOT NULL THEN
    ALTER TABLE public.taches_chantier
      ADD CONSTRAINT taches_chantier_phase_id_fkey
      FOREIGN KEY (phase_id) REFERENCES public.phases_chantier(id) ON DELETE SET NULL;
  END IF;
END
$$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.taches_chantier TO authenticated;
ALTER TABLE public.taches_chantier ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth read taches_chantier" ON public.taches_chantier;
CREATE POLICY "auth read taches_chantier"
  ON public.taches_chantier FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth write taches_chantier" ON public.taches_chantier;
CREATE POLICY "auth write taches_chantier"
  ON public.taches_chantier FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
