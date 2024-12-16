import { useQuery } from "@tanstack/react-query";
import { fetchShows } from "@/repository/tvShowRepositories";
import { Show } from "../app/entities/show";

export const useFetchMovies = () => {
  return useQuery<Show[], Error>({
    queryKey: ["shows"],
    queryFn: fetchShows,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2, // Nombre de tentatives en cas d'erreur
  });
};
