import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { mockCards } from "../data/mockData";
import type { PokemonCard } from "../data/mockData";

interface SearchBarProps {
  onSelectCard: (card: PokemonCard) => void;
}

export function SearchBar({ onSelectCard }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = query.length > 0
    ? mockCards.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

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
        {query && (
          <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {focused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {results.map((card) => (
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
                <span className="text-sm font-bold text-neon-gold">€{card.estimatedPrice.toLocaleString()}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
