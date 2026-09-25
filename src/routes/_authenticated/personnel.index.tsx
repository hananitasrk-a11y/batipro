import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/personnel/")({
  component: () => (
    <CrudTable
      title="Personnel" description="Employés, ouvriers et collaborateurs"
      table="employes" searchFields={["nom", "prenom", "matricule", "cin", "poste"]}
      fields={[
        { name: "matricule", label: "Matricule" },
        { name: "nom", label: "Nom", required: true },
        { name: "prenom", label: "Prénom" },
        { name: "poste", label: "Poste" },
        { name: "type_personnel", label: "Type" },
        { name: "cin", label: "CIN", hideInTable: true },
        { name: "cnss", label: "CNSS", hideInTable: true },
        { name: "telephone", label: "Téléphone", type: "tel" },
        { name: "email", label: "Email", type: "email", hideInTable: true },
        { name: "adresse", label: "Adresse", type: "textarea", hideInTable: true },
        { name: "date_embauche", label: "Date embauche", type: "date", hideInTable: true },
        { name: "date_sortie", label: "Date sortie", type: "date", hideInTable: true },
        { name: "chantier_id", label: "Affecté à", type: "select", ref: { table: "chantier", labelField: "nom" }, hideInTable: true },
        { name: "salaire_base", label: "Salaire base", type: "number" },
        { name: "taux_horaire", label: "Taux horaire", type: "number", hideInTable: true },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
        { name: "actif", label: "Actif", type: "checkbox" },
      ]}
    />
  ),
});
