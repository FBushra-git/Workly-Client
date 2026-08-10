"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LoadingState } from "@/components/states";
import { useAuth } from "@/components/auth-provider";
import type { UserRole } from "@/types";

export function ProtectedRoute({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace(`/login?next=/dashboard/${role.toLowerCase()}`);
    else if (user.role !== role) router.replace(`/dashboard/${user.role.toLowerCase()}`);
  }, [ready, role, router, user]);

  if (!ready || !user || user.role !== role) return <LoadingState label="Checking access" />;
  return <>{children}</>;
}
