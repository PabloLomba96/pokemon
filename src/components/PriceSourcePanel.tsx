import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Lock } from "lucide-react";

interface PriceSource {
  id: string;
  label: string;
  price: number | null;
  tooltip: string;
  locked?: boolean;
  defaultOn: boolean;
}

interface PriceSourcePanelProps {
  tcgPrice: number;
  cardmarketPrice: number;
  ebayPrice: number | null;
  onPriceChange: (newPrice: number) => void;
}

export function PriceSourcePanel({ tcgPrice, cardmarketPrice, ebayPrice, onPriceChange }: PriceSourcePanelProps) {
  const sources: PriceSource[] = [
    { id: "tcg", label: "Pokémon TCG API", price: tcgPrice, tooltip: "Datos proporcionados por Pokémon TCG API. Actualizado hace 2h", defaultOn: true },
    { id: "cardmarket", label: "Cardmarket", price: cardmarketPrice, tooltip: "Datos proporcionados por Cardmarket (Europa). Actualizado hace 1h", defaultOn: true },
    { id: "ebay", label: "eBay (Vendidos)", price: ebayPrice, tooltip: "Datos de últimas ventas en eBay. Actualizado hace 4h", defaultOn: false },
    { id: "internal", label: "Mercado Interno", price: null, tooltip: "Próximamente — Datos del marketplace interno de PokéVault", locked: true, defaultOn: false },
  ];

  const [active, setActive] = useState<Record<string, boolean>>(
    Object.fromEntries(sources.map((s) => [s.id, s.defaultOn]))
  );

  const toggleSource = (id: string) => {
    const src = sources.find((s) => s.id === id);
    if (src?.locked) return;
    const next = { ...active, [id]: !active[id] };
    setActive(next);

    const activeSources = sources.filter((s) => next[s.id] && s.price !== null);
    if (activeSources.length > 0) {
      const avg = activeSources.reduce((sum, s) => sum + (s.price ?? 0), 0) / activeSources.length;
      onPriceChange(Math.round(avg));
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Fuentes de Precio
      </p>
      {sources.map((src) => (
        <div
          key={src.id}
          className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
            src.locked
              ? "border-border/50 opacity-50"
              : active[src.id]
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-surface"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleSource(src.id)}
              disabled={src.locked}
              className={`w-10 h-5 rounded-full relative transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed ${
                src.locked ? "bg-accent" : active[src.id] ? "bg-primary" : "bg-accent"
              }`}
            >
              <motion.div
                animate={{ x: active[src.id] && !src.locked ? 20 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-0.5 w-4 h-4 rounded-full bg-foreground"
              />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-foreground">
                  {src.label}
                </span>
                {src.locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                <div className="relative group">
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block z-50 w-52 p-2 rounded-lg bg-popover border border-border text-xs text-popover-foreground shadow-lg">
                    {src.tooltip}
                  </div>
                </div>
              </div>
              {src.locked && (
                <span className="text-[10px] text-neon-gold font-medium">Próximamente</span>
              )}
            </div>
          </div>
          <AnimatePresence mode="wait">
            {src.price !== null && !src.locked && (
              <motion.span
                key={active[src.id] ? "on" : "off"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: active[src.id] ? 1 : 0.3, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-sm font-semibold text-neon-gold"
              >
                €{src.price.toLocaleString()}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
