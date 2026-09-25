import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/materiel/pannes")({
  component: () => (
    <CrudTable
      title="Pannes journalières" description="Suivi des pannes engins / véhicules"
      table="pannes_engins" searchFields={["description", "statut", "gravite"]}
      fields={[
        { name: "date_panne", label: "Date", type: "date", required: true },
        { name: "engin_id", label: "Engin", type: "select", ref: { table: "engins", labelField: "libelle" } },
        { name: "vehicule_id", label: "Véhicule", type: "select", ref: { table: "vehicules", labelField: "libelle" } },
        { name: "description", label: "Description", type: "text" },
        { name: "gravite", label: "Gravité", type: "select", options: [
          { value: "faible", label: "Faible" }, { value: "moyenne", label: "Moyenne" }, { value: "elevee", label: "Élevée" },
        ] },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "ouverte", label: "Ouverte" }, { value: "en_cours", label: "En cours" }, { value: "resolue", label: "Résolue" },
        ] },
        { name: "date_resolution", label: "Résolue le", type: "date", hideInTable: true },
        { name: "cout_reparation", label: "Coût", type: "number" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
