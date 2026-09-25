import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/production/taches")({
  component: () => (
    <CrudTable
      title="Tâches & planning"
      description="Suivi des tâches par chantier et par phase"
      table="taches_chantier"
      searchFields={["libelle", "responsable"]}
      fields={[
        { name: "chantier_id", label: "Chantier", required: true, ref: { table: "chantier", labelField: "nom" } },
        { name: "phase_id", label: "Phase", ref: { table: "phases_chantier", labelField: "nom" } },
        { name: "libelle", label: "Tâche", required: true },
        { name: "responsable", label: "Responsable" },
        { name: "date_debut", label: "Début", type: "date" },
        { name: "date_fin_prevue", label: "Fin prévue", type: "date" },
        { name: "date_fin_reelle", label: "Fin réelle", type: "date", hideInTable: true },
        { name: "avancement", label: "Avancement (%)", type: "number" },
        { name: "priorite", label: "Priorité", type: "select", options: [
          { value: "basse", label: "Basse" },
          { value: "normale", label: "Normale" },
          { value: "haute", label: "Haute" },
          { value: "urgente", label: "Urgente" },
        ] },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "a_faire", label: "À faire" },
          { value: "en_cours", label: "En cours" },
          { value: "bloque", label: "Bloquée" },
          { value: "termine", label: "Terminée" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
