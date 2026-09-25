import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/production/phases")({
  component: () => (
    <CrudTable
      title="Phases de chantier"
      description="Découpage des chantiers en phases avec avancement et budget"
      table="phases_chantier"
      searchFields={["nom", "code"]}
      fields={[
        { name: "chantier_id", label: "Chantier", required: true, ref: { table: "chantier", labelField: "nom" } },
        { name: "code", label: "Code" },
        { name: "nom", label: "Nom de la phase", required: true },
        { name: "date_debut", label: "Date début", type: "date" },
        { name: "date_fin_prevue", label: "Fin prévue", type: "date" },
        { name: "date_fin_reelle", label: "Fin réelle", type: "date", hideInTable: true },
        { name: "avancement", label: "Avancement (%)", type: "number" },
        { name: "budget", label: "Budget", type: "number" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "planifie", label: "Planifiée" },
          { value: "en_cours", label: "En cours" },
          { value: "suspendu", label: "Suspendue" },
          { value: "termine", label: "Terminée" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
