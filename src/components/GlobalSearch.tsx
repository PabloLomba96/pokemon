import { useState, useEffect } from "react";
import type { PokemonCard } from "../types/cards";
import { getFlagForLanguage } from "../constants/cards";
import { usePokemonSearch } from "../hooks/usePokemonSearch";
import { formatPrice } from "../lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Search } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { Skeleton } from "./ui/skeleton";

const regionBadge: Record<string, { label: string; className: string }> = {
  western: { label: "W", className: "bg-blue-500/20 text-blue-400" },
  japanese: { label: "JP", className: "bg-red-500/20 text-red-400" },
  korean: { label: "KR", className: "bg-green-500/20 text-green-400" },
  chinese: { label: "CN", className: "bg-yellow-500/20 text-yellow-400" },
};

interface GlobalSearchProps {
  onSelectCard: (card: PokemonCard) => void;
}

export function GlobalSearch({ onSelectCard }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { preferences, collection } = useAppStore();

  const { results: apiResults, isLoading } = usePokemonSearch(query, 300);
  const isSearching = query.trim().length >= 2;

  const collectionApiIds = new Set(collection.map((c) => c.setCode + "-" + c.number));

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
          placeholder="Buscar por nombre o número (ej: Charizard, 151, 001/165)..."
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
          ) : !isSearching ? (
            <CommandEmpty>Escribe al menos 2 caracteres para buscar.</CommandEmpty>
          ) : apiResults.length === 0 ? (
            <CommandEmpty>No se encontraron cartas.</CommandEmpty>
          ) : (
            <CommandGroup heading={`Resultados API (${apiResults.length})`}>
              {apiResults.slice(0, 20).map((card: PokemonCard) => {
                const rb = regionBadge[card.region];
                return (
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
                        {rb && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${rb.className}`}>
                            {rb.label}
                          </span>
                        )}
                        {card.estimatedPrice > 0 && (
                          <span className="text-xs font-bold text-neon-gold">
                            {formatPrice(card.estimatedPrice, preferences.currency)}
                          </span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
