import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Plus, Globe } from "lucide-react";
import type { PokemonCard } from "../types/cards";
import { regions, getFlagForLanguage } from "../constants/cards";
import { PriceSourcePanel } from "./PriceSourcePanel";
import { PriceHistoryChart } from "./PriceHistoryChart";
import { useAppStore } from "../store/useAppStore";

interface CardDetailProps {
  card: PokemonCard;
  onClose: () => void;
  onAddToCollection?: () => void;
}

export function CardDetail({ card, onClose, onAddToCollection }: CardDetailProps) {
  const [currentPrice, setCurrentPrice] = useState(card.estimatedPrice);
  const imgRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const { preferences } = useAppStore();
  const sym = preferences.currencySymbol;

  const regionInfo = regions.find(r => r.id === card.region);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    setRotation({ x, y });
  };

  const handleMouseLeave = () => setRotation({ x: 0, y: 0 });

  const formatPrice = (cents: number) => {
    const val = (cents / 100).toFixed(2);
    return `${sym}${val}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="gradient-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{getFlagForLanguage(card.language)}</span>
              <h2 className="text-2xl font-bold text-foreground">{card.name}</h2>
              <span className="text-sm px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium">
                {regionInfo?.flag} {regionInfo?.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{card.set} — {card.number} — {card.rarity}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card image */}
          <div
            ref={imgRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="flex items-center justify-center"
            style={{ perspective: "1000px" }}
          >
            <motion.div
              animate={{ rotateX: rotation.x, rotateY: rotation.y }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative rounded-xl overflow-hidden shadow-2xl"
            >
              <img src={card.image} alt={card.name} className="w-full max-w-xs object-contain" />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(${135 + rotation.y * 3}deg, 
                    oklch(0.65 0.25 300 / 0.15) 0%, 
                    oklch(0.7 0.2 160 / 0.1) 25%, 
                    oklch(0.8 0.15 85 / 0.15) 50%, 
                    oklch(0.65 0.25 300 / 0.1) 75%, 
                    transparent 100%)`,
                }}
              />
            </motion.div>
          </div>

          {/* Details */}
          <div className="space-y-5">
            {/* Price */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Precio Estimado</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPrice}
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="text-4xl font-bold text-neon-gold text-glow-gold"
                >
                  {currentPrice > 0 ? formatPrice(currentPrice) : "No disponible"}
                </motion.p>
              </AnimatePresence>
              {card.priceChange !== 0 && (
                <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${card.priceChange >= 0 ? "text-price-up" : "text-price-down"}`}>
                  {card.priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {card.priceChange >= 0 ? "+" : ""}{card.priceChange}% (30d)
                </div>
              )}
            </div>

            {/* Info chips */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Rareza", value: card.rarity },
                { label: "Estado", value: card.condition },
                { label: "Acabado", value: card.finish },
                { label: "Set", value: card.setCode },
                { label: "Número", value: card.number },
                { label: "Región", value: `${regionInfo?.flag ?? ''} ${regionInfo?.label ?? card.region}` },
              ].map((item) => (
                <div key={item.label} className="bg-accent/50 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Price history chart */}
            <div className="bg-accent/20 rounded-xl p-4 border border-border/50">
              <PriceHistoryChart basePrice={currentPrice} priceChange={card.priceChange} />
            </div>

            {/* Price sources */}
            <PriceSourcePanel
              tcgPrice={card.prices.tcgApi}
              cardmarketPrice={card.prices.cardmarket}
              ebayPrice={card.prices.ebay}
              onPriceChange={setCurrentPrice}
            />

            {/* Add button */}
            <button
              onClick={onAddToCollection}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors glow-purple cursor-pointer active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Añadir a Colección
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
