import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsView } from "@/components/analytics-view";

export const Route = createFileRoute("/_authenticated/personnel/analyse")({
  component: () => (
    <AnalyticsView
      title="Analyse Personnel"
      description="Suivi RH : pointage, paie, absences"
      metrics={[
        { label: "Employés", table: "employes" },
        { label: "Masse salariale", table: "bulletins_paie", aggregate: "sum", field: "net_a_payer", format: "money" },
        { label: "Avances", table: "avances", aggregate: "sum", field: "montant", format: "money" },
        { label: "Congés", table: "conges" },
      ]}
      charts={[
        { title: "Absences par employé (top 10)", table: "absences", groupBy: "employe_id", labelMap: { table: "employes", labelField: "nom" } },
        { title: "Pointages par chantier (top 10)", table: "pointages", groupBy: "chantier_id", labelMap: { table: "chantier", labelField: "nom" } },
      ]}
    />
  ),
});
