"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ReactNode } from "react";
import localFont from "next/font/local";
import "../globals.css";

const anton = localFont({
  src: "../fonts/Anton,Antonio/Anton/Anton-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-anton",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html 
      lang="fr"
      className={anton.variable}
    >
      <head>
        <link rel="icon" href="/logo1.jpg" />
      </head>
      <body 
        className={`
          ${anton.variable}
          bg-gray-100 
          dark:bg-gray-900
          flex 
          justify-center 
          items-center 
          min-h-screen 
          font-sans
        `}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <div className="w-full max-w-md p-4">
              <main className="mt-10">
                {children}
              </main>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}