"use client";

import { ArrowRight, CheckCircle2, Code2, Megaphone, Search, Sparkles, Video } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { ServiceCard } from "@/components/service-card";
import { EmptyState, ErrorMessage, LoadingState } from "@/components/states";
import { api } from "@/lib/api";
import type { Category, Service } from "@/types";

const categoryIcons = [Code2, Sparkles, Megaphone, Video];

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get<Category[]>("/api/categories"), api.get<Service[]>("/api/services?limit=6&status=ACTIVE")])
      .then(([categoryResult, serviceResult]) => { setCategories(categoryResult.data); setServices(serviceResult.data); })
      .catch((reason: Error) => setError(reason.message)).finally(() => setLoading(false));
  }, []);

  function submitSearch(event: FormEvent) { event.preventDefault(); router.push(`/services${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`); }

  return <main>
    <section className="hero"><div className="shell hero-content"><div className="hero-kicker"><span />Work with proven specialists</div><h1>Freelance talent for work that matters.</h1><p className="hero-copy">Find focused expertise, compare clear offers, and move from brief to delivery without the usual marketplace noise.</p><form className="hero-search" onSubmit={submitSearch}><Search className="size-5 text-[var(--muted)]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="What do you need help with?" aria-label="Search services" /><button className="button button-brand" type="submit">Search</button></form><div className="hero-proof"><span><CheckCircle2 className="size-4" />Clear prices</span><span><CheckCircle2 className="size-4" />Role-verified workflows</span><span><CheckCircle2 className="size-4" />Review after delivery</span></div></div></section>
    <section className="section" id="categories"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Explore expertise</p><h2>Start with the work.</h2><p>Browse practical categories shaped around the outcomes teams need most.</p></div><Link className="button button-outline" href="/services">All services <ArrowRight className="size-4" /></Link></div>{loading ? <LoadingState label="Loading categories" /> : error ? <ErrorMessage message={error} /> : categories.length === 0 ? <EmptyState title="No categories yet" message="An administrator can add the first marketplace category." /> : <div className="category-grid">{categories.slice(0,8).map((category,index)=>{const Icon=categoryIcons[index%categoryIcons.length];return <Link key={category.id} href={`/services?categoryId=${category.id}`} className="category-tile"><Icon className="size-6" /><div><h3>{category.name}</h3><p>{category.description||"Specialist services for your next project."}</p></div></Link>;})}</div>}</div></section>
    <section className="section section-muted"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Fresh on Workly</p><h2>Featured services</h2><p>Active offers from independent professionals, with delivery terms visible upfront.</p></div></div>{loading ? <LoadingState label="Loading services" /> : error ? <ErrorMessage message={error} /> : services.length===0 ? <EmptyState title="No services available" message="Freelancers can publish the first offer from their dashboard." /> : <div className="service-grid">{services.map((service)=><ServiceCard key={service.id} service={service}/>)}</div>}</div></section>
    <section className="section"><div className="shell"><div className="cta-band"><div><h2>Turn your expertise into a clear offer.</h2><p>Create a freelancer account, publish your service, and manage delivery in one place.</p></div><Link className="button button-dark" href="/register">Start selling <ArrowRight className="size-4" /></Link></div></div></section>
  </main>;
}
