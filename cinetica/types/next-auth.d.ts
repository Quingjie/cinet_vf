//types/next-auth.d.ts
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
        id: string;
        apiKey?: string;
    };
  }

  interface User {
    id: string;
    apiKey?: string; // Ajoutez apiKey ici
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    apiKey?: string; // Ajoutez apiKey ici
    email: string; // Ajoutez email ici
    name?: string; // Ajoutez name ici
    image?: string; // Gardez image comme optionnel
  }
}