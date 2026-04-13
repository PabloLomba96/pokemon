import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { PokemonCard } from "../data/mockData";
import { getFlagForLanguage, regions } from "../data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface CollectionTableViewProps {
  cards: PokemonCard[];
  onSelectCard: (card: PokemonCard) => void;
}

export function CollectionTableView({ cards, onSelectCard }: CollectionTableViewProps) {
  const formatNum = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="gradient-card rounded-xl overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Carta</TableHead>
            <TableHead className="text-muted-foreground">Región / Idioma</TableHead>
            <TableHead className="text-muted-foreground">Estado</TableHead>
            <TableHead className="text-muted-foreground">Acabado</TableHead>
            <TableHead className="text-muted-foreground text-right">Valor Actual</TableHead>
            <TableHead className="text-muted-foreground text-right">Ganancia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.map((card, i) => {
            const regionInfo = regions.find((r) => r.id === card.region);
            // Simulate a purchase cost as ~85-95% of current price
            const purchaseCost = Math.round(card.estimatedPrice * (0.85 + (i % 10) * 0.01));
            const profit = card.estimatedPrice - purchaseCost;
            const profitPct = ((profit / purchaseCost) * 100).toFixed(1);
            const isPositive = profit >= 0;

            return (
              <TableRow
                key={card.id}
                onClick={() => onSelectCard(card)}
                className="border-border cursor-pointer hover:bg-accent/30 transition-colors"
              >
                {/* Card */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-8 h-11 object-contain rounded"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{card.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {card.set} · {card.number}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Region / Language */}
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{getFlagForLanguage(card.language)}</span>
                    <span className="text-xs text-muted-foreground">{regionInfo?.flag}</span>
                    <span className="text-xs text-muted-foreground">{regionInfo?.label}</span>
                  </div>
                </TableCell>

                {/* Condition */}
                <TableCell>
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-accent/50 text-foreground">
                    {card.condition}
                  </span>
                </TableCell>

                {/* Finish */}
                <TableCell>
                  <span className="text-xs text-muted-foreground">{card.finish}</span>
                </TableCell>

                {/* Value */}
                <TableCell className="text-right">
                  <span className="text-sm font-bold text-neon-gold">€{formatNum(card.estimatedPrice)}</span>
                </TableCell>

                {/* Profit */}
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end gap-1 text-xs font-semibold ${isPositive ? "text-price-up" : "text-price-down"}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? "+" : ""}{profitPct}%
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    €{formatNum(purchaseCost)} → €{formatNum(card.estimatedPrice)}
                  </p>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </motion.div>
  );
}
