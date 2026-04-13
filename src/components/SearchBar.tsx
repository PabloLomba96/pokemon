import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import type { PokemonCard } from "../types/cards";
import { usePokemonSearch } from "../hooks/usePokemonSearch";
import { useAppStore } from "../store/useAppStore";
import { Skeleton } from "./ui/skeleton";

interface SearchBarProps {
  onSelectCard: (card: PokemonCard) => void;
}

export function SearchBar({ onSelectCard }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const { preferences } = useAppStore();
  const sym = preferences.currencySymbol;

  const { results, isLoading } = usePokemonSearch(query, 350);

  return (
    <div className="relative w-full max-w-md">
      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
        focused ? "border-primary/50 bg-surface-elevated glow-purple" : "border-border bg-surface"
      }`}>
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Buscar carta por nombre..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        {isLoading && <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />}
        {query && !isLoading && (
          <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {focused && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-3 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-14 rounded" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              results.slice(0, 10).map((card) => (
                <button
                  key={card.id}
                  onMouseDown={() => { onSelectCard(card); setQuery(""); }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left cursor-pointer"
                >
                  <img src={card.image} alt={card.name} className="w-10 h-14 object-contain rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{card.name}</p>
                    <p className="text-xs text-muted-foreground">{card.set} — {card.number}</p>
                  </div>
                  {card.estimatedPrice > 0 && (
                    <span className="text-sm font-bold text-neon-gold">{sym}{card.estimatedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</span>
                  )}
                </button>
              ))
            ) : (
              <p className="p-4 text-sm text-muted-foreground text-center">No se encontraron resultados.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
