import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrudTable } from "@/components/crud-table";
import { DomainAuthGuide } from "@/components/domain-auth-guide";

export const Route = createFileRoute("/_authenticated/donnees/parametres")({
  component: Parametres,
});

function Parametres() {
  return (
    <Tabs defaultValue="tva">
      <TabsList className="flex-wrap">
        <TabsTrigger value="tva">TVA</TabsTrigger>
        <TabsTrigger value="devises">Devises</TabsTrigger>
        <TabsTrigger value="unites">Unités</TabsTrigger>
        <TabsTrigger value="reglement">Modes règlement</TabsTrigger>
        <TabsTrigger value="transport">Modes transport</TabsTrigger>
        <TabsTrigger value="personnel">Types personnel</TabsTrigger>
        <TabsTrigger value="engins">Types engins</TabsTrigger>
        <TabsTrigger value="papiers">Papiers</TabsTrigger>
        <TabsTrigger value="entretiens">Entretiens</TabsTrigger>
        <TabsTrigger value="plafond">Plafond caisses</TabsTrigger>
        <TabsTrigger value="feries">Jours fériés</TabsTrigger>
        <TabsTrigger value="domaine">Domaine & Auth</TabsTrigger>
      </TabsList>
      <TabsContent value="tva" className="mt-4">
        <CrudTable title="Taux de TVA" table="tva" fields={[
          { name: "libelle", label: "Libellé", required: true },
          { name: "taux", label: "Taux (%)", type: "number", required: true },
          { name: "actif", label: "Actif", type: "checkbox" },
        ]} />
      </TabsContent>
      <TabsContent value="devises" className="mt-4">
        <CrudTable title="Devises" table="devises" fields={[
          { name: "code", label: "Code", required: true },
          { name: "libelle", label: "Libellé", required: true },
          { name: "symbole", label: "Symbole" },
          { name: "taux_change", label: "Taux de change", type: "number" },
        ]} />
      </TabsContent>
      <TabsContent value="unites" className="mt-4">
        <CrudTable title="Unités de mesure" table="unites" fields={[
          { name: "code", label: "Code", required: true },
          { name: "libelle", label: "Libellé", required: true },
        ]} />
      </TabsContent>
      <TabsContent value="reglement" className="mt-4">
        <CrudTable title="Modes de règlement" table="modes_reglement" fields={[
          { name: "code", label: "Code" },
          { name: "libelle", label: "Libellé", required: true },
        ]} />
      </TabsContent>
      <TabsContent value="transport" className="mt-4">
        <CrudTable title="Modes de transport" table="modes_transport" fields={[
          { name: "code", label: "Code" },
          { name: "libelle", label: "Libellé", required: true },
        ]} />
      </TabsContent>
      <TabsContent value="personnel" className="mt-4">
        <CrudTable title="Types de personnel" table="types_personnel" fields={[
          { name: "code", label: "Code" },
          { name: "libelle", label: "Libellé", required: true },
        ]} />
      </TabsContent>
      <TabsContent value="engins" className="mt-4">
        <CrudTable title="Types d'engins" table="types_engins" fields={[
          { name: "code", label: "Code" },
          { name: "libelle", label: "Libellé", required: true },
        ]} />
      </TabsContent>
      <TabsContent value="papiers" className="mt-4">
        <CrudTable title="Papiers (documents matériel)" table="papiers" fields={[
          { name: "code", label: "Code" },
          { name: "libelle", label: "Libellé", required: true },
          { name: "duree_validite_mois", label: "Validité (mois)", type: "number" },
        ]} />
      </TabsContent>
      <TabsContent value="entretiens" className="mt-4">
        <CrudTable title="Entretiens périodiques" table="entretiens_periodiques" fields={[
          { name: "libelle", label: "Libellé", required: true },
          { name: "periodicite_km", label: "Périodicité (km)", type: "number" },
          { name: "periodicite_jours", label: "Périodicité (jours)", type: "number" },
        ]} />
      </TabsContent>
      <TabsContent value="plafond" className="mt-4">
        <CrudTable title="Plafonds de caisses" table="plafond_caisses" fields={[
          { name: "libelle", label: "Libellé", required: true },
          { name: "montant", label: "Montant", type: "number", required: true },
        ]} />
      </TabsContent>
      <TabsContent value="feries" className="mt-4">
        <CrudTable title="Jours fériés" table="jours_feries" fields={[
          { name: "date_jour", label: "Date (AAAA-MM-JJ)", required: true },
          { name: "libelle", label: "Libellé", required: true },
        ]} />
      </TabsContent>
      <TabsContent value="domaine" className="mt-4">
        <DomainAuthGuide />
      </TabsContent>
    </Tabs>
  );
}
