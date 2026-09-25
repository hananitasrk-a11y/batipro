
CREATE TABLE public.phases_chantier (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chantier_id uuid REFERENCES public.chantier(id) ON DELETE CASCADE,
  code text,
  nom text NOT NULL,
  date_debut date,
  date_fin_prevue date,
  date_fin_reelle date,
  avancement numeric DEFAULT 0,
  budget numeric,
  statut text DEFAULT 'planifie',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.phases_chantier TO authenticated;
GRANT ALL ON public.phases_chantier TO service_role;
ALTER TABLE public.phases_chantier ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read phases_chantier" ON public.phases_chantier FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write phases_chantier" ON public.phases_chantier FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_phases_chantier_updated BEFORE UPDATE ON public.phases_chantier FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.taches_chantier (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chantier_id uuid REFERENCES public.chantier(id) ON DELETE CASCADE,
  phase_id uuid REFERENCES public.phases_chantier(id) ON DELETE SET NULL,
  libelle text NOT NULL,
  responsable text,
  date_debut date,
  date_fin_prevue date,
  date_fin_reelle date,
  avancement numeric DEFAULT 0,
  statut text DEFAULT 'a_faire',
  priorite text DEFAULT 'normale',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.taches_chantier TO authenticated;
GRANT ALL ON public.taches_chantier TO service_role;
ALTER TABLE public.taches_chantier ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read taches_chantier" ON public.taches_chantier FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write taches_chantier" ON public.taches_chantier FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_taches_chantier_updated BEFORE UPDATE ON public.taches_chantier FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.consommation_constituants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chantier_id uuid REFERENCES public.chantier(id) ON DELETE SET NULL,
  phase_id uuid REFERENCES public.phases_chantier(id) ON DELETE SET NULL,
  constituant_id uuid REFERENCES public.constituants(id) ON DELETE SET NULL,
  date_conso date NOT NULL DEFAULT CURRENT_DATE,
  quantite numeric NOT NULL DEFAULT 0,
  unite text,
  cout_unitaire numeric,
  cout_total numeric,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consommation_constituants TO authenticated;
GRANT ALL ON public.consommation_constituants TO service_role;
ALTER TABLE public.consommation_constituants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read consommation_constituants" ON public.consommation_constituants FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write consommation_constituants" ON public.consommation_constituants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_consommation_constituants_updated BEFORE UPDATE ON public.consommation_constituants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.rendement_journalier (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chantier_id uuid REFERENCES public.chantier(id) ON DELETE CASCADE,
  phase_id uuid REFERENCES public.phases_chantier(id) ON DELETE SET NULL,
  date_jour date NOT NULL DEFAULT CURRENT_DATE,
  quantite_produite numeric DEFAULT 0,
  unite text,
  heures_travaillees numeric DEFAULT 0,
  effectif integer DEFAULT 0,
  meteo text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rendement_journalier TO authenticated;
GRANT ALL ON public.rendement_journalier TO service_role;
ALTER TABLE public.rendement_journalier ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read rendement_journalier" ON public.rendement_journalier FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write rendement_journalier" ON public.rendement_journalier FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_rendement_journalier_updated BEFORE UPDATE ON public.rendement_journalier FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
