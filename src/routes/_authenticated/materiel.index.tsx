import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/materiel/")({
  component: () => (
    <CrudTable
      title="Matériel & Engins" description="Parc d'engins et équipements"
      table="engins" searchFields={["libelle", "code", "immatriculation", "marque"]}
      fields={[
        { name: "code", label: "Code" },
        { name: "libelle", label: "Libellé", required: true },
        { name: "type_engin", label: "Type" },
        { name: "marque", label: "Marque" },
        { name: "modele", label: "Modèle", hideInTable: true },
        { name: "immatriculation", label: "Immatriculation" },
        { name: "annee", label: "Année", type: "number", hideInTable: true },
        { name: "compteur_km", label: "Compteur km", type: "number", hideInTable: true },
        { name: "compteur_h", label: "Compteur h", type: "number", hideInTable: true },
        { name: "date_acquisition", label: "Acquisition", type: "date", hideInTable: true },
        { name: "valeur_acquisition", label: "Valeur", type: "number", hideInTable: true },
        { name: "chantier_id", label: "Affecté à", type: "select", ref: { table: "chantier", labelField: "nom" }, hideInTable: true },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "disponible", label: "Disponible" },
          { value: "en_service", label: "En service" },
          { value: "maintenance", label: "Maintenance" },
          { value: "hs", label: "Hors service" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
        { name: "actif", label: "Actif", type: "checkbox" },
      ]}
    />
  ),
});
