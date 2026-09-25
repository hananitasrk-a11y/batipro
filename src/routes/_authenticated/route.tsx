import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User as UserIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { GlobalSearch } from "@/components/global-search";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (!isSupabaseConfigured) throw redirect({ to: "/auth" });
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const sessionResult = await Promise.race([
        supabase.auth.getSession(),
        new Promise<never>((_, reject) => {
          window.setTimeout(() => reject(new Error("Session lookup timeout")), 1500);
        }),
      ]).catch(() => null);
      const data = sessionResult?.data;
      const error = sessionResult?.error;
      if (!error && data?.session?.user) return { user: data.session.user };
      if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 100));
    }
    throw redirect({ to: "/auth" });
  },
  component: AuthShell,
});

function AuthShell() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [fullName, setFullName] = useState<string>("");

  useEffect(() => {
    let active = true;
    const timeout = new Promise<never>((_, reject) => {
      window.setTimeout(() => reject(new Error("Profile lookup timeout")), 3000);
    });
    Promise.race([
      supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      timeout,
    ])
      .then((result) => {
        if (!active) return;
        const data = (result as { data?: { full_name?: string | null } | null }).data;
        if (data?.full_name) setFullName(data.full_name);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [user.id]);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const initials = (fullName || user.email || "U").split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="hidden text-sm font-medium text-muted-foreground sm:block">ERP BTP</div>
              <div className="ml-2"><GlobalSearch /></div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-7 w-7"><AvatarFallback className="bg-primary text-xs text-primary-foreground">{initials}</AvatarFallback></Avatar>
                  <span className="hidden text-sm md:inline">{fullName || user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="text-sm">{fullName || "Utilisateur"}</div>
                  <div className="text-xs font-normal text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/donnees" })}>
                  <UserIcon className="mr-2 h-4 w-4" /> Mon profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
