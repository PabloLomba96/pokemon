import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AppSidebar } from "./AppSidebar";
import { Dashboard } from "./Dashboard";
import { ExplorePage } from "./ExplorePage";
import { CardGrid } from "./CardGrid";
import { CardDetail } from "./CardDetail";
import { SearchBar } from "./SearchBar";
import { useCollection } from "../hooks/useCollection";
import type { PokemonCard } from "../data/mockData";
import { catalogCards } from "../data/mockData";

export function AppLayout() {
  const [activeView, setActiveView] = useState("explore");
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const { collection, addCard } = useCollection();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activeView={activeView} onNavigate={setActiveView} />

      <main className="flex-1 min-w-0">
        {activeView === "explore" && (
          <ExplorePage onAddToCollection={addCard} />
        )}

        {activeView === "dashboard" && (
          <>
            <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
              <div className="flex items-center justify-between px-6 h-16">
                <h1 className="text-lg font-bold text-foreground">Mi Dashboard</h1>
              </div>
            </header>
            <Dashboard collection={collection} />
          </>
        )}

        {activeView === "collection" && (
          <>
            <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
              <div className="flex items-center justify-between px-6 h-16">
                <h1 className="text-lg font-bold text-foreground">Mi Colección</h1>
                <SearchBar onSelectCard={setSelectedCard} />
              </div>
            </header>
            <div className="p-6">
              {collection.length > 0 ? (
                <CardGrid cards={collection} onSelectCard={setSelectedCard} />
              ) : (
                <div className="text-center py-20">
                  <p className="text-lg font-semibold text-foreground mb-2">Sin cartas aún</p>
                  <p className="text-sm text-muted-foreground">Ve a Explorar para descubrir y añadir cartas a tu colección.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeView === "search" && (
          <>
            <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
              <div className="flex items-center px-6 h-16">
                <SearchBar onSelectCard={setSelectedCard} />
              </div>
            </header>
            <div className="p-6">
              <CardGrid cards={catalogCards} onSelectCard={setSelectedCard} />
            </div>
          </>
        )}
      </main>

      <AnimatePresence>
        {selectedCard && (
          <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
