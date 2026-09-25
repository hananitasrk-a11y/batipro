import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/donnees/clients")({
  component: () => (
    <CrudTable
      title="Clients"
      description="Liste de vos clients"
      table="clients"
      searchFields={["raison_sociale", "code", "ville", "telephone"]}
      fields={[
        { name: "code", label: "Code" },
        { name: "raison_sociale", label: "Raison sociale", required: true },
        { name: "type_client", label: "Type" },
        { name: "contact", label: "Contact" },
        { name: "telephone", label: "Téléphone", type: "tel" },
        { name: "email", label: "Email", type: "email" },
        { name: "ville", label: "Ville" },
        { name: "adresse", label: "Adresse", type: "textarea", hideInTable: true },
        { name: "ice", label: "ICE", hideInTable: true },
        { name: "rc", label: "RC", hideInTable: true },
        { name: "if_fiscal", label: "IF", hideInTable: true },
        { name: "plafond_credit", label: "Plafond crédit", type: "number" },
        { name: "mode_reglement", label: "Mode de règlement", hideInTable: true },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
        { name: "actif", label: "Actif", type: "checkbox" },
      ]}
    />
  ),
});
