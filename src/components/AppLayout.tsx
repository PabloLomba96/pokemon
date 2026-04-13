import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppSidebar } from "./AppSidebar";
import { Dashboard } from "./Dashboard";
import { ExplorePage } from "./ExplorePage";
import { CardGrid } from "./CardGrid";
import { CollectionTableView } from "./CollectionTableView";
import { CardDetail } from "./CardDetail";
import { AddCardPanel } from "./AddCardPanel";
import { SearchBar } from "./SearchBar";
import { GlobalSearch } from "./GlobalSearch";
import { AuthPage } from "./AuthPage";
import { ProfilePage } from "./ProfilePage";
import { ComingSoonPage } from "./ComingSoonPage";
import { EmptyState } from "./EmptyState";
import { useAppStore } from "../store/useAppStore";
import type { PokemonCard, CardRegion } from "../types/cards";
import { regions } from "../constants/cards";
import { LayoutGrid, List, Filter } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";

export function AppLayout() {
  const {
    isAuthenticated, userId, logout, setAuth,
    collection, addCard, loadCollection, isCollectionLoading,
  } = useAppStore();
  const [activeView, setActiveView] = useState("explore");
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [collectionViewMode, setCollectionViewMode] = useState<"grid" | "table">("grid");
  const [collectionRegion, setCollectionRegion] = useState<CardRegion | "all">("all");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [addingCard, setAddingCard] = useState<PokemonCard | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // Listen to Supabase auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuth(true, session.user.id);
        setIsGuest(false);
      } else if (!isGuest) {
        setAuth(false, null);
      }
      setAuthReady(true);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuth(true, session.user.id);
      }
      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load collection when authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      loadCollection();
    }
  }, [isAuthenticated, userId]);

  // Show auth page if not authenticated and not guest
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated && !isGuest) {
    return (
      <AuthPage
        onLogin={() => {}}
        onGuest={() => {
          setIsGuest(true);
          setActiveView("explore");
        }}
      />
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsGuest(false);
    logout();
  };

  // Guest guard: redirect to auth-required views
  const guardedViews = ["dashboard", "collection", "profile"];
  const requiresAuth = guardedViews.includes(activeView) && isGuest;

  const handleNavigate = (view: string) => {
    if (guardedViews.includes(view) && isGuest) {
      toast.error("Necesitas crear una cuenta para acceder a esta sección.", {
        action: {
          label: "Crear cuenta",
          onClick: () => {
            setIsGuest(false);
            setAuth(false, null);
          },
        },
      });
      return;
    }
    setActiveView(view);
  };

  const filteredCollection = collectionRegion === "all"
    ? collection
    : collection.filter((c) => c.region === collectionRegion);

  const handleAddFromDetail = () => {
    if (isGuest) {
      toast.error("Regístrate para añadir cartas a tu colección.", {
        action: {
          label: "Crear cuenta",
          onClick: () => { setIsGuest(false); setAuth(false, null); },
        },
      });
      return;
    }
    if (selectedCard) {
      setAddingCard(selectedCard);
      setSelectedCard(null);
      setShowAddPanel(true);
    }
  };

  const handleConfirmAdd = async (card: PokemonCard) => {
    try {
      await addCard(card);
      toast.success(`${card.name} añadida a tu colección`, {
        description: `${card.set} — ${card.number}`,
      });
    } catch {
      // Error toast handled in store
    }
    setShowAddPanel(false);
    setAddingCard(null);
  };

  const handleAddFromExplore = async (card: PokemonCard) => {
    if (isGuest) {
      toast.error("Regístrate para añadir cartas a tu colección.", {
        action: {
          label: "Crear cuenta",
          onClick: () => { setIsGuest(false); setAuth(false, null); },
        },
      });
      return;
    }
    try {
      await addCard(card);
      toast.success(`${card.name} añadida a tu colección`, { description: `${card.set} — ${card.number}` });
    } catch { /* handled in store */ }
  };

  const comingSoonViews = ["marketplace", "packs", "accessories", "trades"];

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 h-14">
            <span className="text-sm font-semibold text-muted-foreground">
              PokéVault {isGuest && <span className="text-xs text-primary/60 ml-1">(Invitado)</span>}
            </span>
            <GlobalSearch onSelectCard={(card) => setSelectedCard(card)} />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeView === "explore" && (
            <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ExplorePage onAddToCollection={handleAddFromExplore} />
            </motion.div>
          )}

          {activeView === "dashboard" && !requiresAuth && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Dashboard collection={collection} onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activeView === "collection" && !requiresAuth && (
            <motion.div key="collection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="flex items-center justify-between px-6 h-16">
                  <h1 className="text-lg font-bold text-foreground">Mi Colección</h1>
                  <div className="flex items-center gap-3">
                    <SearchBar onSelectCard={setSelectedCard} />
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button onClick={() => setCollectionViewMode("grid")} className={`p-2 transition-colors cursor-pointer ${collectionViewMode === "grid" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button onClick={() => setCollectionViewMode("table")} className={`p-2 transition-colors cursor-pointer ${collectionViewMode === "table" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </header>

              <div className="p-6">
                {isCollectionLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : collection.length === 0 ? (
                  <EmptyState
                    title="Tu colección está vacía"
                    message="Aún no has añadido ninguna carta. Explora el catálogo y empieza a construir tu legado TCG."
                    ctaLabel="Explorar Catálogo"
                    onCta={() => setActiveView("explore")}
                  />
                ) : (
                  <>
                    <div className="flex items-center gap-2 flex-wrap mb-6">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <button onClick={() => setCollectionRegion("all")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${collectionRegion === "all" ? "bg-primary/20 text-primary border border-primary/40" : "bg-accent text-muted-foreground border border-border hover:border-primary/20"}`}>
                        🌐 Todas
                      </button>
                      {regions.map((r) => (
                        <button key={r.id} onClick={() => setCollectionRegion(r.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${collectionRegion === r.id ? "bg-primary/20 text-primary border border-primary/40" : "bg-accent text-muted-foreground border border-border hover:border-primary/20"}`}>
                          {r.flag} {r.label}
                        </button>
                      ))}
                    </div>

                    {filteredCollection.length > 0 ? (
                      <AnimatePresence mode="wait">
                        {collectionViewMode === "grid" ? (
                          <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <CardGrid cards={filteredCollection} onSelectCard={setSelectedCard} />
                          </motion.div>
                        ) : (
                          <motion.div key="table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <CollectionTableView cards={filteredCollection} onSelectCard={setSelectedCard} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-muted-foreground">No hay cartas en esta región.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeView === "search" && (
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="flex items-center px-6 h-16">
                  <SearchBar onSelectCard={setSelectedCard} />
                </div>
              </header>
              <div className="p-6 text-center py-16">
                <p className="text-muted-foreground">Usa el buscador arriba para encontrar cartas en la API oficial.</p>
              </div>
            </motion.div>
          )}

          {activeView === "profile" && !requiresAuth && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="flex items-center px-6 h-16">
                  <h1 className="text-lg font-bold text-foreground">Perfil & Preferencias</h1>
                </div>
              </header>
              <ProfilePage />
            </motion.div>
          )}

          {comingSoonViews.includes(activeView) && (
            <motion.div key="coming-soon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ComingSoonPage
                title={
                  activeView === "marketplace" ? "El Marketplace P2P está en camino"
                  : activeView === "packs" ? "Sobres y Cajas próximamente"
                  : activeView === "accessories" ? "Accesorios y Protección llegando pronto"
                  : "Intercambios entre coleccionistas"
                }
                subtitle={
                  activeView === "marketplace" ? "Compra y vende cartas directamente con otros coleccionistas europeos, con total transparencia de precios."
                  : activeView === "packs" ? "Abre sobres virtuales, gestiona tu inventario de producto sellado y trackea su valor en tiempo real."
                  : activeView === "accessories" ? "Fundas, carpetas, toploaders y todo lo que necesitas para proteger tu inversión."
                  : "Propón intercambios justos basados en precios de mercado y completa tu colección."
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedCard && (
          <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} onAddToCollection={handleAddFromDetail} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddPanel && addingCard && (
          <AddCardPanel
            card={addingCard}
            onClose={() => setShowAddPanel(false)}
            onConfirmAdd={handleConfirmAdd}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
