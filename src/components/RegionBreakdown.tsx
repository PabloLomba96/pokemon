import { regions } from "../constants/cards";
import type { PokemonCard } from "../types/cards";

interface RegionBreakdownProps {
  cards: PokemonCard[];
}

export function RegionBreakdown({ cards }: RegionBreakdownProps) {
  if (cards.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-6">Sin cartas en tu colección aún.</p>;
  }

  const total = cards.reduce((s, c) => s + c.estimatedPrice, 0);

  return (
    <div className="space-y-3">
      {regions.map((r) => {
        const regionCards = cards.filter((c) => c.region === r.id);
        const value = regionCards.reduce((s, c) => s + c.estimatedPrice, 0);
        const pct = total > 0 ? (value / total) * 100 : 0;
        return (
          <div key={r.id}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-foreground font-medium">{r.flag} {r.label}</span>
              <span className="text-muted-foreground">{regionCards.length} cartas · €{value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</span>
            </div>
            <div className="h-2 rounded-full bg-accent overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
