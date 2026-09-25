import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/ventes/livraisons")({
  component: () => (
    <CrudTable
      title="Livraisons" description="Bons de livraison clients"
      table="livraisons" searchFields={["numero", "chauffeur", "statut"]}
      fields={[
        { name: "numero", label: "N°", type: "text" },
        { name: "date_livraison", label: "Date", type: "date", required: true },
        { name: "client_id", label: "Client", type: "select", ref: { table: "clients", labelField: "raison_sociale" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "commande_id", label: "Commande", type: "select", ref: { table: "commandes_vente", labelField: "numero" } },
        { name: "vehicule_id", label: "Véhicule", type: "select", ref: { table: "vehicules", labelField: "libelle" } },
        { name: "chauffeur", label: "Chauffeur", type: "text" },
        { name: "montant_ht", label: "Montant HT", type: "number" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "preparee", label: "Préparée" },
          { value: "expediee", label: "Expédiée" },
          { value: "livree", label: "Livrée" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
