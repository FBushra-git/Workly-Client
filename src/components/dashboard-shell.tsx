import { LayoutDashboard } from "lucide-react";

export function DashboardShell({ eyebrow, title, description, actions, children }: { eyebrow: string; title: string; description: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[var(--surface)] py-8">
      <div className="shell">
        <div className="dashboard-heading">
          <div><p className="eyebrow"><LayoutDashboard className="size-4" />{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>
          {actions && <div>{actions}</div>}
        </div>
        {children}
      </div>
    </main>
  );
}
