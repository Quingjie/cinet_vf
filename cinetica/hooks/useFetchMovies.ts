import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "@/repository/movieRepository";
import { Movie } from "../app/entities/movie";

export const useFetchMovies = () => {
  return useQuery<Movie[], Error>({
    queryKey: ["movies"],
    queryFn: fetchMovies,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2, // Nombre de tentatives en cas d'erreur
  });
};
