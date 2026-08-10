"use client";

import { ArrowRight, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { ErrorMessage, LoadingState } from "@/components/states";
import { api } from "@/lib/api";
import { dashboardPath } from "@/lib/format";
import type { AuthResponse } from "@/types";

function LoginForm() {
  const router=useRouter(); const params=useSearchParams(); const {login}=useAuth(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(event:FormEvent){event.preventDefault();setLoading(true);setError("");try{const result=await api.post<AuthResponse>("/api/auth/login",{email,password});login(result.data);const next=params.get("next");router.push(next&&next.startsWith("/")?next:dashboardPath(result.data.user.role));}catch(reason){setError(reason instanceof Error?reason.message:"Login failed");}finally{setLoading(false);}}
  return <div className="auth-layout"><section className="auth-visual"><p className="eyebrow !text-[var(--yellow)]">Welcome back</p><h1>Keep your work moving.</h1><p className="mt-5 max-w-xl text-white/75">Return to your orders, services, and delivery workflow with one secure account.</p></section><main className="auth-panel"><LockKeyhole className="mb-5 size-8 text-[var(--brand)]"/><h2>Log in</h2><p>Use your Workly account to continue.</p><form className="form-grid" onSubmit={submit}><div className="field"><label htmlFor="email">Email address</label><input id="email" className="input" type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/></div><div className="field"><label htmlFor="password">Password</label><input id="password" className="input" type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} required/></div>{error&&<ErrorMessage message={error}/>}<button className="button button-brand" disabled={loading}>{loading?"Logging in...":"Log in"}<ArrowRight className="size-4"/></button></form><p className="mt-6 text-sm text-[var(--muted)]">New to Workly? <Link className="font-semibold text-[var(--brand-dark)]" href="/register">Create an account</Link></p></main></div>;
}
export default function LoginPage(){return <Suspense fallback={<LoadingState label="Loading login"/>}><LoginForm/></Suspense>;}
