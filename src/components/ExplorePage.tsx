import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, TrendingUp, Filter } from "lucide-react";
import { catalogCards, regions, getFlagForLanguage } from "../data/mockData";
import type { PokemonCard, CardRegion } from "../data/mockData";
import { CardGrid } from "./CardGrid";
import { CardDetail } from "./CardDetail";
import { AddCardPanel } from "./AddCardPanel";

interface ExplorePageProps {
  onAddToCollection?: (card: PokemonCard) => void;
}

export function ExplorePage({ onAddToCollection }: ExplorePageProps) {
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [addingCard, setAddingCard] = useState<PokemonCard | null>(null);
  const [activeRegion, setActiveRegion] = useState<CardRegion | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = catalogCards
    .filter((c) => activeRegion === "all" || c.region === activeRegion)
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const trendingCards = [...catalogCards].sort((a, b) => b.priceChange - a.priceChange).slice(0, 5);

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
              Explora las cartas más icónicas del mercado. Consulta precios en tiempo real y añádelas a tu colección.
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
                placeholder="Buscar por nombre de carta..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Trending */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-price-up" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tendencia al Alza</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {trendingCards.map((card) => (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelectedCard(card)}
                className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl gradient-card min-w-[220px] cursor-pointer"
              >
                <img src={card.image} alt={card.name} className="w-10 h-14 object-contain rounded" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">{card.name}</p>
                  <p className="text-xs text-muted-foreground">{card.set}</p>
                  <span className="text-xs font-bold text-price-up">+{card.priceChange}%</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Region filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <button onClick={() => setActiveRegion("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeRegion === "all"
                ? "bg-primary/20 text-primary border border-primary/40"
                : "bg-accent text-muted-foreground border border-border hover:border-primary/20"
            }`}
          >🌐 Todas</button>
          {regions.map((r) => (
            <button key={r.id} onClick={() => setActiveRegion(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRegion === r.id
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "bg-accent text-muted-foreground border border-border hover:border-primary/20"
              }`}
            >
              {r.flag} {r.label} <span className="opacity-60">({catalogCards.filter(c => c.region === r.id).length})</span>
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div>
          <p className="text-xs text-muted-foreground mb-4">{filtered.length} cartas encontradas</p>
          <CardGrid cards={filtered} onSelectCard={setSelectedCard} />
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No se encontraron cartas con esos filtros.</p>
            </div>
          )}
        </div>
      </div>

      {/* Card detail modal */}
      <AnimatePresence>
        {selectedCard && (
          <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} onAddToCollection={handleAddToCollection} />
        )}
      </AnimatePresence>

      {/* Add panel */}
      <AnimatePresence>
        {showAddPanel && addingCard && (
          <AddCardPanel cardName={addingCard.name} onClose={() => setShowAddPanel(false)} onConfirmAdd={() => handleConfirmAdd(addingCard)} />
        )}
      </AnimatePresence>
    </div>
  );
}
