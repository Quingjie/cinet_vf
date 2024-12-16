'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"; // Utilisation de usePathname
import { useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname(); // Récupération du pathname actuel

  useEffect(() => {
    const protectedRoutes = ["/dashboard"]; // Liste des routes protégées

    if (status === "unauthenticated" && protectedRoutes.includes(pathname)) {
      router.push("/login");
    }
  }, [status, router, pathname]);

  if (status === "loading") {
    return <div>Chargement...</div>;
  }

  return <>{children}</>;
};
