import { useState, useEffect } from "react";
import { catalogCards } from "../data/mockData";
import type { PokemonCard } from "../data/mockData";
import { getFlagForLanguage } from "../data/mockData";
import { usePokemonSearch } from "../hooks/usePokemonSearch";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Search, Loader2 } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { Skeleton } from "./ui/skeleton";

interface GlobalSearchProps {
  onSelectCard: (card: PokemonCard) => void;
}

export function GlobalSearch({ onSelectCard }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { preferences } = useAppStore();
  const sym = preferences.currencySymbol;
  const formatNum = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const { results: apiResults, isLoading } = usePokemonSearch(query, 300);
  const isSearching = query.trim().length >= 2;

  // Combine: show API results when searching, catalog otherwise
  const displayCards = isSearching ? apiResults : catalogCards;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all cursor-pointer active:scale-95"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm hidden md:inline">Buscar cartas...</span>
        <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border bg-accent px-1.5 text-[10px] font-mono text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Buscar carta por nombre (API en tiempo real)..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isLoading && isSearching ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-11 rounded" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <CommandEmpty>No se encontraron cartas.</CommandEmpty>
              <CommandGroup heading={isSearching ? `Resultados API (${displayCards.length})` : "Catálogo"}>
                {displayCards.slice(0, 20).map((card) => (
                  <CommandItem
                    key={card.id}
                    value={`${card.name} ${card.set} ${card.number}`}
                    onSelect={() => {
                      onSelectCard(card);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <img src={card.image} alt={card.name} className="w-8 h-11 object-contain rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{card.name}</p>
                        <p className="text-xs text-muted-foreground">{card.set} · {card.number}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px]">{getFlagForLanguage(card.language)}</span>
                        {card.estimatedPrice > 0 && (
                          <span className="text-xs font-bold text-neon-gold">{sym}{formatNum(card.estimatedPrice)}</span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
