import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Heart, Pencil } from "lucide-react";
import type { PokemonCard } from "../types/cards";
import { getFlagForLanguage } from "../constants/cards";
import { useAppStore } from "../store/useAppStore";
import { formatPrice } from "../lib/utils";
import { Badge } from "./ui/badge";

interface CardGridProps {
  cards: PokemonCard[];
  onSelectCard: (card: PokemonCard) => void;
  onEditCard?: (card: PokemonCard) => void;
  onDeleteCard?: (card: PokemonCard) => void;
  showEditButton?: boolean;
  collectionIds?: Set<string>;
}

const regionBadge: Record<string, { label: string; className: string }> = {
  western: { label: "W", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  japanese: { label: "JP", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  korean: { label: "KR", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  chinese: { label: "CN", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
};

export function CardGrid({ cards, onSelectCard, onEditCard, onDeleteCard, showEditButton, collectionIds }: CardGridProps) {
  const { preferences, toggleFavorite } = useAppStore();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {cards.map((card, i) => {
        const rb = regionBadge[card.region];
        const inCollection = collectionIds?.has(card.id);

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.5) }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => onSelectCard(card)}
            className="gradient-card rounded-xl p-3 cursor-pointer group relative"
          >
            {/* Action buttons */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {showEditButton && onEditCard && (
                <button
                  onClick={(e) => { e.stopPropagation(); onEditCard(card); }}
                  className="p-1.5 rounded-md bg-primary/80 text-primary-foreground text-[10px] cursor-pointer active:scale-95"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              )}
              {showEditButton && (
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(card.id); }}
                  className="p-1.5 rounded-md bg-background/80 cursor-pointer active:scale-95"
                >
                  <Heart className={`w-3 h-3 ${card.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                </button>
              )}
            </div>

            {/* Duplicate indicator */}
            {inCollection && (
              <div className="absolute top-2 left-2 z-10">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neon-emerald/20 text-neon-emerald border border-neon-emerald/30">
                  ✓ En colección
                </span>
              </div>
            )}

            <div className="relative overflow-hidden rounded-lg mb-3 aspect-[2.5/3.5] bg-accent">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 holo-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                <span className="bg-background/80 backdrop-blur-sm text-[10px] px-1.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                  {getFlagForLanguage(card.specificLanguage ?? card.language)}
                </span>
                {rb && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border backdrop-blur-sm ${rb.className}`}>
                    {rb.label}
                  </span>
                )}
              </div>
              {card.grading && (
                <div className="absolute top-1.5 right-1.5">
                  <span className="bg-neon-gold/90 text-background text-[9px] px-1.5 py-0.5 rounded-md font-bold backdrop-blur-sm shadow-lg">
                    {card.grading.company} {card.grading.grade}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-sm font-semibold text-foreground truncate">{card.name}</p>
              {card.isFavorite && <Heart className="w-3 h-3 fill-red-500 text-red-500 shrink-0" />}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{card.set}</span>
              <span className="opacity-40">•</span>
              <span>{card.number}</span>
            </div>
            <div className="mt-1 mb-2">
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                {card.rarity}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-neon-gold text-glow-gold">
                {card.estimatedPrice > 0 ? formatPrice(card.estimatedPrice, preferences.currency) : "N/D"}
              </span>
              {card.priceChange !== 0 && (
                <span className={`flex items-center gap-0.5 text-xs font-medium ${card.priceChange >= 0 ? "text-price-up" : "text-price-down"}`}>
                  {card.priceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {card.priceChange >= 0 ? "+" : ""}{card.priceChange}%
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
