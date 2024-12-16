//app/api/movie/popular/route.ts
import { Movie } from '../../../entities/movie';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    console.log("Session récupérée :", JSON.stringify(session, null, 2));

    if (!session || !session.user) {
      console.error("Authentification échouée : Aucune session valide");
      return NextResponse.json({ 
        error: "Non authentifié", 
        details: "Aucune session trouvée" 
      }, { status: 401 });
    }

    const userApiKey = session.user.apiKey;
    if (!userApiKey) {
      console.error("Erreur : Clé API manquante");
      return NextResponse.json({ error: "Clé API manquante" }, { status: 401 });
    }

    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${userApiKey}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error("Erreur lors de l'appel à TMDB :", response.status, response.statusText);
      return NextResponse.json({ 
        error: `Erreur TMDB ${response.status}`, 
        details: response.statusText 
      }, { status: response.status });
    }

    const data = await response.json();

    const movies: Movie[] = data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date,
      overview: movie.overview,
      poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      vote_average: movie.vote_average || 0,
    }));

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
    return NextResponse.json({ 
      error: "Erreur interne du serveur", 
      details: error instanceof Error ? error.message : "Erreur inconnue" 
    }, { status: 500 });
  }
}
