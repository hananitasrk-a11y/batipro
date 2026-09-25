import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/ventes/commandes")({
  component: () => (
    <CrudTable
      title="Commandes clients" description="Bons de commande clients"
      table="commandes_vente" searchFields={["numero", "statut"]}
      fields={[
        { name: "numero", label: "N°", type: "text" },
        { name: "date_commande", label: "Date", type: "date", required: true },
        { name: "client_id", label: "Client", type: "select", ref: { table: "clients", labelField: "raison_sociale" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "devis_id", label: "Devis", type: "select", ref: { table: "devis", labelField: "numero" } },
        { name: "montant_ht", label: "Montant HT", type: "number" },
        { name: "tva", label: "TVA", type: "number", hideInTable: true },
        { name: "montant_ttc", label: "Montant TTC", type: "number" },
        { name: "date_livraison", label: "Livraison prévue", type: "date" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "brouillon", label: "Brouillon" },
          { value: "confirmee", label: "Confirmée" },
          { value: "livree", label: "Livrée" },
          { value: "facturee", label: "Facturée" },
          { value: "annulee", label: "Annulée" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
