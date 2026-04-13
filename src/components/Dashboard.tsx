import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Wallet, Layers, Crown, Plus } from "lucide-react";
import { mockCards } from "../data/mockData";
import type { PokemonCard } from "../data/mockData";
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

  const totalValue = mockCards.reduce((sum, c) => sum + c.estimatedPrice, 0);
  const topCard = mockCards.reduce((top, c) => (c.estimatedPrice > top.estimatedPrice ? c : top), mockCards[0]);

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
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Valor Total"
              value={`€${totalValue.toLocaleString()}`}
              change={5.8}
              icon={Wallet}
              accentClass="text-neon-gold"
              glowClass="glow-gold"
            />
            <MetricCard
              title="Cartas Totales"
              value={mockCards.length.toString()}
              icon={Layers}
              accentClass="text-neon-emerald"
              glowClass="glow-emerald"
            />
            <MetricCard
              title="Top Carta"
              value={topCard.name}
              change={topCard.priceChange}
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
              Tu Colección
            </h2>
            <CardGrid cards={mockCards} onSelectCard={setSelectedCard} />
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
