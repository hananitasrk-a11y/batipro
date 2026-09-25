-- Align every module relation with the live singular public.chantier table.
-- This keeps the repair migration static and safe for reruns.
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

ALTER TABLE IF EXISTS public.mouvements_stock
  DROP CONSTRAINT IF EXISTS mouvements_stock_chantier_id_fkey;
ALTER TABLE IF EXISTS public.mouvements_stock
  ADD CONSTRAINT mouvements_stock_chantier_id_fkey
  FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.consommation_constituants
  DROP CONSTRAINT IF EXISTS consommation_constituants_chantier_id_fkey;
ALTER TABLE IF EXISTS public.consommation_constituants
  ADD CONSTRAINT consommation_constituants_chantier_id_fkey
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

ALTER TABLE IF EXISTS public.rendement_journalier
  DROP CONSTRAINT IF EXISTS rendement_journalier_chantier_id_fkey;
ALTER TABLE IF EXISTS public.rendement_journalier
  ADD CONSTRAINT rendement_journalier_chantier_id_fkey
  FOREIGN KEY (chantier_id) REFERENCES public.chantier(id) ON DELETE CASCADE;

NOTIFY pgrst, 'reload schema';
