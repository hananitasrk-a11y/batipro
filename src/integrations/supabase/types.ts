export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      absences: {
        Row: {
          created_at: string
          date_absence: string | null
          duree_heures: number | null
          employe_id: string | null
          id: string
          justifiee: boolean | null
          motif: string | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_absence?: string | null
          duree_heures?: number | null
          employe_id?: string | null
          id?: string
          justifiee?: boolean | null
          motif?: string | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_absence?: string | null
          duree_heures?: number | null
          employe_id?: string | null
          id?: string
          justifiee?: boolean | null
          motif?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "absences_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity: string | null
          entity_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      avances: {
        Row: {
          created_at: string
          date_avance: string | null
          employe_id: string | null
          id: string
          montant: number
          motif: string | null
          notes: string | null
          statut: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_avance?: string | null
          employe_id?: string | null
          id?: string
          montant: number
          motif?: string | null
          notes?: string | null
          statut?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_avance?: string | null
          employe_id?: string | null
          id?: string
          montant?: number
          motif?: string | null
          notes?: string | null
          statut?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "avances_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      avoirs: {
        Row: {
          client_id: string | null
          created_at: string
          date_avoir: string | null
          facture_id: string | null
          fournisseur_id: string | null
          id: string
          montant_ht: number | null
          montant_ttc: number | null
          notes: string | null
          numero: string | null
          statut: string | null
          tva: number | null
          type_avoir: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          date_avoir?: string | null
          facture_id?: string | null
          fournisseur_id?: string | null
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          notes?: string | null
          numero?: string | null
          statut?: string | null
          tva?: number | null
          type_avoir?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          date_avoir?: string | null
          facture_id?: string | null
          fournisseur_id?: string | null
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          notes?: string | null
          numero?: string | null
          statut?: string | null
          tva?: number | null
          type_avoir?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "avoirs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avoirs_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avoirs_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
        ]
      }
      bons_commande: {
        Row: {
          chantier_id: string | null
          created_at: string
          date_bc: string
          fournisseur_id: string | null
          id: string
          montant_ht: number | null
          montant_ttc: number | null
          notes: string | null
          numero: string | null
          statut: string | null
          tva: number | null
          updated_at: string
        }
        Insert: {
          chantier_id?: string | null
          created_at?: string
          date_bc?: string
          fournisseur_id?: string | null
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          notes?: string | null
          numero?: string | null
          statut?: string | null
          tva?: number | null
          updated_at?: string
        }
        Update: {
          chantier_id?: string | null
          created_at?: string
          date_bc?: string
          fournisseur_id?: string | null
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          notes?: string | null
          numero?: string | null
          statut?: string | null
          tva?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bons_commande_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bons_commande_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
        ]
      }
      bulletins_paie: {
        Row: {
          annee: number
          cnss: number | null
          created_at: string
          employe_id: string | null
          heures_sup: number | null
          id: string
          ir: number | null
          mois: number
          net_a_payer: number | null
          notes: string | null
          numero: string | null
          primes: number | null
          retenues: number | null
          salaire_base: number | null
          statut: string | null
          updated_at: string
        }
        Insert: {
          annee: number
          cnss?: number | null
          created_at?: string
          employe_id?: string | null
          heures_sup?: number | null
          id?: string
          ir?: number | null
          mois: number
          net_a_payer?: number | null
          notes?: string | null
          numero?: string | null
          primes?: number | null
          retenues?: number | null
          salaire_base?: number | null
          statut?: string | null
          updated_at?: string
        }
        Update: {
          annee?: number
          cnss?: number | null
          created_at?: string
          employe_id?: string | null
          heures_sup?: number | null
          id?: string
          ir?: number | null
          mois?: number
          net_a_payer?: number | null
          notes?: string | null
          numero?: string | null
          primes?: number | null
          retenues?: number | null
          salaire_base?: number | null
          statut?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulletins_paie_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      caisses: {
        Row: {
          actif: boolean | null
          code: string | null
          created_at: string
          devise: string | null
          id: string
          libelle: string
          notes: string | null
          plafond: number | null
          responsable: string | null
          solde_initial: number | null
          updated_at: string
        }
        Insert: {
          actif?: boolean | null
          code?: string | null
          created_at?: string
          devise?: string | null
          id?: string
          libelle: string
          notes?: string | null
          plafond?: number | null
          responsable?: string | null
          solde_initial?: number | null
          updated_at?: string
        }
        Update: {
          actif?: boolean | null
          code?: string | null
          created_at?: string
          devise?: string | null
          id?: string
          libelle?: string
          notes?: string | null
          plafond?: number | null
          responsable?: string | null
          solde_initial?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      chantier: {
        Row: {
          adresse: string | null
          avancement: number | null
          chef_chantier: string | null
          client_id: string | null
          code: string | null
          created_at: string
          date_debut: string | null
          date_fin_prevue: string | null
          date_fin_reelle: string | null
          id: string
          montant_marche: number | null
          nom: string
          notes: string | null
          statut: string | null
          updated_at: string
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          avancement?: number | null
          chef_chantier?: string | null
          client_id?: string | null
          code?: string | null
          created_at?: string
          date_debut?: string | null
          date_fin_prevue?: string | null
          date_fin_reelle?: string | null
          id?: string
          montant_marche?: number | null
          nom: string
          notes?: string | null
          statut?: string | null
          updated_at?: string
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          avancement?: number | null
          chef_chantier?: string | null
          client_id?: string | null
          code?: string | null
          created_at?: string
          date_debut?: string | null
          date_fin_prevue?: string | null
          date_fin_reelle?: string | null
          id?: string
          montant_marche?: number | null
          nom?: string
          notes?: string | null
          statut?: string | null
          updated_at?: string
          ville?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chantiers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          actif: boolean | null
          adresse: string | null
          code: string | null
          contact: string | null
          created_at: string | null
          email: string | null
          ice: string | null
          id: string
          if_fiscal: string | null
          mode_reglement: string | null
          notes: string | null
          plafond_credit: number | null
          raison_sociale: string
          rc: string | null
          telephone: string | null
          type_client: string | null
          updated_at: string | null
          ville: string | null
        }
        Insert: {
          actif?: boolean | null
          adresse?: string | null
          code?: string | null
          contact?: string | null
          created_at?: string | null
          email?: string | null
          ice?: string | null
          id?: string
          if_fiscal?: string | null
          mode_reglement?: string | null
          notes?: string | null
          plafond_credit?: number | null
          raison_sociale: string
          rc?: string | null
          telephone?: string | null
          type_client?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Update: {
          actif?: boolean | null
          adresse?: string | null
          code?: string | null
          contact?: string | null
          created_at?: string | null
          email?: string | null
          ice?: string | null
          id?: string
          if_fiscal?: string | null
          mode_reglement?: string | null
          notes?: string | null
          plafond_credit?: number | null
          raison_sociale?: string
          rc?: string | null
          telephone?: string | null
          type_client?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      commandes_vente: {
        Row: {
          chantier_id: string | null
          client_id: string | null
          created_at: string
          date_commande: string | null
          date_livraison: string | null
          devis_id: string | null
          id: string
          montant_ht: number | null
          montant_ttc: number | null
          notes: string | null
          numero: string | null
          statut: string | null
          tva: number | null
          updated_at: string
        }
        Insert: {
          chantier_id?: string | null
          client_id?: string | null
          created_at?: string
          date_commande?: string | null
          date_livraison?: string | null
          devis_id?: string | null
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          notes?: string | null
          numero?: string | null
          statut?: string | null
          tva?: number | null
          updated_at?: string
        }
        Update: {
          chantier_id?: string | null
          client_id?: string | null
          created_at?: string
          date_commande?: string | null
          date_livraison?: string | null
          devis_id?: string | null
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          notes?: string | null
          numero?: string | null
          statut?: string | null
          tva?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commandes_vente_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commandes_vente_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commandes_vente_devis_id_fkey"
            columns: ["devis_id"]
            isOneToOne: false
            referencedRelation: "devis"
            referencedColumns: ["id"]
          },
        ]
      }
      comptes_comptables: {
        Row: {
          actif: boolean
          classe: number
          created_at: string
          id: string
          libelle: string
          numero: string
          parent_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          actif?: boolean
          classe: number
          created_at?: string
          id?: string
          libelle: string
          numero: string
          parent_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          actif?: boolean
          classe?: number
          created_at?: string
          id?: string
          libelle?: string
          numero?: string
          parent_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comptes_comptables_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comptes_comptables"
            referencedColumns: ["id"]
          },
        ]
      }
      conges: {
        Row: {
          created_at: string
          date_debut: string
          date_fin: string
          employe_id: string | null
          id: string
          motif: string | null
          nb_jours: number | null
          notes: string | null
          statut: string | null
          type_conge: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_debut: string
          date_fin: string
          employe_id?: string | null
          id?: string
          motif?: string | null
          nb_jours?: number | null
          notes?: string | null
          statut?: string | null
          type_conge?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_debut?: string
          date_fin?: string
          employe_id?: string | null
          id?: string
          motif?: string | null
          nb_jours?: number | null
          notes?: string | null
          statut?: string | null
          type_conge?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conges_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      consommation_constituants: {
        Row: {
          chantier_id: string | null
          constituant_id: string | null
          cout_total: number | null
          cout_unitaire: number | null
          created_at: string
          date_conso: string
          id: string
          notes: string | null
          phase_id: string | null
          quantite: number
          unite: string | null
          updated_at: string
        }
        Insert: {
          chantier_id?: string | null
          constituant_id?: string | null
          cout_total?: number | null
          cout_unitaire?: number | null
          created_at?: string
          date_conso?: string
          id?: string
          notes?: string | null
          phase_id?: string | null
          quantite?: number
          unite?: string | null
          updated_at?: string
        }
        Update: {
          chantier_id?: string | null
          constituant_id?: string | null
          cout_total?: number | null
          cout_unitaire?: number | null
          created_at?: string
          date_conso?: string
          id?: string
          notes?: string | null
          phase_id?: string | null
          quantite?: number
          unite?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consommation_constituants_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consommation_constituants_constituant_id_fkey"
            columns: ["constituant_id"]
            isOneToOne: false
            referencedRelation: "constituants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consommation_constituants_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases_chantier"
            referencedColumns: ["id"]
          },
        ]
      }
      consommation_gasoil: {
        Row: {
          chantier_id: string | null
          compteur_h: number | null
          compteur_km: number | null
          created_at: string
          date_conso: string | null
          engin_id: string | null
          id: string
          montant: number | null
          notes: string | null
          prix_unitaire: number | null
          quantite_litres: number | null
          updated_at: string
          vehicule_id: string | null
        }
        Insert: {
          chantier_id?: string | null
          compteur_h?: number | null
          compteur_km?: number | null
          created_at?: string
          date_conso?: string | null
          engin_id?: string | null
          id?: string
          montant?: number | null
          notes?: string | null
          prix_unitaire?: number | null
          quantite_litres?: number | null
          updated_at?: string
          vehicule_id?: string | null
        }
        Update: {
          chantier_id?: string | null
          compteur_h?: number | null
          compteur_km?: number | null
          created_at?: string
          date_conso?: string | null
          engin_id?: string | null
          id?: string
          montant?: number | null
          notes?: string | null
          prix_unitaire?: number | null
          quantite_litres?: number | null
          updated_at?: string
          vehicule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consommation_gasoil_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consommation_gasoil_engin_id_fkey"
            columns: ["engin_id"]
            isOneToOne: false
            referencedRelation: "engins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consommation_gasoil_vehicule_id_fkey"
            columns: ["vehicule_id"]
            isOneToOne: false
            referencedRelation: "vehicules"
            referencedColumns: ["id"]
          },
        ]
      }
      constituants: {
        Row: {
          actif: boolean | null
          code: string | null
          created_at: string | null
          id: string
          libelle: string
          prix_achat: number | null
          stock_min: number | null
          type_constituant: string | null
          unite: string | null
          updated_at: string | null
        }
        Insert: {
          actif?: boolean | null
          code?: string | null
          created_at?: string | null
          id?: string
          libelle: string
          prix_achat?: number | null
          stock_min?: number | null
          type_constituant?: string | null
          unite?: string | null
          updated_at?: string | null
        }
        Update: {
          actif?: boolean | null
          code?: string | null
          created_at?: string | null
          id?: string
          libelle?: string
          prix_achat?: number | null
          stock_min?: number | null
          type_constituant?: string | null
          unite?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contrats_sous_traitance: {
        Row: {
          avancement: number | null
          chantier_id: string | null
          created_at: string
          date_debut: string | null
          date_fin: string | null
          id: string
          montant_ht: number | null
          montant_ttc: number | null
          notes: string | null
          numero: string | null
          objet: string | null
          phase_id: string | null
          sous_traitant_id: string | null
          statut: string | null
          tva: number | null
          updated_at: string
        }
        Insert: {
          avancement?: number | null
          chantier_id?: string | null
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          notes?: string | null
          numero?: string | null
          objet?: string | null
          phase_id?: string | null
          sous_traitant_id?: string | null
          statut?: string | null
          tva?: number | null
          updated_at?: string
        }
        Update: {
          avancement?: number | null
          chantier_id?: string | null
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          notes?: string | null
          numero?: string | null
          objet?: string | null
          phase_id?: string | null
          sous_traitant_id?: string | null
          statut?: string | null
          tva?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contrats_sous_traitance_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contrats_sous_traitance_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases_chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contrats_sous_traitance_sous_traitant_id_fkey"
            columns: ["sous_traitant_id"]
            isOneToOne: false
            referencedRelation: "sous_traitants"
            referencedColumns: ["id"]
          },
        ]
      }
      demandes_devis: {
        Row: {
          chantier_id: string | null
          created_at: string
          date_demande: string | null
          fournisseur_id: string | null
          id: string
          montant_estime: number | null
          notes: string | null
          numero: string | null
          objet: string | null
          statut: string | null
          updated_at: string
        }
        Insert: {
          chantier_id?: string | null
          created_at?: string
          date_demande?: string | null
          fournisseur_id?: string | null
          id?: string
          montant_estime?: number | null
          notes?: string | null
          numero?: string | null
          objet?: string | null
          statut?: string | null
          updated_at?: string
        }
        Update: {
          chantier_id?: string | null
          created_at?: string
          date_demande?: string | null
          fournisseur_id?: string | null
          id?: string
          montant_estime?: number | null
          notes?: string | null
          numero?: string | null
          objet?: string | null
          statut?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "demandes_devis_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demandes_devis_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
        ]
      }
      depots: {
        Row: {
          actif: boolean | null
          adresse: string | null
          code: string | null
          created_at: string | null
          id: string
          nom: string
          responsable: string | null
          telephone: string | null
          updated_at: string | null
        }
        Insert: {
          actif?: boolean | null
          adresse?: string | null
          code?: string | null
          created_at?: string | null
          id?: string
          nom: string
          responsable?: string | null
          telephone?: string | null
          updated_at?: string | null
        }
        Update: {
          actif?: boolean | null
          adresse?: string | null
          code?: string | null
          created_at?: string | null
          id?: string
          nom?: string
          responsable?: string | null
          telephone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      devis: {
        Row: {
          chantier_id: string | null
          client_id: string | null
          created_at: string
          date_devis: string
          id: string
          montant_ht: number | null
          montant_ttc: number | null
          notes: string | null
          numero: string | null
          objet: string | null
          statut: string | null
          tva: number | null
          updated_at: string
          validite: string | null
        }
        Insert: {
          chantier_id?: string | null
          client_id?: string | null
          created_at?: string
          date_devis: string
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          notes?: string | null
          numero?: string | null
          objet?: string | null
          statut?: string | null
          tva?: number | null
          updated_at?: string
          validite?: string | null
        }
        Update: {
          chantier_id?: string | null
          client_id?: string | null
          created_at?: string
          date_devis?: string
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          notes?: string | null
          numero?: string | null
          objet?: string | null
          statut?: string | null
          tva?: number | null
          updated_at?: string
          validite?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devis_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      devises: {
        Row: {
          code: string
          created_at: string | null
          id: string
          libelle: string
          symbole: string | null
          taux_change: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          libelle: string
          symbole?: string | null
          taux_change?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          libelle?: string
          symbole?: string | null
          taux_change?: number | null
        }
        Relationships: []
      }
      documents_materiel: {
        Row: {
          created_at: string
          date_emission: string | null
          date_expiration: string | null
          engin_id: string | null
          id: string
          libelle: string
          notes: string | null
          type_document: string | null
          updated_at: string
          url: string | null
          vehicule_id: string | null
        }
        Insert: {
          created_at?: string
          date_emission?: string | null
          date_expiration?: string | null
          engin_id?: string | null
          id?: string
          libelle: string
          notes?: string | null
          type_document?: string | null
          updated_at?: string
          url?: string | null
          vehicule_id?: string | null
        }
        Update: {
          created_at?: string
          date_emission?: string | null
          date_expiration?: string | null
          engin_id?: string | null
          id?: string
          libelle?: string
          notes?: string | null
          type_document?: string | null
          updated_at?: string
          url?: string | null
          vehicule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_materiel_engin_id_fkey"
            columns: ["engin_id"]
            isOneToOne: false
            referencedRelation: "engins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_materiel_vehicule_id_fkey"
            columns: ["vehicule_id"]
            isOneToOne: false
            referencedRelation: "vehicules"
            referencedColumns: ["id"]
          },
        ]
      }
      ecritures: {
        Row: {
          created_at: string
          date_ecriture: string
          id: string
          journal_id: string
          libelle: string
          numero: string
          piece_id: string | null
          piece_type: string | null
          reference: string | null
          statut: string
          total_credit: number
          total_debit: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_ecriture?: string
          id?: string
          journal_id: string
          libelle: string
          numero: string
          piece_id?: string | null
          piece_type?: string | null
          reference?: string | null
          statut?: string
          total_credit?: number
          total_debit?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_ecriture?: string
          id?: string
          journal_id?: string
          libelle?: string
          numero?: string
          piece_id?: string | null
          piece_type?: string | null
          reference?: string | null
          statut?: string
          total_credit?: number
          total_debit?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ecritures_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journaux"
            referencedColumns: ["id"]
          },
        ]
      }
      employes: {
        Row: {
          actif: boolean | null
          adresse: string | null
          chantier_id: string | null
          cin: string | null
          cnss: string | null
          created_at: string
          date_embauche: string | null
          date_sortie: string | null
          email: string | null
          id: string
          matricule: string | null
          nom: string
          notes: string | null
          poste: string | null
          prenom: string | null
          salaire_base: number | null
          taux_horaire: number | null
          telephone: string | null
          type_personnel: string | null
          updated_at: string
        }
        Insert: {
          actif?: boolean | null
          adresse?: string | null
          chantier_id?: string | null
          cin?: string | null
          cnss?: string | null
          created_at?: string
          date_embauche?: string | null
          date_sortie?: string | null
          email?: string | null
          id?: string
          matricule?: string | null
          nom: string
          notes?: string | null
          poste?: string | null
          prenom?: string | null
          salaire_base?: number | null
          taux_horaire?: number | null
          telephone?: string | null
          type_personnel?: string | null
          updated_at?: string
        }
        Update: {
          actif?: boolean | null
          adresse?: string | null
          chantier_id?: string | null
          cin?: string | null
          cnss?: string | null
          created_at?: string
          date_embauche?: string | null
          date_sortie?: string | null
          email?: string | null
          id?: string
          matricule?: string | null
          nom?: string
          notes?: string | null
          poste?: string | null
          prenom?: string | null
          salaire_base?: number | null
          taux_horaire?: number | null
          telephone?: string | null
          type_personnel?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employes_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
        ]
      }
      engins: {
        Row: {
          actif: boolean | null
          annee: number | null
          chantier_id: string | null
          code: string | null
          compteur_h: number | null
          compteur_km: number | null
          created_at: string
          date_acquisition: string | null
          id: string
          immatriculation: string | null
          libelle: string
          marque: string | null
          modele: string | null
          notes: string | null
          statut: string | null
          type_engin: string | null
          updated_at: string
          valeur_acquisition: number | null
        }
        Insert: {
          actif?: boolean | null
          annee?: number | null
          chantier_id?: string | null
          code?: string | null
          compteur_h?: number | null
          compteur_km?: number | null
          created_at?: string
          date_acquisition?: string | null
          id?: string
          immatriculation?: string | null
          libelle: string
          marque?: string | null
          modele?: string | null
          notes?: string | null
          statut?: string | null
          type_engin?: string | null
          updated_at?: string
          valeur_acquisition?: number | null
        }
        Update: {
          actif?: boolean | null
          annee?: number | null
          chantier_id?: string | null
          code?: string | null
          compteur_h?: number | null
          compteur_km?: number | null
          created_at?: string
          date_acquisition?: string | null
          id?: string
          immatriculation?: string | null
          libelle?: string
          marque?: string | null
          modele?: string | null
          notes?: string | null
          statut?: string | null
          type_engin?: string | null
          updated_at?: string
          valeur_acquisition?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "engins_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
        ]
      }
      entretiens_periodiques: {
        Row: {
          created_at: string | null
          id: string
          libelle: string
          periodicite_jours: number | null
          periodicite_km: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          libelle: string
          periodicite_jours?: number | null
          periodicite_km?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          libelle?: string
          periodicite_jours?: number | null
          periodicite_km?: number | null
        }
        Relationships: []
      }
      entretiens_realises: {
        Row: {
          compteur_h: number | null
          compteur_km: number | null
          cout: number | null
          created_at: string
          date_entretien: string
          description: string | null
          engin_id: string | null
          id: string
          notes: string | null
          prestataire: string | null
          prochaine_date: string | null
          type_entretien: string | null
          updated_at: string
          vehicule_id: string | null
        }
        Insert: {
          compteur_h?: number | null
          compteur_km?: number | null
          cout?: number | null
          created_at?: string
          date_entretien: string
          description?: string | null
          engin_id?: string | null
          id?: string
          notes?: string | null
          prestataire?: string | null
          prochaine_date?: string | null
          type_entretien?: string | null
          updated_at?: string
          vehicule_id?: string | null
        }
        Update: {
          compteur_h?: number | null
          compteur_km?: number | null
          cout?: number | null
          created_at?: string
          date_entretien?: string
          description?: string | null
          engin_id?: string | null
          id?: string
          notes?: string | null
          prestataire?: string | null
          prochaine_date?: string | null
          type_entretien?: string | null
          updated_at?: string
          vehicule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entretiens_realises_engin_id_fkey"
            columns: ["engin_id"]
            isOneToOne: false
            referencedRelation: "engins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entretiens_realises_vehicule_id_fkey"
            columns: ["vehicule_id"]
            isOneToOne: false
            referencedRelation: "vehicules"
            referencedColumns: ["id"]
          },
        ]
      }
      factures: {
        Row: {
          chantier_id: string | null
          client_id: string | null
          created_at: string
          date_facture: string
          echeance: string | null
          id: string
          montant_ht: number | null
          montant_ttc: number | null
          notes: string | null
          numero: string | null
          statut: string | null
          tva: number | null
          updated_at: string
        }
        Insert: {
          chantier_id?: string | null
          client_id?: string | null
          created_at?: string
          date_facture?: string
          echeance?: string | null
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          notes?: string | null
          numero?: string | null
          statut?: string | null
          tva?: number | null
          updated_at?: string
        }
        Update: {
          chantier_id?: string | null
          client_id?: string | null
          created_at?: string
          date_facture?: string
          echeance?: string | null
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          notes?: string | null
          numero?: string | null
          statut?: string | null
          tva?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "factures_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      fournisseurs: {
        Row: {
          actif: boolean | null
          adresse: string | null
          code: string | null
          contact: string | null
          created_at: string | null
          delai_paiement: number | null
          email: string | null
          ice: string | null
          id: string
          if_fiscal: string | null
          mode_reglement: string | null
          notes: string | null
          raison_sociale: string
          rc: string | null
          telephone: string | null
          updated_at: string | null
          ville: string | null
        }
        Insert: {
          actif?: boolean | null
          adresse?: string | null
          code?: string | null
          contact?: string | null
          created_at?: string | null
          delai_paiement?: number | null
          email?: string | null
          ice?: string | null
          id?: string
          if_fiscal?: string | null
          mode_reglement?: string | null
          notes?: string | null
          raison_sociale: string
          rc?: string | null
          telephone?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Update: {
          actif?: boolean | null
          adresse?: string | null
          code?: string | null
          contact?: string | null
          created_at?: string | null
          delai_paiement?: number | null
          email?: string | null
          ice?: string | null
          id?: string
          if_fiscal?: string | null
          mode_reglement?: string | null
          notes?: string | null
          raison_sociale?: string
          rc?: string | null
          telephone?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      inventaires: {
        Row: {
          constituant_id: string | null
          created_at: string
          date_inventaire: string
          depot_id: string | null
          ecart: number | null
          id: string
          notes: string | null
          produit_id: string | null
          quantite_reelle: number | null
          quantite_theorique: number | null
          updated_at: string
        }
        Insert: {
          constituant_id?: string | null
          created_at?: string
          date_inventaire: string
          depot_id?: string | null
          ecart?: number | null
          id?: string
          notes?: string | null
          produit_id?: string | null
          quantite_reelle?: number | null
          quantite_theorique?: number | null
          updated_at?: string
        }
        Update: {
          constituant_id?: string | null
          created_at?: string
          date_inventaire?: string
          depot_id?: string | null
          ecart?: number | null
          id?: string
          notes?: string | null
          produit_id?: string | null
          quantite_reelle?: number | null
          quantite_theorique?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventaires_constituant_id_fkey"
            columns: ["constituant_id"]
            isOneToOne: false
            referencedRelation: "constituants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventaires_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventaires_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits_finis"
            referencedColumns: ["id"]
          },
        ]
      }
      journaux: {
        Row: {
          actif: boolean
          code: string
          compte_contrepartie_id: string | null
          created_at: string
          id: string
          libelle: string
          type: string
          updated_at: string
        }
        Insert: {
          actif?: boolean
          code: string
          compte_contrepartie_id?: string | null
          created_at?: string
          id?: string
          libelle: string
          type: string
          updated_at?: string
        }
        Update: {
          actif?: boolean
          code?: string
          compte_contrepartie_id?: string | null
          created_at?: string
          id?: string
          libelle?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journaux_compte_contrepartie_id_fkey"
            columns: ["compte_contrepartie_id"]
            isOneToOne: false
            referencedRelation: "comptes_comptables"
            referencedColumns: ["id"]
          },
        ]
      }
      jours_feries: {
        Row: {
          created_at: string | null
          date_jour: string
          id: string
          libelle: string
        }
        Insert: {
          created_at?: string | null
          date_jour: string
          id?: string
          libelle: string
        }
        Update: {
          created_at?: string | null
          date_jour?: string
          id?: string
          libelle?: string
        }
        Relationships: []
      }
      lignes_ecriture: {
        Row: {
          chantier_id: string | null
          compte_id: string
          created_at: string
          credit: number
          debit: number
          ecriture_id: string
          id: string
          lettrage: string | null
          libelle: string | null
          tiers_id: string | null
          tiers_type: string | null
        }
        Insert: {
          chantier_id?: string | null
          compte_id: string
          created_at?: string
          credit?: number
          debit?: number
          ecriture_id: string
          id?: string
          lettrage?: string | null
          libelle?: string | null
          tiers_id?: string | null
          tiers_type?: string | null
        }
        Update: {
          chantier_id?: string | null
          compte_id?: string
          created_at?: string
          credit?: number
          debit?: number
          ecriture_id?: string
          id?: string
          lettrage?: string | null
          libelle?: string | null
          tiers_id?: string | null
          tiers_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lignes_ecriture_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lignes_ecriture_compte_id_fkey"
            columns: ["compte_id"]
            isOneToOne: false
            referencedRelation: "comptes_comptables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lignes_ecriture_ecriture_id_fkey"
            columns: ["ecriture_id"]
            isOneToOne: false
            referencedRelation: "ecritures"
            referencedColumns: ["id"]
          },
        ]
      }
      lignes_releve: {
        Row: {
          created_at: string
          credit: number
          date_operation: string
          debit: number
          id: string
          libelle: string
          ligne_ecriture_id: string | null
          rapproche: boolean
          reference: string | null
          releve_id: string
        }
        Insert: {
          created_at?: string
          credit?: number
          date_operation: string
          debit?: number
          id?: string
          libelle: string
          ligne_ecriture_id?: string | null
          rapproche?: boolean
          reference?: string | null
          releve_id: string
        }
        Update: {
          created_at?: string
          credit?: number
          date_operation?: string
          debit?: number
          id?: string
          libelle?: string
          ligne_ecriture_id?: string | null
          rapproche?: boolean
          reference?: string | null
          releve_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lignes_releve_ligne_ecriture_id_fkey"
            columns: ["ligne_ecriture_id"]
            isOneToOne: false
            referencedRelation: "lignes_ecriture"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lignes_releve_releve_id_fkey"
            columns: ["releve_id"]
            isOneToOne: false
            referencedRelation: "releves_bancaires"
            referencedColumns: ["id"]
          },
        ]
      }
      livraisons: {
        Row: {
          chantier_id: string | null
          chauffeur: string | null
          client_id: string | null
          commande_id: string | null
          created_at: string
          date_livraison: string | null
          id: string
          montant_ht: number | null
          notes: string | null
          numero: string | null
          statut: string | null
          updated_at: string
          vehicule_id: string | null
        }
        Insert: {
          chantier_id?: string | null
          chauffeur?: string | null
          client_id?: string | null
          commande_id?: string | null
          created_at?: string
          date_livraison?: string | null
          id?: string
          montant_ht?: number | null
          notes?: string | null
          numero?: string | null
          statut?: string | null
          updated_at?: string
          vehicule_id?: string | null
        }
        Update: {
          chantier_id?: string | null
          chauffeur?: string | null
          client_id?: string | null
          commande_id?: string | null
          created_at?: string
          date_livraison?: string | null
          id?: string
          montant_ht?: number | null
          notes?: string | null
          numero?: string | null
          statut?: string | null
          updated_at?: string
          vehicule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "livraisons_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "livraisons_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "livraisons_commande_id_fkey"
            columns: ["commande_id"]
            isOneToOne: false
            referencedRelation: "commandes_vente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "livraisons_vehicule_id_fkey"
            columns: ["vehicule_id"]
            isOneToOne: false
            referencedRelation: "vehicules"
            referencedColumns: ["id"]
          },
        ]
      }
      locations_materiel: {
        Row: {
          chantier_id: string | null
          created_at: string
          date_debut: string | null
          date_fin: string | null
          designation: string
          fournisseur_id: string | null
          id: string
          montant_total: number | null
          notes: string | null
          numero: string | null
          quantite: number | null
          statut: string | null
          tarif: number | null
          type_materiel: string | null
          unite_tarif: string | null
          updated_at: string
        }
        Insert: {
          chantier_id?: string | null
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          designation: string
          fournisseur_id?: string | null
          id?: string
          montant_total?: number | null
          notes?: string | null
          numero?: string | null
          quantite?: number | null
          statut?: string | null
          tarif?: number | null
          type_materiel?: string | null
          unite_tarif?: string | null
          updated_at?: string
        }
        Update: {
          chantier_id?: string | null
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          designation?: string
          fournisseur_id?: string | null
          id?: string
          montant_total?: number | null
          notes?: string | null
          numero?: string | null
          quantite?: number | null
          statut?: string | null
          tarif?: number | null
          type_materiel?: string | null
          unite_tarif?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_materiel_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_materiel_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
        ]
      }
      modes_reglement: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          libelle: string
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          libelle: string
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          libelle?: string
        }
        Relationships: []
      }
      modes_transport: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          libelle: string
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          libelle: string
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          libelle?: string
        }
        Relationships: []
      }
      mouvements_stock: {
        Row: {
          chantier_id: string | null
          constituant_id: string | null
          created_at: string
          date_mvt: string
          depot_id: string | null
          id: string
          notes: string | null
          prix_unitaire: number | null
          produit_id: string | null
          quantite: number
          reference: string | null
          type_mvt: string
          updated_at: string
        }
        Insert: {
          chantier_id?: string | null
          constituant_id?: string | null
          created_at?: string
          date_mvt?: string
          depot_id?: string | null
          id?: string
          notes?: string | null
          prix_unitaire?: number | null
          produit_id?: string | null
          quantite: number
          reference?: string | null
          type_mvt: string
          updated_at?: string
        }
        Update: {
          chantier_id?: string | null
          constituant_id?: string | null
          created_at?: string
          date_mvt?: string
          depot_id?: string | null
          id?: string
          notes?: string | null
          prix_unitaire?: number | null
          produit_id?: string | null
          quantite?: number
          reference?: string | null
          type_mvt?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mouvements_stock_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mouvements_stock_constituant_id_fkey"
            columns: ["constituant_id"]
            isOneToOne: false
            referencedRelation: "constituants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mouvements_stock_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mouvements_stock_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits_finis"
            referencedColumns: ["id"]
          },
        ]
      }
      operations_caisse: {
        Row: {
          beneficiaire: string | null
          caisse_id: string | null
          created_at: string
          date_operation: string
          id: string
          libelle: string | null
          montant: number
          piece: string | null
          type_operation: string
          updated_at: string
        }
        Insert: {
          beneficiaire?: string | null
          caisse_id?: string | null
          created_at?: string
          date_operation?: string
          id?: string
          libelle?: string | null
          montant: number
          piece?: string | null
          type_operation: string
          updated_at?: string
        }
        Update: {
          beneficiaire?: string | null
          caisse_id?: string | null
          created_at?: string
          date_operation?: string
          id?: string
          libelle?: string | null
          montant?: number
          piece?: string | null
          type_operation?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operations_caisse_caisse_id_fkey"
            columns: ["caisse_id"]
            isOneToOne: false
            referencedRelation: "caisses"
            referencedColumns: ["id"]
          },
        ]
      }
      pannes_engins: {
        Row: {
          cout_reparation: number | null
          created_at: string
          date_panne: string | null
          date_resolution: string | null
          description: string | null
          engin_id: string | null
          gravite: string | null
          id: string
          notes: string | null
          statut: string | null
          updated_at: string
          vehicule_id: string | null
        }
        Insert: {
          cout_reparation?: number | null
          created_at?: string
          date_panne?: string | null
          date_resolution?: string | null
          description?: string | null
          engin_id?: string | null
          gravite?: string | null
          id?: string
          notes?: string | null
          statut?: string | null
          updated_at?: string
          vehicule_id?: string | null
        }
        Update: {
          cout_reparation?: number | null
          created_at?: string
          date_panne?: string | null
          date_resolution?: string | null
          description?: string | null
          engin_id?: string | null
          gravite?: string | null
          id?: string
          notes?: string | null
          statut?: string | null
          updated_at?: string
          vehicule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pannes_engins_engin_id_fkey"
            columns: ["engin_id"]
            isOneToOne: false
            referencedRelation: "engins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pannes_engins_vehicule_id_fkey"
            columns: ["vehicule_id"]
            isOneToOne: false
            referencedRelation: "vehicules"
            referencedColumns: ["id"]
          },
        ]
      }
      papiers: {
        Row: {
          code: string | null
          created_at: string | null
          duree_validite_mois: number | null
          id: string
          libelle: string
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          duree_validite_mois?: number | null
          id?: string
          libelle: string
        }
        Update: {
          code?: string | null
          created_at?: string | null
          duree_validite_mois?: number | null
          id?: string
          libelle?: string
        }
        Relationships: []
      }
      papiers_engins: {
        Row: {
          cout: number | null
          created_at: string
          date_emission: string | null
          date_expiration: string | null
          engin_id: string | null
          id: string
          libelle: string
          notes: string | null
          numero: string | null
          papier_id: string | null
          updated_at: string
          vehicule_id: string | null
        }
        Insert: {
          cout?: number | null
          created_at?: string
          date_emission?: string | null
          date_expiration?: string | null
          engin_id?: string | null
          id?: string
          libelle: string
          notes?: string | null
          numero?: string | null
          papier_id?: string | null
          updated_at?: string
          vehicule_id?: string | null
        }
        Update: {
          cout?: number | null
          created_at?: string
          date_emission?: string | null
          date_expiration?: string | null
          engin_id?: string | null
          id?: string
          libelle?: string
          notes?: string | null
          numero?: string | null
          papier_id?: string | null
          updated_at?: string
          vehicule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "papiers_engins_engin_id_fkey"
            columns: ["engin_id"]
            isOneToOne: false
            referencedRelation: "engins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "papiers_engins_papier_id_fkey"
            columns: ["papier_id"]
            isOneToOne: false
            referencedRelation: "papiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "papiers_engins_vehicule_id_fkey"
            columns: ["vehicule_id"]
            isOneToOne: false
            referencedRelation: "vehicules"
            referencedColumns: ["id"]
          },
        ]
      }
      phases_chantier: {
        Row: {
          avancement: number | null
          budget: number | null
          chantier_id: string | null
          code: string | null
          created_at: string
          date_debut: string | null
          date_fin_prevue: string | null
          date_fin_reelle: string | null
          id: string
          nom: string
          notes: string | null
          statut: string | null
          updated_at: string
        }
        Insert: {
          avancement?: number | null
          budget?: number | null
          chantier_id?: string | null
          code?: string | null
          created_at?: string
          date_debut?: string | null
          date_fin_prevue?: string | null
          date_fin_reelle?: string | null
          id?: string
          nom: string
          notes?: string | null
          statut?: string | null
          updated_at?: string
        }
        Update: {
          avancement?: number | null
          budget?: number | null
          chantier_id?: string | null
          code?: string | null
          created_at?: string
          date_debut?: string | null
          date_fin_prevue?: string | null
          date_fin_reelle?: string | null
          id?: string
          nom?: string
          notes?: string | null
          statut?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "phases_chantier_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
        ]
      }
      plafond_caisses: {
        Row: {
          created_at: string | null
          id: string
          libelle: string
          montant: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          libelle: string
          montant: number
        }
        Update: {
          created_at?: string | null
          id?: string
          libelle?: string
          montant?: number
        }
        Relationships: []
      }
      pointages: {
        Row: {
          absent: boolean | null
          chantier_id: string | null
          created_at: string
          date_pointage: string
          employe_id: string | null
          heures_normales: number | null
          heures_sup: number | null
          id: string
          motif: string | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          absent?: boolean | null
          chantier_id?: string | null
          created_at?: string
          date_pointage: string
          employe_id?: string | null
          heures_normales?: number | null
          heures_sup?: number | null
          id?: string
          motif?: string | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          absent?: boolean | null
          chantier_id?: string | null
          created_at?: string
          date_pointage?: string
          employe_id?: string | null
          heures_normales?: number | null
          heures_sup?: number | null
          id?: string
          motif?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pointages_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pointages_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      produits_finis: {
        Row: {
          actif: boolean | null
          code: string | null
          created_at: string | null
          id: string
          libelle: string
          prix_vente: number | null
          tva_taux: number | null
          type_produit: string | null
          unite: string | null
          updated_at: string | null
        }
        Insert: {
          actif?: boolean | null
          code?: string | null
          created_at?: string | null
          id?: string
          libelle: string
          prix_vente?: number | null
          tva_taux?: number | null
          type_produit?: string | null
          unite?: string | null
          updated_at?: string | null
        }
        Update: {
          actif?: boolean | null
          code?: string | null
          created_at?: string | null
          id?: string
          libelle?: string
          prix_vente?: number | null
          tva_taux?: number | null
          type_produit?: string | null
          unite?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          job_title: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          job_title?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      receptions: {
        Row: {
          bon_commande_id: string | null
          chantier_id: string | null
          created_at: string
          date_reception: string
          depot_id: string | null
          fournisseur_id: string | null
          id: string
          montant_ht: number | null
          notes: string | null
          numero: string | null
          statut: string | null
          updated_at: string
        }
        Insert: {
          bon_commande_id?: string | null
          chantier_id?: string | null
          created_at?: string
          date_reception: string
          depot_id?: string | null
          fournisseur_id?: string | null
          id?: string
          montant_ht?: number | null
          notes?: string | null
          numero?: string | null
          statut?: string | null
          updated_at?: string
        }
        Update: {
          bon_commande_id?: string | null
          chantier_id?: string | null
          created_at?: string
          date_reception?: string
          depot_id?: string | null
          fournisseur_id?: string | null
          id?: string
          montant_ht?: number | null
          notes?: string | null
          numero?: string | null
          statut?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "receptions_bon_commande_id_fkey"
            columns: ["bon_commande_id"]
            isOneToOne: false
            referencedRelation: "bons_commande"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receptions_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receptions_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receptions_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
        ]
      }
      reglements: {
        Row: {
          client_id: string | null
          created_at: string
          date_reglement: string
          facture_id: string | null
          fournisseur_id: string | null
          id: string
          mode: string | null
          montant: number
          notes: string | null
          numero: string | null
          reference: string | null
          type_reglement: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          date_reglement: string
          facture_id?: string | null
          fournisseur_id?: string | null
          id?: string
          mode?: string | null
          montant?: number
          notes?: string | null
          numero?: string | null
          reference?: string | null
          type_reglement?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          date_reglement?: string
          facture_id?: string | null
          fournisseur_id?: string | null
          id?: string
          mode?: string | null
          montant?: number
          notes?: string | null
          numero?: string | null
          reference?: string | null
          type_reglement?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reglements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reglements_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reglements_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
        ]
      }
      releves_bancaires: {
        Row: {
          compte_id: string
          created_at: string
          date_debut: string
          date_fin: string
          id: string
          reference: string
          solde_final: number
          solde_initial: number
          statut: string
          updated_at: string
        }
        Insert: {
          compte_id: string
          created_at?: string
          date_debut: string
          date_fin: string
          id?: string
          reference: string
          solde_final?: number
          solde_initial?: number
          statut?: string
          updated_at?: string
        }
        Update: {
          compte_id?: string
          created_at?: string
          date_debut?: string
          date_fin?: string
          id?: string
          reference?: string
          solde_final?: number
          solde_initial?: number
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "releves_bancaires_compte_id_fkey"
            columns: ["compte_id"]
            isOneToOne: false
            referencedRelation: "comptes_comptables"
            referencedColumns: ["id"]
          },
        ]
      }
      rendement_journalier: {
        Row: {
          chantier_id: string | null
          created_at: string
          date_jour: string
          effectif: number | null
          heures_travaillees: number | null
          id: string
          meteo: string | null
          notes: string | null
          phase_id: string | null
          quantite_produite: number | null
          unite: string | null
          updated_at: string
        }
        Insert: {
          chantier_id?: string | null
          created_at?: string
          date_jour?: string
          effectif?: number | null
          heures_travaillees?: number | null
          id?: string
          meteo?: string | null
          notes?: string | null
          phase_id?: string | null
          quantite_produite?: number | null
          unite?: string | null
          updated_at?: string
        }
        Update: {
          chantier_id?: string | null
          created_at?: string
          date_jour?: string
          effectif?: number | null
          heures_travaillees?: number | null
          id?: string
          meteo?: string | null
          notes?: string | null
          phase_id?: string | null
          quantite_produite?: number | null
          unite?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rendement_journalier_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rendement_journalier_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases_chantier"
            referencedColumns: ["id"]
          },
        ]
      }
      retours: {
        Row: {
          chantier_id: string | null
          client_id: string | null
          created_at: string
          date_retour: string | null
          facture_id: string | null
          fournisseur_id: string | null
          id: string
          montant_ht: number | null
          motif: string | null
          notes: string | null
          numero: string | null
          statut: string | null
          type_retour: string
          updated_at: string
        }
        Insert: {
          chantier_id?: string | null
          client_id?: string | null
          created_at?: string
          date_retour?: string | null
          facture_id?: string | null
          fournisseur_id?: string | null
          id?: string
          montant_ht?: number | null
          motif?: string | null
          notes?: string | null
          numero?: string | null
          statut?: string | null
          type_retour?: string
          updated_at?: string
        }
        Update: {
          chantier_id?: string | null
          client_id?: string | null
          created_at?: string
          date_retour?: string | null
          facture_id?: string | null
          fournisseur_id?: string | null
          id?: string
          montant_ht?: number | null
          motif?: string | null
          notes?: string | null
          numero?: string | null
          statut?: string | null
          type_retour?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "retours_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retours_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retours_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retours_fournisseur_id_fkey"
            columns: ["fournisseur_id"]
            isOneToOne: false
            referencedRelation: "fournisseurs"
            referencedColumns: ["id"]
          },
        ]
      }
      societe: {
        Row: {
          adresse: string | null
          cnss: string | null
          created_at: string | null
          devise_defaut: string | null
          email: string | null
          forme_juridique: string | null
          ice: string | null
          id: string
          if_fiscal: string | null
          logo_url: string | null
          patente: string | null
          raison_sociale: string
          rc: string | null
          site_web: string | null
          telephone: string | null
          updated_at: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          cnss?: string | null
          created_at?: string | null
          devise_defaut?: string | null
          email?: string | null
          forme_juridique?: string | null
          ice?: string | null
          id?: string
          if_fiscal?: string | null
          logo_url?: string | null
          patente?: string | null
          raison_sociale: string
          rc?: string | null
          site_web?: string | null
          telephone?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          cnss?: string | null
          created_at?: string | null
          devise_defaut?: string | null
          email?: string | null
          forme_juridique?: string | null
          ice?: string | null
          id?: string
          if_fiscal?: string | null
          logo_url?: string | null
          patente?: string | null
          raison_sociale?: string
          rc?: string | null
          site_web?: string | null
          telephone?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      sous_traitants: {
        Row: {
          actif: boolean
          adresse: string | null
          code: string | null
          contact: string | null
          created_at: string
          email: string | null
          ice: string | null
          id: string
          notes: string | null
          raison_sociale: string
          rib: string | null
          specialite: string | null
          telephone: string | null
          updated_at: string
        }
        Insert: {
          actif?: boolean
          adresse?: string | null
          code?: string | null
          contact?: string | null
          created_at?: string
          email?: string | null
          ice?: string | null
          id?: string
          notes?: string | null
          raison_sociale: string
          rib?: string | null
          specialite?: string | null
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          actif?: boolean
          adresse?: string | null
          code?: string | null
          contact?: string | null
          created_at?: string
          email?: string | null
          ice?: string | null
          id?: string
          notes?: string | null
          raison_sociale?: string
          rib?: string | null
          specialite?: string | null
          telephone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      taches_chantier: {
        Row: {
          avancement: number | null
          chantier_id: string | null
          created_at: string
          date_debut: string | null
          date_fin_prevue: string | null
          date_fin_reelle: string | null
          id: string
          libelle: string
          notes: string | null
          phase_id: string | null
          priorite: string | null
          responsable: string | null
          statut: string | null
          updated_at: string
        }
        Insert: {
          avancement?: number | null
          chantier_id?: string | null
          created_at?: string
          date_debut?: string | null
          date_fin_prevue?: string | null
          date_fin_reelle?: string | null
          id?: string
          libelle: string
          notes?: string | null
          phase_id?: string | null
          priorite?: string | null
          responsable?: string | null
          statut?: string | null
          updated_at?: string
        }
        Update: {
          avancement?: number | null
          chantier_id?: string | null
          created_at?: string
          date_debut?: string | null
          date_fin_prevue?: string | null
          date_fin_reelle?: string | null
          id?: string
          libelle?: string
          notes?: string | null
          phase_id?: string | null
          priorite?: string | null
          responsable?: string | null
          statut?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "taches_chantier_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taches_chantier_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases_chantier"
            referencedColumns: ["id"]
          },
        ]
      }
      transferts_materiel: {
        Row: {
          chantier_destination_id: string | null
          chantier_source_id: string | null
          created_at: string
          date_transfert: string | null
          engin_id: string | null
          id: string
          motif: string | null
          notes: string | null
          updated_at: string
          vehicule_id: string | null
        }
        Insert: {
          chantier_destination_id?: string | null
          chantier_source_id?: string | null
          created_at?: string
          date_transfert?: string | null
          engin_id?: string | null
          id?: string
          motif?: string | null
          notes?: string | null
          updated_at?: string
          vehicule_id?: string | null
        }
        Update: {
          chantier_destination_id?: string | null
          chantier_source_id?: string | null
          created_at?: string
          date_transfert?: string | null
          engin_id?: string | null
          id?: string
          motif?: string | null
          notes?: string | null
          updated_at?: string
          vehicule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transferts_materiel_chantier_destination_id_fkey"
            columns: ["chantier_destination_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferts_materiel_chantier_source_id_fkey"
            columns: ["chantier_source_id"]
            isOneToOne: false
            referencedRelation: "chantier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferts_materiel_engin_id_fkey"
            columns: ["engin_id"]
            isOneToOne: false
            referencedRelation: "engins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferts_materiel_vehicule_id_fkey"
            columns: ["vehicule_id"]
            isOneToOne: false
            referencedRelation: "vehicules"
            referencedColumns: ["id"]
          },
        ]
      }
      transferts_stock: {
        Row: {
          constituant_id: string | null
          created_at: string
          date_transfert: string | null
          depot_destination_id: string | null
          depot_source_id: string | null
          id: string
          notes: string | null
          numero: string | null
          produit_id: string | null
          quantite: number | null
          statut: string | null
          updated_at: string
        }
        Insert: {
          constituant_id?: string | null
          created_at?: string
          date_transfert?: string | null
          depot_destination_id?: string | null
          depot_source_id?: string | null
          id?: string
          notes?: string | null
          numero?: string | null
          produit_id?: string | null
          quantite?: number | null
          statut?: string | null
          updated_at?: string
        }
        Update: {
          constituant_id?: string | null
          created_at?: string
          date_transfert?: string | null
          depot_destination_id?: string | null
          depot_source_id?: string | null
          id?: string
          notes?: string | null
          numero?: string | null
          produit_id?: string | null
          quantite?: number | null
          statut?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transferts_stock_constituant_id_fkey"
            columns: ["constituant_id"]
            isOneToOne: false
            referencedRelation: "constituants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferts_stock_depot_destination_id_fkey"
            columns: ["depot_destination_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferts_stock_depot_source_id_fkey"
            columns: ["depot_source_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferts_stock_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits_finis"
            referencedColumns: ["id"]
          },
        ]
      }
      tva: {
        Row: {
          actif: boolean | null
          created_at: string | null
          id: string
          libelle: string
          taux: number
        }
        Insert: {
          actif?: boolean | null
          created_at?: string | null
          id?: string
          libelle: string
          taux: number
        }
        Update: {
          actif?: boolean | null
          created_at?: string | null
          id?: string
          libelle?: string
          taux?: number
        }
        Relationships: []
      }
      types_engins: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          libelle: string
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          libelle: string
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          libelle?: string
        }
        Relationships: []
      }
      types_personnel: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          libelle: string
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          libelle: string
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          libelle?: string
        }
        Relationships: []
      }
      unites: {
        Row: {
          code: string
          created_at: string | null
          id: string
          libelle: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          libelle: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          libelle?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicules: {
        Row: {
          actif: boolean | null
          capacite: number | null
          chauffeur: string | null
          code: string | null
          compteur_km: number | null
          created_at: string
          id: string
          immatriculation: string | null
          libelle: string
          marque: string | null
          modele: string | null
          notes: string | null
          statut: string | null
          type_vehicule: string | null
          updated_at: string
        }
        Insert: {
          actif?: boolean | null
          capacite?: number | null
          chauffeur?: string | null
          code?: string | null
          compteur_km?: number | null
          created_at?: string
          id?: string
          immatriculation?: string | null
          libelle: string
          marque?: string | null
          modele?: string | null
          notes?: string | null
          statut?: string | null
          type_vehicule?: string | null
          updated_at?: string
        }
        Update: {
          actif?: boolean | null
          capacite?: number | null
          chauffeur?: string | null
          code?: string | null
          compteur_km?: number | null
          created_at?: string
          id?: string
          immatriculation?: string | null
          libelle?: string
          marque?: string | null
          modele?: string | null
          notes?: string | null
          statut?: string | null
          type_vehicule?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _kpi_ident_ok: {
        Args: { p_column: string; p_table: string }
        Returns: boolean
      }
      balance_generale: {
        Args: { p_date_debut: string; p_date_fin: string }
        Returns: Json
      }
      bilan: { Args: { p_date: string }; Returns: Json }
      chantier_financials: { Args: never; Returns: Json }
      compte_resultat: {
        Args: { p_date_debut: string; p_date_fin: string }
        Returns: Json
      }
      dashboard_kpis: { Args: never; Returns: Json }
      declaration_tva: {
        Args: { p_date_debut: string; p_date_fin: string }
        Returns: Json
      }
      grand_livre: {
        Args: { p_compte_id: string; p_date_debut: string; p_date_fin: string }
        Returns: Json
      }
      has_any_role: {
        Args: { _roles: string[]; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_direction: { Args: { _user_id: string }; Returns: boolean }
      kpi_count: {
        Args: { p_filters?: Json; p_table: string }
        Returns: number
      }
      kpi_group: {
        Args: {
          p_agg?: string
          p_field?: string
          p_group: string
          p_limit?: number
          p_table: string
        }
        Returns: Json
      }
      kpi_sum: {
        Args: { p_field: string; p_filters?: Json; p_table: string }
        Returns: number
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "direction"
        | "chef_chantier"
        | "rh"
        | "comptable"
        | "magasinier"
        | "caissier"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "direction",
        "chef_chantier",
        "rh",
        "comptable",
        "magasinier",
        "caissier",
      ],
    },
  },
} as const
