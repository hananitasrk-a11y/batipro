import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/materiel/transferts")({
  component: () => (
    <CrudTable
      title="Transferts matériel" description="Transferts entre chantiers"
      table="transferts_materiel" searchFields={["motif"]}
      fields={[
        { name: "date_transfert", label: "Date", type: "date", required: true },
        { name: "engin_id", label: "Engin", type: "select", ref: { table: "engins", labelField: "libelle" } },
        { name: "vehicule_id", label: "Véhicule", type: "select", ref: { table: "vehicules", labelField: "libelle" } },
        { name: "chantier_source_id", label: "Chantier source", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "chantier_destination_id", label: "Chantier destination", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "motif", label: "Motif", type: "text" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
