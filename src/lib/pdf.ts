import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/integrations/supabase/client";
import { fmtMoney } from "@/lib/format";

function formatPdfMoney(value: number | null | undefined): string {
  if (value == null) return "0 MAD";

  return fmtMoney(value, "MAD")
    .replace(/\s*\/\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
export type DocKind = "Devis" | "Facture" | "Bon de commande" | "Bon de livraison" | "Bon d'avoir";

interface SocieteInfo {
  raison_sociale?: string | null;
  nom?: string | null;
  adresse?: string | null;
  ville?: string | null;
  telephone?: string | null;
  email?: string | null;
  site_web?: string | null;
  ice?: string | null;
  rc?: string | null;
  if_fiscal?: string | null;
  if?: string | null;
  logo_url?: string | null;
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

function companyName(societe: SocieteInfo) {
  return societe.raison_sociale || societe.nom || "Société";
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-FR");
}

async function addLogo(doc: jsPDF, logoUrl?: string | null, x = 14, y = 14, size = 26) {
  if (!logoUrl || typeof window === "undefined") return;

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = logoUrl;
    });

    doc.addImage(image, "PNG", x, y, size, size);
  } catch {
    // Ignore missing or invalid logo; the document still renders correctly.
  }
}

async function addHeaderBlock(doc: jsPDF, societe: SocieteInfo, opts: DocOptions) {
  const W = doc.internal.pageSize.getWidth();
  const company = companyName(societe);
  const companyLines = [
    societe.adresse ? [societe.adresse, societe.ville].filter(Boolean).join(" - ") : null,
    societe.telephone,
    societe.email,
    societe.site_web,
    societe.ice && `ICE: ${societe.ice}`,
    societe.rc && `RC: ${societe.rc}`,
    (societe.if_fiscal || societe.if) && `IF: ${societe.if_fiscal ?? societe.if}`,
  ].filter(Boolean) as string[];

  doc.setFillColor(11, 23, 42);
  doc.rect(0, 0, W, 46, "F");

  const logoX = 14;
  const logoY = 10;
  const logoSize = 26;
  const hasLogo = Boolean(societe.logo_url);

  if (hasLogo) {
    await addLogo(doc, societe.logo_url, logoX, logoY, logoSize);
  }

  doc.setTextColor(255, 255, 255);
  if (!hasLogo) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.text("BatiPro Construction Maroc", 42, 18);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(opts.kind.toUpperCase(), W - 14, 22, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`N° ${opts.numero || "—"}`, W - 14, 30, { align: "right" });
  if (opts.date) {
    doc.text(`Date: ${formatDate(opts.date)}`, W - 14, 37, { align: "right" });
  }
  if (opts.echeance) {
    doc.text(`Échéance: ${formatDate(opts.echeance)}`, W - 14, 43, { align: "right" });
  }

  doc.setTextColor(0, 0, 0);

  if (opts.tier) {
    const boxX = 14;
    const boxY = 56;
    const boxW = W / 2 - 20;
    const boxH = 30;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, "F");
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(opts.tier.titre, boxX + 6, boxY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const lines = [opts.tier.nom, ...(opts.tier.details ?? [])].filter(Boolean);
    lines.forEach((line, index) => {
      const text = doc.splitTextToSize(line, boxW - 12);
      doc.text(text, boxX + 6, boxY + 15 + index * 5.2);
    });
  }

  if (opts.chantier || opts.objet) {
    const boxX = W / 2 + 2;
    const boxY = 56;
    const boxW = W / 2 - 20;
    const boxH = 30;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, "F");
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(opts.chantier ? "Chantier" : "Objet", boxX + 6, boxY + 8);

    const headline = opts.chantier ?? opts.objet ?? "";
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const chunks = doc.splitTextToSize(headline, boxW - 12);
    doc.text(chunks, boxX + 6, boxY + 15);
  }

  if (opts.statut) {
    const status = opts.statut.charAt(0).toUpperCase() + opts.statut.slice(1);
    const statusX = W - 54;
    const statusY = 52;
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(statusX, statusY, 40, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(22, 101, 52);
    doc.text(status, statusX + 5, statusY + 5.5);
    doc.setTextColor(0);
  }
}

async function renderDocument(doc: jsPDF, societe: SocieteInfo, opts: DocOptions) {
  const W = doc.internal.pageSize.getWidth();

  await addHeaderBlock(doc, societe, opts);

  let y = 96;

  const fallbackLabel = opts.chantier ? `Chantier - ${opts.chantier}` : opts.objet ?? "Chantier";
  const rows = (opts.lignes && opts.lignes.length > 0
    ? opts.lignes
    : [{ designation: fallbackLabel, qte: 1, pu: opts.montant_ht ?? 0, total: opts.montant_ht ?? 0 }])
    .map((line) => [
      line.designation ?? "",
      String(line.qte ?? 0),
      line.pu != null ? formatPdfMoney(line.pu) : "",
      line.total != null ? formatPdfMoney(line.total) : "",
    ]);

  autoTable(doc, {
    startY: y,
    head: [["Désignation", "Qté", "P.U.", "Total"]],
    body: rows,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      lineColor: [226, 232, 240],
      textColor: [15, 23, 42],
      valign: "middle",
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 100, fontStyle: "normal" },
      1: { cellWidth: 18, halign: "center" },
      2: { cellWidth: 26, halign: "right" },
      3: { cellWidth: 30, halign: "right" },
    },
    margin: { left: 14, right: 14 },
    theme: "grid",
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  const ht = opts.montant_ht ?? 0;
  const computedTva = Math.max(0, (opts.montant_ttc ?? ht) - ht);
  const tva = opts.tva ?? computedTva;
  const ttc = opts.montant_ttc ?? ht + tva;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(W - 90, finalY, 76, 28, 2, 2, "F");
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(W - 90, finalY, 76, 28, 2, 2, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Total HT", W - 82, finalY + 8);
  doc.text(formatPdfMoney(ht), W - 16, finalY + 8, { align: "right" });
  doc.text("TVA", W - 82, finalY + 15);
  doc.text(formatPdfMoney(tva), W - 16, finalY + 15, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Total TTC", W - 82, finalY + 24);
  doc.text(formatPdfMoney(ttc), W - 16, finalY + 24, { align: "right" });

  const signBoxX = 14;
  const signBoxY = finalY + 12;
  const signBoxW = W / 2 - 22;
  const signBoxH = 20;
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(signBoxX, signBoxY, signBoxW, signBoxH, 2, 2, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Cachet et signature :", signBoxX + 6, signBoxY + 9);

  const cleanNotes = (opts.notes ?? "")
    .replace(/Devis généré automatiquement.*$/gim, "")
    .replace(/Facture générée automatiquement.*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (cleanNotes) {
    const notesY = finalY + 42;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Notes", 14, notesY);
    doc.setFont("helvetica", "normal");
    const noteLines = doc.splitTextToSize(cleanNotes, W - 30);
    doc.text(noteLines, 14, notesY + 5);
  }

  const footerY = doc.internal.pageSize.getHeight() - 12;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, doc.internal.pageSize.getHeight() - 20, W - 14, doc.internal.pageSize.getHeight() - 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  const footerLines = [
    "Zone industrielle Sidi Bernoussi, Rue des Chantiers, N° 42 - Casablanca",
    "+212 522 334 455 • contact@batipro.ma • https://www.batipro.ma",
  ];
  footerLines.forEach((line, index) => {
    doc.text(line, W / 2, footerY + index * 4, { align: "center" });
  });
  doc.setTextColor(0);
}

export async function generateDocumentPDF(opts: DocOptions) {
  const societe = await loadSociete();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  await renderDocument(doc, societe, opts);
  doc.save(`${opts.kind}_${opts.numero || "doc"}.pdf`);
}

export async function generateDocumentsPDF(items: DocOptions[], filename?: string) {
  if (items.length === 0) return;
  const societe = await loadSociete();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  for (let i = 0; i < items.length; i += 1) {
    const opts = items[i];
    if (i > 0) doc.addPage();
    await renderDocument(doc, societe, opts);
  }
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
