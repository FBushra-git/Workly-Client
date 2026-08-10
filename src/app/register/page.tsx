"use client";

import { ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { ErrorMessage } from "@/components/states";
import { api } from "@/lib/api";
import type { User, UserRole } from "@/types";

export default function RegisterPage(){
  const router=useRouter(); const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [role,setRole]=useState<Exclude<UserRole,"ADMIN">>("CLIENT"); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(event:FormEvent){event.preventDefault();setLoading(true);setError("");try{await api.post<{user:User}>("/api/auth/register",{name,email,password,role});router.push("/login");}catch(reason){setError(reason instanceof Error?reason.message:"Registration failed");}finally{setLoading(false);}}
  return <div className="auth-layout"><section className="auth-visual"><p className="eyebrow !text-[var(--yellow)]">Join the marketplace</p><h1>Bring a brief or bring your craft.</h1><p className="mt-5 max-w-xl text-white/75">Choose the account that matches how you work. You can hire specialists or publish clear freelance offers.</p></section><main className="auth-panel"><UserPlus className="mb-5 size-8 text-[var(--brand)]"/><h2>Create account</h2><p>Start as a client or freelancer. Admin access is assigned separately.</p><form className="form-grid" onSubmit={submit}><div className="field"><label htmlFor="name">Full name</label><input id="name" className="input" minLength={2} maxLength={100} value={name} onChange={(e)=>setName(e.target.value)} required/></div><div className="field"><label htmlFor="email">Email address</label><input id="email" className="input" type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/></div><div className="field"><label htmlFor="password">Password</label><input id="password" className="input" type="password" autoComplete="new-password" minLength={8} maxLength={72} value={password} onChange={(e)=>setPassword(e.target.value)} required/><span className="text-xs text-[var(--muted)]">Use at least 8 characters.</span></div><div className="field"><label htmlFor="role">I want to</label><select id="role" className="select" value={role} onChange={(e)=>setRole(e.target.value as Exclude<UserRole,"ADMIN">)}><option value="CLIENT">Hire freelancers</option><option value="FREELANCER">Sell services</option></select></div>{error&&<ErrorMessage message={error}/>}<button className="button button-brand" disabled={loading}>{loading?"Creating account...":"Create account"}<ArrowRight className="size-4"/></button></form><p className="mt-6 text-sm text-[var(--muted)]">Already registered? <Link className="font-semibold text-[var(--brand-dark)]" href="/login">Log in</Link></p></main></div>;
}
