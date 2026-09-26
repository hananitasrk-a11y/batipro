import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";
import { generateDocumentPDF, generateDocumentsPDF, fetchLabel, fetchLabelsMap, type DocOptions } from "@/lib/pdf";
import { Download, FileDown } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

export const Route = createFileRoute("/_authenticated/ventes/devis")({
  component: () => (
    <CrudTable
      title="Devis" description="Devis clients"
      table="devis" searchFields={["numero", "objet", "statut"]}
      bulkActions={[{
        label: "Exporter PDF", icon: FileDown,
        onClick: async (rows) => {
          try {
            const clients = await fetchLabelsMap("clients", rows.map((r) => r.client_id as string), "raison_sociale");
            const clientIces = await fetchLabelsMap("clients", rows.map((r) => r.client_id as string), "ice");
            const clientAdresses = await fetchLabelsMap("clients", rows.map((r) => r.client_id as string), "adresse");
            const clientTels = await fetchLabelsMap("clients", rows.map((r) => r.client_id as string), "telephone");
            const chantiers = await fetchLabelsMap("chantier", rows.map((r) => r.chantier_id as string), "nom");
            const items: DocOptions[] = rows.map((r) => {
              const cid = String(r.client_id ?? "");
              const details: string[] = [];
              if (clientIces[cid]) details.push(`ICE: ${clientIces[cid]}`);
              if (clientAdresses[cid]) details.push(clientAdresses[cid]);
              if (clientTels[cid]) details.push(`Tél: ${clientTels[cid]}`);
              return {
                kind: "Devis",
                numero: String(r.numero ?? ""),
                date: r.date_devis ? String(r.date_devis) : null,
                echeance: r.validite ? String(r.validite) : null,
                tier: r.client_id ? {
                  titre: "Adressé à",
                  nom: clients[cid] ?? "",
                  details: details.length ? details : undefined,
                } : null,
                chantier: r.chantier_id ? chantiers[String(r.chantier_id)] ?? null : null,
                objet: r.objet as string,
                montant_ht: r.montant_ht as number,
                tva: r.tva as number,
                montant_ttc: r.montant_ttc as number,
                notes: [r.conditions, r.notes].filter(Boolean).join("\n\n") as string,
              };
            });
            await generateDocumentsPDF(items, `Devis_lot_${items.length}.pdf`);
            toast.success(`${items.length} devis exporté(s)`);
          } catch (e) { toast.error(getErrorMessage(e, "Impossible d'exporter les devis")); }
        },
      }]}
      rowActions={[{
        label: "Télécharger PDF", icon: Download,
        onClick: async (r) => {
          try {
            const clientNom = await fetchLabel("clients", r.client_id as string, "raison_sociale");
            const clientIce = await fetchLabel("clients", r.client_id as string, "ice");
            const clientAdresse = await fetchLabel("clients", r.client_id as string, "adresse");
            const clientTel = await fetchLabel("clients", r.client_id as string, "telephone");
            const chantierNom = await fetchLabel("chantier", r.chantier_id as string, "nom");
            const details: string[] = [];
            if (clientIce) details.push(`ICE: ${clientIce}`);
            if (clientAdresse) details.push(clientAdresse);
            if (clientTel) details.push(`Tél: ${clientTel}`);
            await generateDocumentPDF({
              kind: "Devis",
              numero: String(r.numero ?? ""),
              date: r.date_devis ? String(r.date_devis) : null,
              echeance: r.validite ? String(r.validite) : null,
              tier: clientNom ? { titre: "Adressé à", nom: clientNom, details: details.length ? details : undefined } : null,
              chantier: chantierNom,
              objet: r.objet as string,
              montant_ht: r.montant_ht as number,
              tva: r.tva as number,
              montant_ttc: r.montant_ttc as number,
              notes: [r.conditions, r.notes].filter(Boolean).join("\n\n") as string,
            });
          } catch (e) { toast.error(getErrorMessage(e, "Impossible d'exporter le devis")); }
        },
      }]}
      fields={[
        { name: "numero", label: "N° Devis", type: "text", required: true },
        { name: "date_devis", label: "Date d'émission", type: "date", required: true },
        { name: "client_id", label: "Client", type: "select", required: true, ref: { table: "clients", labelField: "raison_sociale" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "objet", label: "Objet", type: "text", required: true },
        { name: "montant_ht", label: "Montant HT", type: "number", required: true },
        { name: "tva", label: "TVA (%)", type: "number", required: true },
        { name: "montant_ttc", label: "Montant TTC", type: "number", required: true },
        { name: "validite", label: "Date de validité", type: "date", required: true },
        { name: "statut", label: "Statut", type: "select", required: true, defaultValue: "brouillon", options: [
          { value: "brouillon", label: "Brouillon" },
          { value: "envoye", label: "Envoyé" },
          { value: "accepte", label: "Accepté" },
          { value: "refuse", label: "Refusé" },
        ] },
        { name: "conditions", label: "Conditions / Mentions légales", type: "textarea", hideInTable: true },
        { name: "notes", label: "Notes internes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
