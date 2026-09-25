
-- 1) New users get NO role until an admin assigns one (removes broad chef_chantier access).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  user_count INTEGER;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  -- No default role: newly signed-up users have no access until an admin grants one.
  RETURN NEW;
END $function$;

-- 2) Revoke EXECUTE on internal trigger-only SECURITY DEFINER function from callers.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Helper to reduce repetition
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid, _roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text = ANY(_roles)
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_any_role(uuid, text[]) TO authenticated;

-- ============================================================
-- HR: employes, bulletins_paie, avances, conges, absences, pointages
-- SELECT + WRITE restricted to admin/direction/rh
-- ============================================================
DROP POLICY IF EXISTS "auth read employes" ON public.employes;
DROP POLICY IF EXISTS "auth write employes" ON public.employes;
CREATE POLICY "hr read employes" ON public.employes FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']));
CREATE POLICY "hr write employes" ON public.employes FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']));

DROP POLICY IF EXISTS "auth read bp" ON public.bulletins_paie;
DROP POLICY IF EXISTS "auth write bp" ON public.bulletins_paie;
CREATE POLICY "hr read bp" ON public.bulletins_paie FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']));
CREATE POLICY "hr write bp" ON public.bulletins_paie FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']));

DROP POLICY IF EXISTS "auth read avances" ON public.avances;
DROP POLICY IF EXISTS "auth write avances" ON public.avances;
CREATE POLICY "hr read avances" ON public.avances FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']));
CREATE POLICY "hr write avances" ON public.avances FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']));

DROP POLICY IF EXISTS "auth read conges" ON public.conges;
DROP POLICY IF EXISTS "auth write conges" ON public.conges;
CREATE POLICY "hr read conges" ON public.conges FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']));
CREATE POLICY "hr write conges" ON public.conges FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']));

DROP POLICY IF EXISTS "auth read absences" ON public.absences;
DROP POLICY IF EXISTS "auth write absences" ON public.absences;
CREATE POLICY "hr read absences" ON public.absences FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']));
CREATE POLICY "hr write absences" ON public.absences FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh']));

DROP POLICY IF EXISTS "auth read pointages" ON public.pointages;
DROP POLICY IF EXISTS "auth write pointages" ON public.pointages;
CREATE POLICY "hr read pointages" ON public.pointages FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh','chef_chantier']));
CREATE POLICY "hr write pointages" ON public.pointages FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh','chef_chantier']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','rh','chef_chantier']));

-- ============================================================
-- FINANCE: factures, reglements, operations_caisse, caisses, avoirs
-- SELECT: admin/direction/comptable/caissier ; WRITE: admin/direction/comptable
-- ============================================================
DROP POLICY IF EXISTS "auth read fact" ON public.factures;
DROP POLICY IF EXISTS "auth write fact" ON public.factures;
CREATE POLICY "fin read fact" ON public.factures FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','caissier']));
CREATE POLICY "fin write fact" ON public.factures FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']));

DROP POLICY IF EXISTS "auth read regl" ON public.reglements;
DROP POLICY IF EXISTS "auth write regl" ON public.reglements;
CREATE POLICY "fin read regl" ON public.reglements FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','caissier']));
CREATE POLICY "fin write regl" ON public.reglements FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']));

DROP POLICY IF EXISTS "auth read opcaisse" ON public.operations_caisse;
DROP POLICY IF EXISTS "auth write opcaisse" ON public.operations_caisse;
CREATE POLICY "fin read opcaisse" ON public.operations_caisse FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','caissier']));
CREATE POLICY "fin write opcaisse" ON public.operations_caisse FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','caissier']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','caissier']));

DROP POLICY IF EXISTS "auth read caisses" ON public.caisses;
DROP POLICY IF EXISTS "auth write caisses" ON public.caisses;
CREATE POLICY "fin read caisses" ON public.caisses FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','caissier']));
CREATE POLICY "fin write caisses" ON public.caisses FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']));

DROP POLICY IF EXISTS "auth read avoirs" ON public.avoirs;
DROP POLICY IF EXISTS "auth write avoirs" ON public.avoirs;
CREATE POLICY "fin read avoirs" ON public.avoirs FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','caissier']));
CREATE POLICY "fin write avoirs" ON public.avoirs FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']));

-- ============================================================
-- ACHATS: bons_commande, receptions, demandes_devis, retours
-- SELECT: all authenticated with a role ; WRITE: admin/direction/comptable/magasinier
-- ============================================================
DROP POLICY IF EXISTS "auth read bc" ON public.bons_commande;
DROP POLICY IF EXISTS "auth write bc" ON public.bons_commande;
CREATE POLICY "read bc" ON public.bons_commande FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier','chef_chantier']));
CREATE POLICY "write bc" ON public.bons_commande FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier']));

DROP POLICY IF EXISTS "auth read recep" ON public.receptions;
DROP POLICY IF EXISTS "auth write recep" ON public.receptions;
CREATE POLICY "read recep" ON public.receptions FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier','chef_chantier']));
CREATE POLICY "write recep" ON public.receptions FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier']));

DROP POLICY IF EXISTS "auth read demandes_devis" ON public.demandes_devis;
DROP POLICY IF EXISTS "auth write demandes_devis" ON public.demandes_devis;
CREATE POLICY "read demandes_devis" ON public.demandes_devis FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier','chef_chantier']));
CREATE POLICY "write demandes_devis" ON public.demandes_devis FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier']));

DROP POLICY IF EXISTS "auth read retours" ON public.retours;
DROP POLICY IF EXISTS "auth write retours" ON public.retours;
CREATE POLICY "read retours" ON public.retours FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier','chef_chantier']));
CREATE POLICY "write retours" ON public.retours FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier']));

-- ============================================================
-- VENTES: devis, commandes_vente, livraisons
-- WRITE: admin/direction/comptable
-- ============================================================
DROP POLICY IF EXISTS "auth read devis" ON public.devis;
DROP POLICY IF EXISTS "auth write devis" ON public.devis;
CREATE POLICY "read devis" ON public.devis FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier','chef_chantier']));
CREATE POLICY "write devis" ON public.devis FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']));

DROP POLICY IF EXISTS "auth read commandes_vente" ON public.commandes_vente;
DROP POLICY IF EXISTS "auth write commandes_vente" ON public.commandes_vente;
CREATE POLICY "read cv" ON public.commandes_vente FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier','chef_chantier']));
CREATE POLICY "write cv" ON public.commandes_vente FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']));

DROP POLICY IF EXISTS "auth read livraisons" ON public.livraisons;
DROP POLICY IF EXISTS "auth write livraisons" ON public.livraisons;
CREATE POLICY "read livr" ON public.livraisons FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable','magasinier','chef_chantier']));
CREATE POLICY "write livr" ON public.livraisons FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','direction','comptable']));
