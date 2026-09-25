ALTER TABLE public.chantier
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();

UPDATE public.chantier
SET id = gen_random_uuid()
WHERE id IS NULL;

ALTER TABLE public.chantier
ALTER COLUMN id SET NOT NULL;

ALTER TABLE public.chantier
ADD CONSTRAINT chantier_pkey PRIMARY KEY (id);

NOTIFY pgrst, 'reload schema';
