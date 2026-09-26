import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";
import { generateDocumentPDF, generateDocumentsPDF, fetchLabel, fetchLabelsMap, type DocOptions } from "@/lib/pdf";
import { Download, FileDown } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

export const Route = createFileRoute("/_authenticated/ventes/livraisons")({
  component: () => (
    <CrudTable
      title="Livraisons" description="Bons de livraison clients"
      table="livraisons" searchFields={["numero", "chauffeur", "statut"]}
      bulkActions={[{
        label: "Exporter PDF",
        icon: FileDown,
        onClick: async (rows) => {
          try {
            const clients = await fetchLabelsMap("clients", rows.map((r) => r.client_id as string), "raison_sociale");
            const clientIces = await fetchLabelsMap("clients", rows.map((r) => r.client_id as string), "ice");
            const chantiers = await fetchLabelsMap("chantier", rows.map((r) => r.chantier_id as string), "nom");
            const items: DocOptions[] = rows.map((r) => ({
              kind: "Bon de livraison",
              numero: String(r.numero ?? ""),
              date: r.date_livraison ? String(r.date_livraison) : null,
              echeance: r.date_livraison ? String(r.date_livraison) : null,
              tier: r.client_id ? {
                titre: "Livré à",
                nom: clients[String(r.client_id)] ?? "",
                details: clientIces[String(r.client_id)] ? [`ICE: ${clientIces[String(r.client_id)]}`] : undefined,
              } : null,
              chantier: r.chantier_id ? chantiers[String(r.chantier_id)] ?? null : null,
              montant_ht: r.montant_ht as number,
              notes: r.notes as string,
            }));
            await generateDocumentsPDF(items, `Livraisons_lot_${items.length}.pdf`);
            toast.success(`${items.length} bon(s) de livraison exporté(s)`);
          } catch (e) { toast.error(getErrorMessage(e, "Impossible d'exporter les bons de livraison")); }
        },
      }]}
      rowActions={[{
        label: "Télécharger PDF", icon: Download,
        onClick: async (r) => {
          try {
            const clientNom = await fetchLabel("clients", r.client_id as string, "raison_sociale");
            const clientIce = await fetchLabel("clients", r.client_id as string, "ice");
            const chantierNom = await fetchLabel("chantier", r.chantier_id as string, "nom");
            await generateDocumentPDF({
              kind: "Bon de livraison",
              numero: String(r.numero ?? ""),
              date: r.date_livraison ? String(r.date_livraison) : null,
              echeance: r.date_livraison ? String(r.date_livraison) : null,
              tier: clientNom ? { titre: "Livré à", nom: clientNom, details: clientIce ? [`ICE: ${clientIce}`] : undefined } : null,
              chantier: chantierNom,
              montant_ht: r.montant_ht as number,
              notes: r.notes as string,
            });
          } catch (e) { toast.error(getErrorMessage(e, "Impossible d'exporter le bon de livraison")); }
        },
      }]}
      fields={[
        { name: "numero", label: "N°", type: "text" },
        { name: "date_livraison", label: "Date", type: "date", required: true },
        { name: "client_id", label: "Client", type: "select", ref: { table: "clients", labelField: "raison_sociale" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "commande_id", label: "Commande", type: "select", ref: { table: "commandes_vente", labelField: "numero" } },
        { name: "vehicule_id", label: "Véhicule", type: "select", ref: { table: "vehicules", labelField: "libelle" } },
        { name: "chauffeur", label: "Chauffeur", type: "text" },
        { name: "montant_ht", label: "Montant HT", type: "number" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "preparee", label: "Préparée" },
          { value: "expediee", label: "Expédiée" },
          { value: "livree", label: "Livrée" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
