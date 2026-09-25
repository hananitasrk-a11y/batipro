import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/production/")({
  component: () => (
    <CrudTable
      title="Chantiers" description="Suivi des affaires et chantiers en cours"
      table="chantier" searchFields={["nom", "code", "ville", "chef_chantier"]}
      fields={[
        { name: "code", label: "Code" },
        { name: "nom", label: "Nom du chantier", required: true },
        { name: "client_id", label: "Client", type: "select", ref: { table: "clients", labelField: "raison_sociale" } },
        { name: "ville", label: "Ville" },
        { name: "adresse", label: "Adresse", type: "textarea", hideInTable: true },
        { name: "date_debut", label: "Date début", type: "date" },
        { name: "date_fin_prevue", label: "Fin prévue", type: "date", hideInTable: true },
        { name: "date_fin_reelle", label: "Fin réelle", type: "date", hideInTable: true },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "prospection", label: "Prospection" },
          { value: "en_cours", label: "En cours" },
          { value: "suspendu", label: "Suspendu" },
          { value: "termine", label: "Terminé" },
        ] },
        { name: "montant_marche", label: "Montant marché", type: "number" },
        { name: "avancement", label: "Avancement (%)", type: "number" },
        { name: "chef_chantier", label: "Chef de chantier" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
