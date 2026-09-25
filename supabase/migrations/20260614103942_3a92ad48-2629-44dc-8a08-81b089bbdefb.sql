
-- Production
CREATE TABLE public.chantiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT, nom TEXT NOT NULL, client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  adresse TEXT, ville TEXT, date_debut DATE, date_fin_prevue DATE, date_fin_reelle DATE,
  statut TEXT DEFAULT 'en_cours', montant_marche NUMERIC, avancement NUMERIC DEFAULT 0,
  chef_chantier TEXT, notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chantiers TO authenticated;
GRANT ALL ON public.chantiers TO service_role;
ALTER TABLE public.chantiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read chantiers" ON public.chantiers FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write chantiers" ON public.chantiers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_chantiers_updated BEFORE UPDATE ON public.chantiers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Personnel
CREATE TABLE public.employes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricule TEXT, nom TEXT NOT NULL, prenom TEXT, cin TEXT, cnss TEXT,
  poste TEXT, type_personnel TEXT, telephone TEXT, email TEXT, adresse TEXT,
  date_embauche DATE, date_sortie DATE, salaire_base NUMERIC, taux_horaire NUMERIC,
  chantier_id UUID REFERENCES public.chantiers(id) ON DELETE SET NULL,
  actif BOOLEAN DEFAULT true, notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employes TO authenticated;
GRANT ALL ON public.employes TO service_role;
ALTER TABLE public.employes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read employes" ON public.employes FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write employes" ON public.employes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_employes_updated BEFORE UPDATE ON public.employes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Matériel
CREATE TABLE public.engins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT, libelle TEXT NOT NULL, type_engin TEXT, marque TEXT, modele TEXT,
  immatriculation TEXT, annee INTEGER, compteur_km NUMERIC, compteur_h NUMERIC,
  date_acquisition DATE, valeur_acquisition NUMERIC, statut TEXT DEFAULT 'disponible',
  chantier_id UUID REFERENCES public.chantiers(id) ON DELETE SET NULL,
  notes TEXT, actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.engins TO authenticated;
GRANT ALL ON public.engins TO service_role;
ALTER TABLE public.engins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read engins" ON public.engins FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write engins" ON public.engins FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_engins_updated BEFORE UPDATE ON public.engins FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Transport
CREATE TABLE public.vehicules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT, libelle TEXT NOT NULL, immatriculation TEXT, marque TEXT, modele TEXT,
  type_vehicule TEXT, capacite NUMERIC, chauffeur TEXT, compteur_km NUMERIC,
  statut TEXT DEFAULT 'disponible', notes TEXT, actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicules TO authenticated;
GRANT ALL ON public.vehicules TO service_role;
ALTER TABLE public.vehicules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read vehicules" ON public.vehicules FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write vehicules" ON public.vehicules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_vehicules_updated BEFORE UPDATE ON public.vehicules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Caisses
CREATE TABLE public.caisses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT, libelle TEXT NOT NULL, responsable TEXT, devise TEXT DEFAULT 'MAD',
  solde_initial NUMERIC DEFAULT 0, plafond NUMERIC, actif BOOLEAN DEFAULT true, notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.caisses TO authenticated;
GRANT ALL ON public.caisses TO service_role;
ALTER TABLE public.caisses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read caisses" ON public.caisses FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write caisses" ON public.caisses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_caisses_updated BEFORE UPDATE ON public.caisses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.operations_caisse (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caisse_id UUID REFERENCES public.caisses(id) ON DELETE CASCADE,
  date_operation DATE NOT NULL DEFAULT CURRENT_DATE,
  type_operation TEXT NOT NULL,
  montant NUMERIC NOT NULL,
  libelle TEXT, beneficiaire TEXT, piece TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.operations_caisse TO authenticated;
GRANT ALL ON public.operations_caisse TO service_role;
ALTER TABLE public.operations_caisse ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read opcaisse" ON public.operations_caisse FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write opcaisse" ON public.operations_caisse FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_opcaisse_updated BEFORE UPDATE ON public.operations_caisse FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Achats
CREATE TABLE public.bons_commande (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT, date_bc DATE NOT NULL DEFAULT CURRENT_DATE,
  fournisseur_id UUID REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
  chantier_id UUID REFERENCES public.chantiers(id) ON DELETE SET NULL,
  montant_ht NUMERIC, tva NUMERIC, montant_ttc NUMERIC,
  statut TEXT DEFAULT 'brouillon', notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bons_commande TO authenticated;
GRANT ALL ON public.bons_commande TO service_role;
ALTER TABLE public.bons_commande ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read bc" ON public.bons_commande FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write bc" ON public.bons_commande FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_bc_updated BEFORE UPDATE ON public.bons_commande FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Ventes
CREATE TABLE public.factures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT, date_facture DATE NOT NULL DEFAULT CURRENT_DATE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  chantier_id UUID REFERENCES public.chantiers(id) ON DELETE SET NULL,
  montant_ht NUMERIC, tva NUMERIC, montant_ttc NUMERIC,
  statut TEXT DEFAULT 'brouillon', echeance DATE, notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.factures TO authenticated;
GRANT ALL ON public.factures TO service_role;
ALTER TABLE public.factures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read fact" ON public.factures FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write fact" ON public.factures FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_fact_updated BEFORE UPDATE ON public.factures FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Stocks
CREATE TABLE public.mouvements_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date_mvt DATE NOT NULL DEFAULT CURRENT_DATE,
  type_mvt TEXT NOT NULL,
  depot_id UUID REFERENCES public.depots(id) ON DELETE SET NULL,
  constituant_id UUID REFERENCES public.constituants(id) ON DELETE SET NULL,
  produit_id UUID REFERENCES public.produits_finis(id) ON DELETE SET NULL,
  quantite NUMERIC NOT NULL,
  prix_unitaire NUMERIC,
  chantier_id UUID REFERENCES public.chantiers(id) ON DELETE SET NULL,
  reference TEXT, notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mouvements_stock TO authenticated;
GRANT ALL ON public.mouvements_stock TO service_role;
ALTER TABLE public.mouvements_stock ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read mvt" ON public.mouvements_stock FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write mvt" ON public.mouvements_stock FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_mvt_updated BEFORE UPDATE ON public.mouvements_stock FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
