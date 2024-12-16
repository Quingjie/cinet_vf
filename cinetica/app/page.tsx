'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirection vers /menu
    router.replace('/menu');
  }, [router]);

  return null; // On peut afficher un écran de chargement ici si nécessaire
}
