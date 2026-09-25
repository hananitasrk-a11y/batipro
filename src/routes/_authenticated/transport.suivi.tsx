import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/transport/suivi")({
  component: () => (
    <CrudTable
      title="Suivi transports" description="Livraisons et tournées"
      table="livraisons" searchFields={["numero", "chauffeur", "statut"]}
      fields={[
        { name: "numero", label: "N°" },
        { name: "date_livraison", label: "Date", type: "date", required: true },
        { name: "vehicule_id", label: "Véhicule", type: "select", ref: { table: "vehicules", labelField: "libelle" } },
        { name: "chauffeur", label: "Chauffeur", type: "text" },
        { name: "client_id", label: "Client", type: "select", ref: { table: "clients", labelField: "raison_sociale" } },
        { name: "chantier_id", label: "Destination", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "montant_ht", label: "Montant", type: "number" },
        { name: "statut", label: "Statut", type: "text" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
