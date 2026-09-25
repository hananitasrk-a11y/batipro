-- Ensure the address field used by the production form exists.
ALTER TABLE public.chantier
  ADD COLUMN IF NOT EXISTS adresse TEXT;

NOTIFY pgrst, 'reload schema';
