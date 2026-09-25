-- Repair the purchase request table for databases where the original migration was skipped.
-- The live project uses public.chantier (singular).
CREATE TABLE IF NOT EXISTS public.demandes_devis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT,
  date_demande DATE DEFAULT CURRENT_DATE,
  fournisseur_id UUID REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
  chantier_id UUID REFERENCES public.chantier(id) ON DELETE SET NULL,
  objet TEXT,
  montant_estime NUMERIC,
  statut TEXT DEFAULT 'brouillon',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.demandes_devis TO authenticated;
ALTER TABLE public.demandes_devis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth read demandes_devis" ON public.demandes_devis;
CREATE POLICY "auth read demandes_devis"
  ON public.demandes_devis FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth write demandes_devis" ON public.demandes_devis;
CREATE POLICY "auth write demandes_devis"
  ON public.demandes_devis FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
