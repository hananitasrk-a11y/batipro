import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/achats/receptions")({
  component: () => (
    <CrudTable
      title="Réceptions" description="Bons de réception fournisseurs"
      table="receptions" searchFields={["numero", "statut"]}
      fields={[
        { name: "numero", label: "N° Réception", type: "text" },
        { name: "date_reception", label: "Date", type: "date", required: true },
        { name: "fournisseur_id", label: "Fournisseur", type: "select", ref: { table: "fournisseurs", labelField: "raison_sociale" } },
        { name: "bon_commande_id", label: "Bon de commande", type: "select", ref: { table: "bons_commande", labelField: "numero" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "depot_id", label: "Dépôt", type: "select", ref: { table: "depots", labelField: "libelle" } },
        { name: "montant_ht", label: "Montant HT", type: "number" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "recue", label: "Reçue" },
          { value: "partielle", label: "Partielle" },
          { value: "controle", label: "Contrôlée" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
