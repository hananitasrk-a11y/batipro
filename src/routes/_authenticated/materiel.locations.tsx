import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/materiel/locations")({
  component: () => (
    <CrudTable
      title="Locations matériel" description="Engins et véhicules loués auprès de fournisseurs"
      table="locations_materiel" searchFields={["numero", "designation", "statut", "type_materiel"]}
      fields={[
        { name: "numero", label: "N°" },
        { name: "designation", label: "Désignation", required: true },
        { name: "type_materiel", label: "Type" },
        { name: "fournisseur_id", label: "Fournisseur", type: "select", ref: { table: "fournisseurs", labelField: "raison_sociale" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "date_debut", label: "Début", type: "date" },
        { name: "date_fin", label: "Fin", type: "date" },
        { name: "tarif", label: "Tarif", type: "number" },
        { name: "unite_tarif", label: "Unité", type: "select", options: [
          { value: "heure", label: "Heure" },
          { value: "jour", label: "Jour" },
          { value: "mois", label: "Mois" },
          { value: "forfait", label: "Forfait" },
        ] },
        { name: "quantite", label: "Quantité", type: "number" },
        { name: "montant_total", label: "Montant total", type: "number" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "en_cours", label: "En cours" },
          { value: "termine", label: "Terminé" },
          { value: "annule", label: "Annulé" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
