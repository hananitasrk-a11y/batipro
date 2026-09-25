
-- Helper trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

-- Generic creator macro via DO blocks
-- 1) Demandes de devis (achats)
CREATE TABLE IF NOT EXISTS public.demandes_devis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text, date_demande date DEFAULT CURRENT_DATE,
  fournisseur_id uuid REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
  chantier_id uuid REFERENCES public.chantiers(id) ON DELETE SET NULL,
  objet text, montant_estime numeric,
  statut text DEFAULT 'brouillon', notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.demandes_devis TO authenticated;
GRANT ALL ON public.demandes_devis TO service_role;
ALTER TABLE public.demandes_devis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read demandes_devis" ON public.demandes_devis FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write demandes_devis" ON public.demandes_devis FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_demandes_devis_updated BEFORE UPDATE ON public.demandes_devis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Commandes vente
CREATE TABLE IF NOT EXISTS public.commandes_vente (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text, date_commande date DEFAULT CURRENT_DATE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  chantier_id uuid REFERENCES public.chantiers(id) ON DELETE SET NULL,
  devis_id uuid REFERENCES public.devis(id) ON DELETE SET NULL,
  montant_ht numeric, tva numeric, montant_ttc numeric,
  date_livraison date, statut text DEFAULT 'brouillon', notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.commandes_vente TO authenticated;
GRANT ALL ON public.commandes_vente TO service_role;
ALTER TABLE public.commandes_vente ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read commandes_vente" ON public.commandes_vente FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write commandes_vente" ON public.commandes_vente FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_commandes_vente_updated BEFORE UPDATE ON public.commandes_vente FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Livraisons
CREATE TABLE IF NOT EXISTS public.livraisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text, date_livraison date DEFAULT CURRENT_DATE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  chantier_id uuid REFERENCES public.chantiers(id) ON DELETE SET NULL,
  commande_id uuid REFERENCES public.commandes_vente(id) ON DELETE SET NULL,
  vehicule_id uuid REFERENCES public.vehicules(id) ON DELETE SET NULL,
  chauffeur text, montant_ht numeric, statut text DEFAULT 'preparee', notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.livraisons TO authenticated;
GRANT ALL ON public.livraisons TO service_role;
ALTER TABLE public.livraisons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read livraisons" ON public.livraisons FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write livraisons" ON public.livraisons FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_livraisons_updated BEFORE UPDATE ON public.livraisons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Retours (achat + vente unifiés via type)
CREATE TABLE IF NOT EXISTS public.retours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text, date_retour date DEFAULT CURRENT_DATE,
  type_retour text NOT NULL DEFAULT 'achat',
  fournisseur_id uuid REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  facture_id uuid REFERENCES public.factures(id) ON DELETE SET NULL,
  chantier_id uuid REFERENCES public.chantiers(id) ON DELETE SET NULL,
  motif text, montant_ht numeric, statut text DEFAULT 'brouillon', notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.retours TO authenticated;
GRANT ALL ON public.retours TO service_role;
ALTER TABLE public.retours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read retours" ON public.retours FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write retours" ON public.retours FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_retours_updated BEFORE UPDATE ON public.retours FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Avoirs
CREATE TABLE IF NOT EXISTS public.avoirs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text, date_avoir date DEFAULT CURRENT_DATE,
  type_avoir text NOT NULL DEFAULT 'achat',
  fournisseur_id uuid REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  facture_id uuid REFERENCES public.factures(id) ON DELETE SET NULL,
  montant_ht numeric, tva numeric, montant_ttc numeric,
  statut text DEFAULT 'brouillon', notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.avoirs TO authenticated;
GRANT ALL ON public.avoirs TO service_role;
ALTER TABLE public.avoirs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read avoirs" ON public.avoirs FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write avoirs" ON public.avoirs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_avoirs_updated BEFORE UPDATE ON public.avoirs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6) Transferts stock entre dépôts
CREATE TABLE IF NOT EXISTS public.transferts_stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text, date_transfert date DEFAULT CURRENT_DATE,
  depot_source_id uuid REFERENCES public.depots(id) ON DELETE SET NULL,
  depot_destination_id uuid REFERENCES public.depots(id) ON DELETE SET NULL,
  constituant_id uuid REFERENCES public.constituants(id) ON DELETE SET NULL,
  produit_id uuid REFERENCES public.produits_finis(id) ON DELETE SET NULL,
  quantite numeric, statut text DEFAULT 'en_cours', notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transferts_stock TO authenticated;
GRANT ALL ON public.transferts_stock TO service_role;
ALTER TABLE public.transferts_stock ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read transferts_stock" ON public.transferts_stock FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write transferts_stock" ON public.transferts_stock FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_transferts_stock_updated BEFORE UPDATE ON public.transferts_stock FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7) Transferts matériel (engins entre chantiers)
CREATE TABLE IF NOT EXISTS public.transferts_materiel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_transfert date DEFAULT CURRENT_DATE,
  engin_id uuid REFERENCES public.engins(id) ON DELETE SET NULL,
  vehicule_id uuid REFERENCES public.vehicules(id) ON DELETE SET NULL,
  chantier_source_id uuid REFERENCES public.chantiers(id) ON DELETE SET NULL,
  chantier_destination_id uuid REFERENCES public.chantiers(id) ON DELETE SET NULL,
  motif text, notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transferts_materiel TO authenticated;
GRANT ALL ON public.transferts_materiel TO service_role;
ALTER TABLE public.transferts_materiel ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read transferts_materiel" ON public.transferts_materiel FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write transferts_materiel" ON public.transferts_materiel FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_transferts_materiel_updated BEFORE UPDATE ON public.transferts_materiel FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8) Avances personnel
CREATE TABLE IF NOT EXISTS public.avances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employe_id uuid REFERENCES public.employes(id) ON DELETE SET NULL,
  date_avance date DEFAULT CURRENT_DATE,
  montant numeric NOT NULL,
  motif text, statut text DEFAULT 'accordee', notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.avances TO authenticated;
GRANT ALL ON public.avances TO service_role;
ALTER TABLE public.avances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read avances" ON public.avances FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write avances" ON public.avances FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_avances_updated BEFORE UPDATE ON public.avances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9) Absences
CREATE TABLE IF NOT EXISTS public.absences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employe_id uuid REFERENCES public.employes(id) ON DELETE SET NULL,
  date_absence date DEFAULT CURRENT_DATE,
  duree_heures numeric, motif text, justifiee boolean DEFAULT false, notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.absences TO authenticated;
GRANT ALL ON public.absences TO service_role;
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read absences" ON public.absences FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write absences" ON public.absences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_absences_updated BEFORE UPDATE ON public.absences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10) Consommation gasoil
CREATE TABLE IF NOT EXISTS public.consommation_gasoil (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_conso date DEFAULT CURRENT_DATE,
  engin_id uuid REFERENCES public.engins(id) ON DELETE SET NULL,
  vehicule_id uuid REFERENCES public.vehicules(id) ON DELETE SET NULL,
  chantier_id uuid REFERENCES public.chantiers(id) ON DELETE SET NULL,
  quantite_litres numeric, prix_unitaire numeric, montant numeric,
  compteur_km numeric, compteur_h numeric, notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consommation_gasoil TO authenticated;
GRANT ALL ON public.consommation_gasoil TO service_role;
ALTER TABLE public.consommation_gasoil ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read consommation_gasoil" ON public.consommation_gasoil FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write consommation_gasoil" ON public.consommation_gasoil FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_consommation_gasoil_updated BEFORE UPDATE ON public.consommation_gasoil FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11) Pannes engins
CREATE TABLE IF NOT EXISTS public.pannes_engins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_panne date DEFAULT CURRENT_DATE,
  engin_id uuid REFERENCES public.engins(id) ON DELETE SET NULL,
  vehicule_id uuid REFERENCES public.vehicules(id) ON DELETE SET NULL,
  description text, gravite text, statut text DEFAULT 'ouverte',
  date_resolution date, cout_reparation numeric, notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pannes_engins TO authenticated;
GRANT ALL ON public.pannes_engins TO service_role;
ALTER TABLE public.pannes_engins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read pannes_engins" ON public.pannes_engins FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write pannes_engins" ON public.pannes_engins FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_pannes_engins_updated BEFORE UPDATE ON public.pannes_engins FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 12) Documents engins/véhicules (cartes grises, contrats…)
CREATE TABLE IF NOT EXISTS public.documents_materiel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  libelle text NOT NULL,
  type_document text,
  engin_id uuid REFERENCES public.engins(id) ON DELETE SET NULL,
  vehicule_id uuid REFERENCES public.vehicules(id) ON DELETE SET NULL,
  url text, date_emission date, date_expiration date, notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents_materiel TO authenticated;
GRANT ALL ON public.documents_materiel TO service_role;
ALTER TABLE public.documents_materiel ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read documents_materiel" ON public.documents_materiel FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write documents_materiel" ON public.documents_materiel FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_documents_materiel_updated BEFORE UPDATE ON public.documents_materiel FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
