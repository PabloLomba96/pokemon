import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PokemonCard } from "../types/cards";
import type { DbUserCard } from "../types/cards";
import { supabase } from "../integrations/supabase/client";
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
  addCard: (card: PokemonCard) => Promise<void>;
  removeCard: (cardId: string) => Promise<void>;
  updateCard: (cardId: string, updates: Partial<PokemonCard>) => Promise<void>;
  loadCollection: () => Promise<void>;

  // Auth
  isAuthenticated: boolean;
  userId: string | null;
  login: () => void;
  logout: () => void;
  setAuth: (authenticated: boolean, userId: string | null) => void;

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

      addCard: async (card) => {
        const { userId } = get();
        if (!userId) {
          toast.error("Debes iniciar sesión para añadir cartas.");
          return;
        }

        set({ isCollectionLoading: true });
        try {
          const { error } = await supabase.from("user_cards").insert({
            user_id: userId,
            api_card_id: card.id,
            card_name: card.name,
            card_set: card.set,
            card_number: card.number,
            card_image: card.image,
            card_rarity: card.rarity,
            card_era: card.era,
            region: card.region,
            language: card.language,
            condition: card.condition,
            finish: card.finish,
            is_graded: !!card.grading,
            grading_company: card.grading?.company ?? null,
            grade: card.grading?.grade ?? null,
            estimated_price: card.estimatedPrice,
            price_change: card.priceChange,
            manual_price: card.manualPrice ?? null,
            specific_language: card.specificLanguage ?? null,
          });

          if (error) throw error;
          await get().loadCollection();
        } catch (err) {
          console.error("Error adding card:", err);
          toast.error("Error al guardar la carta. Intenta de nuevo.");
          throw err;
        } finally {
          set({ isCollectionLoading: false });
        }
      },

      removeCard: async (cardId) => {
        const { userId } = get();
        if (!userId) return;

        set({ isCollectionLoading: true });
        try {
          const { error } = await supabase
            .from("user_cards")
            .delete()
            .eq("id", cardId)
            .eq("user_id", userId);

          if (error) throw error;
          set((state) => ({
            collection: state.collection.filter((c) => c.id !== cardId),
            isCollectionLoading: false,
          }));
        } catch (err) {
          set({ isCollectionLoading: false });
          toast.error("Error al eliminar la carta.");
        }
      },

      updateCard: async (cardId, updates) => {
        const { userId } = get();
        if (!userId) return;

        try {
          const dbUpdates: Record<string, unknown> = {};
          if (updates.condition !== undefined) dbUpdates.condition = updates.condition;
          if (updates.finish !== undefined) dbUpdates.finish = updates.finish;
          if (updates.specificLanguage !== undefined) dbUpdates.specific_language = updates.specificLanguage;
          if (updates.manualPrice !== undefined) dbUpdates.manual_price = updates.manualPrice;
          if (updates.grading !== undefined) {
            dbUpdates.is_graded = !!updates.grading;
            dbUpdates.grading_company = updates.grading?.company ?? null;
            dbUpdates.grade = updates.grading?.grade ?? null;
          }
          if (updates.language !== undefined) dbUpdates.language = updates.language;

          const { error } = await supabase
            .from("user_cards")
            .update(dbUpdates)
            .eq("id", cardId)
            .eq("user_id", userId);

          if (error) throw error;

          set((state) => ({
            collection: state.collection.map((c) =>
              c.id === cardId ? { ...c, ...updates } : c
            ),
          }));
          toast.success("Carta actualizada");
        } catch (err) {
          console.error("Error updating card:", err);
          toast.error("Error al actualizar la carta.");
        }
      },

      loadCollection: async () => {
        const { userId } = get();
        if (!userId) {
          set({ collection: [], isCollectionLoading: false });
          return;
        }

        set({ isCollectionLoading: true });
        try {
          const { data, error } = await supabase
            .from("user_cards")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

          if (error) throw error;

          const cards: PokemonCard[] = (data ?? []).map((row: DbUserCard) => ({
            id: row.id,
            name: row.card_name,
            set: row.card_set,
            setCode: row.api_card_id.split("-")[0] ?? "",
            number: row.card_number,
            rarity: row.card_rarity,
            era: row.card_era,
            image: row.card_image,
            condition: row.condition,
            language: row.language,
            region: row.region as PokemonCard["region"],
            finish: row.finish,
            specificLanguage: row.specific_language,
            manualPrice: row.manual_price,
            grading: row.is_graded && row.grading_company ? {
              company: row.grading_company as "PSA" | "BGS" | "CGC" | "PCA",
              grade: row.grade ?? 10,
            } : undefined,
            prices: {
              tcgApi: null,
              cardmarket: row.estimated_price > 0 ? row.estimated_price : null,
              ebay: null,
            },
            priceDetails: [],
            estimatedPrice: row.manual_price ?? row.estimated_price,
            priceChange: Number(row.price_change) || 0,
            dateAdded: row.acquired_at?.split("T")[0] ?? new Date().toISOString().split("T")[0],
          }));

          set({ collection: cards, isCollectionLoading: false });
        } catch (err) {
          console.error("Error loading collection:", err);
          set({ isCollectionLoading: false });
          toast.error("Error al cargar tu colección.");
        }
      },

      // Auth
      isAuthenticated: false,
      userId: null,
      login: () => set({ isAuthenticated: true }),
      logout: () => {
        supabase.auth.signOut();
        set({ isAuthenticated: false, userId: null, collection: [] });
      },
      setAuth: (authenticated, userId) => set({ isAuthenticated: authenticated, userId }),

      // Preferences
      preferences: {
        currency: "EUR",
        currencySymbol: "€",
        priceEngine: "cardmarket",
        displayName: "Coleccionista",
        email: "",
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
      name: "dexpoke-store",
      partialize: (state) => ({
        preferences: state.preferences,
      }),
    }
  )
);
