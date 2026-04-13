import { useState, useEffect, useRef } from "react";
import type { PokemonCard, CardRegion } from "../types/cards";
import { searchCards } from "../services/pokemonApi";

export function usePokemonSearch(query: string, debounceMs = 400, region: CardRegion | "all" = "all") {
  const [results, setResults] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setTotalCount(0);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const data = await searchCards({ query, region, page: 1, pageSize: 40 });
        if (!controller.signal.aborted) {
          setResults(data.cards);
          setTotalCount(data.totalCount);
        }
      } catch (err: any) {
        if (!controller.signal.aborted) {
          if (err.message === "RATE_LIMIT") {
            setError("Límite de peticiones alcanzado. Intenta de nuevo en unos segundos.");
          } else {
            setError("Error de conexión con la base de datos de Pokémon.");
          }
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, region]);

  return { results, isLoading, error, totalCount };
}
