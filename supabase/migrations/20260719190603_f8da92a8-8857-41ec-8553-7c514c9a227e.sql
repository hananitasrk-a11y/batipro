
-- Plan comptable
CREATE TABLE public.comptes_comptables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL UNIQUE,
  libelle text NOT NULL,
  classe smallint NOT NULL CHECK (classe BETWEEN 1 AND 8),
  type text NOT NULL CHECK (type IN ('actif','passif','charge','produit','mixte')),
  parent_id uuid REFERENCES public.comptes_comptables(id) ON DELETE SET NULL,
  actif boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comptes_comptables TO authenticated;
GRANT ALL ON public.comptes_comptables TO service_role;
ALTER TABLE public.comptes_comptables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "compta read" ON public.comptes_comptables FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']));
CREATE POLICY "compta write" ON public.comptes_comptables FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['admin','comptable'])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','comptable']));
CREATE TRIGGER trg_comptes_upd BEFORE UPDATE ON public.comptes_comptables FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Journaux
CREATE TABLE public.journaux (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  libelle text NOT NULL,
  type text NOT NULL CHECK (type IN ('vente','achat','banque','caisse','od','paie')),
  compte_contrepartie_id uuid REFERENCES public.comptes_comptables(id),
  actif boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journaux TO authenticated;
GRANT ALL ON public.journaux TO service_role;
ALTER TABLE public.journaux ENABLE ROW LEVEL SECURITY;
CREATE POLICY "journ read" ON public.journaux FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']));
CREATE POLICY "journ write" ON public.journaux FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['admin','comptable'])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','comptable']));
CREATE TRIGGER trg_journ_upd BEFORE UPDATE ON public.journaux FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Écritures comptables (en-tête)
CREATE TABLE public.ecritures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL UNIQUE,
  date_ecriture date NOT NULL DEFAULT CURRENT_DATE,
  journal_id uuid NOT NULL REFERENCES public.journaux(id) ON DELETE RESTRICT,
  libelle text NOT NULL,
  reference text,
  piece_type text,
  piece_id uuid,
  statut text NOT NULL DEFAULT 'brouillon' CHECK (statut IN ('brouillon','validee','cloturee')),
  total_debit numeric NOT NULL DEFAULT 0,
  total_credit numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ecritures_date ON public.ecritures(date_ecriture);
CREATE INDEX idx_ecritures_journ ON public.ecritures(journal_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ecritures TO authenticated;
GRANT ALL ON public.ecritures TO service_role;
ALTER TABLE public.ecritures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ecr read" ON public.ecritures FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']));
CREATE POLICY "ecr write" ON public.ecritures FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['admin','comptable'])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','comptable']));
CREATE TRIGGER trg_ecr_upd BEFORE UPDATE ON public.ecritures FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Lignes d'écriture
CREATE TABLE public.lignes_ecriture (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ecriture_id uuid NOT NULL REFERENCES public.ecritures(id) ON DELETE CASCADE,
  compte_id uuid NOT NULL REFERENCES public.comptes_comptables(id) ON DELETE RESTRICT,
  libelle text,
  debit numeric NOT NULL DEFAULT 0 CHECK (debit >= 0),
  credit numeric NOT NULL DEFAULT 0 CHECK (credit >= 0),
  lettrage text,
  tiers_type text,
  tiers_id uuid,
  chantier_id uuid REFERENCES public.chantiers(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_lignes_ecr ON public.lignes_ecriture(ecriture_id);
CREATE INDEX idx_lignes_compte ON public.lignes_ecriture(compte_id);
CREATE INDEX idx_lignes_lettr ON public.lignes_ecriture(lettrage) WHERE lettrage IS NOT NULL;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lignes_ecriture TO authenticated;
GRANT ALL ON public.lignes_ecriture TO service_role;
ALTER TABLE public.lignes_ecriture ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lig read" ON public.lignes_ecriture FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']));
CREATE POLICY "lig write" ON public.lignes_ecriture FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['admin','comptable'])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','comptable']));

-- Trigger : recalculer les totaux d'écriture
CREATE OR REPLACE FUNCTION public.recompute_ecriture_totals()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE eid uuid;
BEGIN
  eid := COALESCE(NEW.ecriture_id, OLD.ecriture_id);
  UPDATE public.ecritures SET
    total_debit = COALESCE((SELECT sum(debit) FROM public.lignes_ecriture WHERE ecriture_id = eid),0),
    total_credit = COALESCE((SELECT sum(credit) FROM public.lignes_ecriture WHERE ecriture_id = eid),0),
    updated_at = now()
  WHERE id = eid;
  RETURN NULL;
END $$;
CREATE TRIGGER trg_lignes_totals AFTER INSERT OR UPDATE OR DELETE ON public.lignes_ecriture FOR EACH ROW EXECUTE FUNCTION public.recompute_ecriture_totals();

-- Relevés bancaires
CREATE TABLE public.releves_bancaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  compte_id uuid NOT NULL REFERENCES public.comptes_comptables(id) ON DELETE RESTRICT,
  reference text NOT NULL,
  date_debut date NOT NULL,
  date_fin date NOT NULL,
  solde_initial numeric NOT NULL DEFAULT 0,
  solde_final numeric NOT NULL DEFAULT 0,
  statut text NOT NULL DEFAULT 'ouvert' CHECK (statut IN ('ouvert','rapproche','cloture')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.releves_bancaires TO authenticated;
GRANT ALL ON public.releves_bancaires TO service_role;
ALTER TABLE public.releves_bancaires ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rel read" ON public.releves_bancaires FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']));
CREATE POLICY "rel write" ON public.releves_bancaires FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['admin','comptable'])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','comptable']));
CREATE TRIGGER trg_rel_upd BEFORE UPDATE ON public.releves_bancaires FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Lignes de relevé
CREATE TABLE public.lignes_releve (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  releve_id uuid NOT NULL REFERENCES public.releves_bancaires(id) ON DELETE CASCADE,
  date_operation date NOT NULL,
  libelle text NOT NULL,
  reference text,
  debit numeric NOT NULL DEFAULT 0,
  credit numeric NOT NULL DEFAULT 0,
  rapproche boolean NOT NULL DEFAULT false,
  ligne_ecriture_id uuid REFERENCES public.lignes_ecriture(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_lignes_rel ON public.lignes_releve(releve_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lignes_releve TO authenticated;
GRANT ALL ON public.lignes_releve TO service_role;
ALTER TABLE public.lignes_releve ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lrel read" ON public.lignes_releve FOR SELECT TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']));
CREATE POLICY "lrel write" ON public.lignes_releve FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['admin','comptable'])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','comptable']));

-- Plan comptable de base (marocain simplifié)
INSERT INTO public.comptes_comptables (numero, libelle, classe, type) VALUES
('1111','Capital social',1,'passif'),
('1181','Résultats nets en instance d''affectation',1,'passif'),
('2321','Bâtiments',2,'actif'),
('2332','Matériel et outillage',2,'actif'),
('2340','Matériel de transport',2,'actif'),
('3111','Marchandises',3,'actif'),
('3421','Clients',3,'actif'),
('3455','État - TVA récupérable',3,'actif'),
('4411','Fournisseurs',4,'passif'),
('4432','Rémunérations dues au personnel',4,'passif'),
('4455','État - TVA facturée',4,'passif'),
('5141','Banque',5,'actif'),
('5161','Caisse',5,'actif'),
('6111','Achats de marchandises',6,'charge'),
('6125','Achats de matières et fournitures consommables',6,'charge'),
('6141','Locations et charges locatives',6,'charge'),
('6171','Rémunérations du personnel',6,'charge'),
('6186','Sous-traitance',6,'charge'),
('6331','Impôts et taxes',6,'charge'),
('7111','Ventes de marchandises',7,'produit'),
('7121','Ventes de biens produits',7,'produit'),
('7124','Travaux',7,'produit');

INSERT INTO public.journaux (code, libelle, type) VALUES
('VT','Journal des ventes','vente'),
('AC','Journal des achats','achat'),
('BQ','Journal de banque','banque'),
('CA','Journal de caisse','caisse'),
('OD','Opérations diverses','od'),
('PA','Journal de paie','paie');

-- Grand livre : lignes d'un compte sur période avec solde progressif
CREATE OR REPLACE FUNCTION public.grand_livre(p_compte_id uuid, p_date_debut date, p_date_fin date)
RETURNS jsonb LANGUAGE sql STABLE SET search_path = public AS $$
  WITH lignes AS (
    SELECT e.date_ecriture, e.numero, e.libelle AS ecr_libelle, l.libelle, l.debit, l.credit,
      sum(l.debit - l.credit) OVER (ORDER BY e.date_ecriture, e.numero, l.id) AS solde
    FROM lignes_ecriture l
    JOIN ecritures e ON e.id = l.ecriture_id
    WHERE l.compte_id = p_compte_id
      AND e.date_ecriture BETWEEN p_date_debut AND p_date_fin
      AND e.statut <> 'brouillon'
    ORDER BY e.date_ecriture, e.numero, l.id
  )
  SELECT COALESCE(jsonb_agg(to_jsonb(lignes)), '[]'::jsonb) FROM lignes;
$$;

-- Balance générale : agrégation par compte
CREATE OR REPLACE FUNCTION public.balance_generale(p_date_debut date, p_date_fin date)
RETURNS jsonb LANGUAGE sql STABLE SET search_path = public AS $$
  WITH agg AS (
    SELECT c.numero, c.libelle, c.classe, c.type,
      COALESCE(sum(l.debit),0) AS total_debit,
      COALESCE(sum(l.credit),0) AS total_credit,
      COALESCE(sum(l.debit - l.credit),0) AS solde
    FROM comptes_comptables c
    LEFT JOIN lignes_ecriture l ON l.compte_id = c.id
    LEFT JOIN ecritures e ON e.id = l.ecriture_id
      AND e.date_ecriture BETWEEN p_date_debut AND p_date_fin
      AND e.statut <> 'brouillon'
    GROUP BY c.id
    HAVING COALESCE(sum(l.debit),0) + COALESCE(sum(l.credit),0) > 0
    ORDER BY c.numero
  )
  SELECT COALESCE(jsonb_agg(to_jsonb(agg)), '[]'::jsonb) FROM agg;
$$;

-- Bilan : Actif / Passif
CREATE OR REPLACE FUNCTION public.bilan(p_date date)
RETURNS jsonb LANGUAGE sql STABLE SET search_path = public AS $$
  WITH s AS (
    SELECT c.type, c.numero, c.libelle,
      COALESCE(sum(l.debit - l.credit),0) AS solde
    FROM comptes_comptables c
    LEFT JOIN lignes_ecriture l ON l.compte_id = c.id
    LEFT JOIN ecritures e ON e.id = l.ecriture_id
      AND e.date_ecriture <= p_date AND e.statut <> 'brouillon'
    WHERE c.classe IN (1,2,3,4,5)
    GROUP BY c.id
  )
  SELECT jsonb_build_object(
    'actif', COALESCE((SELECT jsonb_agg(jsonb_build_object('numero',numero,'libelle',libelle,'solde',solde) ORDER BY numero) FROM s WHERE type='actif' AND solde <> 0), '[]'::jsonb),
    'passif', COALESCE((SELECT jsonb_agg(jsonb_build_object('numero',numero,'libelle',libelle,'solde',-solde) ORDER BY numero) FROM s WHERE type='passif' AND solde <> 0), '[]'::jsonb),
    'total_actif', COALESCE((SELECT sum(solde) FROM s WHERE type='actif'),0),
    'total_passif', COALESCE((SELECT sum(-solde) FROM s WHERE type='passif'),0)
  );
$$;

-- Compte de résultat : Charges / Produits
CREATE OR REPLACE FUNCTION public.compte_resultat(p_date_debut date, p_date_fin date)
RETURNS jsonb LANGUAGE sql STABLE SET search_path = public AS $$
  WITH s AS (
    SELECT c.type, c.numero, c.libelle,
      COALESCE(sum(l.debit),0) AS td,
      COALESCE(sum(l.credit),0) AS tc
    FROM comptes_comptables c
    LEFT JOIN lignes_ecriture l ON l.compte_id = c.id
    LEFT JOIN ecritures e ON e.id = l.ecriture_id
      AND e.date_ecriture BETWEEN p_date_debut AND p_date_fin
      AND e.statut <> 'brouillon'
    WHERE c.classe IN (6,7)
    GROUP BY c.id
  )
  SELECT jsonb_build_object(
    'charges', COALESCE((SELECT jsonb_agg(jsonb_build_object('numero',numero,'libelle',libelle,'montant',td-tc) ORDER BY numero) FROM s WHERE type='charge' AND (td-tc) <> 0), '[]'::jsonb),
    'produits', COALESCE((SELECT jsonb_agg(jsonb_build_object('numero',numero,'libelle',libelle,'montant',tc-td) ORDER BY numero) FROM s WHERE type='produit' AND (tc-td) <> 0), '[]'::jsonb),
    'total_charges', COALESCE((SELECT sum(td-tc) FROM s WHERE type='charge'),0),
    'total_produits', COALESCE((SELECT sum(tc-td) FROM s WHERE type='produit'),0),
    'resultat', COALESCE((SELECT sum(tc-td) FROM s WHERE type='produit'),0) - COALESCE((SELECT sum(td-tc) FROM s WHERE type='charge'),0)
  );
$$;

-- Déclaration TVA
CREATE OR REPLACE FUNCTION public.declaration_tva(p_date_debut date, p_date_fin date)
RETURNS jsonb LANGUAGE sql STABLE SET search_path = public AS $$
  WITH s AS (
    SELECT c.numero,
      COALESCE(sum(l.debit),0) AS td,
      COALESCE(sum(l.credit),0) AS tc
    FROM comptes_comptables c
    JOIN lignes_ecriture l ON l.compte_id = c.id
    JOIN ecritures e ON e.id = l.ecriture_id
      AND e.date_ecriture BETWEEN p_date_debut AND p_date_fin
      AND e.statut <> 'brouillon'
    WHERE c.numero IN ('3455','4455')
    GROUP BY c.numero
  )
  SELECT jsonb_build_object(
    'tva_recuperable', COALESCE((SELECT td-tc FROM s WHERE numero='3455'),0),
    'tva_facturee',    COALESCE((SELECT tc-td FROM s WHERE numero='4455'),0),
    'tva_a_payer',     COALESCE((SELECT tc-td FROM s WHERE numero='4455'),0) - COALESCE((SELECT td-tc FROM s WHERE numero='3455'),0)
  );
$$;

GRANT EXECUTE ON FUNCTION public.grand_livre(uuid,date,date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.balance_generale(date,date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.bilan(date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.compte_resultat(date,date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.declaration_tva(date,date) TO authenticated;
