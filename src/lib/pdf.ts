import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/integrations/supabase/client";
import { fmtMoney } from "@/lib/format";

export type DocKind = "Devis" | "Facture" | "Bon de commande";

interface SocieteInfo {
  nom?: string | null;
  adresse?: string | null;
  telephone?: string | null;
  email?: string | null;
  ice?: string | null;
  rc?: string | null;
  if?: string | null;
}

export interface DocOptions {
  kind: DocKind;
  numero: string;
  date?: string | null;
  echeance?: string | null;
  tier?: { titre: string; nom: string; details?: string[] } | null;
  chantier?: string | null;
  objet?: string | null;
  lignes?: { designation: string; qte?: number; pu?: number; total?: number }[];
  montant_ht?: number | null;
  tva?: number | null;
  montant_ttc?: number | null;
  notes?: string | null;
  statut?: string | null;
}

async function loadSociete(): Promise<SocieteInfo> {
  const { data } = await supabase.from("societe" as never).select("*").limit(1).maybeSingle();
  return (data as unknown as SocieteInfo) ?? {};
}

function renderDocument(doc: jsPDF, societe: SocieteInfo, opts: DocOptions) {
  const W = doc.internal.pageSize.getWidth();
  let y = 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(societe.nom ?? "Société", 14, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  y += 6;
  const lines = [societe.adresse, societe.telephone, societe.email].filter(Boolean) as string[];
  lines.forEach((l) => { doc.text(l, 14, y); y += 4; });
  const legal = [societe.ice && `ICE: ${societe.ice}`, societe.rc && `RC: ${societe.rc}`, societe.if && `IF: ${societe.if}`].filter(Boolean) as string[];
  if (legal.length) { doc.text(legal.join("  •  "), 14, y); y += 4; }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(opts.kind.toUpperCase(), W - 14, 18, { align: "right" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`N° ${opts.numero || "—"}`, W - 14, 25, { align: "right" });
  if (opts.date) doc.text(`Date: ${opts.date}`, W - 14, 30, { align: "right" });
  if (opts.echeance) doc.text(`Échéance: ${opts.echeance}`, W - 14, 35, { align: "right" });

  y = Math.max(y, 42);
  doc.setDrawColor(200);
  doc.line(14, y, W - 14, y);
  y += 6;

  if (opts.tier) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(opts.tier.titre, 14, y); y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(opts.tier.nom, 14, y); y += 5;
    (opts.tier.details ?? []).forEach((d) => { doc.text(d, 14, y); y += 4; });
    y += 2;
  }
  if (opts.chantier) { doc.setFont("helvetica", "bold"); doc.text("Chantier:", 14, y); doc.setFont("helvetica", "normal"); doc.text(opts.chantier, 35, y); y += 5; }
  if (opts.objet) { doc.setFont("helvetica", "bold"); doc.text("Objet:", 14, y); doc.setFont("helvetica", "normal"); doc.text(opts.objet, 30, y); y += 5; }

  const body = (opts.lignes && opts.lignes.length > 0 ? opts.lignes : [{ designation: opts.objet ?? "Prestation", qte: 1, pu: opts.montant_ht ?? 0, total: opts.montant_ht ?? 0 }])
    .map((l) => [l.designation ?? "", String(l.qte ?? ""), l.pu != null ? fmtMoney(l.pu) : "", l.total != null ? fmtMoney(l.total) : ""]);

  autoTable(doc, {
    startY: y + 2,
    head: [["Désignation", "Qté", "P.U.", "Total"]],
    body,
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [30, 64, 175], textColor: 255 },
    columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" } },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  const totalsX = W - 80;
  const ht = opts.montant_ht ?? 0;
  const tva = opts.tva ?? 0;
  const ttc = opts.montant_ttc ?? ht + tva;
  doc.setFontSize(10);
  doc.text("Total HT", totalsX, finalY);
  doc.text(fmtMoney(ht), W - 14, finalY, { align: "right" });
  doc.text("TVA", totalsX, finalY + 5);
  doc.text(fmtMoney(tva), W - 14, finalY + 5, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Total TTC", totalsX, finalY + 12);
  doc.text(fmtMoney(ttc), W - 14, finalY + 12, { align: "right" });

  if (opts.notes) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Notes:", 14, finalY + 22);
    const split = doc.splitTextToSize(opts.notes, W - 28);
    doc.text(split, 14, finalY + 27);
  }

  const H = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(`${societe.nom ?? ""} — Document généré le ${new Date().toLocaleDateString("fr-FR")}`, W / 2, H - 8, { align: "center" });
  doc.setTextColor(0);
}

export async function generateDocumentPDF(opts: DocOptions) {
  const societe = await loadSociete();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  renderDocument(doc, societe, opts);
  doc.save(`${opts.kind}_${opts.numero || "doc"}.pdf`);
}

export async function generateDocumentsPDF(items: DocOptions[], filename?: string) {
  if (items.length === 0) return;
  const societe = await loadSociete();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  items.forEach((opts, i) => {
    if (i > 0) doc.addPage();
    renderDocument(doc, societe, opts);
  });
  const kind = items[0].kind;
  doc.save(filename ?? `${kind}_lot_${items.length}.pdf`);
}

// Resolve many labels in one query
export async function fetchLabelsMap(table: string, ids: (string | null | undefined)[], field: string): Promise<Record<string, string>> {
  const unique = Array.from(new Set(ids.filter(Boolean) as string[]));
  if (unique.length === 0) return {};
  const { data } = await supabase.from(table as never).select(`id, ${field}`).in("id", unique);
  const out: Record<string, string> = {};
  ((data as Record<string, unknown>[]) ?? []).forEach((r) => {
    out[String(r.id)] = String(r[field] ?? "");
  });
  return out;
}

export async function fetchLabel(table: string, id: string | null | undefined, field: string): Promise<string | null> {
  if (!id) return null;
  const { data } = await supabase.from(table as never).select(field).eq("id", id).maybeSingle();
  return data ? String((data as Record<string, unknown>)[field] ?? "") : null;
}
