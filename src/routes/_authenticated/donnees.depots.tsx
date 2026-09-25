import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/donnees/depots")({
  component: () => (
    <CrudTable
      title="Dépôts"
      description="Entrepôts et lieux de stockage"
      table="depots"
      searchFields={["nom", "code"]}
      fields={[
        { name: "code", label: "Code" },
        { name: "nom", label: "Nom", required: true },
        { name: "adresse", label: "Adresse" },
        { name: "responsable", label: "Responsable" },
        { name: "telephone", label: "Téléphone", type: "tel" },
        { name: "actif", label: "Actif", type: "checkbox" },
      ]}
    />
  ),
});
