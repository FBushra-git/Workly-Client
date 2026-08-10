import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer-band">
      <div className="shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="brand-mark text-white"><span className="brand-icon"><BriefcaseBusiness className="size-5" /></span>Workly</div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">Independent expertise, clearly scoped. Hire specialists and keep every order moving in one focused marketplace.</p>
        </div>
        <div><h3 className="footer-title">Marketplace</h3><Link href="/services">Browse services</Link><Link href="/register">Become a freelancer</Link></div>
        <div><h3 className="footer-title">Account</h3><Link href="/login">Log in</Link><Link href="/register">Create account</Link></div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/45">Workly freelance marketplace</div>
    </footer>
  );
}
