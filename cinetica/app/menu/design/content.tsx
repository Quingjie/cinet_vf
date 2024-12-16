//app/menu/design/content.tsx
'use client';

import { PropsWithChildren, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "../theme-provider";

import { Telescope, Popcorn, UserRound, BookmarkCheck, MonitorPlay } from "lucide-react";
import MovieCarousel from "../../../components/ui/MovieCarousel";
import ShowCarousel from "../../../components/ui/ShowCarousel";
import MovieCard from "@/components/ui/MovieCard";
import ShowCard from "@/components/ui/ShowCard";

import { Movie } from '@/app/entities/movie'; 
import { Show } from '@/app/entities/show'; 

export const Content = ({ children }: PropsWithChildren) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  const getPageTitle = () => {
    if (pathname === "/menu") return <><Telescope className="inline-block mr-2" /> Discover</>;
    
    if (pathname.includes("/menu/movie")) {
      if (pathname.includes("now-playing")) return <><Popcorn className="inline-block mr-2" /> Movies Now Playing</>;
      if (pathname.includes("popular")) return <><UserRound className="inline-block mr-2" /> Movies Popular</>;
      if (pathname.includes("top-rated")) return <><BookmarkCheck className="inline-block mr-2" /> Movies Top Rated</>;
    }
    
    if (pathname.includes("/menu/show")) {
      if (pathname.includes("on-the-air")) return <><MonitorPlay className="inline-block mr-2" /> Shows On the Air</>;
      if (pathname.includes("popular")) return <><UserRound className="inline-block mr-2" /> Shows Popular</>;
      if (pathname.includes("top-rated")) return <><BookmarkCheck className="inline-block mr-2" /> Shows Top Rated</>;
    }
    
    return "Content";
  };

  const renderResponsiveCards = (items: Movie[] | Show[], type: 'movie' | 'show') => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          type === 'movie' ? (
            <MovieCard 
              key={(item as Movie).id} 
              movie={item as Movie} 
              theme={theme === 'dark' ? 'light' : 'dark'} 
            />
          ) : (
            <ShowCard 
              key={(item as Show).id} 
              show={item as Show} 
              theme={theme === 'dark' ? 'light' : 'dark'} 
            />
          )
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("Current pathname:", pathname);

      try {
        let endpoint = "";

        if (pathname === "/menu") {
          const [moviesRes, showsRes] = await Promise.all([
            fetch("/api/movie/now-playing"),
            fetch("/api/show/on-the-air")
          ]);
          setMovies(await moviesRes.json());
          setShows(await showsRes.json());
        } else if (pathname.includes("/menu/movie")) {
          if (pathname.includes("now-playing")) {endpoint = "/api/movie/now-playing";}
          if (pathname.includes("popular")) {endpoint = "/api/movie/popular";}
          if (pathname.includes("top-rated")) {endpoint = "/api/movie/top-rated";}
          const moviesRes = await fetch(endpoint);
          setMovies(await moviesRes.json());
          setShows([]);
        } else if (pathname.includes("/menu/show")) {
          console.log("Entering show condition");
          if (pathname === "/menu/show/on-the-air") {endpoint = "/api/show/on-the-air";}
          if (pathname === "/menu/show/popular") {endpoint = "/api/show/popular";}
          if (pathname === "/menu/show/top-rated") {endpoint = "/api/show/top-rated";}
          console.log("Selected endpoint:", endpoint);
          const showsRes = await fetch(endpoint);
          setShows(await showsRes.json());
          setMovies([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [pathname, session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
      style={{ gridArea: "content" }}
    >
      <h1 className="text-3xl font-bold mb-6 flex items-center">{getPageTitle()}</h1>

      {children}

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <>
          {pathname === "/menu" && (
            <>
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Now Playing</h2>
                <MovieCarousel movies={movies} pageMode={theme === "dark" ? "primary" : "secondary"} />
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">On the Air</h2>
                <ShowCarousel shows={shows} pageMode={theme === "dark" ? "primary" : "secondary"} />
              </div>
            </>
          )}

          {pathname.includes("/menu/movie") && movies.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
              {movies.map((movie) => (
                <div key={movie.id} className="flex justify-center">
                  <MovieCard 
                    movie={movie} 
                    theme={theme === 'dark' ? 'light' : 'dark'} 
                  />
                </div>
              ))}
            </div>
          )}

          {pathname.includes("/menu/show") && shows.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 p-4">
              {shows.map((show) => (
                <div key={show.id} className="flex justify-center">
                  <ShowCard 
                    show={show} 
                    theme={theme === 'dark' ? 'light' : 'dark'} 
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};