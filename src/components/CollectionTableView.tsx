import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Pencil } from "lucide-react";
import type { PokemonCard } from "../types/cards";
import { getFlagForLanguage, regions } from "../constants/cards";
import { useAppStore } from "../store/useAppStore";
import { formatPrice } from "../lib/utils";
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
  onEditCard?: (card: PokemonCard) => void;
}

export function CollectionTableView({ cards, onSelectCard, onEditCard }: CollectionTableViewProps) {
  const { preferences } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="gradient-card rounded-xl overflow-x-auto -mx-2 md:mx-0"
    >
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Carta</TableHead>
            <TableHead className="text-muted-foreground">Región / Idioma</TableHead>
            <TableHead className="text-muted-foreground">Estado</TableHead>
            <TableHead className="text-muted-foreground">Graduación</TableHead>
            <TableHead className="text-muted-foreground">Acabado</TableHead>
            <TableHead className="text-muted-foreground text-right whitespace-nowrap">Valor Actual</TableHead>
            <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.map((card) => {
            const regionInfo = regions.find((r) => r.id === card.region);

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
                    <span className="text-sm">{getFlagForLanguage(card.specificLanguage ?? card.language)}</span>
                    <span className="text-xs text-muted-foreground">{regionInfo?.flag}</span>
                    <span className="text-xs text-muted-foreground">{regionInfo?.label}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-accent/50 text-foreground whitespace-nowrap">
                    {card.condition}
                  </span>
                </TableCell>

                <TableCell>
                  {card.grading ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md bg-neon-gold/20 text-neon-gold border border-neon-gold/30 whitespace-nowrap">
                      {card.grading.company} {card.grading.grade}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{card.finish}</span>
                </TableCell>

                <TableCell className="text-right">
                  <span className="text-sm font-bold text-neon-gold whitespace-nowrap">
                    {card.estimatedPrice > 0 ? formatPrice(card.estimatedPrice, preferences.currency) : "N/D"}
                  </span>
                  {card.manualPrice && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">manual</p>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  {onEditCard && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onEditCard(card); }}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer active:scale-95"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </motion.div>
  );
}
