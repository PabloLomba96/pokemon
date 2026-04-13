import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PokemonCard } from "../data/mockData";

export type CurrencyCode = "EUR" | "USD";
export type PriceEngine = "cardmarket" | "tcgApi" | "ebay";

interface UserPreferences {
  currency: CurrencyCode;
  currencySymbol: string;
  priceEngine: PriceEngine;
  displayName: string;
  email: string;
}

interface AppState {
  // Collection
  collection: PokemonCard[];
  addCard: (card: PokemonCard) => void;
  removeCard: (cardId: string) => void;

  // Auth (simulated)
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;

  // Preferences
  preferences: UserPreferences;
  setCurrency: (currency: CurrencyCode) => void;
  setPriceEngine: (engine: PriceEngine) => void;
  setDisplayName: (name: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Collection
      collection: [],
      addCard: (card) =>
        set((state) => {
          const uniqueId = `${card.id}-${Date.now()}`;
          const newCard = { ...card, id: uniqueId, dateAdded: new Date().toISOString().split("T")[0] };
          return { collection: [...state.collection, newCard] };
        }),
      removeCard: (cardId) =>
        set((state) => ({
          collection: state.collection.filter((c) => c.id !== cardId),
        })),

      // Auth
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),

      // Preferences
      preferences: {
        currency: "EUR",
        currencySymbol: "€",
        priceEngine: "cardmarket",
        displayName: "Coleccionista",
        email: "demo@pokevault.com",
      },
      setCurrency: (currency) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            currency,
            currencySymbol: currency === "EUR" ? "€" : "$",
          },
        })),
      setPriceEngine: (engine) =>
        set((state) => ({
          preferences: { ...state.preferences, priceEngine: engine },
        })),
      setDisplayName: (name) =>
        set((state) => ({
          preferences: { ...state.preferences, displayName: name },
        })),
    }),
    {
      name: "pokevault-store",
    }
  )
);
