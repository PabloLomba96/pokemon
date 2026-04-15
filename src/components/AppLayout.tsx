import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppSidebar } from "./AppSidebar";
import { Dashboard } from "./Dashboard";
import { ExplorePage } from "./ExplorePage";
import { CardGrid } from "./CardGrid";
import { CollectionTableView } from "./CollectionTableView";
import { CardDetail } from "./CardDetail";
import { AddCardPanel } from "./AddCardPanel";
import { EditCardModal } from "./EditCardModal";
import { SearchBar } from "./SearchBar";
import { GlobalSearch } from "./GlobalSearch";
import { AuthPage } from "./AuthPage";
import { ProfilePage } from "./ProfilePage";
import { ComingSoonPage } from "./ComingSoonPage";
import { EmptyState } from "./EmptyState";
import { SetTracker } from "./SetTracker";
import { useAppStore } from "../store/useAppStore";
import type { PokemonCard, CardRegion } from "../types/cards";
import { regions } from "../constants/cards";
import { formatPrice } from "../lib/utils";
import { LayoutGrid, List, Filter, Heart, FolderOpen, Trash2, FolderPlus, Wallet } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";

export function AppLayout() {
  const {
    isAuthenticated, userId, logout, setAuth,
    collection, addCard, removeCards, moveCardsToFolder, loadCollection, isCollectionLoading,
    folders, loadFolders, createFolder, deleteFolder,
    preferences,
  } = useAppStore();
  const [activeView, setActiveView] = useState("explore");
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [collectionViewMode, setCollectionViewMode] = useState<"grid" | "table">("grid");
  const [collectionRegion, setCollectionRegion] = useState<CardRegion | "all">("all");
  const [collectionFilter, setCollectionFilter] = useState<"all" | "favorites" | string>("all");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [addingCard, setAddingCard] = useState<PokemonCard | null>(null);
  const [editingCard, setEditingCard] = useState<PokemonCard | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

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

  // Load collection and folders when authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      loadCollection();
      loadFolders();
    }
  }, [isAuthenticated, userId]);

  const filteredCollection = useMemo(() => {
    let cards = collection;
    if (collectionRegion !== "all") {
      cards = cards.filter((c) => c.region === collectionRegion);
    }
    if (collectionFilter === "favorites") {
      cards = cards.filter((c) => c.isFavorite);
    } else if (collectionFilter !== "all") {
      // folder id
      cards = cards.filter((c) => c.folderId === collectionFilter);
    }
    return cards;
  }, [collection, collectionRegion, collectionFilter]);

  const totalValue = useMemo(
    () => filteredCollection.reduce((sum, c) => sum + c.estimatedPrice, 0),
    [filteredCollection]
  );

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

  const guardedViews = ["dashboard", "collection", "profile", "set-tracker"];

  const handleNavigate = (view: string) => {
    if (guardedViews.includes(view) && isGuest) {
      toast.error("Necesitas crear una cuenta para acceder a esta sección.", {
        action: {
          label: "Registrarse en DexVault",
          onClick: () => {
            setIsGuest(false);
            setAuth(false, null);
          },
        },
      });
      return;
    }
    setActiveView(view);
    setSelectedIds(new Set());
  };

  const handleAddFromDetail = () => {
    if (isGuest) {
      toast.error("Regístrate en DexVault para guardar esta carta.", {
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
      toast.error("Regístrate en DexVault para guardar esta carta.", {
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

  const handleToggleSelect = (cardId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredCollection.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCollection.map((c) => c.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    await removeCards(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleBulkMoveToFolder = async (folderId: string | null) => {
    if (selectedIds.size === 0) return;
    await moveCardsToFolder(Array.from(selectedIds), folderId);
    setSelectedIds(new Set());
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    await createFolder(newFolderName.trim());
    setNewFolderName("");
    setShowNewFolder(false);
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
              DexVault {isGuest && <span className="text-xs text-primary/60 ml-1">(Invitado)</span>}
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

          {activeView === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Dashboard collection={collection} onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activeView === "set-tracker" && (
            <motion.div key="set-tracker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SetTracker collection={collection} />
            </motion.div>
          )}

          {activeView === "collection" && (
            <motion.div key="collection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <header className="sticky top-14 z-30 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="flex items-center justify-between px-6 h-16">
                  <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-foreground">Mi Colección</h1>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-gold/10 border border-neon-gold/20">
                      <Wallet className="w-4 h-4 text-neon-gold" />
                      <span className="text-sm font-bold text-neon-gold">{formatPrice(totalValue, preferences.currency)}</span>
                    </div>
                  </div>
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
                    {/* Filters bar */}
                    <div className="flex items-center gap-2 flex-wrap mb-4">
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

                    {/* Folder/Favorites filter */}
                    <div className="flex items-center gap-2 flex-wrap mb-6">
                      <button onClick={() => setCollectionFilter("all")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${collectionFilter === "all" ? "bg-primary/20 text-primary border border-primary/40" : "bg-accent text-muted-foreground border border-border"}`}>
                        Todas
                      </button>
                      <button onClick={() => setCollectionFilter("favorites")} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${collectionFilter === "favorites" ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-accent text-muted-foreground border border-border"}`}>
                        <Heart className="w-3 h-3" /> Favoritas
                      </button>
                      {folders.map((f) => (
                        <button key={f.id} onClick={() => setCollectionFilter(f.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${collectionFilter === f.id ? "bg-primary/20 text-primary border border-primary/40" : "bg-accent text-muted-foreground border border-border"}`}>
                          <FolderOpen className="w-3 h-3" style={{ color: f.color }} /> {f.name}
                        </button>
                      ))}
                      <button onClick={() => setShowNewFolder(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent text-muted-foreground border border-border hover:border-primary/20 transition-all cursor-pointer">
                        <FolderPlus className="w-3 h-3" /> Nueva
                      </button>
                    </div>

                    {/* New folder form */}
                    {showNewFolder && (
                      <div className="flex items-center gap-2 mb-4">
                        <Input
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="Nombre de la carpeta"
                          className="max-w-xs bg-accent border-border"
                          onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                        />
                        <button onClick={handleCreateFolder} className="px-3 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground cursor-pointer">Crear</button>
                        <button onClick={() => setShowNewFolder(false)} className="px-3 py-2 rounded-lg text-xs text-muted-foreground cursor-pointer">Cancelar</button>
                      </div>
                    )}

                    {/* Bulk actions */}
                    {collectionViewMode === "table" && selectedIds.size > 0 && (
                      <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20">
                        <span className="text-sm font-semibold text-primary">{selectedIds.size} seleccionada(s)</span>
                        <button onClick={handleBulkDelete} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-price-down/20 text-price-down border border-price-down/30 cursor-pointer">
                          <Trash2 className="w-3 h-3" /> Eliminar
                        </button>
                        {folders.length > 0 && (
                          <Select onValueChange={(v) => handleBulkMoveToFolder(v === "none" ? null : v)}>
                            <SelectTrigger className="w-40 h-8 text-xs bg-accent border-border">
                              <SelectValue placeholder="Mover a carpeta..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Sin carpeta</SelectItem>
                              {folders.map((f) => (
                                <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    )}

                    {filteredCollection.length > 0 ? (
                      <AnimatePresence mode="wait">
                        {collectionViewMode === "grid" ? (
                          <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <CardGrid cards={filteredCollection} onSelectCard={setSelectedCard} onEditCard={setEditingCard} showEditButton />
                          </motion.div>
                        ) : (
                          <motion.div key="table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <CollectionTableView
                              cards={filteredCollection}
                              onSelectCard={setSelectedCard}
                              onEditCard={setEditingCard}
                              selectedIds={selectedIds}
                              onToggleSelect={handleToggleSelect}
                              onToggleSelectAll={handleToggleSelectAll}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-muted-foreground">No hay cartas con estos filtros.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeView === "search" && (
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <header className="sticky top-14 z-30 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="flex items-center px-6 h-16">
                  <SearchBar onSelectCard={setSelectedCard} />
                </div>
              </header>
              <div className="p-6 text-center py-16">
                <p className="text-muted-foreground">Usa el buscador arriba para encontrar cartas en la API oficial.</p>
              </div>
            </motion.div>
          )}

          {activeView === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <header className="sticky top-14 z-30 border-b border-border bg-background/80 backdrop-blur-md">
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
          <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} onAddToCollection={handleAddFromDetail} isGuest={isGuest} />
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

      <AnimatePresence>
        {editingCard && (
          <EditCardModal
            card={editingCard}
            onClose={() => { setEditingCard(null); loadCollection(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
