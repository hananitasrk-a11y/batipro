
-- SOUS-TRAITANTS
CREATE TABLE public.sous_traitants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text,
  raison_sociale text NOT NULL,
  specialite text,
  contact text,
  telephone text,
  email text,
  adresse text,
  ice text,
  rib text,
  notes text,
  actif boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sous_traitants TO authenticated;
GRANT ALL ON public.sous_traitants TO service_role;
ALTER TABLE public.sous_traitants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sous_traitants_read_auth" ON public.sous_traitants FOR SELECT TO authenticated USING (true);
CREATE POLICY "sous_traitants_write_priv" ON public.sous_traitants FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','chef_chantier','comptable']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','chef_chantier','comptable']));
CREATE TRIGGER trg_sous_traitants_upd BEFORE UPDATE ON public.sous_traitants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CONTRATS SOUS-TRAITANCE
CREATE TABLE public.contrats_sous_traitance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text,
  sous_traitant_id uuid REFERENCES public.sous_traitants(id) ON DELETE SET NULL,
  chantier_id uuid REFERENCES public.chantiers(id) ON DELETE SET NULL,
  phase_id uuid REFERENCES public.phases_chantier(id) ON DELETE SET NULL,
  objet text,
  date_debut date,
  date_fin date,
  montant_ht numeric(14,2) DEFAULT 0,
  tva numeric(14,2) DEFAULT 0,
  montant_ttc numeric(14,2) DEFAULT 0,
  avancement numeric(5,2) DEFAULT 0,
  statut text DEFAULT 'en_cours',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contrats_sous_traitance TO authenticated;
GRANT ALL ON public.contrats_sous_traitance TO service_role;
ALTER TABLE public.contrats_sous_traitance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cst_read_auth" ON public.contrats_sous_traitance FOR SELECT TO authenticated USING (true);
CREATE POLICY "cst_write_priv" ON public.contrats_sous_traitance FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','chef_chantier','comptable']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','chef_chantier','comptable']));
CREATE TRIGGER trg_cst_upd BEFORE UPDATE ON public.contrats_sous_traitance
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- LOCATIONS MATÉRIEL
CREATE TABLE public.locations_materiel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text,
  fournisseur_id uuid REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
  type_materiel text,
  designation text NOT NULL,
  chantier_id uuid REFERENCES public.chantiers(id) ON DELETE SET NULL,
  date_debut date,
  date_fin date,
  tarif numeric(14,2) DEFAULT 0,
  unite_tarif text,
  quantite numeric(14,2) DEFAULT 1,
  montant_total numeric(14,2) DEFAULT 0,
  statut text DEFAULT 'en_cours',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locations_materiel TO authenticated;
GRANT ALL ON public.locations_materiel TO service_role;
ALTER TABLE public.locations_materiel ENABLE ROW LEVEL SECURITY;
CREATE POLICY "loc_mat_read_auth" ON public.locations_materiel FOR SELECT TO authenticated USING (true);
CREATE POLICY "loc_mat_write_priv" ON public.locations_materiel FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','chef_chantier','comptable']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','chef_chantier','comptable']));
CREATE TRIGGER trg_loc_mat_upd BEFORE UPDATE ON public.locations_materiel
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Synthèse financière par chantier (recettes vs dépenses vs marge)
CREATE OR REPLACE FUNCTION public.chantier_financials()
RETURNS jsonb
LANGUAGE sql STABLE SET search_path = public AS $$
  WITH r AS (
    SELECT c.id, c.nom,
      COALESCE((SELECT sum(montant_ttc) FROM factures f WHERE f.chantier_id = c.id), 0) AS recettes,
      COALESCE((SELECT sum(cout_total) FROM consommation_constituants cc WHERE cc.chantier_id = c.id), 0)
      + COALESCE((SELECT sum(montant) FROM consommation_gasoil g WHERE g.chantier_id = c.id), 0)
      + COALESCE((SELECT sum(montant_ttc) FROM contrats_sous_traitance ct WHERE ct.chantier_id = c.id), 0)
      + COALESCE((SELECT sum(montant_total) FROM locations_materiel lm WHERE lm.chantier_id = c.id), 0)
      AS depenses
    FROM chantiers c
  )
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'id', id, 'nom', nom, 'recettes', recettes, 'depenses', depenses, 'marge', recettes - depenses
  ) ORDER BY (recettes - depenses) DESC), '[]'::jsonb) FROM r;
$$;
GRANT EXECUTE ON FUNCTION public.chantier_financials() TO authenticated;
