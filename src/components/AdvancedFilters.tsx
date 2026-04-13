import { useState } from "react";
import { motion } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";

const eras = ["Classic (Base-Neo)", "e-Series", "EX / Diamond & Pearl", "HeartGold & SoulSilver", "Black & White", "XY", "Sun & Moon", "Sword & Shield", "Scarlet & Violet"] as const;
const sets = ["Base Set", "Jungle", "Fossil", "Neo Genesis", "Neo Revelation", "Evolving Skies", "Brilliant Stars", "VMAX Climax", "VSTAR Universe", "151", "Scarlet & Violet"] as const;
const rarities = ["Common", "Uncommon", "Rare", "Holo Rare", "Ultra Rare", "Secret Rare", "Illustration Rare", "Special Art Rare", "Character Super Rare", "Art Rare", "Full Art", "Rainbow Rare", "Gold"] as const;

interface AdvancedFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEras: string[];
  selectedSets: string[];
  selectedRarities: string[];
  onErasChange: (eras: string[]) => void;
  onSetsChange: (sets: string[]) => void;
  onRaritiesChange: (rarities: string[]) => void;
}

export function AdvancedFilters({
  open, onOpenChange,
  selectedEras, selectedSets, selectedRarities,
  onErasChange, onSetsChange, onRaritiesChange,
}: AdvancedFiltersProps) {

  const toggleItem = (list: string[], item: string, setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const activeCount = selectedEras.length + selectedSets.length + selectedRarities.length;

  const clearAll = () => {
    onErasChange([]);
    onSetsChange([]);
    onRaritiesChange([]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-card border-border overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-foreground flex items-center justify-between">
            Filtros Avanzados
            {activeCount > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer font-normal">
                <RotateCcw className="w-3 h-3" />
                Limpiar ({activeCount})
              </button>
            )}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Filtra por era, set y rareza para encontrar exactamente lo que buscas
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pt-2">
          {/* Eras */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Era / Bloque
            </label>
            <div className="flex flex-wrap gap-1.5">
              {eras.map((era) => (
                <button
                  key={era}
                  onClick={() => toggleItem(selectedEras, era, onErasChange)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedEras.includes(era)
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-accent/30 text-muted-foreground border border-border hover:border-primary/20"
                  }`}
                >
                  {era}
                </button>
              ))}
            </div>
          </div>

          {/* Sets */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Set / Colección
            </label>
            <div className="flex flex-wrap gap-1.5">
              {sets.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleItem(selectedSets, s, onSetsChange)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedSets.includes(s)
                      ? "bg-neon-emerald/20 text-neon-emerald border border-neon-emerald/40"
                      : "bg-accent/30 text-muted-foreground border border-border hover:border-neon-emerald/20"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Rarities */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Rareza
            </label>
            <div className="flex flex-wrap gap-1.5">
              {rarities.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleItem(selectedRarities, r, onRaritiesChange)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedRarities.includes(r)
                      ? "bg-neon-gold/20 text-neon-gold border border-neon-gold/40"
                      : "bg-accent/30 text-muted-foreground border border-border hover:border-neon-gold/20"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
