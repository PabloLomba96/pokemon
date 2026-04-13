import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PokemonCard } from "../data/mockData";
import { toast } from "sonner";

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
  isCollectionLoading: boolean;
  addCard: (card: PokemonCard) => void;
  removeCard: (cardId: string) => void;
  addCardAsync: (card: PokemonCard) => Promise<void>;
  removeCardAsync: (cardId: string) => Promise<void>;

  // Auth (simulated — will be replaced by Supabase Auth)
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
    (set, get) => ({
      // Collection
      collection: [],
      isCollectionLoading: false,
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

      // Async versions — ready for Supabase integration
      addCardAsync: async (card) => {
        set({ isCollectionLoading: true });
        try {
          // TODO: POST to Supabase user_cards table
          // const { error } = await supabase.from('user_cards').insert({...})
          // if (error) throw error;

          // For now, update local state
          const uniqueId = `${card.id}-${Date.now()}`;
          const newCard = { ...card, id: uniqueId, dateAdded: new Date().toISOString().split("T")[0] };
          set((state) => ({ collection: [...state.collection, newCard], isCollectionLoading: false }));
        } catch (err) {
          set({ isCollectionLoading: false });
          toast.error("Error al guardar la carta. Intenta de nuevo.");
          throw err;
        }
      },
      removeCardAsync: async (cardId) => {
        set({ isCollectionLoading: true });
        try {
          // TODO: DELETE from Supabase user_cards table
          set((state) => ({
            collection: state.collection.filter((c) => c.id !== cardId),
            isCollectionLoading: false,
          }));
        } catch (err) {
          set({ isCollectionLoading: false });
          toast.error("Error al eliminar la carta.");
          throw err;
        }
      },

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

// DB Schema types — ready for Supabase migration
export interface DbProfile {
  id: string; // auth.users.id
  username: string;
  avatar_url: string | null;
  preferred_currency: CurrencyCode;
  default_price_source: PriceEngine;
  created_at: string;
  updated_at: string;
}

export interface DbUserCard {
  id: string;
  user_id: string; // references profiles.id
  api_card_id: string; // Pokémon TCG API card ID
  condition: string;
  language: string;
  region: string;
  finish: string;
  is_graded: boolean;
  grading_company: string | null;
  grade: number | null;
  purchase_price: number | null;
  acquired_at: string;
  created_at: string;
}
