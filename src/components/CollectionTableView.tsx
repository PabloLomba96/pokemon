import { useRef } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Heart } from "lucide-react";
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
import { useVirtualizer } from "@tanstack/react-virtual";
import { Checkbox } from "./ui/checkbox";

const regionBadge: Record<string, { label: string; className: string }> = {
  western: { label: "W", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  japanese: { label: "JP", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  korean: { label: "KR", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  chinese: { label: "CN", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
};

interface CollectionTableViewProps {
  cards: PokemonCard[];
  onSelectCard: (card: PokemonCard) => void;
  onEditCard?: (card: PokemonCard) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (cardId: string) => void;
  onToggleSelectAll?: () => void;
}

export function CollectionTableView({ cards, onSelectCard, onEditCard, selectedIds, onToggleSelect, onToggleSelectAll }: CollectionTableViewProps) {
  const { preferences, toggleFavorite, removeCard } = useAppStore();
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: cards.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 20,
  });

  const allSelected = selectedIds && cards.length > 0 && cards.every((c) => selectedIds.has(c.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="gradient-card rounded-xl overflow-hidden -mx-2 md:mx-0"
    >
      <div ref={parentRef} className="overflow-auto max-h-[75vh]">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {onToggleSelect && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={() => onToggleSelectAll?.()}
                  />
                </TableHead>
              )}
              <TableHead className="text-muted-foreground">Carta</TableHead>
              <TableHead className="text-muted-foreground">Región</TableHead>
              <TableHead className="text-muted-foreground">Estado</TableHead>
              <TableHead className="text-muted-foreground">Graduación</TableHead>
              <TableHead className="text-muted-foreground">Acabado</TableHead>
              <TableHead className="text-muted-foreground text-right whitespace-nowrap">Valor Actual</TableHead>
              <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const card = cards[virtualRow.index];
              const rb = regionBadge[card.region];
              const isSelected = selectedIds?.has(card.id);

              return (
                <TableRow
                  key={card.id}
                  onClick={() => onSelectCard(card)}
                  className={`border-border cursor-pointer hover:bg-accent/30 transition-colors ${isSelected ? "bg-primary/10" : ""}`}
                >
                  {onToggleSelect && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelect(card.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={card.image} alt={card.name} className="w-8 h-11 object-contain rounded" loading="lazy" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-foreground">{card.name}</p>
                          {card.isFavorite && <Heart className="w-3 h-3 fill-red-500 text-red-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{card.set} · {card.number}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{getFlagForLanguage(card.specificLanguage ?? card.language)}</span>
                      {rb && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${rb.className}`}>
                          {rb.label}
                        </span>
                      )}
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
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleFavorite(card.id)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Heart className={`w-3.5 h-3.5 ${card.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                      </button>
                      {onEditCard && (
                        <button
                          onClick={() => onEditCard(card)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => removeCard(card.id)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-price-down hover:bg-price-down/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
