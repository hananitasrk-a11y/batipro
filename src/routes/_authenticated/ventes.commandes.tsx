import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";
import { generateDocumentPDF, generateDocumentsPDF, fetchLabel, fetchLabelsMap, type DocOptions } from "@/lib/pdf";
import { Download, FileDown } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

export const Route = createFileRoute("/_authenticated/ventes/commandes")({
  component: () => (
    <CrudTable
      title="Commandes clients" description="Bons de commande clients"
      table="commandes_vente" searchFields={["numero", "statut"]}
      bulkActions={[{
        label: "Exporter PDF",
        icon: FileDown,
        onClick: async (rows) => {
          try {
            const clients = await fetchLabelsMap("clients", rows.map((r) => r.client_id as string), "raison_sociale");
            const clientIces = await fetchLabelsMap("clients", rows.map((r) => r.client_id as string), "ice");
            const chantiers = await fetchLabelsMap("chantier", rows.map((r) => r.chantier_id as string), "nom");
            const items: DocOptions[] = rows.map((r) => ({
              kind: "Bon de commande",
              numero: String(r.numero ?? ""),
              date: r.date_commande ? String(r.date_commande) : null,
              echeance: r.date_livraison ? String(r.date_livraison) : null,
              tier: r.client_id ? {
                titre: "Commandé à",
                nom: clients[String(r.client_id)] ?? "",
                details: clientIces[String(r.client_id)] ? [`ICE: ${clientIces[String(r.client_id)]}`] : undefined,
              } : null,
              chantier: r.chantier_id ? chantiers[String(r.chantier_id)] ?? null : null,
              montant_ht: r.montant_ht as number,
              tva: r.tva as number,
              montant_ttc: r.montant_ttc as number,
              notes: r.notes as string,
            }));
            await generateDocumentsPDF(items, `Commandes_lot_${items.length}.pdf`);
            toast.success(`${items.length} bon(s) de commande exporté(s)`);
          } catch (e) { toast.error(getErrorMessage(e, "Impossible d'exporter les bons de commande")); }
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
              kind: "Bon de commande",
              numero: String(r.numero ?? ""),
              date: r.date_commande ? String(r.date_commande) : null,
              echeance: r.date_livraison ? String(r.date_livraison) : null,
              tier: clientNom ? { titre: "Commandé à", nom: clientNom, details: clientIce ? [`ICE: ${clientIce}`] : undefined } : null,
              chantier: chantierNom,
              montant_ht: r.montant_ht as number,
              tva: r.tva as number,
              montant_ttc: r.montant_ttc as number,
              notes: r.notes as string,
            });
          } catch (e) { toast.error(getErrorMessage(e, "Impossible d'exporter le bon de commande")); }
        },
      }]}
      fields={[
        { name: "numero", label: "N°", type: "text" },
        { name: "date_commande", label: "Date", type: "date", required: true },
        { name: "client_id", label: "Client", type: "select", ref: { table: "clients", labelField: "raison_sociale" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "devis_id", label: "Devis", type: "select", ref: { table: "devis", labelField: "numero" } },
        { name: "montant_ht", label: "Montant HT", type: "number" },
        { name: "tva", label: "TVA", type: "number", hideInTable: true },
        { name: "montant_ttc", label: "Montant TTC", type: "number" },
        { name: "date_livraison", label: "Livraison prévue", type: "date" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "brouillon", label: "Brouillon" },
          { value: "confirmee", label: "Confirmée" },
          { value: "livree", label: "Livrée" },
          { value: "facturee", label: "Facturée" },
          { value: "annulee", label: "Annulée" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
