import { Show } from "../app/entities/show";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { users } from "./user";

const API_BASE_URL = "https://api.themoviedb.org/3";

// Vérification de la clé API utilisateur
const API_KEY = users[0]?.apiKey;
if (!API_KEY) {
  throw new Error("Clé API utilisateur manquante");
}

// Récupérer les séries populaires
export const fetchShows = async (): Promise<Show[]> => {
  const response = await fetch(`${API_BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des séries populaires");
  }

  const data = await response.json();
  return data.results; // Renvoie uniquement la liste des séries
};

// Récupérer les détails d'une série spécifique
export const fetchShowDetails = async (showId: string): Promise<Show> => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Non authentifié");
  }

  const response = await fetch(`${API_BASE_URL}/tv/${showId}?api_key=${API_KEY}&language=fr-FR`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des détails de la série");
  }

  return response.json();
};

// Récupérer les crédits d'une série (acteurs, réalisateurs, etc.)
export const fetchShowCredits = async (showId: string): Promise<any> => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Non authentifié");
  }

  const response = await fetch(`${API_BASE_URL}/tv/${showId}/credits?api_key=${API_KEY}`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des crédits de la série");
  }

  return response.json();
};