import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, TrendingUp, TrendingDown, Plus } from "lucide-react";
import type { PokemonCard } from "../data/mockData";
import { PriceSourcePanel } from "./PriceSourcePanel";

interface CardDetailProps {
  card: PokemonCard;
  onClose: () => void;
  onAddToCollection: () => void;
}

export function CardDetail({ card, onClose, onAddToCollection }: CardDetailProps) {
  const [currentPrice, setCurrentPrice] = useState(card.estimatedPrice);
  const imgRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    setRotation({ x, y });
  };

  const handleMouseLeave = () => setRotation({ x: 0, y: 0 });

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
            <h2 className="text-2xl font-bold text-foreground">{card.name}</h2>
            <p className="text-sm text-muted-foreground">{card.set} — {card.number}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card image with holo effect */}
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
              <img
                src={card.image}
                alt={card.name}
                className="w-full max-w-xs object-contain"
              />
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

          {/* Details panel */}
          <div className="space-y-6">
            {/* Price */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Precio Estimado</p>
              <motion.p
                key={currentPrice}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-bold text-neon-gold text-glow-gold"
              >
                €{currentPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              </motion.p>
              <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${card.priceChange >= 0 ? "text-price-up" : "text-price-down"}`}>
                {card.priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {card.priceChange >= 0 ? "+" : ""}{card.priceChange}% (30d)
              </div>
            </div>

            {/* Info chips */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Rareza", value: card.rarity },
                { label: "Estado", value: card.condition },
                { label: "Idioma", value: card.language },
                { label: "Acabado", value: card.finish },
              ].map((item) => (
                <div key={item.label} className="bg-accent/50 rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors glow-purple cursor-pointer"
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
