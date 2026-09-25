import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/production/rendement")({
  component: () => (
    <CrudTable
      title="Rendement journalier"
      description="Suivi quotidien de production sur chantier"
      table="rendement_journalier"
      searchFields={["notes", "meteo"]}
      fields={[
        { name: "date_jour", label: "Date", type: "date", required: true },
        { name: "chantier_id", label: "Chantier", required: true, ref: { table: "chantier", labelField: "nom" } },
        { name: "phase_id", label: "Phase", ref: { table: "phases_chantier", labelField: "nom" }, hideInTable: true },
        { name: "quantite_produite", label: "Quantité produite", type: "number" },
        { name: "unite", label: "Unité" },
        { name: "heures_travaillees", label: "Heures travaillées", type: "number" },
        { name: "effectif", label: "Effectif", type: "number" },
        { name: "meteo", label: "Météo", type: "select", options: [
          { value: "ensoleille", label: "Ensoleillé" },
          { value: "nuageux", label: "Nuageux" },
          { value: "pluie", label: "Pluie" },
          { value: "vent", label: "Vent" },
          { value: "arret", label: "Arrêt" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
