import { motion } from "framer-motion";
import { Crown, TrendingUp, TrendingDown } from "lucide-react";
import type { PokemonCard } from "../data/mockData";
import { getFlagForLanguage } from "../data/mockData";

interface TopCardsWidgetProps {
  cards: PokemonCard[];
  onSelectCard: (card: PokemonCard) => void;
}

export function TopCardsWidget({ cards, onSelectCard }: TopCardsWidgetProps) {
  const top = [...cards].sort((a, b) => b.estimatedPrice - a.estimatedPrice).slice(0, 5);

  if (top.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-6">Sin cartas en tu colección aún.</p>;
  }

  return (
    <div className="space-y-2">
      {top.map((card, i) => (
        <motion.button
          key={card.id}
          whileHover={{ x: 4 }}
          onClick={() => onSelectCard(card)}
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-accent/30 hover:bg-accent/60 transition-colors cursor-pointer text-left"
        >
          <span className="text-sm font-bold text-muted-foreground w-5 text-center">
            {i === 0 ? <Crown className="w-4 h-4 text-neon-gold inline" /> : `#${i + 1}`}
          </span>
          <img src={card.image} alt={card.name} className="w-8 h-11 object-contain rounded" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{getFlagForLanguage(card.language)} {card.name}</p>
            <p className="text-xs text-muted-foreground">{card.set}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-neon-gold">€{card.estimatedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
            <span className={`text-[10px] font-medium ${card.priceChange >= 0 ? "text-price-up" : "text-price-down"}`}>
              {card.priceChange >= 0 ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
              {" "}{card.priceChange >= 0 ? "+" : ""}{card.priceChange}%
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
