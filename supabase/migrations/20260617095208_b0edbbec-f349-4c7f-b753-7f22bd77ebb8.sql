
CREATE INDEX IF NOT EXISTS idx_chantiers_statut ON public.chantiers(statut);
CREATE INDEX IF NOT EXISTS idx_chantiers_client_id ON public.chantiers(client_id);
CREATE INDEX IF NOT EXISTS idx_factures_client_id ON public.factures(client_id);
CREATE INDEX IF NOT EXISTS idx_factures_statut ON public.factures(statut);
CREATE INDEX IF NOT EXISTS idx_factures_created_at ON public.factures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reglements_mode ON public.reglements(mode);
CREATE INDEX IF NOT EXISTS idx_reglements_client ON public.reglements(client_id);
CREATE INDEX IF NOT EXISTS idx_reglements_fournisseur ON public.reglements(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_reglements_created_at ON public.reglements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bons_commande_fournisseur ON public.bons_commande(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_bons_commande_statut ON public.bons_commande(statut);
CREATE INDEX IF NOT EXISTS idx_operations_caisse_caisse ON public.operations_caisse(caisse_id);
CREATE INDEX IF NOT EXISTS idx_operations_caisse_type ON public.operations_caisse(type_operation);
CREATE INDEX IF NOT EXISTS idx_pointages_chantier ON public.pointages(chantier_id);
CREATE INDEX IF NOT EXISTS idx_pointages_employe ON public.pointages(employe_id);
CREATE INDEX IF NOT EXISTS idx_mouvements_stock_depot ON public.mouvements_stock(depot_id);
CREATE INDEX IF NOT EXISTS idx_mouvements_stock_type ON public.mouvements_stock(type_mvt);
CREATE INDEX IF NOT EXISTS idx_livraisons_vehicule ON public.livraisons(vehicule_id);
CREATE INDEX IF NOT EXISTS idx_livraisons_statut ON public.livraisons(statut);
CREATE INDEX IF NOT EXISTS idx_consommation_gasoil_engin ON public.consommation_gasoil(engin_id);
CREATE INDEX IF NOT EXISTS idx_pannes_engins_engin ON public.pannes_engins(engin_id);
CREATE INDEX IF NOT EXISTS idx_absences_employe ON public.absences(employe_id);
CREATE INDEX IF NOT EXISTS idx_entretiens_realises_engin ON public.entretiens_realises(engin_id);

CREATE OR REPLACE FUNCTION public.dashboard_kpis()
RETURNS jsonb LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'chantiersActifs', (SELECT count(*) FROM chantiers WHERE statut = 'en_cours'),
    'employes',        (SELECT count(*) FROM employes),
    'engins',          (SELECT count(*) FROM engins),
    'vehicules',       (SELECT count(*) FROM vehicules),
    'clients',         (SELECT count(*) FROM clients),
    'fournisseurs',    (SELECT count(*) FROM fournisseurs),
    'depots',          (SELECT count(*) FROM depots),
    'produits',        (SELECT count(*) FROM produits_finis),
    'caFacture',       (SELECT COALESCE(sum(montant_ttc),0) FROM factures),
    'encaisse',        (SELECT COALESCE(sum(montant),0)     FROM reglements),
    'achats',          (SELECT COALESCE(sum(montant_ttc),0) FROM bons_commande),
    'depenses',        (SELECT COALESCE(sum(montant),0)     FROM operations_caisse WHERE type_operation = 'depense')
  )
$$;

CREATE OR REPLACE FUNCTION public._kpi_ident_ok(p_table text, p_column text)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = p_table
      AND (p_column IS NULL OR column_name = p_column)
  )
$$;

CREATE OR REPLACE FUNCTION public.kpi_count(p_table text, p_filters jsonb DEFAULT '{}'::jsonb)
RETURNS bigint LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public AS $$
DECLARE k text; v text; where_sql text := ''; total bigint;
BEGIN
  IF NOT public._kpi_ident_ok(p_table, NULL) THEN RAISE EXCEPTION 'invalid table'; END IF;
  IF p_filters IS NOT NULL AND jsonb_typeof(p_filters) = 'object' THEN
    FOR k, v IN SELECT * FROM jsonb_each_text(p_filters) LOOP
      IF NOT public._kpi_ident_ok(p_table, k) THEN RAISE EXCEPTION 'invalid column %', k; END IF;
      where_sql := where_sql || format(' AND %I = %L', k, v);
    END LOOP;
  END IF;
  EXECUTE format('SELECT count(*) FROM public.%I WHERE TRUE %s', p_table, where_sql) INTO total;
  RETURN total;
END $$;

CREATE OR REPLACE FUNCTION public.kpi_sum(p_table text, p_field text, p_filters jsonb DEFAULT '{}'::jsonb)
RETURNS numeric LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public AS $$
DECLARE k text; v text; where_sql text := ''; total numeric;
BEGIN
  IF NOT public._kpi_ident_ok(p_table, p_field) THEN RAISE EXCEPTION 'invalid table/field'; END IF;
  IF p_filters IS NOT NULL AND jsonb_typeof(p_filters) = 'object' THEN
    FOR k, v IN SELECT * FROM jsonb_each_text(p_filters) LOOP
      IF NOT public._kpi_ident_ok(p_table, k) THEN RAISE EXCEPTION 'invalid column %', k; END IF;
      where_sql := where_sql || format(' AND %I = %L', k, v);
    END LOOP;
  END IF;
  EXECUTE format('SELECT COALESCE(sum(%I),0) FROM public.%I WHERE TRUE %s', p_field, p_table, where_sql) INTO total;
  RETURN total;
END $$;

CREATE OR REPLACE FUNCTION public.kpi_group(
  p_table text, p_group text, p_field text DEFAULT NULL,
  p_agg text DEFAULT 'count', p_limit int DEFAULT 10
) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public AS $$
DECLARE agg_sql text; result jsonb;
BEGIN
  IF NOT public._kpi_ident_ok(p_table, p_group) THEN RAISE EXCEPTION 'invalid table/group'; END IF;
  IF p_agg = 'sum' THEN
    IF p_field IS NULL OR NOT public._kpi_ident_ok(p_table, p_field) THEN RAISE EXCEPTION 'invalid field'; END IF;
    agg_sql := format('COALESCE(sum(%I),0)::numeric', p_field);
  ELSIF p_agg = 'count' THEN
    agg_sql := 'count(*)::numeric';
  ELSE
    RAISE EXCEPTION 'invalid agg';
  END IF;
  EXECUTE format(
    'SELECT COALESCE(jsonb_agg(t), ''[]''::jsonb) FROM (
        SELECT COALESCE(%I::text, ''—'') AS name, %s AS value
        FROM public.%I GROUP BY %I ORDER BY value DESC LIMIT %s
     ) t', p_group, agg_sql, p_table, p_group, p_limit
  ) INTO result;
  RETURN result;
END $$;

GRANT EXECUTE ON FUNCTION public.dashboard_kpis() TO authenticated;
GRANT EXECUTE ON FUNCTION public.kpi_count(text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.kpi_sum(text, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.kpi_group(text, text, text, text, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public._kpi_ident_ok(text, text) TO authenticated;
