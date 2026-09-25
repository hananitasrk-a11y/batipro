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
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();

UPDATE public.chantier
SET id = gen_random_uuid()
WHERE id IS NULL;

ALTER TABLE public.chantier
ALTER COLUMN id SET NOT NULL;

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
ALTER TABLE public.chantier ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth read chantier" ON public.chantier;
CREATE POLICY "auth read chantier"
	ON public.chantier FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth write chantier" ON public.chantier;
CREATE POLICY "auth write chantier"
	ON public.chantier FOR ALL TO authenticated
	USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
