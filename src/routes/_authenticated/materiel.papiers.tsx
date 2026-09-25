import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/materiel/papiers")({
  component: () => (
    <CrudTable
      title="Papiers" description="Documents administratifs (cartes grises, assurances, visites…)"
      table="papiers_engins" searchFields={["libelle", "numero"]}
      fields={[
        { name: "libelle", label: "Libellé", type: "text", required: true },
        { name: "numero", label: "Numéro", type: "text" },
        { name: "engin_id", label: "Engin", type: "select", ref: { table: "engins", labelField: "libelle" } },
        { name: "vehicule_id", label: "Véhicule", type: "select", ref: { table: "vehicules", labelField: "libelle" } },
        { name: "papier_id", label: "Type papier", type: "select", ref: { table: "papiers", labelField: "libelle" } },
        { name: "date_emission", label: "Date émission", type: "date" },
        { name: "date_expiration", label: "Date expiration", type: "date" },
        { name: "cout", label: "Coût", type: "number" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
