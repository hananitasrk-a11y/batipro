
CREATE OR REPLACE FUNCTION public.audit_sous_traitance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_action text;
  v_entity text := TG_TABLE_NAME;
  v_entity_id text;
  v_details jsonb;
  v_chantier uuid;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'create';
    v_entity_id := NEW.id::text;
    v_details := to_jsonb(NEW);
    v_chantier := CASE WHEN TG_TABLE_NAME = 'contrats_sous_traitance' THEN NEW.chantier_id ELSE NULL END;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'update';
    v_entity_id := NEW.id::text;
    v_details := jsonb_build_object('before', to_jsonb(OLD), 'after', to_jsonb(NEW));
    v_chantier := CASE WHEN TG_TABLE_NAME = 'contrats_sous_traitance' THEN NEW.chantier_id ELSE NULL END;
  ELSE
    v_action := 'delete';
    v_entity_id := OLD.id::text;
    v_details := to_jsonb(OLD);
    v_chantier := CASE WHEN TG_TABLE_NAME = 'contrats_sous_traitance' THEN OLD.chantier_id ELSE NULL END;
  END IF;

  IF v_chantier IS NOT NULL THEN
    v_details := v_details || jsonb_build_object('chantier_id', v_chantier);
  END IF;

  INSERT INTO public.activity_log (user_id, action, entity, entity_id, details)
  VALUES (auth.uid(), v_action, v_entity, v_entity_id, v_details);

  RETURN COALESCE(NEW, OLD);
END $$;

DROP TRIGGER IF EXISTS trg_audit_sous_traitants ON public.sous_traitants;
CREATE TRIGGER trg_audit_sous_traitants
AFTER INSERT OR UPDATE OR DELETE ON public.sous_traitants
FOR EACH ROW EXECUTE FUNCTION public.audit_sous_traitance();

DROP TRIGGER IF EXISTS trg_audit_contrats_sous_traitance ON public.contrats_sous_traitance;
CREATE TRIGGER trg_audit_contrats_sous_traitance
AFTER INSERT OR UPDATE OR DELETE ON public.contrats_sous_traitance
FOR EACH ROW EXECUTE FUNCTION public.audit_sous_traitance();

CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON public.activity_log(entity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_details_chantier ON public.activity_log ((details->>'chantier_id'));
