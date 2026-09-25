import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Globe } from "lucide-react";
import { toast } from "sonner";
import { allowedRedirectUrls, APP_ORIGIN } from "@/lib/auth-redirect";

function CopyRow({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2">
      <code className="truncate text-xs">{value}</code>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          navigator.clipboard.writeText(value);
          setCopied(true);
          toast.success("Copié");
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export function DomainAuthGuide() {
  const [urls, setUrls] = useState<string[]>([]);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(APP_ORIGIN());
    setUrls(allowedRedirectUrls());
  }, []);

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Domaine & redirections d'authentification</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          L'application détecte automatiquement son domaine : les redirections de connexion
          (Google, liens de confirmation) utilisent toujours l'adresse depuis laquelle le site est
          ouvert. Aucun code n'est à modifier lorsque vous changez de domaine InfinityFree — il
          suffit d'autoriser les URLs ci-dessous côté backend.
        </p>
        <div className="mt-3 rounded-md border border-dashed p-3 text-sm">
          <span className="text-muted-foreground">Domaine détecté : </span>
          <span className="font-medium">{origin || "…"}</span>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold">URLs à autoriser (Redirect URLs)</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Copiez-les dans les paramètres d'authentification du backend (Site URL + Redirect URLs),
          ainsi que dans la console Google si vous utilisez « Continuer avec Google ».
        </p>
        <div className="mt-3 space-y-2">
          {urls.map((u) => (
            <CopyRow key={u} value={u} />
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold">Procédure lors d'un changement de domaine</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Téléversez le build statique dans <code>htdocs/</code> du nouveau domaine.</li>
          <li>Ouvrez ce site sur le nouveau domaine et revenez sur cette page.</li>
          <li>Copiez les URLs détectées ci-dessus et ajoutez-les aux Redirect URLs du backend.</li>
          <li>Activez le SSL (https) chez InfinityFree pour éviter les blocages de redirection.</li>
          <li>Videz le cache du navigateur puis testez la connexion.</li>
        </ol>
        <p className="mt-3 text-xs text-muted-foreground">
          La connexion email / mot de passe fonctionne sur n'importe quel domaine sans
          configuration ; seules les connexions sociales exigent ces autorisations.
        </p>
      </Card>
    </div>
  );
}
