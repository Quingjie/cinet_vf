//app/menu/layout.tsx
'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
import { ApplicationLayout } from "./design/ApplicationLayout";
import { AppSidebar } from "./design/sidebar";
import { Content } from "./design/content";
import { Header } from "./design/header";
import "../globals.css";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { ThemeProvider } from './theme-provider';

const queryClient = new QueryClient();

export default function MenuLayout({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased" style={{ margin: 0, padding: 0, width: "100vw", height: "100vh" }}>
        <ThemeProvider>
          <SessionProvider>
            <SidebarProvider>
              <QueryClientProvider client={queryClient}>
                <ApplicationLayout>
                  <Header />
                  <AppSidebar />
                  <Content>
                    {children}
                  </Content>
                </ApplicationLayout>
              </QueryClientProvider>
            </SidebarProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}