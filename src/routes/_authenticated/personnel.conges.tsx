import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/personnel/conges")({
  component: () => (
    <CrudTable
      title="Congés & Absences" description="Gestion des congés"
      table="conges" searchFields={["type_conge", "statut", "motif"]}
      fields={[
        { name: "employe_id", label: "Employé", type: "select", ref: { table: "employes", labelField: "nom" } },
        { name: "type_conge", label: "Type", type: "select", options: [
          { value: "paye", label: "Congé payé" },
          { value: "maladie", label: "Maladie" },
          { value: "sans_solde", label: "Sans solde" },
          { value: "autre", label: "Autre" },
        ] },
        { name: "date_debut", label: "Début", type: "date", required: true },
        { name: "date_fin", label: "Fin", type: "date", required: true },
        { name: "nb_jours", label: "Nb jours", type: "number" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "en_attente", label: "En attente" },
          { value: "approuve", label: "Approuvé" },
          { value: "refuse", label: "Refusé" },
        ] },
        { name: "motif", label: "Motif", type: "text" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
