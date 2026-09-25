-- BatiPro demo data. Safe to run repeatedly: fixed IDs + upserts.
-- Run after the schema migrations have been applied.
BEGIN;

DO $$
DECLARE
  relation_row RECORD;
  constraint_definition TEXT;
BEGIN
  IF to_regclass('public.chantiers') IS NOT NULL
     AND to_regclass('public.chantier') IS NOT NULL THEN
    FOR relation_row IN
      SELECT c.oid, c.conrelid::regclass AS table_name, c.conname
      FROM pg_constraint c
      WHERE c.contype = 'f'
        AND c.confrelid = 'public.chantiers'::regclass
    LOOP
      constraint_definition := replace(
        pg_get_constraintdef(relation_row.oid),
        'REFERENCES public.chantiers',
        'REFERENCES public.chantier'
      );
      EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', relation_row.table_name, relation_row.conname);
      EXECUTE format('ALTER TABLE %s ADD CONSTRAINT %I %s', relation_row.table_name, relation_row.conname, constraint_definition);
    END LOOP;
  END IF;
END
$$;

DO $$
BEGIN
  IF to_regclass('public.demandes_devis') IS NOT NULL
     AND to_regclass('public.chantier') IS NOT NULL THEN
    ALTER TABLE public.demandes_devis
      DROP CONSTRAINT IF EXISTS demandes_devis_chantier_id_fkey;
    ALTER TABLE public.demandes_devis
      ADD CONSTRAINT demandes_devis_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;
  END IF;
END
$$;

INSERT INTO public.clients (id, code, raison_sociale, contact, telephone, email, adresse, ville, ice, actif)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'CL-001', 'Atlas Promotion', 'Nadia El Mansouri', '0522401100', 'contact@atlas-promotion.ma', '12 boulevard Zerktouni', 'Casablanca', '001234567890123', true),
  ('10000000-0000-0000-0000-000000000002', 'CL-002', 'Riad Invest', 'Youssef Amrani', '0524322200', 'contact@riad-invest.ma', '8 avenue Mohammed VI', 'Marrakech', '001234567890124', true)
ON CONFLICT (id) DO UPDATE SET raison_sociale = EXCLUDED.raison_sociale, ville = EXCLUDED.ville, actif = EXCLUDED.actif;

INSERT INTO public.fournisseurs (id, code, raison_sociale, contact, telephone, email, adresse, ville, ice, actif)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'FR-001', 'BatiMatériaux Maroc', 'Karim Bennani', '0522334455', 'commercial@batimateriaux.ma', 'Zone industrielle Sidi Bernoussi', 'Casablanca', '002345678901234', true),
  ('20000000-0000-0000-0000-000000000002', 'FR-002', 'ÉlecPro Services', 'Sara Tazi', '0522445566', 'contact@elecpro.ma', '45 rue de l Industrie', 'Rabat', '002345678901235', true)
ON CONFLICT (id) DO UPDATE SET raison_sociale = EXCLUDED.raison_sociale, ville = EXCLUDED.ville, actif = EXCLUDED.actif;

INSERT INTO public.chantier (id, code, nom, client_id, adresse, ville, date_debut, date_fin_prevue, statut, montant_marche, avancement, chef_chantier, notes)
VALUES
  ('30000000-0000-0000-0000-000000000001', 'CH-001', 'Résidence Alizé', '10000000-0000-0000-0000-000000000001', 'Route d El Jadida, lot 18', 'Casablanca', '2026-01-15', '2027-06-30', 'en_cours', 18500000, 42, 'Omar Alaoui', 'Chantier de démonstration principal'),
  ('30000000-0000-0000-0000-000000000002', 'CH-002', 'Villa Riad Atlas', '10000000-0000-0000-0000-000000000002', 'Quartier Targa', 'Marrakech', '2026-03-01', '2026-12-15', 'en_cours', 4200000, 28, 'Hicham Naciri', 'Second chantier de démonstration')
ON CONFLICT (id) DO UPDATE SET nom = EXCLUDED.nom, statut = EXCLUDED.statut, avancement = EXCLUDED.avancement;

INSERT INTO public.phases_chantier (id, chantier_id, code, nom, date_debut, date_fin_prevue, avancement, budget, statut)
VALUES
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'PH-01', 'Gros œuvre', '2026-01-15', '2026-09-30', 65, 7800000, 'en_cours'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'PH-02', 'Second œuvre', '2026-10-01', '2027-03-31', 10, 6200000, 'planifie'),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'PH-01', 'Terrassement et fondations', '2026-03-01', '2026-05-31', 80, 1100000, 'en_cours')
ON CONFLICT (id) DO UPDATE SET nom = EXCLUDED.nom, avancement = EXCLUDED.avancement, statut = EXCLUDED.statut;

INSERT INTO public.taches_chantier (id, chantier_id, phase_id, libelle, responsable, date_debut, date_fin_prevue, avancement, statut, priorite)
VALUES
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Coulage dalle niveau 2', 'Omar Alaoui', '2026-09-20', '2026-09-28', 70, 'en_cours', 'haute'),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Contrôle ferraillage', 'Yassine Fadili', '2026-09-25', '2026-09-27', 0, 'a_faire', 'normale'),
  ('50000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', 'Préparation réseaux EU/EP', 'Hicham Naciri', '2026-09-26', '2026-10-05', 0, 'a_faire', 'normale')
ON CONFLICT (id) DO UPDATE SET libelle = EXCLUDED.libelle, avancement = EXCLUDED.avancement, statut = EXCLUDED.statut;

INSERT INTO public.demandes_devis (id, numero, date_demande, fournisseur_id, chantier_id, objet, montant_estime, statut, notes)
VALUES
  ('60000000-0000-0000-0000-000000000001', 'DD-2026-001', '2026-09-20', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Acier HA et treillis soudé', 385000, 'envoyee', 'Livraison souhaitée sous 10 jours'),
  ('60000000-0000-0000-0000-000000000002', 'DD-2026-002', '2026-09-22', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'Tableaux électriques et câblage', 142000, 'brouillon', null)
ON CONFLICT (id) DO UPDATE SET objet = EXCLUDED.objet, statut = EXCLUDED.statut, montant_estime = EXCLUDED.montant_estime;

INSERT INTO public.bons_commande (id, numero, date_bc, fournisseur_id, chantier_id, montant_ht, tva, montant_ttc, statut, notes)
VALUES
  ('70000000-0000-0000-0000-000000000001', 'BC-2026-001', '2026-09-21', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 385000, 77000, 462000, 'envoye', 'Commande acier gros œuvre')
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, montant_ttc = EXCLUDED.montant_ttc;

INSERT INTO public.sous_traitants (id, code, raison_sociale, contact, telephone, specialite, actif)
VALUES
  ('80000000-0000-0000-0000-000000000001', 'ST-001', 'ClimaTech Maroc', 'Mehdi Zahraoui', '0522556677', 'Climatisation et ventilation', true)
ON CONFLICT (id) DO UPDATE SET raison_sociale = EXCLUDED.raison_sociale, actif = EXCLUDED.actif;

INSERT INTO public.contrats_sous_traitance (id, numero, chantier_id, sous_traitant_id, objet, date_debut, date_fin, montant_ht, tva, montant_ttc, avancement, statut)
VALUES
  ('90000000-0000-0000-0000-000000000001', 'STC-2026-001', '30000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', 'Lot climatisation résidence', '2026-10-01', '2027-02-28', 680000, 136000, 816000, 0, 'en_cours')
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, avancement = EXCLUDED.avancement;

COMMIT;

NOTIFY pgrst, 'reload schema';
