import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/transport/")({
  component: () => (
    <CrudTable
      title="Transport — Véhicules" description="Parc de véhicules"
      table="vehicules" searchFields={["libelle", "immatriculation", "chauffeur"]}
      fields={[
        { name: "code", label: "Code" },
        { name: "libelle", label: "Libellé", required: true },
        { name: "immatriculation", label: "Immatriculation" },
        { name: "marque", label: "Marque" },
        { name: "modele", label: "Modèle", hideInTable: true },
        { name: "type_vehicule", label: "Type" },
        { name: "capacite", label: "Capacité (t/m³)", type: "number", hideInTable: true },
        { name: "chauffeur", label: "Chauffeur" },
        { name: "compteur_km", label: "Compteur km", type: "number", hideInTable: true },
        { name: "statut", label: "Statut" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
        { name: "actif", label: "Actif", type: "checkbox" },
      ]}
    />
  ),
});
