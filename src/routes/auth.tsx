import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { authRedirectUrl } from "@/lib/auth-redirect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Connexion — BatiPro" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@batipro.ma");
  const [password, setPassword] = useState("BatiPro2026!");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleEmail = async () => {
    if (loading) return;
    setLoginError("");
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        throw new Error(
          "La connexion Supabase n'est pas configurée pour cette version de l'application.",
        );
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      if (!data.session) {
        throw new Error("La session de connexion n'a pas pu être créée.");
      }
      window.location.replace(new URL("/dashboard/", window.location.href).toString());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur d'authentification";
      setLoginError(message);
      toast.error(message);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: authRedirectUrl("/dashboard") });
    if (result.error) { toast.error("Échec connexion Google"); setLoading(false); return; }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative z-10 flex min-h-screen pointer-events-auto items-center justify-center px-4" style={{ background: "var(--gradient-hero)" }}>
      <div className="relative z-10 w-full max-w-md pointer-events-auto">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 text-[#f2efe8]">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-[#3ec8cc]/10 backdrop-blur">
            <Building2 className="h-5 w-5 text-[#3ec8cc]" />
          </div>
          <span className="text-xl font-semibold">BatiPro</span>
        </Link>
        <Card className="border-[#f2efe8]/10 bg-[#132234] p-6 text-[#f2efe8]">
          <div className="mb-4">
            <h1 className="text-lg font-semibold">Connexion</h1>
            <p className="mt-1 text-sm text-[#f2efe8]/60">
              Accès réservé aux utilisateurs autorisés. Contactez votre administrateur pour créer un compte.
            </p>
          </div>
          {!isSupabaseConfigured && (
            <div className="mb-4 rounded-md border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
              La connexion n'est pas encore configurée pour ce domaine. Ajoutez
              les variables Supabase au build de production.
            </div>
          )}
          <form noValidate onSubmit={(e) => { e.preventDefault(); void handleEmail(); }} className="relative z-10 space-y-3 pointer-events-auto">
            <div>
              <Label htmlFor="email-in" className="text-[#f2efe8]/80">Email</Label>
              <Input id="email-in" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="border-[#f2efe8]/10 bg-[#0b1622] text-[#f2efe8] placeholder:text-[#f2efe8]/40" />
            </div>
            <div>
              <Label htmlFor="pwd-in" className="text-[#f2efe8]/80">Mot de passe</Label>
              <Input id="pwd-in" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="border-[#f2efe8]/10 bg-[#0b1622] text-[#f2efe8] placeholder:text-[#f2efe8]/40" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="relative z-[100] h-10 w-full cursor-pointer rounded-md bg-[#3ec8cc] px-4 py-2 text-sm font-medium text-[#0b1622] hover:brightness-110"
              style={{ pointerEvents: "auto", touchAction: "manipulation" }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
            </button>
          </form>
          {loginError && (
            <div role="alert" className="mt-3 rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">
              {loginError}
            </div>
          )}
          <div className="mt-4 rounded-md border border-dashed border-[#f2efe8]/20 bg-[#0b1622] p-3 text-xs">
            <div className="font-medium text-[#f2efe8]">Connexion par défaut</div>
            <div className="mt-1 text-[#f2efe8]/60">admin@batipro.ma — BatiPro2026!</div>
            <button
              type="button"
              className="mt-2 h-8 w-full cursor-pointer rounded-md bg-[#3ec8cc]/10 px-3 text-xs text-[#3ec8cc] hover:bg-[#3ec8cc]/20 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
              onClick={() => { setEmail("admin@batipro.ma"); setPassword("BatiPro2026!"); }}
            >
              Remplir les identifiants
            </button>
          </div>

          <div className="relative my-5"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#f2efe8]/10" /></div><div className="relative flex justify-center text-xs"><span className="bg-[#132234] px-2 text-[#f2efe8]/50">ou</span></div></div>
          <Button type="button" variant="outline" className="w-full border-[#f2efe8]/20 bg-[#0b1622] text-[#f2efe8] hover:bg-[#f2efe8]/10" onClick={handleGoogle} disabled={loading || !isSupabaseConfigured}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuer avec Google
          </Button>
        </Card>
      </div>
    </div>
  );
}
