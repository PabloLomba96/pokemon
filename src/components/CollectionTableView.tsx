import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { PokemonCard } from "../types/cards";
import { getFlagForLanguage, regions } from "../constants/cards";
import { useAppStore } from "../store/useAppStore";
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
  const { preferences } = useAppStore();
  const sym = preferences.currencySymbol;
  const formatNum = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="gradient-card rounded-xl overflow-x-auto"
    >
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Carta</TableHead>
            <TableHead className="text-muted-foreground">Región / Idioma</TableHead>
            <TableHead className="text-muted-foreground">Estado</TableHead>
            <TableHead className="text-muted-foreground">Graduación</TableHead>
            <TableHead className="text-muted-foreground">Acabado</TableHead>
            <TableHead className="text-muted-foreground text-right">Valor Actual</TableHead>
            <TableHead className="text-muted-foreground text-right">Ganancia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.map((card, i) => {
            const regionInfo = regions.find((r) => r.id === card.region);
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

                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{getFlagForLanguage(card.language)}</span>
                    <span className="text-xs text-muted-foreground">{regionInfo?.flag}</span>
                    <span className="text-xs text-muted-foreground">{regionInfo?.label}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-accent/50 text-foreground">
                    {card.condition}
                  </span>
                </TableCell>

                <TableCell>
                  {card.grading ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md bg-neon-gold/20 text-neon-gold border border-neon-gold/30">
                      {card.grading.company} {card.grading.grade}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell>
                  <span className="text-xs text-muted-foreground">{card.finish}</span>
                </TableCell>

                <TableCell className="text-right">
                  <span className="text-sm font-bold text-neon-gold">{sym}{formatNum(card.estimatedPrice)}</span>
                </TableCell>

                <TableCell className="text-right">
                  <div className={`flex items-center justify-end gap-1 text-xs font-semibold ${isPositive ? "text-price-up" : "text-price-down"}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? "+" : ""}{profitPct}%
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {sym}{formatNum(purchaseCost)} → {sym}{formatNum(card.estimatedPrice)}
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
