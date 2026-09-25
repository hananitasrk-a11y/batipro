import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

export const Route = createFileRoute("/_authenticated/donnees/societe")({
  component: SocietePage,
});

type Societe = {
  id?: string;
  raison_sociale: string;
  forme_juridique?: string | null;
  rc?: string | null;
  ice?: string | null;
  if_fiscal?: string | null;
  cnss?: string | null;
  patente?: string | null;
  adresse?: string | null;
  ville?: string | null;
  telephone?: string | null;
  email?: string | null;
  site_web?: string | null;
  logo_url?: string | null;
  devise_defaut?: string | null;
};

const empty: Societe = { raison_sociale: "" };

function SocietePage() {
  const [data, setData] = useState<Societe>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data: rows, error } = await supabase.from("societe").select("*").limit(1);
      if (error) toast.error(error.message);
      else if (rows?.length) setData(rows[0] as Societe);
      setLoading(false);
    })();
  }, []);

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Le fichier sélectionné doit être une image.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : "";
        setData((current) => ({ ...current, logo_url: result }));
      };
      reader.readAsDataURL(file);
      toast.success("Logo chargé et prêt à être enregistré.");
    } catch {
      toast.error("Impossible de charger le logo.");
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.raison_sociale.trim()) {
      toast.error("La raison sociale est obligatoire");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...data };
      delete (payload as { id?: string }).id;
      const result = data.id
        ? await supabase.from("societe").update(payload).eq("id", data.id).select().single()
        : await supabase.from("societe").insert(payload).select().single();
      if (result.error) throw result.error;
      if (result.data) setData(result.data as Societe);
      toast.success("Société enregistrée");
    } catch (error) {
      toast.error(getErrorMessage(error, "Impossible d'enregistrer la société"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="grid h-64 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  const field = (key: keyof Societe, label: string, type = "text") => (
    <div>
      <Label htmlFor={key}>{label}</Label>
      <Input id={key} type={type} value={(data[key] as string) ?? ""} onChange={(e) => setData({ ...data, [key]: e.target.value })} />
    </div>
  );

  return (
    <form onSubmit={save}>
      <Card className="p-6">
        <h2 className="font-semibold">Informations de la société</h2>
        <p className="mt-1 text-sm text-muted-foreground">Ces informations apparaîtront sur vos documents (devis, factures, bons…).</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {field("raison_sociale", "Raison sociale *")}
          {field("forme_juridique", "Forme juridique")}
          {field("rc", "RC")}
          {field("ice", "ICE")}
          {field("if_fiscal", "Identifiant Fiscal (IF)")}
          {field("cnss", "CNSS")}
          {field("patente", "Patente")}
          {field("devise_defaut", "Devise par défaut")}
          {field("telephone", "Téléphone", "tel")}
          {field("email", "Email", "email")}
          {field("site_web", "Site web", "url")}
          <div className="md:col-span-2">
            <Label>Logo de la société</Label>
            <div className="mt-2 flex flex-col gap-3 rounded-md border border-dashed p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {data.logo_url ? (
                  <img src={data.logo_url} alt="Logo de la société" className="h-16 w-16 rounded-md object-cover border" />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-md border border-dashed text-xs text-muted-foreground">Logo</div>
                )}
                <div className="text-sm text-muted-foreground">
                  {data.logo_url ? "Un logo est déjà associé à la société." : "Aucun logo ajouté pour le moment."}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={handleLogoChange} className="max-w-xs" />
                {data.logo_url && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setData((current) => ({ ...current, logo_url: null }))}
                  >
                    Retirer
                  </Button>
                )}
              </div>
            </div>
          </div>
          {field("ville", "Ville")}
          <div className="md:col-span-2">{field("adresse", "Adresse")}</div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}</Button>
        </div>
      </Card>
    </form>
  );
}
