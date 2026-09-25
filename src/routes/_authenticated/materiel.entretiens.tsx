import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/materiel/entretiens")({
  component: () => (
    <CrudTable
      title="Entretiens" description="Interventions de maintenance"
      table="entretiens_realises" searchFields={["type_entretien", "prestataire", "description"]}
      fields={[
        { name: "date_entretien", label: "Date", type: "date", required: true },
        { name: "engin_id", label: "Engin", type: "select", ref: { table: "engins", labelField: "libelle" } },
        { name: "vehicule_id", label: "Véhicule", type: "select", ref: { table: "vehicules", labelField: "libelle" } },
        { name: "type_entretien", label: "Type", type: "text" },
        { name: "compteur_km", label: "Compteur km", type: "number" },
        { name: "compteur_h", label: "Compteur h", type: "number" },
        { name: "cout", label: "Coût", type: "number" },
        { name: "prestataire", label: "Prestataire", type: "text" },
        { name: "description", label: "Description", type: "textarea", hideInTable: true },
        { name: "prochaine_date", label: "Prochaine échéance", type: "date" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
