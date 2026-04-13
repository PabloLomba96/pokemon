import { useState, useCallback } from "react";
import type { PokemonCard } from "../data/mockData";

const STORAGE_KEY = "pokevault_collection";

function loadCollection(): PokemonCard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCollection(cards: PokemonCard[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function useCollection() {
  const [collection, setCollection] = useState<PokemonCard[]>(loadCollection);

  const addCard = useCallback((card: PokemonCard) => {
    setCollection((prev) => {
      // avoid exact duplicates by id — allow same card with different language/condition via unique id
      const uniqueId = `${card.id}-${Date.now()}`;
      const newCard = { ...card, id: uniqueId, dateAdded: new Date().toISOString().split("T")[0] };
      const next = [...prev, newCard];
      saveCollection(next);
      return next;
    });
  }, []);

  const removeCard = useCallback((cardId: string) => {
    setCollection((prev) => {
      const next = prev.filter((c) => c.id !== cardId);
      saveCollection(next);
      return next;
    });
  }, []);

  return { collection, addCard, removeCard };
}
