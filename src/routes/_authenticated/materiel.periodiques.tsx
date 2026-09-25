import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/materiel/periodiques")({
  component: () => (
    <CrudTable
      title="Entretiens périodiques" description="Plan d'entretien préventif"
      table="entretiens_periodiques" searchFields={["libelle"]}
      fields={[
        { name: "libelle", label: "Libellé", required: true },
        { name: "periodicite_km", label: "Périodicité km", type: "number" },
        { name: "periodicite_h", label: "Périodicité h", type: "number" },
        { name: "periodicite_jours", label: "Périodicité jours", type: "number" },
      ]}
    />
  ),
});
