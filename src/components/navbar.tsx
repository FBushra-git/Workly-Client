"use client";

import { BriefcaseBusiness, LogOut, Menu, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { dashboardPath } from "@/lib/format";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, ready } = useAuth();

  return (
    <header className="site-header">
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Link href="/" className="brand-mark" onClick={() => setOpen(false)}>
          <span className="brand-icon"><BriefcaseBusiness className="size-5" /></span>
          <span>Workly</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          <Link href="/services" className="nav-link">Find services</Link>
          <Link href="/#categories" className="nav-link">Categories</Link>
          {user?.role === "FREELANCER" && <Link href="/dashboard/freelancer" className="nav-link">Sell your work</Link>}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {ready && user ? (
            <>
              <Link className="button button-ghost" href={dashboardPath(user.role)}>
                <UserRound className="size-4" /> Dashboard
              </Link>
              <button className="icon-button" onClick={logout} title="Log out" aria-label="Log out">
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <>
              <Link className="button button-ghost" href="/login">Log in</Link>
              <Link className="button button-dark" href="/register">Join Workly</Link>
            </>
          )}
        </div>
        <button className="icon-button mobile-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="mobile-menu md:hidden">
          <Link href="/services" onClick={() => setOpen(false)}>Find services</Link>
          <Link href="/#categories" onClick={() => setOpen(false)}>Categories</Link>
          {user ? (
            <>
              <Link href={dashboardPath(user.role)} onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={() => { logout(); setOpen(false); }}>Log out</button>
            </>
          ) : (
            <><Link href="/login">Log in</Link><Link href="/register">Join Workly</Link></>
          )}
        </div>
      )}
    </header>
  );
}
