-- BatiPro demo data. Safe to run repeatedly: fixed IDs + upserts.
-- Run after the schema migrations have been applied.
BEGIN;

DO $$
BEGIN
  IF to_regclass('public.chantier') IS NOT NULL THEN
    ALTER TABLE IF EXISTS public.bons_commande
      DROP CONSTRAINT IF EXISTS bons_commande_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.bons_commande
      ADD CONSTRAINT bons_commande_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.contrats_sous_traitance
      DROP CONSTRAINT IF EXISTS contrats_sous_traitance_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.contrats_sous_traitance
      ADD CONSTRAINT contrats_sous_traitance_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.demandes_devis
      DROP CONSTRAINT IF EXISTS demandes_devis_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.demandes_devis
      ADD CONSTRAINT demandes_devis_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.devis
      DROP CONSTRAINT IF EXISTS devis_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.devis
      ADD CONSTRAINT devis_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.devis
      DROP CONSTRAINT IF EXISTS devis_client_id_fkey;
    ALTER TABLE IF EXISTS public.devis
      ADD CONSTRAINT devis_client_id_fkey
      FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.commandes_vente
      DROP CONSTRAINT IF EXISTS commandes_vente_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.commandes_vente
      ADD CONSTRAINT commandes_vente_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.commandes_vente
      DROP CONSTRAINT IF EXISTS commandes_vente_client_id_fkey;
    ALTER TABLE IF EXISTS public.commandes_vente
      ADD CONSTRAINT commandes_vente_client_id_fkey
      FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.commandes_vente
      DROP CONSTRAINT IF EXISTS commandes_vente_devis_id_fkey;
    ALTER TABLE IF EXISTS public.commandes_vente
      ADD CONSTRAINT commandes_vente_devis_id_fkey
      FOREIGN KEY (devis_id) REFERENCES public.devis(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.livraisons
      DROP CONSTRAINT IF EXISTS livraisons_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.livraisons
      ADD CONSTRAINT livraisons_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.livraisons
      DROP CONSTRAINT IF EXISTS livraisons_client_id_fkey;
    ALTER TABLE IF EXISTS public.livraisons
      ADD CONSTRAINT livraisons_client_id_fkey
      FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.livraisons
      DROP CONSTRAINT IF EXISTS livraisons_commande_id_fkey;
    ALTER TABLE IF EXISTS public.livraisons
      ADD CONSTRAINT livraisons_commande_id_fkey
      FOREIGN KEY (commande_id) REFERENCES public.commandes_vente(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.employes
      DROP CONSTRAINT IF EXISTS employes_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.employes
      ADD CONSTRAINT employes_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.engins
      DROP CONSTRAINT IF EXISTS engins_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.engins
      ADD CONSTRAINT engins_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.factures
      DROP CONSTRAINT IF EXISTS factures_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.factures
      ADD CONSTRAINT factures_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.receptions
      DROP CONSTRAINT IF EXISTS receptions_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.receptions
      ADD CONSTRAINT receptions_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.retours
      DROP CONSTRAINT IF EXISTS retours_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.retours
      ADD CONSTRAINT retours_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.mouvements_stock
      DROP CONSTRAINT IF EXISTS mouvements_stock_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.mouvements_stock
      ADD CONSTRAINT mouvements_stock_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.pointages
      DROP CONSTRAINT IF EXISTS pointages_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.pointages
      ADD CONSTRAINT pointages_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.transferts_materiel
      DROP CONSTRAINT IF EXISTS transferts_materiel_chantier_source_id_fkey;
    ALTER TABLE IF EXISTS public.transferts_materiel
      ADD CONSTRAINT transferts_materiel_chantier_source_id_fkey
      FOREIGN KEY (chantier_source_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.transferts_materiel
      DROP CONSTRAINT IF EXISTS transferts_materiel_chantier_destination_id_fkey;
    ALTER TABLE IF EXISTS public.transferts_materiel
      ADD CONSTRAINT transferts_materiel_chantier_destination_id_fkey
      FOREIGN KEY (chantier_destination_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.consommation_gasoil
      DROP CONSTRAINT IF EXISTS consommation_gasoil_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.consommation_gasoil
      ADD CONSTRAINT consommation_gasoil_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.locations_materiel
      DROP CONSTRAINT IF EXISTS locations_materiel_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.locations_materiel
      ADD CONSTRAINT locations_materiel_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.lignes_ecriture
      DROP CONSTRAINT IF EXISTS lignes_ecriture_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.lignes_ecriture
      ADD CONSTRAINT lignes_ecriture_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.phases_chantier
      DROP CONSTRAINT IF EXISTS phases_chantier_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.phases_chantier
      ADD CONSTRAINT phases_chantier_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE CASCADE;

    ALTER TABLE IF EXISTS public.taches_chantier
      DROP CONSTRAINT IF EXISTS taches_chantier_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.taches_chantier
      ADD CONSTRAINT taches_chantier_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE CASCADE;

    ALTER TABLE IF EXISTS public.consommation_constituants
      DROP CONSTRAINT IF EXISTS consommation_constituants_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.consommation_constituants
      ADD CONSTRAINT consommation_constituants_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

    ALTER TABLE IF EXISTS public.rendement_journalier
      DROP CONSTRAINT IF EXISTS rendement_journalier_chantier_id_fkey;
    ALTER TABLE IF EXISTS public.rendement_journalier
      ADD CONSTRAINT rendement_journalier_chantier_id_fkey
      FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE CASCADE;
  END IF;
END
$$;

INSERT INTO public.user_roles (user_id, role)
SELECT au.id, 'admin'
FROM auth.users au
WHERE au.email = 'admin@batipro.ma'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.societe (
  id, raison_sociale, forme_juridique, rc, ice, if_fiscal, cnss, patente,
  adresse, ville, telephone, email, site_web, logo_url, devise_defaut
)
VALUES (
  '00000000-0000-0000-0000-000000000010',
  'BatiPro Construction Maroc',
  'SARL',
  'RC Casablanca 2024/1234',
  '001234567890123',
  'IF-2024-00123',
  'CNSS-451236',
  'PAT-88912',
  'Zone industrielle Sidi Bernoussi, Rue des Chantiers, N° 42',
  'Casablanca',
  '+212 522 334 455',
  'contact@batipro.ma',
  'https://www.batipro.ma',
  'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
  'MAD'
)
ON CONFLICT (id) DO UPDATE SET
  raison_sociale = EXCLUDED.raison_sociale,
  forme_juridique = EXCLUDED.forme_juridique,
  rc = EXCLUDED.rc,
  ice = EXCLUDED.ice,
  if_fiscal = EXCLUDED.if_fiscal,
  cnss = EXCLUDED.cnss,
  patente = EXCLUDED.patente,
  adresse = EXCLUDED.adresse,
  ville = EXCLUDED.ville,
  telephone = EXCLUDED.telephone,
  email = EXCLUDED.email,
  site_web = EXCLUDED.site_web,
  logo_url = EXCLUDED.logo_url,
  devise_defaut = EXCLUDED.devise_defaut;

INSERT INTO public.clients (id, code, raison_sociale, contact, telephone, email, adresse, ville, ice, actif)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'CL-001', 'Atlas Promotion', 'Nadia El Mansouri', '0522401100', 'contact@atlas-promotion.ma', '12 boulevard Zerktouni', 'Casablanca', '001234567890123', true),
  ('10000000-0000-0000-0000-000000000002', 'CL-002', 'Riad Invest', 'Youssef Amrani', '0524322200', 'contact@riad-invest.ma', '8 avenue Mohammed VI', 'Marrakech', '001234567890124', true)
ON CONFLICT (code) DO UPDATE SET raison_sociale = EXCLUDED.raison_sociale, ville = EXCLUDED.ville, actif = EXCLUDED.actif;

INSERT INTO public.fournisseurs (id, code, raison_sociale, contact, telephone, email, adresse, ville, ice, actif)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'FR-001', 'BatiMatériaux Maroc', 'Karim Bennani', '0522334455', 'commercial@batimateriaux.ma', 'Zone industrielle Sidi Bernoussi', 'Casablanca', '002345678901234', true),
  ('20000000-0000-0000-0000-000000000002', 'FR-002', 'ÉlecPro Services', 'Sara Tazi', '0522445566', 'contact@elecpro.ma', '45 rue de l Industrie', 'Rabat', '002345678901235', true),
  ('20000000-0000-0000-0000-000000000003', 'FR-003', 'Pneus & Carburants du Sud', 'Anass Belkacem', '0522998877', 'achat@pneuscarburants.ma', 'Route de Safi - Lot A', 'Agadir', '002345678901236', true)
ON CONFLICT (code) DO UPDATE SET raison_sociale = EXCLUDED.raison_sociale, ville = EXCLUDED.ville, actif = EXCLUDED.actif;

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

INSERT INTO public.rendement_journalier (id, chantier_id, phase_id, date_jour, quantite_produite, unite, heures_travaillees, effectif, meteo, notes)
VALUES
  ('56000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '2026-09-20', 28.5, 'M3', 58, 12, 'ensoleille', 'Production conforme, béton livré avant l’heure prévue.'),
  ('56000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '2026-09-21', 31.0, 'M3', 62, 13, 'nuageux', 'Bon rythme de mise en place sur dalle niveau 2.'),
  ('56000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', '2026-09-24', 18.0, 'M3', 46, 9, 'ensoleille', 'Terrassement finalisé, préparation réseaux en avance.'),
  ('56000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', '2026-09-25', 22.4, 'M3', 49, 10, 'variable', 'Second œuvre en légère hausse, travaux de finition sur les façades.')
ON CONFLICT (id) DO UPDATE SET quantite_produite = EXCLUDED.quantite_produite, heures_travaillees = EXCLUDED.heures_travaillees, effectif = EXCLUDED.effectif, meteo = EXCLUDED.meteo, notes = EXCLUDED.notes;

INSERT INTO public.activity_log (id, user_id, action, entity, entity_id, details, created_at)
VALUES
  ('98000000-0000-0000-0000-000000000001', NULL, 'create', 'sous_traitants', '80000000-0000-0000-0000-000000000001', '{"raison_sociale":"ClimaTech Maroc","specialite":"Climatisation et ventilation","actif":true}', '2026-09-20T09:15:00+00'),
  ('98000000-0000-0000-0000-000000000002', NULL, 'update', 'contrats_sous_traitance', '90000000-0000-0000-0000-000000000001', '{"numero":"STC-2026-001","chantier_id":"30000000-0000-0000-0000-000000000001","statut":"en_cours","avancement":15}', '2026-09-22T11:30:00+00'),
  ('98000000-0000-0000-0000-000000000003', NULL, 'create', 'contrats_sous_traitance', '90000000-0000-0000-0000-000000000001', '{"numero":"STC-2026-001","chantier_id":"30000000-0000-0000-0000-000000000001","montant_ttc":816000,"objet":"Lot climatisation résidence"}', '2026-09-23T14:20:00+00'),
  ('98000000-0000-0000-0000-000000000004', NULL, 'create', 'contrats_sous_traitance', '90000000-0000-0000-0000-000000000002', '{"numero":"STC-2026-002","chantier_id":"30000000-0000-0000-0000-000000000002","montant_ttc":420000,"objet":"Réalisation façade et menuiseries"}', '2026-09-24T10:05:00+00'),
  ('98000000-0000-0000-0000-000000000005', NULL, 'update', 'sous_traitants', '80000000-0000-0000-0000-000000000002', '{"raison_sociale":"Bâtimec Atelier","specialite":"Façades et menuiseries","statut":"active"}', '2026-09-24T16:45:00+00')
ON CONFLICT (id) DO UPDATE SET action = EXCLUDED.action, entity = EXCLUDED.entity, details = EXCLUDED.details;

INSERT INTO public.demandes_devis (id, numero, date_demande, fournisseur_id, chantier_id, objet, montant_estime, statut, notes)
VALUES
  ('60000000-0000-0000-0000-000000000001', 'DD-2026-001', '2026-09-20', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Acier HA et treillis soudé', 385000, 'envoyee', 'Livraison souhaitée sous 10 jours'),
  ('60000000-0000-0000-0000-000000000002', 'DD-2026-002', '2026-09-22', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'Tableaux électriques et câblage', 142000, 'brouillon', null),
  ('60000000-0000-0000-0000-000000000003', 'DD-2026-003', '2026-09-24', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 'Carburant diesel pour engins', 56000, 'approuvee', 'Livraison en deux tranches selon planning chantier')
ON CONFLICT (id) DO UPDATE SET objet = EXCLUDED.objet, statut = EXCLUDED.statut, montant_estime = EXCLUDED.montant_estime;

INSERT INTO public.devis (id, numero, date_devis, client_id, chantier_id, objet, montant_ht, tva, montant_ttc, statut, validite, notes)
VALUES
  ('61000000-0000-0000-0000-000000000001', 'DV-2026-001', '2026-09-18', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Réalisation dalle béton niveau 2', 186000, 37200, 223200, 'accepte', '2026-10-05', 'Devis validé après reprise du programme de chantier.'),
  ('61000000-0000-0000-0000-000000000002', 'DV-2026-002', '2026-09-24', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'Terrassement et assainissement villa', 93000, 18600, 111600, 'envoye', '2026-10-10', 'Demande de confirmation du client pour la commande définitive.')
ON CONFLICT (id) DO UPDATE SET numero = EXCLUDED.numero, objet = EXCLUDED.objet, montant_ttc = EXCLUDED.montant_ttc, statut = EXCLUDED.statut;

INSERT INTO public.commandes_vente (id, numero, date_commande, client_id, chantier_id, devis_id, montant_ht, tva, montant_ttc, date_livraison, statut, notes)
VALUES
  ('62000000-0000-0000-0000-000000000001', 'CV-2026-001', '2026-09-20', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '61000000-0000-0000-0000-000000000001', 186000, 37200, 223200, '2026-10-02', 'confirmee', 'Commande confirmée selon devis validé.'),
  ('62000000-0000-0000-0000-000000000002', 'CV-2026-002', '2026-09-25', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '61000000-0000-0000-0000-000000000002', 93000, 18600, 111600, '2026-10-08', 'livree', 'Livraison réalisée sur le chantier, facture en attente.')
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, montant_ttc = EXCLUDED.montant_ttc, notes = EXCLUDED.notes;

INSERT INTO public.devis (id, numero, date_devis, client_id, chantier_id, objet, montant_ht, tva, montant_ttc, statut, validite, notes)
VALUES
  ('61000000-0000-0000-0000-000000000003', 'DV-2026-003', '2026-09-26', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Devis généré automatiquement pour la commande client', 194500, 38900, 233400, 'accepte', '2026-10-18', 'Devis généré automatiquement à partir des données de vente et de chantier.')
ON CONFLICT (id) DO UPDATE SET numero = EXCLUDED.numero, montant_ttc = EXCLUDED.montant_ttc, statut = EXCLUDED.statut, notes = EXCLUDED.notes;

INSERT INTO public.commandes_vente (id, numero, date_commande, client_id, chantier_id, devis_id, montant_ht, tva, montant_ttc, date_livraison, statut, notes)
VALUES
  ('62000000-0000-0000-0000-000000000003', 'CV-2026-003', '2026-09-27', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '61000000-0000-0000-0000-000000000003', 194500, 38900, 233400, '2026-10-05', 'confirmee', 'Commande générée automatiquement depuis le devis accepté.')
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, montant_ttc = EXCLUDED.montant_ttc, notes = EXCLUDED.notes;

INSERT INTO public.factures (id, numero, date_facture, client_id, chantier_id, montant_ht, tva, montant_ttc, statut, echeance, notes)
VALUES
  ('26000000-0000-0000-0000-000000000005', 'FA-2026-005', '2026-09-28', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 194500, 38900, 233400, 'envoyee', '2026-10-28', 'Facture générée automatiquement depuis la commande client CV-2026-003.')
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, montant_ttc = EXCLUDED.montant_ttc, notes = EXCLUDED.notes;

INSERT INTO public.avoirs (id, numero, date_avoir, type_avoir, fournisseur_id, client_id, facture_id, montant_ht, tva, montant_ttc, statut, notes)
VALUES
  ('79000000-0000-0000-0000-000000000005', 'AV-2026-005', '2026-09-30', 'vente', NULL, '10000000-0000-0000-0000-000000000001', '26000000-0000-0000-0000-000000000005', 11670, 2334, 14004, 'brouillon', 'Avoir généré automatiquement pour ajustement de quantité sur facture client.')
ON CONFLICT (id) DO UPDATE SET montant_ttc = EXCLUDED.montant_ttc, statut = EXCLUDED.statut, notes = EXCLUDED.notes;

INSERT INTO public.livraisons (id, numero, date_livraison, client_id, chantier_id, commande_id, vehicule_id, chauffeur, montant_ht, statut, notes)
VALUES
  ('63000000-0000-0000-0000-000000000001', 'LV-2026-001', '2026-09-22', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '62000000-0000-0000-0000-000000000001', '23000000-0000-0000-0000-000000000001', 'Hicham Naciri', 186000, 'livree', 'Livraison de béton et matériel sur chantier.'),
  ('63000000-0000-0000-0000-000000000002', 'LV-2026-002', '2026-09-26', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '62000000-0000-0000-0000-000000000002', '23000000-0000-0000-0000-000000000002', 'Aymen Khatib', 93000, 'livree', 'Terrassement et matériaux livrés selon planning.')
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, montant_ht = EXCLUDED.montant_ht, notes = EXCLUDED.notes;

INSERT INTO public.bons_commande (id, numero, date_bc, fournisseur_id, chantier_id, montant_ht, tva, montant_ttc, statut, notes)
VALUES
  ('70000000-0000-0000-0000-000000000001', 'BC-2026-001', '2026-09-21', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 385000, 77000, 462000, 'envoye', 'Commande acier gros œuvre'),
  ('70000000-0000-0000-0000-000000000002', 'BC-2026-002', '2026-09-23', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 128400, 25680, 154080, 'livre', 'Commande câblage et tableaux électriques livrés sur site')
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, montant_ttc = EXCLUDED.montant_ttc;

INSERT INTO public.receptions (id, numero, date_reception, fournisseur_id, bon_commande_id, chantier_id, depot_id, montant_ht, statut, notes)
VALUES
  ('77000000-0000-0000-0000-000000000001', 'RC-2026-001', '2026-09-21', '20000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', 214500, 'recue', 'Livraison acier et treillis conforme au BC-2026-001'),
  ('77000000-0000-0000-0000-000000000002', 'RC-2026-002', '2026-09-24', '20000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000002', 118000, 'recue', 'Tableaux électriques reçus et stockés au dépôt Marrakech')
ON CONFLICT (id) DO UPDATE SET montant_ht = EXCLUDED.montant_ht, statut = EXCLUDED.statut, notes = EXCLUDED.notes;

INSERT INTO public.factures (id, numero, date_facture, client_id, chantier_id, montant_ht, tva, montant_ttc, statut, echeance, notes)
VALUES
  ('26000000-0000-0000-0000-000000000003', 'FA-2026-003', '2026-09-22', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 184000, 36800, 220800, 'payee', '2026-10-24', 'Facture achat matériaux - BatiMatériaux Maroc'),
  ('26000000-0000-0000-0000-000000000004', 'FA-2026-004', '2026-09-25', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 98000, 19600, 117600, 'envoyee', '2026-11-01', 'Facture achat électricité - ÉlecPro Services')
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, montant_ttc = EXCLUDED.montant_ttc, notes = EXCLUDED.notes;

INSERT INTO public.retours (id, numero, date_retour, type_retour, fournisseur_id, client_id, facture_id, chantier_id, motif, montant_ht, statut, notes)
VALUES
  ('78000000-0000-0000-0000-000000000001', 'RT-2026-001', '2026-09-22', 'achat', '20000000-0000-0000-0000-000000000001', NULL, '26000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 'Matériaux livrés avec défaut sur lot d’acier', 15000, 'traite', 'Retour accepté après contrôle qualité'),
  ('78000000-0000-0000-0000-000000000002', 'RT-2026-002', '2026-09-25', 'achat', '20000000-0000-0000-0000-000000000002', NULL, '26000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', 'Accessoires électriques non conformes', 6400, 'en_cours', 'Retour en attente de validation fournisseur')
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, montant_ht = EXCLUDED.montant_ht, notes = EXCLUDED.notes;

INSERT INTO public.avoirs (id, numero, date_avoir, type_avoir, fournisseur_id, client_id, facture_id, montant_ht, tva, montant_ttc, statut, notes)
VALUES
  ('79000000-0000-0000-0000-000000000001', 'AV-2026-001', '2026-09-23', 'achat', '20000000-0000-0000-0000-000000000001', NULL, '26000000-0000-0000-0000-000000000003', 13600, 2720, 16320, 'valide', 'Avoir pour quantité livrée en trop sur la commande acier'),
  ('79000000-0000-0000-0000-000000000002', 'AV-2026-002', '2026-09-26', 'achat', '20000000-0000-0000-0000-000000000002', NULL, '26000000-0000-0000-0000-000000000004', 4800, 960, 5760, 'brouillon', 'Avoir partiel sur câblage inutilisé')
ON CONFLICT (id) DO UPDATE SET montant_ttc = EXCLUDED.montant_ttc, statut = EXCLUDED.statut, notes = EXCLUDED.notes;

INSERT INTO public.reglements (id, numero, date_reglement, type_reglement, client_id, fournisseur_id, facture_id, mode, montant, reference, notes)
VALUES
  ('80000000-0000-0000-0000-000000000003', 'REG-2026-001', '2026-09-23', 'fournisseur', NULL, '20000000-0000-0000-0000-000000000001', '26000000-0000-0000-0000-000000000003', 'virement', 110000, 'REF-TR-88321', 'Règlement partiel facture BatiMatériaux Maroc'),
  ('80000000-0000-0000-0000-000000000004', 'REG-2026-002', '2026-09-25', 'fournisseur', NULL, '20000000-0000-0000-0000-000000000002', '26000000-0000-0000-0000-000000000004', 'cheque', 42000, 'REF-CH-45112', 'Règlement fournisseur ÉlecPro Services'),
  ('80000000-0000-0000-0000-000000000005', 'REG-CL-2026-001', '2026-09-21', 'client', '10000000-0000-0000-0000-000000000001', NULL, '26000000-0000-0000-0000-000000000001', 'virement', 150000, 'REF-CL-22091', 'Règlement client Atlas Promotion sur facture d’avancement'),
  ('80000000-0000-0000-0000-000000000006', 'REG-CL-2026-002', '2026-09-27', 'client', '10000000-0000-0000-0000-000000000002', NULL, '26000000-0000-0000-0000-000000000002', 'cheque', 70000, 'REF-CL-33284', 'Règlement client Riad Invest sur travaux terrassement')
ON CONFLICT (id) DO UPDATE SET montant = EXCLUDED.montant, mode = EXCLUDED.mode, notes = EXCLUDED.notes;

INSERT INTO public.retours (id, numero, date_retour, type_retour, fournisseur_id, client_id, facture_id, chantier_id, motif, montant_ht, statut, notes)
VALUES
  ('78000000-0000-0000-0000-000000000003', 'RT-2026-003', '2026-09-28', 'vente', NULL, '10000000-0000-0000-0000-000000000001', '26000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Retour de surplus de béton non utilisé sur dalle', 12000, 'traite', 'Ajustement de la facture de fin de chantier.'),
  ('78000000-0000-0000-0000-000000000004', 'RT-2026-004', '2026-09-29', 'vente', NULL, '10000000-0000-0000-0000-000000000002', '26000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'Matériaux livrés en quantité supérieure à la demande', 6800, 'en_cours', 'Validation du client en attente.')
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, montant_ht = EXCLUDED.montant_ht, notes = EXCLUDED.notes;

INSERT INTO public.avoirs (id, numero, date_avoir, type_avoir, fournisseur_id, client_id, facture_id, montant_ht, tva, montant_ttc, statut, notes)
VALUES
  ('79000000-0000-0000-0000-000000000003', 'AV-2026-003', '2026-09-28', 'vente', NULL, '10000000-0000-0000-0000-000000000001', '26000000-0000-0000-0000-000000000001', 11800, 2360, 14160, 'valide', 'Avoir client pour surplus de béton livré.'),
  ('79000000-0000-0000-0000-000000000004', 'AV-2026-004', '2026-09-30', 'vente', NULL, '10000000-0000-0000-0000-000000000002', '26000000-0000-0000-0000-000000000002', 6500, 1300, 7800, 'brouillon', 'Avoir partiel à finaliser avec la comptabilité.')
ON CONFLICT (id) DO UPDATE SET montant_ttc = EXCLUDED.montant_ttc, statut = EXCLUDED.statut, notes = EXCLUDED.notes;

INSERT INTO public.sous_traitants (id, code, raison_sociale, contact, telephone, specialite, actif)
VALUES
  ('80000000-0000-0000-0000-000000000001', 'ST-001', 'ClimaTech Maroc', 'Mehdi Zahraoui', '0522556677', 'Climatisation et ventilation', true),
  ('80000000-0000-0000-0000-000000000002', 'ST-002', 'Bâtimec Atelier', 'Sami Ait Ali', '0522667788', 'Façades et menuiseries', true)
ON CONFLICT (id) DO UPDATE SET raison_sociale = EXCLUDED.raison_sociale, actif = EXCLUDED.actif;

INSERT INTO public.contrats_sous_traitance (id, numero, chantier_id, sous_traitant_id, objet, date_debut, date_fin, montant_ht, tva, montant_ttc, avancement, statut)
VALUES
  ('90000000-0000-0000-0000-000000000001', 'STC-2026-001', '30000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', 'Lot climatisation résidence', '2026-10-01', '2027-02-28', 680000, 136000, 816000, 0, 'en_cours'),
  ('90000000-0000-0000-0000-000000000002', 'STC-2026-002', '30000000-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000002', 'Façades et menuiseries extérieures', '2026-09-15', '2026-12-20', 350000, 70000, 420000, 18, 'en_cours')
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, avancement = EXCLUDED.avancement;

INSERT INTO public.depots (id, code, nom, adresse, responsable, telephone, actif)
VALUES
  ('11000000-0000-0000-0000-000000000001', 'DP-001', 'Dépôt Casablanca', 'Zone industrielle Sidi Bernoussi, Casablanca', 'Mohamed Bensaid', '0522336677', true),
  ('11000000-0000-0000-0000-000000000002', 'DP-002', 'Dépôt Marrakech', 'Quartier industriel, Marrakech', 'Salma Alami', '0523447788', true)
ON CONFLICT (code) DO UPDATE SET nom = EXCLUDED.nom, actif = EXCLUDED.actif;

INSERT INTO public.unites (id, code, libelle)
VALUES
  ('12000000-0000-0000-0000-000000000001', 'U', 'Unité'),
  ('12000000-0000-0000-0000-000000000002', 'KG', 'Kilogramme'),
  ('12000000-0000-0000-0000-000000000003', 'M3', 'Mètre cube'),
  ('12000000-0000-0000-0000-000000000004', 'H', 'Heure')
ON CONFLICT (code) DO UPDATE SET libelle = EXCLUDED.libelle;

INSERT INTO public.tva (id, libelle, taux, actif)
VALUES
  ('13000000-0000-0000-0000-000000000001', 'TVA standard', 20.00, true),
  ('13000000-0000-0000-0000-000000000002', 'TVA réduit', 10.00, true)
ON CONFLICT (id) DO UPDATE SET taux = EXCLUDED.taux, actif = EXCLUDED.actif;

INSERT INTO public.devises (id, code, libelle, symbole, taux_change)
VALUES
  ('14000000-0000-0000-0000-000000000001', 'MAD', 'Dirham marocain', 'DH', 1),
  ('14000000-0000-0000-0000-000000000002', 'EUR', 'Euro', '€', 10.85)
ON CONFLICT (code) DO UPDATE SET taux_change = EXCLUDED.taux_change;

INSERT INTO public.constituants (id, code, libelle, type_constituant, unite, prix_achat, stock_min, actif)
VALUES
  ('15000000-0000-0000-0000-000000000001', 'C-001', 'Sable 0/5', 'granulat', 'M3', 180, 40, true),
  ('15000000-0000-0000-0000-000000000002', 'C-002', 'Ciment CPJ 42.5', 'liant', 'KG', 2.8, 5000, true),
  ('15000000-0000-0000-0000-000000000003', 'C-003', 'Acier corrugué', 'metallique', 'KG', 8.5, 1200, true)
ON CONFLICT (code) DO UPDATE SET prix_achat = EXCLUDED.prix_achat, stock_min = EXCLUDED.stock_min, actif = EXCLUDED.actif;

INSERT INTO public.consommation_constituants (id, chantier_id, phase_id, constituant_id, date_conso, quantite, unite, cout_unitaire, cout_total, notes)
VALUES
  ('57000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '15000000-0000-0000-0000-000000000002', '2026-09-20', 900, 'KG', 2.8, 2520, 'Ciment CPJ 42.5 consommé sur dalle niveau 2.'),
  ('57000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '15000000-0000-0000-0000-000000000001', '2026-09-21', 18, 'M3', 180, 3240, 'Sable 0/5 utilisé pour la dalle et le remplissage.'),
  ('57000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', '15000000-0000-0000-0000-000000000003', '2026-09-24', 140, 'KG', 8.5, 1190, 'Acier corrugué consommé pour le ferraillage des fondations.')
ON CONFLICT (id) DO UPDATE SET quantite = EXCLUDED.quantite, cout_total = EXCLUDED.cout_total, notes = EXCLUDED.notes;

INSERT INTO public.produits_finis (id, code, libelle, type_produit, unite, prix_vente, tva_taux, actif)
VALUES
  ('16000000-0000-0000-0000-000000000001', 'PF-001', 'Béton prêt à l’emploi', 'beton', 'M3', 620, 20, true),
  ('16000000-0000-0000-0000-000000000002', 'PF-002', 'Bloc de béton 20x20x40', 'materiau', 'U', 18, 20, true),
  ('16000000-0000-0000-0000-000000000003', 'PF-003', 'Mortier de jointoiement', 'materiau', 'KG', 9.5, 20, true)
ON CONFLICT (code) DO UPDATE SET prix_vente = EXCLUDED.prix_vente, actif = EXCLUDED.actif;

INSERT INTO public.modes_reglement (id, code, libelle)
VALUES
  ('17000000-0000-0000-0000-000000000001', 'VIR', 'Virement bancaire'),
  ('17000000-0000-0000-0000-000000000002', 'CB', 'Carte bancaire'),
  ('17000000-0000-0000-0000-000000000003', 'ESPECE', 'Espèces')
ON CONFLICT (code) DO UPDATE SET libelle = EXCLUDED.libelle;

INSERT INTO public.modes_transport (id, code, libelle)
VALUES
  ('18000000-0000-0000-0000-000000000001', 'TRUCK', 'Camion'),
  ('18000000-0000-0000-0000-000000000002', 'VOIT', 'Véhicule léger'),
  ('18000000-0000-0000-0000-000000000003', 'AUTO', 'Livraison locale')
ON CONFLICT (code) DO UPDATE SET libelle = EXCLUDED.libelle;

INSERT INTO public.types_personnel (id, code, libelle)
VALUES
  ('19000000-0000-0000-0000-000000000001', 'MO', 'Main d’œuvre'),
  ('19000000-0000-0000-0000-000000000002', 'CH', 'Chauffeur'),
  ('19000000-0000-0000-0000-000000000003', 'TECH', 'Technicien')
ON CONFLICT (code) DO UPDATE SET libelle = EXCLUDED.libelle;

INSERT INTO public.types_engins (id, code, libelle)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'TRACT', 'Tracteur'),
  ('20000000-0000-0000-0000-000000000002', 'NIVE', 'Niveleuse'),
  ('20000000-0000-0000-0000-000000000003', 'CHARG', 'Chargeuse')
ON CONFLICT (code) DO UPDATE SET libelle = EXCLUDED.libelle;

INSERT INTO public.employes (id, matricule, nom, prenom, cin, cnss, poste, type_personnel, telephone, email, adresse, date_embauche, salaire_base, taux_horaire, chantier_id, actif, notes)
VALUES
  ('21000000-0000-0000-0000-000000000001', 'EMP-001', 'Alaoui', 'Omar', 'AB123456', '123456789', 'Chef de chantier', 'MO', '0611223344', 'omar.alaoui@batipro.ma', 'Casablanca', '2024-01-05', 12000, 65, '30000000-0000-0000-0000-000000000001', true, 'Superviseur de chantier principal'),
  ('21000000-0000-0000-0000-000000000002', 'EMP-002', 'Fadili', 'Yassine', 'CD234567', '234567890', 'Technicien béton', 'TECH', '0677889900', 'yassine.fadili@batipro.ma', 'Rabat', '2025-03-12', 9800, 52, '30000000-0000-0000-0000-000000000001', true, 'Contrôle qualité'),
  ('21000000-0000-0000-0000-000000000003', 'EMP-003', 'Naciri', 'Hicham', 'EF345678', '345678901', 'Chauffeur', 'CH', '0655443322', 'hicham.naciri@batipro.ma', 'Marrakech', '2023-11-20', 9000, 48, '30000000-0000-0000-0000-000000000002', true, 'Conduit les camions de transport'),
  ('21000000-0000-0000-0000-000000000004', 'EMP-004', 'Bensaid', 'Hajar', 'GH456789', '456789012', 'Gestionnaire de chantier', 'MO', '0666554433', 'hajar.bensaid@batipro.ma', 'Casablanca', '2022-09-11', 11000, 58, '30000000-0000-0000-0000-000000000001', true, 'Suivi administratif et planning du chantier'),
  ('21000000-0000-0000-0000-000000000005', 'EMP-005', 'Sefri', 'Idriss', 'IJ567890', '567890123', 'Chef sécurité', 'MO', '0622334455', 'idriss.sefri@batipro.ma', 'Rabat', '2024-02-15', 9500, 50, '30000000-0000-0000-0000-000000000002', true, 'Coordonne les contrôles de sécurité et la conformité du site'),
  ('21000000-0000-0000-0000-000000000006', 'EMP-006', 'Khlifi', 'Salma', 'KL678901', '678901234', 'Comptable chantier', 'TECH', '0688997766', 'salma.khlifi@batipro.ma', 'Marrakech', '2025-01-18', 10200, 54, '30000000-0000-0000-0000-000000000002', true, 'Suivi des paiements fournisseurs et relances clients')
ON CONFLICT (id) DO UPDATE SET poste = EXCLUDED.poste, actif = EXCLUDED.actif, chantier_id = EXCLUDED.chantier_id;

INSERT INTO public.bulletins_paie (id, numero, employe_id, mois, annee, salaire_base, heures_sup, primes, retenues, cnss, ir, net_a_payer, statut, notes)
VALUES
  ('33000000-0000-0000-0000-000000000001', 'BP-2026-09-001', '21000000-0000-0000-0000-000000000001', 9, 2026, 12000, 18, 1500, 620, 390, 420, 12468, 'paye', 'Salaire du chef de chantier avec prime d’ancienneté et heures supplémentaires sur la phase gros œuvre.'),
  ('33000000-0000-0000-0000-000000000002', 'BP-2026-09-002', '21000000-0000-0000-0000-000000000002', 9, 2026, 9800, 12, 950, 410, 310, 280, 9758, 'paye', 'Paie du technicien béton avec prime qualité et retenue sur congés non pris.'),
  ('33000000-0000-0000-0000-000000000003', 'BP-2026-09-003', '21000000-0000-0000-0000-000000000003', 9, 2026, 9000, 9, 600, 340, 280, 180, 8810, 'paye', 'Rémunération chauffeur de camion avec prime de déplacement chantier.'),
  ('33000000-0000-0000-0000-000000000004', 'BP-2026-09-004', '21000000-0000-0000-0000-000000000006', 9, 2026, 10200, 6, 700, 360, 320, 240, 9986, 'brouillon', 'Bulletin comptable chantier en attente de validation administrative.')
ON CONFLICT (id) DO UPDATE SET numero = EXCLUDED.numero, net_a_payer = EXCLUDED.net_a_payer, statut = EXCLUDED.statut, notes = EXCLUDED.notes;

INSERT INTO public.conges (id, employe_id, type_conge, date_debut, date_fin, nb_jours, statut, motif, notes)
VALUES
  ('34000000-0000-0000-0000-000000000001', '21000000-0000-0000-0000-000000000004', 'paye', '2026-09-10', '2026-09-14', 5, 'approuve', 'Congés annuels', 'Récupération des jours de congés de l’été, remplacement assuré par la gestion administrative.'),
  ('34000000-0000-0000-0000-000000000002', '21000000-0000-0000-0000-000000000005', 'maladie', '2026-09-18', '2026-09-19', 2, 'valide', 'Maladie', 'Arrêt de courte durée justifié et pris en charge selon règlement interne.'),
  ('34000000-0000-0000-0000-000000000003', '21000000-0000-0000-0000-000000000002', 'paye', '2026-10-02', '2026-10-06', 5, 'en_attente', 'Congés annuels', 'Demande soumise au chef de chantier pour validation avant prochaine semaine.')
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, nb_jours = EXCLUDED.nb_jours, motif = EXCLUDED.motif;

INSERT INTO public.avances (id, employe_id, date_avance, montant, motif, statut, notes)
VALUES
  ('36000000-0000-0000-0000-000000000001', '21000000-0000-0000-0000-000000000003', '2026-09-15', 1200, 'Achat carburant et entretien véhicule', 'accordee', 'Avance remboursable sur salaire de septembre, règlement à récupérer sur prochain bulletin.'),
  ('36000000-0000-0000-0000-000000000002', '21000000-0000-0000-0000-000000000004', '2026-09-20', 1500, 'Frais de déplacement chantier', 'accordee', 'Acompte pour déplacement et hébergement temporaire sur site.'),
  ('36000000-0000-0000-0000-000000000003', '21000000-0000-0000-0000-000000000006', '2026-09-24', 800, 'Frais de bureau et fournitures', 'en_cours', 'Demande soumise à validation comptable.')
ON CONFLICT (id) DO UPDATE SET montant = EXCLUDED.montant, statut = EXCLUDED.statut, notes = EXCLUDED.notes;

INSERT INTO public.absences (id, employe_id, date_absence, duree_heures, motif, justifiee, notes)
VALUES
  ('35000000-0000-0000-0000-000000000001', '21000000-0000-0000-0000-000000000005', '2026-09-18', 6, 'Visite médicale', true, 'Absence justifiée, reprise prévue le même jour en fin de journée.'),
  ('35000000-0000-0000-0000-000000000002', '21000000-0000-0000-0000-000000000003', '2026-09-22', 4, 'Problème de transport', false, 'Retard non justifié, signalé au responsable hiérarchique pour suivi.'),
  ('35000000-0000-0000-0000-000000000003', '21000000-0000-0000-0000-000000000001', '2026-09-25', 2, 'Réunion de coordination', true, 'Absence courte pour réunion de chantier en tête de projet.')
ON CONFLICT (id) DO UPDATE SET duree_heures = EXCLUDED.duree_heures, motif = EXCLUDED.motif, justifiee = EXCLUDED.justifiee, notes = EXCLUDED.notes;

INSERT INTO public.pointages (id, date_pointage, employe_id, chantier_id, heures_normales, heures_sup, absent, motif, notes)
VALUES
  ('32000000-0000-0000-0000-000000000001', '2026-09-20', '21000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 8, 2, false, NULL, 'Jour normal avec heures supplémentaires pour avancement dalle niveau 2.'),
  ('32000000-0000-0000-0000-000000000002', '2026-09-20', '21000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 7.5, 1.5, false, NULL, 'Contrôle qualité sur béton et contrôle ferraillage.'),
  ('32000000-0000-0000-0000-000000000003', '2026-09-21', '21000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 8, 0, false, NULL, 'Transport matérieux vers le second chantier, circuit régulier.'),
  ('32000000-0000-0000-0000-000000000004', '2026-09-22', '21000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000002', 6, 0, true, 'Visite médicale', 'Absence justifiée pour visite médicale de contrôle.'),
  ('32000000-0000-0000-0000-000000000005', '2026-09-23', '21000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 8, 0.5, false, NULL, 'Suivi administratif et préparation planning de livraison.')
ON CONFLICT (id) DO UPDATE SET heures_normales = EXCLUDED.heures_normales, heures_sup = EXCLUDED.heures_sup, absent = EXCLUDED.absent, motif = EXCLUDED.motif, notes = EXCLUDED.notes;

INSERT INTO public.engins (id, code, libelle, type_engin, marque, modele, immatriculation, annee, compteur_km, compteur_h, date_acquisition, valeur_acquisition, statut, chantier_id, notes, actif)
VALUES
  ('22000000-0000-0000-0000-000000000001', 'ENG-001', 'Tracteur TL 100', 'Tracteur', 'New Holland', 'TL100', 'A-123-BC', 2022, 4200, 1600, '2022-05-12', 190000, 'disponible', '30000000-0000-0000-0000-000000000001', 'Engin principal du chantier', true),
  ('22000000-0000-0000-0000-000000000002', 'ENG-002', 'Niveleuse 210', 'Niveleuse', 'Caterpillar', '210', 'B-456-DE', 2021, 5300, 1800, '2021-09-10', 260000, 'en_service', '30000000-0000-0000-0000-000000000002', 'Utilisée pour nivellement et terrassement', true)
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, actif = EXCLUDED.actif;

INSERT INTO public.vehicules (id, code, libelle, immatriculation, marque, modele, type_vehicule, capacite, chauffeur, compteur_km, statut, notes, actif)
VALUES
  ('23000000-0000-0000-0000-000000000001', 'V-001', 'Camion 3.5T', 'B-789-FG', 'Renault', 'Master', 'camion', 3.5, 'Hicham Naciri', 32400, 'disponible', 'Livraison matérieux', true),
  ('23000000-0000-0000-0000-000000000002', 'V-002', 'Pickup utilitaire', 'C-321-HJ', 'Toyota', 'Hilux', 'pickup', 1.2, 'Aymen Khatib', 28700, 'en_service', 'Service chantier', true)
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, actif = EXCLUDED.actif;

INSERT INTO public.transferts_materiel (id, date_transfert, engin_id, vehicule_id, chantier_source_id, chantier_destination_id, motif, notes)
VALUES
  ('22100000-0000-0000-0000-000000000001', '2026-09-19', '22000000-0000-0000-0000-000000000001', NULL, '30000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'Affectation temporaire', 'Tracteur déplacé vers le second chantier pour accélérer le terrassement.'),
  ('22100000-0000-0000-0000-000000000002', '2026-09-24', NULL, '23000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'Transport de matériaux', 'Camion réaffecté pour livraisons sur la villa Riad Atlas.')
ON CONFLICT (id) DO UPDATE SET motif = EXCLUDED.motif, notes = EXCLUDED.notes;

INSERT INTO public.consommation_gasoil (id, date_conso, engin_id, vehicule_id, chantier_id, quantite_litres, prix_unitaire, montant, compteur_km, compteur_h, notes)
VALUES
  ('22200000-0000-0000-0000-000000000001', '2026-09-20', '22000000-0000-0000-0000-000000000001', NULL, '30000000-0000-0000-0000-000000000001', 120, 10.5, 1260, 4250, 1650, 'Carburant consommé pour le tracteur principal du chantier Alizé.'),
  ('22200000-0000-0000-0000-000000000002', '2026-09-23', NULL, '23000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 80, 10.5, 840, 32600, NULL, 'Trajet de livraison de sable et béton sur la villa Marrakech.')
ON CONFLICT (id) DO UPDATE SET quantite_litres = EXCLUDED.quantite_litres, montant = EXCLUDED.montant, notes = EXCLUDED.notes;

INSERT INTO public.pannes_engins (id, date_panne, engin_id, vehicule_id, description, gravite, statut, date_resolution, cout_reparation, notes)
VALUES
  ('22300000-0000-0000-0000-000000000001', '2026-09-18', '22000000-0000-0000-0000-000000000002', NULL, 'Fuite hydraulique sur le circuit de direction', 'moyenne', 'resolue', '2026-09-19', 2200, 'Réparation rapide effectuée par le garage local du chantier.'),
  ('22300000-0000-0000-0000-000000000002', '2026-09-25', NULL, '23000000-0000-0000-0000-000000000002', 'Panne batterie au démarrage', 'faible', 'ouverte', NULL, 0, 'Véhicule de service en attente de remplacement batterie.')
ON CONFLICT (id) DO UPDATE SET description = EXCLUDED.description, statut = EXCLUDED.statut, cout_reparation = EXCLUDED.cout_reparation, notes = EXCLUDED.notes;

INSERT INTO public.documents_materiel (id, libelle, type_document, engin_id, vehicule_id, url, date_emission, date_expiration, notes)
VALUES
  ('22400000-0000-0000-0000-000000000001', 'Carte grise tracteur TL 100', 'carte_grise', '22000000-0000-0000-0000-000000000001', NULL, '/docs/engins/TRACTOR-TL100.pdf', '2022-05-12', '2032-05-11', 'Document de suivi du tracteur principal.'),
  ('22400000-0000-0000-0000-000000000002', 'Assurance camion 3.5T', 'assurance', NULL, '23000000-0000-0000-0000-000000000001', '/docs/vehicules/V-001-assurance.pdf', '2026-01-15', '2027-01-14', 'Contrat d’assurance valide pour la flotte de transport.')
ON CONFLICT (id) DO UPDATE SET libelle = EXCLUDED.libelle, type_document = EXCLUDED.type_document, date_expiration = EXCLUDED.date_expiration, notes = EXCLUDED.notes;

INSERT INTO public.papiers (id, code, libelle, duree_validite_mois)
VALUES
  ('22500000-0000-0000-0000-000000000001', 'PAP-001', 'Carte grise', 120),
  ('22500000-0000-0000-0000-000000000002', 'PAP-002', 'Assurance véhicule', 12),
  ('22500000-0000-0000-0000-000000000003', 'PAP-003', 'Permis de conduire', 60)
ON CONFLICT (code) DO UPDATE SET libelle = EXCLUDED.libelle, duree_validite_mois = EXCLUDED.duree_validite_mois;

INSERT INTO public.entretiens_periodiques (id, libelle, periodicite_km, periodicite_jours)
VALUES
  ('22600000-0000-0000-0000-000000000001', 'Vidange moteur', 5000, 180),
  ('22600000-0000-0000-0000-000000000002', 'Contrôle hydraulique', 2000, 90),
  ('22600000-0000-0000-0000-000000000003', 'Révision générale', 10000, 365)
ON CONFLICT (id) DO UPDATE SET libelle = EXCLUDED.libelle, periodicite_km = EXCLUDED.periodicite_km, periodicite_jours = EXCLUDED.periodicite_jours;

INSERT INTO public.entretiens_realises (id, date_entretien, engin_id, vehicule_id, type_entretien, compteur_km, compteur_h, cout, prestataire, description, prochaine_date, notes)
VALUES
  ('22700000-0000-0000-0000-000000000001', '2026-09-10', '22000000-0000-0000-0000-000000000001', NULL, 'vidange', 4200, 1600, 1800, 'Garage CMC Casablanca', 'Vidange moteur et remplacement filtre à huile.', '2026-11-15', 'Entretien effectué selon planning de prévention.'),
  ('22700000-0000-0000-0000-000000000002', '2026-09-18', NULL, '23000000-0000-0000-0000-000000000001', 'inspection', 32400, NULL, 960, 'Atelier Route & Transport', 'Contrôle freinage et vérification des pneus.', '2026-10-18', 'Véhicule remis en service après inspection complète.'),
  ('22700000-0000-0000-0000-000000000003', '2026-09-22', '22000000-0000-0000-0000-000000000002', NULL, 'hydraulique', 5300, 1800, 2400, 'Mécanique BTP Sahara', 'Réparation fuite hydraulique et vérification circuit de direction.', '2026-12-01', 'Panne corrigée, engin prêt pour le prochain chantier.')
ON CONFLICT (id) DO UPDATE SET type_entretien = EXCLUDED.type_entretien, compteur_km = EXCLUDED.compteur_km, cout = EXCLUDED.cout, notes = EXCLUDED.notes;

INSERT INTO public.papiers_engins (id, engin_id, vehicule_id, papier_id, libelle, numero, date_emission, date_expiration, cout, notes)
VALUES
  ('22800000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000001', NULL, '22500000-0000-0000-0000-000000000001', 'Carte grise', 'CG-TRACT-001', '2022-05-12', '2032-05-11', 0, 'Document de circulation du tracteur principal.'),
  ('22800000-0000-0000-0000-000000000002', NULL, '23000000-0000-0000-0000-000000000001', '22500000-0000-0000-0000-000000000002', 'Assurance véhicule', 'ASS-V-001', '2026-01-15', '2027-01-14', 4200, 'Assurance couvrant les transports de matériaux sur site.'),
  ('22800000-0000-0000-0000-000000000003', NULL, '23000000-0000-0000-0000-000000000002', '22500000-0000-0000-0000-000000000003', 'Permis de conduire', 'PERMIS-CH-002', '2023-04-10', '2033-04-09', 0, 'Permis conforme du chauffeur affecté au pickup.')
ON CONFLICT (id) DO UPDATE SET libelle = EXCLUDED.libelle, numero = EXCLUDED.numero, date_expiration = EXCLUDED.date_expiration, notes = EXCLUDED.notes;

INSERT INTO public.locations_materiel (id, numero, fournisseur_id, type_materiel, designation, chantier_id, date_debut, date_fin, tarif, unite_tarif, quantite, montant_total, statut, notes)
VALUES
  ('22900000-0000-0000-0000-000000000001', 'LOC-2026-001', '20000000-0000-0000-0000-000000000003', 'compacteur', 'Compacteur Vibrant 12T', '30000000-0000-0000-0000-000000000001', '2026-09-15', '2026-10-15', 4500, 'jour', 30, 135000, 'en_cours', 'Location de compacteur pour compactage des zones de dalle.'),
  ('22900000-0000-0000-0000-000000000002', 'LOC-2026-002', '20000000-0000-0000-0000-000000000001', 'nacelle', 'Nacelle élévatrice 18m', '30000000-0000-0000-0000-000000000002', '2026-09-20', '2026-09-30', 3200, 'jour', 10, 32000, 'en_cours', 'Location temporaire pour finition façade et menuiseries extérieures.')
ON CONFLICT (id) DO UPDATE SET type_materiel = EXCLUDED.type_materiel, designation = EXCLUDED.designation, montant_total = EXCLUDED.montant_total, statut = EXCLUDED.statut, notes = EXCLUDED.notes;

INSERT INTO public.caisses (id, code, libelle, responsable, devise, solde_initial, plafond, actif, notes)
VALUES
  ('24000000-0000-0000-0000-000000000001', 'C-001', 'Caisse principale', 'Direction', 'MAD', 52000, 150000, true, 'Caisse centrale de l’entreprise'),
  ('24000000-0000-0000-0000-000000000002', 'C-002', 'Caisse chantier', 'Omar Alaoui', 'MAD', 15000, 60000, true, 'Caisse locale du chantier Résidence Alizé')
ON CONFLICT (id) DO UPDATE SET solde_initial = EXCLUDED.solde_initial, actif = EXCLUDED.actif;

INSERT INTO public.operations_caisse (id, caisse_id, date_operation, type_operation, montant, libelle, beneficiaire, piece)
VALUES
  ('25000000-0000-0000-0000-000000000001', '24000000-0000-0000-0000-000000000001', '2026-09-21', 'entree', 22000, 'Paiement client facture 2026-001', 'Atlas Promotion', 'PI-001'),
  ('25000000-0000-0000-0000-000000000002', '24000000-0000-0000-0000-000000000002', '2026-09-22', 'depense', 12800, 'Achat carburant chantier', 'Total Maroc', 'PI-002'),
  ('25000000-0000-0000-0000-000000000003', '24000000-0000-0000-0000-000000000001', '2026-09-24', 'depense', 4500, 'Rémunération équipe', 'Personnel', 'PI-003')
ON CONFLICT (id) DO UPDATE SET montant = EXCLUDED.montant, libelle = EXCLUDED.libelle;

INSERT INTO public.factures (id, numero, date_facture, client_id, chantier_id, montant_ht, tva, montant_ttc, statut, echeance, notes)
VALUES
  ('26000000-0000-0000-0000-000000000001', 'F-2026-001', '2026-09-20', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 305000, 61000, 366000, 'payee', '2026-10-20', 'Facture d’avancement gros œuvre'),
  ('26000000-0000-0000-0000-000000000002', 'F-2026-002', '2026-09-23', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 230000, 46000, 276000, 'envoyee', '2026-10-25', 'Facture travaux terrassement')
ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, montant_ttc = EXCLUDED.montant_ttc;

INSERT INTO public.mouvements_stock (id, date_mvt, type_mvt, depot_id, constituant_id, produit_id, quantite, prix_unitaire, chantier_id, reference, notes)
VALUES
  ('27000000-0000-0000-0000-000000000001', '2026-09-18', 'entree', '11000000-0000-0000-0000-000000000001', '15000000-0000-0000-0000-000000000002', NULL, 1800, 2.8, '30000000-0000-0000-0000-000000000001', 'BL-001', 'Livraison ciment pour la phase 1'),
  ('27000000-0000-0000-0000-000000000002', '2026-09-20', 'sortie', '11000000-0000-0000-0000-000000000001', NULL, '16000000-0000-0000-0000-000000000001', 12, 620, '30000000-0000-0000-0000-000000000001', 'BS-001', 'Béton livré sur chantier'),
  ('27000000-0000-0000-0000-000000000003', '2026-09-22', 'entree', '11000000-0000-0000-0000-000000000002', '15000000-0000-0000-0000-000000000001', NULL, 20, 180, '30000000-0000-0000-0000-000000000002', 'BL-002', 'Sable livré pour la villa'),
  ('27000000-0000-0000-0000-000000000004', '2026-09-24', 'entree', '11000000-0000-0000-0000-000000000001', '15000000-0000-0000-0000-000000000003', NULL, 900, 8.5, '30000000-0000-0000-0000-000000000001', 'BL-003', 'Livraison acier renforcé pour dalle niveau 2'),
  ('27000000-0000-0000-0000-000000000005', '2026-09-25', 'sortie', '11000000-0000-0000-0000-000000000001', '15000000-0000-0000-0000-000000000003', NULL, 250, 8.5, '30000000-0000-0000-0000-000000000001', 'BS-002', 'Sortie acier pour ferraillage de la dalle 2'),
  ('27000000-0000-0000-0000-000000000006', '2026-09-25', 'entree', '11000000-0000-0000-0000-000000000002', NULL, '16000000-0000-0000-0000-000000000003', 48, 9.5, '30000000-0000-0000-0000-000000000002', 'BL-004', 'Livraison mortier de jointoiement pour finition façade')
ON CONFLICT (id) DO UPDATE SET quantite = EXCLUDED.quantite, notes = EXCLUDED.notes;

INSERT INTO public.inventaires (id, date_inventaire, depot_id, constituant_id, produit_id, quantite_theorique, quantite_reelle, ecart, notes)
VALUES
  ('29000000-0000-0000-0000-000000000001', '2026-09-25', '11000000-0000-0000-0000-000000000001', '15000000-0000-0000-0000-000000000002', NULL, 5000, 4680, -320, 'Écart léger sur le stock ciment, à surveiller sur la prochaine livraison.'),
  ('29000000-0000-0000-0000-000000000002', '2026-09-25', '11000000-0000-0000-0000-000000000002', NULL, '16000000-0000-0000-0000-000000000001', 120, 109, -11, 'Stock béton prêt à l’emploi légèrement inférieur au théorique.')
ON CONFLICT (id) DO UPDATE SET quantite_reelle = EXCLUDED.quantite_reelle, ecart = EXCLUDED.ecart, notes = EXCLUDED.notes;

INSERT INTO public.transferts_stock (id, numero, date_transfert, depot_source_id, depot_destination_id, constituant_id, produit_id, quantite, statut, notes)
VALUES
  ('30000000-0000-0000-0000-000000000001', 'TR-2026-001', '2026-09-23', '11000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000002', '15000000-0000-0000-0000-000000000001', NULL, 12, 'termine', 'Transfert sable pour le chantier Marrakech.'),
  ('30000000-0000-0000-0000-000000000002', 'TR-2026-002', '2026-09-24', '11000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000002', NULL, '16000000-0000-0000-0000-000000000002', 35, 'en_cours', 'Bloc béton transféré vers le dépôt secondaire en attente de validation.')
ON CONFLICT (id) DO UPDATE SET quantite = EXCLUDED.quantite, statut = EXCLUDED.statut, notes = EXCLUDED.notes;

INSERT INTO public.comptes_comptables (id, numero, libelle, classe, type, actif)
VALUES
  ('ea000000-0000-0000-0000-000000000001', '5121', 'Banque principale', 5, 'actif', true),
  ('ea000000-0000-0000-0000-000000000002', '3421', 'Clients', 3, 'actif', true),
  ('ea000000-0000-0000-0000-000000000003', '4411', 'Fournisseurs', 4, 'passif', true),
  ('ea000000-0000-0000-0000-000000000004', '6111', 'Achats de marchandises', 6, 'charge', true),
  ('ea000000-0000-0000-0000-000000000005', '7111', 'Ventes de marchandises', 7, 'produit', true)
ON CONFLICT (numero) DO UPDATE SET libelle = EXCLUDED.libelle, classe = EXCLUDED.classe, type = EXCLUDED.type, actif = EXCLUDED.actif;

INSERT INTO public.journaux (id, code, libelle, type, compte_contrepartie_id, actif)
VALUES
  ('eb000000-0000-0000-0000-000000000001', 'BQ', 'Journal de banque', 'banque', (SELECT id FROM public.comptes_comptables WHERE numero = '5121'), true),
  ('eb000000-0000-0000-0000-000000000002', 'AC', 'Journal des achats', 'achat', (SELECT id FROM public.comptes_comptables WHERE numero = '4411'), true),
  ('eb000000-0000-0000-0000-000000000003', 'VT', 'Journal des ventes', 'vente', (SELECT id FROM public.comptes_comptables WHERE numero = '3421'), true)
ON CONFLICT (code) DO UPDATE SET libelle = EXCLUDED.libelle, type = EXCLUDED.type, compte_contrepartie_id = EXCLUDED.compte_contrepartie_id, actif = EXCLUDED.actif;

INSERT INTO public.ecritures (id, numero, date_ecriture, journal_id, libelle, reference, piece_type, statut, total_debit, total_credit)
VALUES
  ('ec000000-0000-0000-0000-000000000001', 'ECR-2026-001', '2026-09-21', (SELECT id FROM public.journaux WHERE code = 'BQ'), 'Encaissement facture client Atlas Promotion', 'REG-CL-2026-001', 'reglement', 'validee', 150000, 150000),
  ('ec000000-0000-0000-0000-000000000002', 'ECR-2026-002', '2026-09-24', (SELECT id FROM public.journaux WHERE code = 'AC'), 'Achat matériaux chez BatiMatériaux Maroc', 'FA-2026-003', 'facture', 'validee', 184000, 184000),
  ('ec000000-0000-0000-0000-000000000003', 'ECR-2026-003', '2026-09-25', (SELECT id FROM public.journaux WHERE code = 'VT'), 'Vente de béton sur chantier Alizé', 'F-2026-001', 'facture', 'validee', 366000, 366000)
ON CONFLICT (numero) DO UPDATE SET date_ecriture = EXCLUDED.date_ecriture, journal_id = EXCLUDED.journal_id, libelle = EXCLUDED.libelle, reference = EXCLUDED.reference, piece_type = EXCLUDED.piece_type, statut = EXCLUDED.statut, total_debit = EXCLUDED.total_debit, total_credit = EXCLUDED.total_credit;

INSERT INTO public.lignes_ecriture (id, ecriture_id, compte_id, libelle, debit, credit, chantier_id)
VALUES
  ('ed000000-0000-0000-0000-000000000001', 'ec000000-0000-0000-0000-000000000001', (SELECT id FROM public.comptes_comptables WHERE numero = '5121'), 'Banque principale', 150000, 0, '30000000-0000-0000-0000-000000000001'),
  ('ed000000-0000-0000-0000-000000000002', 'ec000000-0000-0000-0000-000000000001', (SELECT id FROM public.comptes_comptables WHERE numero = '3421'), 'Clients', 0, 150000, '30000000-0000-0000-0000-000000000001'),
  ('ed000000-0000-0000-0000-000000000003', 'ec000000-0000-0000-0000-000000000002', (SELECT id FROM public.comptes_comptables WHERE numero = '6111'), 'Achats de marchandises', 184000, 0, '30000000-0000-0000-0000-000000000001'),
  ('ed000000-0000-0000-0000-000000000004', 'ec000000-0000-0000-0000-000000000002', (SELECT id FROM public.comptes_comptables WHERE numero = '4411'), 'Fournisseurs', 0, 184000, '30000000-0000-0000-0000-000000000001'),
  ('ed000000-0000-0000-0000-000000000005', 'ec000000-0000-0000-0000-000000000003', (SELECT id FROM public.comptes_comptables WHERE numero = '3421'), 'Clients', 366000, 0, '30000000-0000-0000-0000-000000000001'),
  ('ed000000-0000-0000-0000-000000000006', 'ec000000-0000-0000-0000-000000000003', (SELECT id FROM public.comptes_comptables WHERE numero = '7111'), 'Ventes de marchandises', 0, 366000, '30000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO UPDATE SET ecriture_id = EXCLUDED.ecriture_id, compte_id = EXCLUDED.compte_id, libelle = EXCLUDED.libelle, debit = EXCLUDED.debit, credit = EXCLUDED.credit, chantier_id = EXCLUDED.chantier_id;

INSERT INTO public.releves_bancaires (id, compte_id, reference, date_debut, date_fin, solde_initial, solde_final, statut)
VALUES
  ('ee000000-0000-0000-0000-000000000001', (SELECT id FROM public.comptes_comptables WHERE numero = '5121'), 'REL-BQ-2026-09', '2026-09-01', '2026-09-30', 52000, 202000, 'rapproche')
ON CONFLICT (id) DO UPDATE SET compte_id = EXCLUDED.compte_id, reference = EXCLUDED.reference, date_debut = EXCLUDED.date_debut, date_fin = EXCLUDED.date_fin, solde_initial = EXCLUDED.solde_initial, solde_final = EXCLUDED.solde_final, statut = EXCLUDED.statut;

INSERT INTO public.lignes_releve (id, releve_id, date_operation, libelle, reference, debit, credit, rapproche, ligne_ecriture_id)
VALUES
  ('ef000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000001', '2026-09-21', 'Encaissement client Atlas Promotion', 'REG-CL-2026-001', 0, 150000, true, (SELECT id FROM public.lignes_ecriture WHERE ecriture_id = 'ec000000-0000-0000-0000-000000000001' AND compte_id = (SELECT id FROM public.comptes_comptables WHERE numero = '3421') LIMIT 1)),
  ('ef000000-0000-0000-0000-000000000002', 'ee000000-0000-0000-0000-000000000001', '2026-09-24', 'Paiement achat matériaux', 'FA-2026-003', 184000, 0, false, (SELECT id FROM public.lignes_ecriture WHERE ecriture_id = 'ec000000-0000-0000-0000-000000000002' AND compte_id = (SELECT id FROM public.comptes_comptables WHERE numero = '6111') LIMIT 1))
ON CONFLICT (id) DO UPDATE SET libelle = EXCLUDED.libelle, reference = EXCLUDED.reference, debit = EXCLUDED.debit, credit = EXCLUDED.credit, rapproche = EXCLUDED.rapproche, ligne_ecriture_id = EXCLUDED.ligne_ecriture_id;

COMMIT;

NOTIFY pgrst, 'reload schema';
