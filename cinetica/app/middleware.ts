import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    console.log("Middleware - Requête :", req.url);
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Vérification plus stricte du token
        console.log("Middleware - Token complet :", token);
        
        // Vérifiez des propriétés spécifiques du token
        return token?.email !== undefined && 
               token?.id !== undefined && 
               token?.exp !== undefined;
      },
    },
    pages: {
      signIn: "/login",
      error: "/error",
    },
  }
);

export const config = {
  matcher: ['/menu/:path*', '/api/movie/:path*'],
};