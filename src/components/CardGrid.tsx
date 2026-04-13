import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { PokemonCard } from "../types/cards";
import { getFlagForLanguage, regions } from "../constants/cards";
import { useAppStore } from "../store/useAppStore";

interface CardGridProps {
  cards: PokemonCard[];
  onSelectCard: (card: PokemonCard) => void;
}

export function CardGrid({ cards, onSelectCard }: CardGridProps) {
  const { preferences } = useAppStore();
  const sym = preferences.currencySymbol;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {cards.map((card, i) => {
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => onSelectCard(card)}
            className="gradient-card rounded-xl p-3 cursor-pointer group"
          >
            <div className="relative overflow-hidden rounded-lg mb-3 aspect-[2.5/3.5] bg-accent">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 holo-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              {/* Region + language flag badge */}
              <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                <span className="bg-background/80 backdrop-blur-sm text-[10px] px-1.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                  {getFlagForLanguage(card.language)}
                  {card.region === "western" && <span>🌍</span>}
                </span>
              </div>
              {/* Grading badge */}
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
                {sym}{card.estimatedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              </span>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${card.priceChange >= 0 ? "text-price-up" : "text-price-down"}`}>
                {card.priceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {card.priceChange >= 0 ? "+" : ""}{card.priceChange}%
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
