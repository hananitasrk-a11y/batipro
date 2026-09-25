-- Align every module relation with the live singular public.chantier table.
DO $$
DECLARE
  relation_row RECORD;
  constraint_definition TEXT;
BEGIN
  IF to_regclass('public.chantier') IS NULL THEN
    RAISE EXCEPTION 'public.chantier must exist before repairing foreign keys';
  END IF;

  IF to_regclass('public.chantiers') IS NOT NULL THEN
    FOR relation_row IN
      SELECT
        c.oid,
        c.conrelid::regclass AS table_name,
        c.conname
      FROM pg_constraint c
      WHERE c.contype = 'f'
        AND c.confrelid = 'public.chantiers'::regclass
    LOOP
      constraint_definition := pg_get_constraintdef(relation_row.oid);
      EXECUTE format(
        'ALTER TABLE %s DROP CONSTRAINT %I',
        relation_row.table_name,
        relation_row.conname
      );
      constraint_definition := replace(
        constraint_definition,
        'REFERENCES public.chantiers',
        'REFERENCES public.chantier'
      );
      EXECUTE format(
        'ALTER TABLE %s ADD CONSTRAINT %I %s',
        relation_row.table_name,
        relation_row.conname,
        constraint_definition
      );
    END LOOP;
  END IF;
END
$$;

NOTIFY pgrst, 'reload schema';
