import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Wallet, Layers, Crown, Plus } from "lucide-react";
import { mockCards, regions } from "../data/mockData";
import type { PokemonCard, CardRegion } from "../data/mockData";
import { AppSidebar } from "./AppSidebar";
import { MetricCard } from "./MetricCard";
import { PortfolioChart } from "./PortfolioChart";
import { CardGrid } from "./CardGrid";
import { CardDetail } from "./CardDetail";
import { AddCardPanel } from "./AddCardPanel";
import { SearchBar } from "./SearchBar";

export function Dashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [addingCardName, setAddingCardName] = useState("");
  const [activeRegion, setActiveRegion] = useState<CardRegion | "all">("all");

  const filteredCards = activeRegion === "all"
    ? mockCards
    : mockCards.filter((c) => c.region === activeRegion);

  const formatNumber = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const totalValue = filteredCards.reduce((sum, c) => sum + c.estimatedPrice, 0);
  const topCard = filteredCards.length > 0
    ? filteredCards.reduce((top, c) => (c.estimatedPrice > top.estimatedPrice ? c : top), filteredCards[0])
    : null;

  const handleAddToCollection = () => {
    if (selectedCard) {
      setAddingCardName(selectedCard.name);
      setSelectedCard(null);
      setShowAddPanel(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activeView={activeView} onNavigate={setActiveView} />

      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 h-16">
            <h1 className="text-lg font-bold text-foreground">
              {activeView === "dashboard" && "Mi Colección"}
              {activeView === "collection" && "Todas las Cartas"}
              {activeView === "search" && "Buscador"}
            </h1>
            <div className="flex items-center gap-3">
              <SearchBar onSelectCard={setSelectedCard} />
              <button
                onClick={() => { setAddingCardName("Nueva Carta"); setShowAddPanel(true); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors glow-purple cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Añadir
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Region Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">Región:</span>
            <button
              onClick={() => setActiveRegion("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRegion === "all"
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "bg-accent text-muted-foreground border border-border hover:border-primary/20"
              }`}
            >
              🌐 Todas
            </button>
            {regions.map((r) => {
              const count = mockCards.filter((c) => c.region === r.id).length;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRegion(r.id)}
                  title={r.description}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeRegion === r.id
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-accent text-muted-foreground border border-border hover:border-primary/20"
                  }`}
                >
                  {r.flag} {r.label} <span className="opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Valor Total"
              value={`€${formatNumber(totalValue)}`}
              change={5.8}
              icon={Wallet}
              accentClass="text-neon-gold"
              glowClass="glow-gold"
            />
            <MetricCard
              title="Cartas Totales"
              value={filteredCards.length.toString()}
              icon={Layers}
              accentClass="text-neon-emerald"
              glowClass="glow-emerald"
            />
            <MetricCard
              title="Top Carta"
              value={topCard?.name ?? "—"}
              change={topCard?.priceChange}
              icon={Crown}
              accentClass="text-primary"
              glowClass="glow-purple"
            />
          </div>

          {/* Chart */}
          <PortfolioChart />

          {/* Cards grid */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Tu Colección {activeRegion !== "all" && `— ${regions.find(r => r.id === activeRegion)?.label}`}
            </h2>
            <CardGrid cards={filteredCards} onSelectCard={setSelectedCard} />
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {selectedCard && (
          <CardDetail
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
            onAddToCollection={handleAddToCollection}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddPanel && (
          <AddCardPanel
            cardName={addingCardName}
            onClose={() => setShowAddPanel(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
