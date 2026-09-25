-- Repair audit_sous_traitance: NEW/OLD records do not all expose chantier_id.
CREATE OR REPLACE FUNCTION public.audit_sous_traitance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_action TEXT;
  v_entity TEXT := TG_TABLE_NAME;
  v_entity_id TEXT;
  v_details JSONB;
  v_chantier UUID;
  v_record JSONB;
BEGIN
  v_record := CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END;
  v_entity_id := v_record->>'id';

  IF TG_OP = 'INSERT' THEN
    v_action := 'create';
    v_details := v_record;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'update';
    v_details := jsonb_build_object('before', to_jsonb(OLD), 'after', to_jsonb(NEW));
  ELSE
    v_action := 'delete';
    v_details := v_record;
  END IF;

  v_chantier := NULLIF(v_record->>'chantier_id', '')::UUID;
  IF v_chantier IS NOT NULL THEN
    v_details := v_details || jsonb_build_object('chantier_id', v_chantier);
  END IF;

  INSERT INTO public.activity_log (user_id, action, entity, entity_id, details)
  VALUES (auth.uid(), v_action, v_entity, v_entity_id, v_details);

  RETURN COALESCE(NEW, OLD);
END
$$;

NOTIFY pgrst, 'reload schema';
