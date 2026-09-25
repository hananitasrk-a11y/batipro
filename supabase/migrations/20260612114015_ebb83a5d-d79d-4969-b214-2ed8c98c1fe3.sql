
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin','direction','chef_chantier','rh','comptable','magasinier','caissier');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  job_title TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ============ USER_ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_direction(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','direction'))
$$;

-- Admins can see/manage all roles
CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Handle new user: create profile + first user gets admin role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  user_count INTEGER;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'chef_chantier');
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ HELPER: standard referential table ============
-- Macro pattern: we manually create each since pg lacks macros. Each gets RLS:
-- SELECT for any authenticated, INSERT/UPDATE/DELETE for admin/direction.

-- SOCIETE (singleton company info)
CREATE TABLE public.societe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raison_sociale TEXT NOT NULL,
  forme_juridique TEXT,
  rc TEXT,
  ice TEXT,
  if_fiscal TEXT,
  cnss TEXT,
  patente TEXT,
  adresse TEXT,
  ville TEXT,
  telephone TEXT,
  email TEXT,
  site_web TEXT,
  logo_url TEXT,
  devise_defaut TEXT DEFAULT 'MAD',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.societe TO authenticated;
GRANT ALL ON public.societe TO service_role;
ALTER TABLE public.societe ENABLE ROW LEVEL SECURITY;
CREATE POLICY "societe_select" ON public.societe FOR SELECT TO authenticated USING (true);
CREATE POLICY "societe_write" ON public.societe FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));
CREATE TRIGGER trg_societe_updated BEFORE UPDATE ON public.societe FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CLIENTS
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  raison_sociale TEXT NOT NULL,
  type_client TEXT,
  contact TEXT,
  telephone TEXT,
  email TEXT,
  adresse TEXT,
  ville TEXT,
  ice TEXT,
  rc TEXT,
  if_fiscal TEXT,
  plafond_credit NUMERIC(15,2) DEFAULT 0,
  mode_reglement TEXT,
  notes TEXT,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients_select" ON public.clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "clients_write" ON public.clients FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FOURNISSEURS
CREATE TABLE public.fournisseurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  raison_sociale TEXT NOT NULL,
  contact TEXT,
  telephone TEXT,
  email TEXT,
  adresse TEXT,
  ville TEXT,
  ice TEXT,
  rc TEXT,
  if_fiscal TEXT,
  mode_reglement TEXT,
  delai_paiement INTEGER DEFAULT 30,
  notes TEXT,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fournisseurs TO authenticated;
GRANT ALL ON public.fournisseurs TO service_role;
ALTER TABLE public.fournisseurs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fournisseurs_select" ON public.fournisseurs FOR SELECT TO authenticated USING (true);
CREATE POLICY "fournisseurs_write" ON public.fournisseurs FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));
CREATE TRIGGER trg_fournisseurs_updated BEFORE UPDATE ON public.fournisseurs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- DEPOTS
CREATE TABLE public.depots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  nom TEXT NOT NULL,
  adresse TEXT,
  responsable TEXT,
  telephone TEXT,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.depots TO authenticated;
GRANT ALL ON public.depots TO service_role;
ALTER TABLE public.depots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "depots_select" ON public.depots FOR SELECT TO authenticated USING (true);
CREATE POLICY "depots_write" ON public.depots FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));
CREATE TRIGGER trg_depots_updated BEFORE UPDATE ON public.depots FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- UNITES
CREATE TABLE public.unites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  libelle TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.unites TO authenticated;
GRANT ALL ON public.unites TO service_role;
ALTER TABLE public.unites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "unites_select" ON public.unites FOR SELECT TO authenticated USING (true);
CREATE POLICY "unites_write" ON public.unites FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));

-- TVA
CREATE TABLE public.tva (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  libelle TEXT NOT NULL,
  taux NUMERIC(5,2) NOT NULL,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tva TO authenticated;
GRANT ALL ON public.tva TO service_role;
ALTER TABLE public.tva ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tva_select" ON public.tva FOR SELECT TO authenticated USING (true);
CREATE POLICY "tva_write" ON public.tva FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));

-- DEVISES
CREATE TABLE public.devises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  libelle TEXT NOT NULL,
  symbole TEXT,
  taux_change NUMERIC(15,6) DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.devises TO authenticated;
GRANT ALL ON public.devises TO service_role;
ALTER TABLE public.devises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "devises_select" ON public.devises FOR SELECT TO authenticated USING (true);
CREATE POLICY "devises_write" ON public.devises FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));

-- CONSTITUANTS (matières premières)
CREATE TABLE public.constituants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  libelle TEXT NOT NULL,
  type_constituant TEXT,
  unite TEXT,
  prix_achat NUMERIC(15,2) DEFAULT 0,
  stock_min NUMERIC(15,3) DEFAULT 0,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.constituants TO authenticated;
GRANT ALL ON public.constituants TO service_role;
ALTER TABLE public.constituants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "constituants_select" ON public.constituants FOR SELECT TO authenticated USING (true);
CREATE POLICY "constituants_write" ON public.constituants FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));
CREATE TRIGGER trg_constituants_updated BEFORE UPDATE ON public.constituants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PRODUITS_FINIS
CREATE TABLE public.produits_finis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  libelle TEXT NOT NULL,
  type_produit TEXT,
  unite TEXT,
  prix_vente NUMERIC(15,2) DEFAULT 0,
  tva_taux NUMERIC(5,2) DEFAULT 20,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produits_finis TO authenticated;
GRANT ALL ON public.produits_finis TO service_role;
ALTER TABLE public.produits_finis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "produits_finis_select" ON public.produits_finis FOR SELECT TO authenticated USING (true);
CREATE POLICY "produits_finis_write" ON public.produits_finis FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));
CREATE TRIGGER trg_produits_updated BEFORE UPDATE ON public.produits_finis FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- MODES_REGLEMENT
CREATE TABLE public.modes_reglement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  libelle TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.modes_reglement TO authenticated;
GRANT ALL ON public.modes_reglement TO service_role;
ALTER TABLE public.modes_reglement ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modes_reglement_select" ON public.modes_reglement FOR SELECT TO authenticated USING (true);
CREATE POLICY "modes_reglement_write" ON public.modes_reglement FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));

-- MODES_TRANSPORT
CREATE TABLE public.modes_transport (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  libelle TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.modes_transport TO authenticated;
GRANT ALL ON public.modes_transport TO service_role;
ALTER TABLE public.modes_transport ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modes_transport_select" ON public.modes_transport FOR SELECT TO authenticated USING (true);
CREATE POLICY "modes_transport_write" ON public.modes_transport FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));

-- TYPES_PERSONNEL
CREATE TABLE public.types_personnel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  libelle TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.types_personnel TO authenticated;
GRANT ALL ON public.types_personnel TO service_role;
ALTER TABLE public.types_personnel ENABLE ROW LEVEL SECURITY;
CREATE POLICY "types_personnel_select" ON public.types_personnel FOR SELECT TO authenticated USING (true);
CREATE POLICY "types_personnel_write" ON public.types_personnel FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));

-- TYPES_ENGINS
CREATE TABLE public.types_engins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  libelle TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.types_engins TO authenticated;
GRANT ALL ON public.types_engins TO service_role;
ALTER TABLE public.types_engins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "types_engins_select" ON public.types_engins FOR SELECT TO authenticated USING (true);
CREATE POLICY "types_engins_write" ON public.types_engins FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));

-- PAPIERS (documents matériel)
CREATE TABLE public.papiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  libelle TEXT NOT NULL,
  duree_validite_mois INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.papiers TO authenticated;
GRANT ALL ON public.papiers TO service_role;
ALTER TABLE public.papiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "papiers_select" ON public.papiers FOR SELECT TO authenticated USING (true);
CREATE POLICY "papiers_write" ON public.papiers FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));

-- ENTRETIENS_PERIODIQUES
CREATE TABLE public.entretiens_periodiques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  libelle TEXT NOT NULL,
  periodicite_km INTEGER,
  periodicite_jours INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entretiens_periodiques TO authenticated;
GRANT ALL ON public.entretiens_periodiques TO service_role;
ALTER TABLE public.entretiens_periodiques ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entretiens_select" ON public.entretiens_periodiques FOR SELECT TO authenticated USING (true);
CREATE POLICY "entretiens_write" ON public.entretiens_periodiques FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));

-- PLAFOND_CAISSES
CREATE TABLE public.plafond_caisses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  libelle TEXT NOT NULL,
  montant NUMERIC(15,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plafond_caisses TO authenticated;
GRANT ALL ON public.plafond_caisses TO service_role;
ALTER TABLE public.plafond_caisses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plafond_caisses_select" ON public.plafond_caisses FOR SELECT TO authenticated USING (true);
CREATE POLICY "plafond_caisses_write" ON public.plafond_caisses FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));

-- JOURS_FERIES
CREATE TABLE public.jours_feries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date_jour DATE NOT NULL UNIQUE,
  libelle TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jours_feries TO authenticated;
GRANT ALL ON public.jours_feries TO service_role;
ALTER TABLE public.jours_feries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jours_feries_select" ON public.jours_feries FOR SELECT TO authenticated USING (true);
CREATE POLICY "jours_feries_write" ON public.jours_feries FOR ALL TO authenticated
  USING (public.is_admin_or_direction(auth.uid())) WITH CHECK (public.is_admin_or_direction(auth.uid()));

-- ACTIVITY_LOG
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_log_select_admin" ON public.activity_log FOR SELECT TO authenticated
  USING (public.is_admin_or_direction(auth.uid()));
CREATE POLICY "activity_log_insert_self" ON public.activity_log FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Seed default reference data
INSERT INTO public.unites (code, libelle) VALUES
  ('U','Unité'),('KG','Kilogramme'),('T','Tonne'),('M','Mètre'),('M2','Mètre carré'),('M3','Mètre cube'),('L','Litre'),('H','Heure'),('J','Jour')
ON CONFLICT DO NOTHING;

INSERT INTO public.tva (libelle, taux) VALUES
  ('TVA 20%', 20),('TVA 14%', 14),('TVA 10%', 10),('TVA 7%', 7),('Exonéré', 0)
ON CONFLICT DO NOTHING;

INSERT INTO public.devises (code, libelle, symbole) VALUES
  ('MAD','Dirham marocain','DH'),('EUR','Euro','€'),('USD','Dollar US','$')
ON CONFLICT DO NOTHING;

INSERT INTO public.modes_reglement (code, libelle) VALUES
  ('ESP','Espèces'),('CHQ','Chèque'),('VIR','Virement'),('EFF','Effet'),('CB','Carte bancaire')
ON CONFLICT DO NOTHING;

INSERT INTO public.modes_transport (code, libelle) VALUES
  ('CAM','Camion'),('SEMI','Semi-remorque'),('UTL','Utilitaire'),('EXT','Transport externe')
ON CONFLICT DO NOTHING;

INSERT INTO public.types_personnel (code, libelle) VALUES
  ('OUV','Ouvrier'),('CHEF','Chef d''équipe'),('CDR','Cadre'),('ADMIN','Administratif'),('CHAUF','Chauffeur')
ON CONFLICT DO NOTHING;

INSERT INTO public.types_engins (code, libelle) VALUES
  ('PEL','Pelle'),('BUL','Bulldozer'),('CHA','Chargeuse'),('CAM','Camion benne'),('GRU','Grue'),('COMP','Compacteur')
ON CONFLICT DO NOTHING;
