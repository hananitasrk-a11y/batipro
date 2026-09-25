import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsView } from "@/components/analytics-view";

export const Route = createFileRoute("/_authenticated/materiel/analyse")({
  component: () => (
    <AnalyticsView
      title="Analyse Matériel"
      description="Suivi du parc engins, entretien et carburant"
      metrics={[
        { label: "Engins", table: "engins" },
        { label: "Entretiens", table: "entretiens_realises" },
        { label: "Coût entretien", table: "entretiens_realises", aggregate: "sum", field: "cout", format: "money" },
        { label: "Coût gasoil", table: "consommation_gasoil", aggregate: "sum", field: "montant", format: "money" },
      ]}
      charts={[
        { title: "Pannes par engin (top 10)", table: "pannes_engins", groupBy: "engin_id", labelMap: { table: "engins", labelField: "matricule" } },
        { title: "Gasoil par engin (top 10)", table: "consommation_gasoil", groupBy: "engin_id", field: "quantite", aggregate: "sum", labelMap: { table: "engins", labelField: "matricule" } },
      ]}
    />
  ),
});
