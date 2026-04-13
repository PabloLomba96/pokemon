import { motion } from "framer-motion";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PokemonCard } from "../types/cards";
import { getFlagForLanguage } from "../constants/cards";

interface CardCarouselProps {
  cards: PokemonCard[];
  onSelectCard: (card: PokemonCard) => void;
}

export function CardCarousel({ cards, onSelectCard }: CardCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Añade cartas desde Explorar para verlas aquí.
      </div>
    );
  }

  return (
    <div className="relative group">
      <button onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      ><ChevronLeft className="w-4 h-4" /></button>
      <button onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      ><ChevronRight className="w-4 h-4" /></button>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-none px-1">
        {cards.map((card) => (
          <motion.div key={card.id} whileHover={{ scale: 1.05, y: -4 }}
            onClick={() => onSelectCard(card)}
            className="flex-shrink-0 w-40 gradient-card rounded-xl p-3 cursor-pointer"
          >
            <div className="aspect-[2.5/3.5] rounded-lg overflow-hidden bg-accent mb-2 relative">
              <img src={card.image} alt={card.name} className="w-full h-full object-contain" loading="lazy" />
              <div className="absolute inset-0 holo-effect opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <p className="text-xs font-semibold text-foreground truncate">{card.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{getFlagForLanguage(card.language)} {card.set}</p>
            <p className="text-xs font-bold text-neon-gold mt-1">
              €{card.estimatedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
