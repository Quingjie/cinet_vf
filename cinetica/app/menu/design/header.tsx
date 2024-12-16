'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Logo from "../../logo1.jpg";
import localFont from "next/font/local";
import { useTheme } from "../theme-provider";
import { users } from "@/repository/user";
import { Menu } from "lucide-react";

const anton = localFont({
  src: "../../fonts/Anton,Antonio/Anton/Anton-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-anton",
});

interface MovieSuggestion {
  id: number;
  title: string;
  poster_path: string | null;
  type: "movie" | "tv";
}

export const Header = (props: PropsWithChildren & { onSidebarToggle?: () => void }) => {
  const { data: session } = useSession();
  const { theme, mode, setMode } = useTheme();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const router = useRouter();

  const getNextMode = () => {
    switch (mode) {
      case "auto":
        return "light";
      case "light":
        return "dark";
      case "dark":
        return "auto";
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case "auto":
        return "🖥️ Auto";
      case "light":
        return "☀️ Clair";
      case "dark":
        return "🌙 Sombre";
    }
  };

  const clearCookies = () => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    const userApiKey = users[0].apiKey;

    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);

      const [moviesResponse, seriesResponse] = await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            searchQuery
          )}&api_key=${userApiKey}`
        ),
        fetch(
          `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
            searchQuery
          )}&api_key=${userApiKey}`
        ),
      ]);

      const moviesData = await moviesResponse.json();
      const seriesData = await seriesResponse.json();

      const movieSuggestions =
        moviesData.results?.slice(0, 5).map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          type: "movie",
        })) || [];

      const seriesSuggestions =
        seriesData.results?.slice(0, 5).map((serie: any) => ({
          id: serie.id,
          title: serie.name,
          poster_path: serie.poster_path,
          type: "tv",
        })) || [];

      setSuggestions([...movieSuggestions, ...seriesSuggestions]);
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: MovieSuggestion & { type: string }) => {
    setSuggestions([]);
    if (suggestion.type === "movie") {
      router.push(`/menu/movie/${suggestion.id}`);
    } else if (suggestion.type === "tv") {
      router.push(`/menu/show/${suggestion.id}`);
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
      style={{
        gridArea: "header",
        width: "100%",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex items-center space-x-4">
        {isSmallScreen && session && (
          <button 
          onClick={() => props.onSidebarToggle && props.onSidebarToggle()}
          className={`mr-4 ${
            theme === "dark" 
              ? "text-white hover:bg-gray-700" 
              : "text-black hover:bg-gray-200"
          } p-2 rounded-md transition-colors`}
        >
          <Menu size={24} />
        </button>
        )}
        <Image
          src={Logo}
          alt="Logo"
          className="w-16 h-16 items-center rounded-full"
        />
        <h1 className={`text-2xl ${anton.className}`}>Cinetica</h1>
        {session && (
          <span className="text-sm">
            Bonjour, <strong>{session.user?.name || "Utilisateur"}</strong>
          </span>
        )}
      </div>

      <div className="flex items-center space-x-4 relative">
        {session ? (
          <>
            <div className="relative w-64">
              <input
                placeholder="Rechercher un film ou série"
                className={`p-2 border rounded w-full ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
                value={query}
                onChange={handleSearch}
              />
              {suggestions.length > 0 && (
                <ul
                  className={`absolute left-0 right-0 mt-1 rounded shadow-lg max-h-64 overflow-y-auto ${
                    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
                  }`}
                  style={{ zIndex: 1000 }}
                >
                  {suggestions.map((movie) => (
                    <li
                      key={movie.id}
                      className={`flex items-center px-4 py-2 cursor-pointer ${
                        theme === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-200"
                      }`}
                      onClick={() => handleSuggestionClick(movie)}
                    >
                      {movie.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                          alt={movie.title}
                          className="w-12 h-18 object-cover rounded mr-4"
                        />
                      )}
                      <span>{movie.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!isSmallScreen && (
              <>
                <button
                  onClick={() => {
                    clearCookies();
                    signOut(); 
                  }}
                  className={`px-4 py-2 rounded-full bg-[#8E8FC3] ${
                    theme === "dark"
                      ? "text-gray-800"
                      : "text-white"
                  }`}
                >
                  Déconnexion
                </button>
                <button
                  onClick={() => setMode(getNextMode())}
                  className={`p-2 border rounded w-32 ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-black border-gray-300"
                  }`}
                >
                  {getModeLabel()}
                </button>
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};