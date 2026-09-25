import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/personnel/paie")({
  component: () => (
    <CrudTable
      title="Paie" description="Bulletins de salaire"
      table="bulletins_paie" searchFields={["numero", "statut"]}
      fields={[
        { name: "numero", label: "N° Bulletin", type: "text" },
        { name: "employe_id", label: "Employé", type: "select", ref: { table: "employes", labelField: "nom" } },
        { name: "mois", label: "Mois", type: "number", required: true },
        { name: "annee", label: "Année", type: "number", required: true },
        { name: "salaire_base", label: "Salaire base", type: "number" },
        { name: "heures_sup", label: "H. sup.", type: "number" },
        { name: "primes", label: "Primes", type: "number" },
        { name: "retenues", label: "Retenues", type: "number" },
        { name: "cnss", label: "CNSS", type: "number" },
        { name: "ir", label: "IR", type: "number" },
        { name: "net_a_payer", label: "Net à payer", type: "number" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "brouillon", label: "Brouillon" },
          { value: "valide", label: "Validé" },
          { value: "paye", label: "Payé" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
