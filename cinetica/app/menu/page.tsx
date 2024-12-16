//app/menu/page.tsx
"use client";

"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
  }, [session, status]);

  if (status === "loading") {
    return <div>Chargement...</div>;
  }

  if (!session || !session.user) {
    return <div>Non authentifié</div>;
  }
  
  return (
    <div>
    </div>
  );
}