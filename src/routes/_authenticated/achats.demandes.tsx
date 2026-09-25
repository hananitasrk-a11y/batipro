import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/achats/demandes")({
  component: () => (
    <CrudTable
      title="Demandes de devis" description="Demandes de prix aux fournisseurs"
      table="demandes_devis" searchFields={["numero", "objet", "statut"]}
      fields={[
        { name: "numero", label: "N°", type: "text" },
        { name: "date_demande", label: "Date", type: "date", required: true },
        { name: "fournisseur_id", label: "Fournisseur", type: "select", ref: { table: "fournisseurs", labelField: "raison_sociale" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "objet", label: "Objet", type: "text" },
        { name: "montant_estime", label: "Montant estimé", type: "number" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "brouillon", label: "Brouillon" },
          { value: "envoyee", label: "Envoyée" },
          { value: "recue", label: "Réponse reçue" },
          { value: "validee", label: "Validée" },
          { value: "annulee", label: "Annulée" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
