import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/materiel/gasoil")({
  component: () => (
    <CrudTable
      title="Consommation gasoil" description="Suivi du carburant"
      table="consommation_gasoil" searchFields={["notes"]}
      fields={[
        { name: "date_conso", label: "Date", type: "date", required: true },
        { name: "engin_id", label: "Engin", type: "select", ref: { table: "engins", labelField: "libelle" } },
        { name: "vehicule_id", label: "Véhicule", type: "select", ref: { table: "vehicules", labelField: "libelle" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "quantite_litres", label: "Quantité (L)", type: "number" },
        { name: "prix_unitaire", label: "Prix L", type: "number" },
        { name: "montant", label: "Montant", type: "number" },
        { name: "compteur_km", label: "Compteur km", type: "number", hideInTable: true },
        { name: "compteur_h", label: "Compteur h", type: "number", hideInTable: true },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
