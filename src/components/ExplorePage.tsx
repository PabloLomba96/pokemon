import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, SlidersHorizontal } from "lucide-react";
import { regions } from "../data/mockData";
import type { PokemonCard, CardRegion } from "../data/mockData";
import { CardGrid } from "./CardGrid";
import { CardDetail } from "./CardDetail";
import { AddCardPanel } from "./AddCardPanel";
import { AdvancedFilters } from "./AdvancedFilters";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Skeleton } from "./ui/skeleton";
import { usePokemonSearch } from "../hooks/usePokemonSearch";
import { toast } from "sonner";

interface ExplorePageProps {
  onAddToCollection?: (card: PokemonCard) => void;
}

export function ExplorePage({ onAddToCollection }: ExplorePageProps) {
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [addingCard, setAddingCard] = useState<PokemonCard | null>(null);
  const [activeRegion, setActiveRegion] = useState<CardRegion | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "change">("name");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);

  const advancedCount = selectedEras.length + selectedSets.length + selectedRarities.length;

  const { results: apiResults, isLoading: apiLoading, error: apiError } = usePokemonSearch(searchQuery);
  const isSearching = searchQuery.trim().length >= 2;

  if (apiError) {
    toast.error(apiError);
  }

  const filtered = apiResults
    .filter((c: PokemonCard) => activeRegion === "all" || c.region === activeRegion)
    .filter((c: PokemonCard) => selectedEras.length === 0 || selectedEras.includes(c.era))
    .filter((c: PokemonCard) => selectedSets.length === 0 || selectedSets.includes(c.set))
    .filter((c: PokemonCard) => selectedRarities.length === 0 || selectedRarities.includes(c.rarity))
    .sort((a: PokemonCard, b: PokemonCard) => {
      if (sortBy === "price") return b.estimatedPrice - a.estimatedPrice;
      if (sortBy === "change") return b.priceChange - a.priceChange;
      return a.name.localeCompare(b.name);
    });

  const handleAddToCollection = () => {
    if (selectedCard) {
      setAddingCard(selectedCard);
      setSelectedCard(null);
      setShowAddPanel(true);
    }
  };

  const handleConfirmAdd = (card: PokemonCard) => {
    onAddToCollection?.(card);
    setShowAddPanel(false);
    setAddingCard(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-neon-gold/5" />
        <div className="relative px-6 py-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Explorar Catálogo</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Descubre Cartas <span className="text-primary text-glow-purple">Pokémon TCG</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Busca en la base de datos oficial con precios reales de Cardmarket y TCGPlayer.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto"
          >
            <div className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-border bg-card/80 backdrop-blur-sm">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre de carta (ej: Charizard, Pikachu)..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
              />
              {apiLoading && (
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              )}
            </div>
            {isSearching && !apiLoading && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {apiResults.length} resultados de la API oficial
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Filter toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="gradient-card rounded-xl p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filtros de Región & Numeración</h3>
            </div>
            <button
              onClick={() => setShowAdvanced(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtros Avanzados
              {advancedCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {advancedCount}
                </span>
              )}
            </button>
          </div>

          <ToggleGroup
            type="single"
            value={activeRegion}
            onValueChange={(val) => { if (val) setActiveRegion(val as CardRegion | "all"); }}
            className="flex flex-wrap gap-1.5 justify-start"
          >
            <ToggleGroupItem value="all" className="px-4 py-2 rounded-lg text-xs font-semibold data-[state=on]:bg-primary/20 data-[state=on]:text-primary data-[state=on]:border-primary/40 border border-border bg-accent/30 text-muted-foreground hover:text-foreground transition-all cursor-pointer">
              🌐 Todas
            </ToggleGroupItem>
            {regions.map((r) => (
              <ToggleGroupItem
                key={r.id}
                value={r.id}
                className="px-4 py-2 rounded-lg text-xs font-semibold data-[state=on]:bg-primary/20 data-[state=on]:text-primary data-[state=on]:border-primary/40 border border-border bg-accent/30 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                <span className="mr-1.5">{r.flag}</span>
                {r.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Ordenar:</span>
            {([
              { key: "name", label: "Nombre" },
              { key: "price", label: "Precio" },
              { key: "change", label: "Tendencia" },
            ] as const).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  sortBy === opt.key
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {advancedCount > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Activos:</span>
              {[...selectedEras, ...selectedSets, ...selectedRarities].map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Cards grid or skeletons */}
        <div>
          {!isSearching ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Escribe al menos 2 caracteres para buscar cartas en la API oficial.</p>
            </div>
          ) : apiLoading ? (
            <>
              <p className="text-xs text-muted-foreground mb-4">Buscando en la API oficial...</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="gradient-card rounded-xl p-3 space-y-3">
                    <Skeleton className="aspect-[2.5/3.5] rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-5 w-1/3" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-4">{filtered.length} cartas encontradas</p>
              <CardGrid cards={filtered} onSelectCard={setSelectedCard} />
              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No se encontraron cartas en la API.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AdvancedFilters
        open={showAdvanced}
        onOpenChange={setShowAdvanced}
        selectedEras={selectedEras}
        selectedSets={selectedSets}
        selectedRarities={selectedRarities}
        onErasChange={setSelectedEras}
        onSetsChange={setSelectedSets}
        onRaritiesChange={setSelectedRarities}
      />

      <AnimatePresence>
        {selectedCard && (
          <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} onAddToCollection={handleAddToCollection} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddPanel && addingCard && (
          <AddCardPanel cardName={addingCard.name} onClose={() => setShowAddPanel(false)} onConfirmAdd={() => handleConfirmAdd(addingCard)} />
        )}
      </AnimatePresence>
    </div>
  );
}
