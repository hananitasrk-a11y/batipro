import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/caisses/")({
  component: () => (
    <CrudTable
      title="Caisses" description="Caisses physiques et banques"
      table="caisses" searchFields={["libelle", "code", "responsable"]}
      fields={[
        { name: "code", label: "Code" },
        { name: "libelle", label: "Libellé", required: true },
        { name: "responsable", label: "Responsable" },
        { name: "devise", label: "Devise" },
        { name: "solde_initial", label: "Solde initial", type: "number" },
        { name: "plafond", label: "Plafond", type: "number" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
        { name: "actif", label: "Actif", type: "checkbox" },
      ]}
    />
  ),
});
