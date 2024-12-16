"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./globals.css";
import { PropsWithChildren } from "react";

export default function RootLayout({
  children,
}: PropsWithChildren<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}