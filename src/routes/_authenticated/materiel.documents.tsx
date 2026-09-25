import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/materiel/documents")({
  component: () => (
    <CrudTable
      title="Documents matériel" description="Documents liés aux engins et véhicules"
      table="documents_materiel" searchFields={["libelle", "type_document"]}
      fields={[
        { name: "libelle", label: "Libellé", required: true },
        { name: "type_document", label: "Type" },
        { name: "engin_id", label: "Engin", type: "select", ref: { table: "engins", labelField: "libelle" } },
        { name: "vehicule_id", label: "Véhicule", type: "select", ref: { table: "vehicules", labelField: "libelle" } },
        { name: "url", label: "URL/Fichier", type: "text", hideInTable: true },
        { name: "date_emission", label: "Date émission", type: "date" },
        { name: "date_expiration", label: "Date expiration", type: "date" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
