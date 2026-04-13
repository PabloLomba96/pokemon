import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { PokemonCard } from "../data/mockData";
import { getFlagForLanguage, regions } from "../data/mockData";

interface CardGridProps {
  cards: PokemonCard[];
  onSelectCard: (card: PokemonCard) => void;
}

export function CardGrid({ cards, onSelectCard }: CardGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {cards.map((card, i) => {
        const regionInfo = regions.find(r => r.id === card.region);
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
                <span className="bg-background/80 backdrop-blur-sm text-[10px] px-1.5 py-0.5 rounded-md font-semibold">
                  {getFlagForLanguage(card.language)} {regionInfo?.flag}
                </span>
              </div>
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
                €{card.estimatedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
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
