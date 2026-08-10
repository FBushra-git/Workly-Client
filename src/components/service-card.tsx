import { ArrowUpRight, Clock3, UserRound } from "lucide-react";
import Link from "next/link";

import { formatCurrency } from "@/lib/format";
import type { Service } from "@/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="service-card">
      <div className="service-card-top">
        <span className="category-label">{service.category.name}</span>
        <span className={`status-dot ${service.status === "ACTIVE" ? "status-active" : "status-inactive"}`}>{service.status.toLowerCase()}</span>
      </div>
      <Link href={`/services/${service.id}`} className="service-title">{service.title}</Link>
      <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">{service.description}</p>
      <div className="mt-auto flex items-center justify-between border-t border-[var(--line)] pt-4">
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]"><UserRound className="size-4" />{service.freelancer.name}</div>
        <div className="text-right"><strong className="block text-[var(--ink)]">{formatCurrency(service.price)}</strong><span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]"><Clock3 className="size-3" />{service.deliveryDays} days</span></div>
      </div>
      <Link href={`/services/${service.id}`} className="card-link">View service <ArrowUpRight className="size-4" /></Link>
    </article>
  );
}
