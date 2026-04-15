import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Layers, Crown, Settings2, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import type { PokemonCard } from "../types/cards";
import { MetricCard } from "./MetricCard";
import { PortfolioChart } from "./PortfolioChart";
import { PortfolioInsights } from "./PortfolioInsights";
import { CardCarousel } from "./CardCarousel";
import { TopCardsWidget } from "./TopCardsWidget";
import { RegionBreakdown } from "./RegionBreakdown";
import { CardDetail } from "./CardDetail";
import { CardGrid } from "./CardGrid";
import { EmptyState } from "./EmptyState";
import { useDashboardWidgets } from "../hooks/useDashboardWidgets";
import type { WidgetType } from "../hooks/useDashboardWidgets";
import { useAppStore } from "../store/useAppStore";
import { formatPrice } from "../lib/utils";

interface DashboardProps {
  collection: PokemonCard[];
  onNavigate?: (view: string) => void;
}

export function Dashboard({ collection, onNavigate }: DashboardProps) {
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const { widgets, toggleWidget, moveWidget } = useDashboardWidgets();
  const { preferences } = useAppStore();

  const totalValue = collection.reduce((sum, c) => sum + c.estimatedPrice, 0);
  const topCard = collection.length > 0
    ? collection.reduce((top, c) => (c.estimatedPrice > top.estimatedPrice ? c : top), collection[0])
    : null;
  const recentCards = [...collection].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 6);

  if (collection.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          title="Tu bóveda está vacía"
          message="Empieza tu legado TCG. Explora el catálogo, descubre cartas icónicas y construye un portafolio envidiable."
          ctaLabel="Ir a Explorar"
          onCta={() => onNavigate?.("explore")}
        />
      </div>
    );
  }

  const renderWidget = (type: WidgetType) => {
    switch (type) {
      case "metrics":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard title="Valor Total" value={formatPrice(totalValue, preferences.currency)} change={5.8} icon={Wallet} accentClass="text-neon-gold" glowClass="glow-gold" />
            <MetricCard title="Cartas Totales" value={collection.length.toString()} icon={Layers} accentClass="text-neon-emerald" glowClass="glow-emerald" />
            <MetricCard title="Top Carta" value={topCard?.name ?? "—"} change={topCard?.priceChange} icon={Crown} accentClass="text-primary" glowClass="glow-purple" />
          </div>
        );
      case "chart":
        return <PortfolioChart />;
      case "carousel":
        return (
          <div className="gradient-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Carrusel de tu Colección</h3>
            <CardCarousel cards={collection} onSelectCard={setSelectedCard} />
          </div>
        );
      case "topCards":
        return (
          <div className="gradient-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Top Cartas Valiosas</h3>
            <TopCardsWidget cards={collection} onSelectCard={setSelectedCard} />
          </div>
        );
      case "regionBreakdown":
        return (
          <div className="gradient-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Desglose por Región</h3>
            <RegionBreakdown cards={collection} />
          </div>
        );
      case "insights":
        return <PortfolioInsights cards={collection} />;
      case "recentlyAdded":
        return (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Añadidas Recientemente</h3>
            <CardGrid cards={recentCards} onSelectCard={setSelectedCard} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Bienvenido a tu Bóveda en DexVault</h1>
          <p className="text-sm text-muted-foreground">{collection.length} cartas en tu colección</p>
        </div>
        <button onClick={() => setShowCustomize(!showCustomize)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all cursor-pointer"
        >
          <Settings2 className="w-4 h-4" />
          Personalizar
        </button>
      </div>

      <AnimatePresence>
        {showCustomize && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="gradient-card rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Widgets del Dashboard</h3>
              <p className="text-xs text-muted-foreground">Activa, desactiva o reordena los widgets que quieres ver.</p>
              <div className="space-y-2">
                {widgets.map((w) => (
                  <div key={w.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-accent/30">
                    <button onClick={() => toggleWidget(w.id)} className="cursor-pointer">
                      {w.enabled ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    <span className={`text-sm flex-1 ${w.enabled ? "text-foreground" : "text-muted-foreground"}`}>{w.label}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveWidget(w.id, "up")} className="text-muted-foreground hover:text-foreground cursor-pointer">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => moveWidget(w.id, "down")} className="text-muted-foreground hover:text-foreground cursor-pointer">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {widgets.filter(w => w.enabled).map((w) => (
        <motion.div key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {renderWidget(w.type)}
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedCard && (
          <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
