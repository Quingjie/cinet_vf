'use client';

import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ProtectedRoute } from "@/components/ui/ProtectedRoute";
import "../globals.css";
import { usePathname } from "next/navigation"; // Import de usePathname

const noAuthRequired = ["/", "/login"];

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname(); // Récupération du pathname actuel
  const isProtected = !noAuthRequired.includes(pathname || "");

  return (
    <SessionProvider session={pageProps.session}>
      {isProtected ? (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}
