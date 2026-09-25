import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  sections: string[];
  icon?: ReactNode;
}

export function ModulePlaceholder({ title, description, sections, icon }: Props) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      <Card className="border-dashed bg-muted/30 p-8 text-center">
        <Construction className="mx-auto h-10 w-10 text-warning" />
        <h2 className="mt-4 font-semibold">Module en cours de développement</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          La structure de base et les référentiels sont en place. Les écrans opérationnels arrivent en phase 2.
        </p>
      </Card>
      <Card className="p-5">
        <h3 className="font-semibold">Écrans prévus</h3>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {sections.map((s) => (
            <li key={s} className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {s}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
