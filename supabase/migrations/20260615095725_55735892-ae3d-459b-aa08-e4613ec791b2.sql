
-- POINTAGES
CREATE TABLE public.pointages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_pointage date NOT NULL,
  employe_id uuid REFERENCES public.employes(id) ON DELETE CASCADE,
  chantier_id uuid REFERENCES public.chantiers(id) ON DELETE SET NULL,
  heures_normales numeric DEFAULT 0,
  heures_sup numeric DEFAULT 0,
  absent boolean DEFAULT false,
  motif text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pointages TO authenticated;
GRANT ALL ON public.pointages TO service_role;
ALTER TABLE public.pointages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read pointages" ON public.pointages FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write pointages" ON public.pointages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_pointages_uat BEFORE UPDATE ON public.pointages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BULLETINS DE PAIE
CREATE TABLE public.bulletins_paie (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text,
  employe_id uuid REFERENCES public.employes(id) ON DELETE CASCADE,
  mois integer NOT NULL,
  annee integer NOT NULL,
  salaire_base numeric DEFAULT 0,
  heures_sup numeric DEFAULT 0,
  primes numeric DEFAULT 0,
  retenues numeric DEFAULT 0,
  cnss numeric DEFAULT 0,
  ir numeric DEFAULT 0,
  net_a_payer numeric DEFAULT 0,
  statut text DEFAULT 'brouillon',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bulletins_paie TO authenticated;
GRANT ALL ON public.bulletins_paie TO service_role;
ALTER TABLE public.bulletins_paie ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read bp" ON public.bulletins_paie FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write bp" ON public.bulletins_paie FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_bp_uat BEFORE UPDATE ON public.bulletins_paie FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CONGES
CREATE TABLE public.conges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employe_id uuid REFERENCES public.employes(id) ON DELETE CASCADE,
  type_conge text DEFAULT 'paye',
  date_debut date NOT NULL,
  date_fin date NOT NULL,
  nb_jours numeric DEFAULT 0,
  statut text DEFAULT 'en_attente',
  motif text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conges TO authenticated;
GRANT ALL ON public.conges TO service_role;
ALTER TABLE public.conges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read conges" ON public.conges FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write conges" ON public.conges FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_conges_uat BEFORE UPDATE ON public.conges FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RECEPTIONS
CREATE TABLE public.receptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text,
  date_reception date NOT NULL,
  fournisseur_id uuid REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
  bon_commande_id uuid REFERENCES public.bons_commande(id) ON DELETE SET NULL,
  chantier_id uuid REFERENCES public.chantiers(id) ON DELETE SET NULL,
  depot_id uuid REFERENCES public.depots(id) ON DELETE SET NULL,
  montant_ht numeric DEFAULT 0,
  statut text DEFAULT 'recue',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.receptions TO authenticated;
GRANT ALL ON public.receptions TO service_role;
ALTER TABLE public.receptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read recep" ON public.receptions FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write recep" ON public.receptions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_recep_uat BEFORE UPDATE ON public.receptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- DEVIS
CREATE TABLE public.devis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text,
  date_devis date NOT NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  chantier_id uuid REFERENCES public.chantiers(id) ON DELETE SET NULL,
  objet text,
  montant_ht numeric DEFAULT 0,
  tva numeric DEFAULT 0,
  montant_ttc numeric DEFAULT 0,
  statut text DEFAULT 'brouillon',
  validite date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.devis TO authenticated;
GRANT ALL ON public.devis TO service_role;
ALTER TABLE public.devis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read devis" ON public.devis FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write devis" ON public.devis FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_devis_uat BEFORE UPDATE ON public.devis FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- REGLEMENTS
CREATE TABLE public.reglements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text,
  date_reglement date NOT NULL,
  type_reglement text NOT NULL DEFAULT 'client',
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  fournisseur_id uuid REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
  facture_id uuid REFERENCES public.factures(id) ON DELETE SET NULL,
  mode text,
  montant numeric NOT NULL DEFAULT 0,
  reference text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reglements TO authenticated;
GRANT ALL ON public.reglements TO service_role;
ALTER TABLE public.reglements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read regl" ON public.reglements FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write regl" ON public.reglements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_regl_uat BEFORE UPDATE ON public.reglements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- INVENTAIRES
CREATE TABLE public.inventaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_inventaire date NOT NULL,
  depot_id uuid REFERENCES public.depots(id) ON DELETE SET NULL,
  constituant_id uuid REFERENCES public.constituants(id) ON DELETE SET NULL,
  produit_id uuid REFERENCES public.produits_finis(id) ON DELETE SET NULL,
  quantite_theorique numeric DEFAULT 0,
  quantite_reelle numeric DEFAULT 0,
  ecart numeric DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventaires TO authenticated;
GRANT ALL ON public.inventaires TO service_role;
ALTER TABLE public.inventaires ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read inv" ON public.inventaires FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write inv" ON public.inventaires FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_inv_uat BEFORE UPDATE ON public.inventaires FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ENTRETIENS REALISES
CREATE TABLE public.entretiens_realises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_entretien date NOT NULL,
  engin_id uuid REFERENCES public.engins(id) ON DELETE SET NULL,
  vehicule_id uuid REFERENCES public.vehicules(id) ON DELETE SET NULL,
  type_entretien text,
  compteur_km integer,
  compteur_h integer,
  cout numeric DEFAULT 0,
  prestataire text,
  description text,
  prochaine_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entretiens_realises TO authenticated;
GRANT ALL ON public.entretiens_realises TO service_role;
ALTER TABLE public.entretiens_realises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read ent" ON public.entretiens_realises FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write ent" ON public.entretiens_realises FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_ent_uat BEFORE UPDATE ON public.entretiens_realises FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PAPIERS ENGINS / VEHICULES
CREATE TABLE public.papiers_engins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engin_id uuid REFERENCES public.engins(id) ON DELETE CASCADE,
  vehicule_id uuid REFERENCES public.vehicules(id) ON DELETE CASCADE,
  papier_id uuid REFERENCES public.papiers(id) ON DELETE SET NULL,
  libelle text NOT NULL,
  numero text,
  date_emission date,
  date_expiration date,
  cout numeric DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.papiers_engins TO authenticated;
GRANT ALL ON public.papiers_engins TO service_role;
ALTER TABLE public.papiers_engins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read pe" ON public.papiers_engins FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write pe" ON public.papiers_engins FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_pe_uat BEFORE UPDATE ON public.papiers_engins FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
