import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsView } from "@/components/analytics-view";

export const Route = createFileRoute("/_authenticated/transport/analyse")({
  component: () => (
    <AnalyticsView
      title="Analyse Transport"
      description="Livraisons et suivi des véhicules"
      metrics={[
        { label: "Véhicules", table: "vehicules" },
        { label: "Livraisons", table: "livraisons" },
        { label: "Transferts matériel", table: "transferts_materiel" },
        { label: "Modes transport", table: "modes_transport" },
      ]}
      charts={[
        { title: "Livraisons par véhicule (top 10)", table: "livraisons", groupBy: "vehicule_id", labelMap: { table: "vehicules", labelField: "matricule" } },
        { title: "Livraisons par statut", table: "livraisons", groupBy: "statut", type: "pie" },
      ]}
    />
  ),
});
