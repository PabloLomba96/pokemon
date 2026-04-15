import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, AlertCircle } from "lucide-react";
import type { PokemonCard } from "../types/cards";
import { useAppStore } from "../store/useAppStore";
import { formatPrice } from "../lib/utils";
import { Progress } from "./ui/progress";

interface SetTrackerProps {
  collection: PokemonCard[];
}

interface SetInfo {
  setName: string;
  setCode: string;
  ownedCards: PokemonCard[];
  ownedCount: number;
  /** We estimate total from the highest card number we see in the set */
  estimatedTotal: number;
  percentage: number;
  totalValue: number;
  missingCount: number;
}

export function SetTracker({ collection }: SetTrackerProps) {
  const { preferences } = useAppStore();

  const sets = useMemo(() => {
    const setMap = new Map<string, PokemonCard[]>();
    for (const card of collection) {
      const key = card.setCode || card.set;
      if (!setMap.has(key)) setMap.set(key, []);
      setMap.get(key)!.push(card);
    }

    const result: SetInfo[] = [];
    for (const [setCode, cards] of setMap) {
      // Estimate total cards from highest number in owned cards
      let maxNum = 0;
      for (const c of cards) {
        const num = parseInt(c.number, 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
      const estimatedTotal = Math.max(maxNum, cards.length);
      const uniqueNumbers = new Set(cards.map((c) => c.number));
      const ownedCount = uniqueNumbers.size;
      const percentage = estimatedTotal > 0 ? Math.round((ownedCount / estimatedTotal) * 100) : 0;
      const totalValue = cards.reduce((sum, c) => sum + c.estimatedPrice, 0);

      result.push({
        setName: cards[0].set,
        setCode,
        ownedCards: cards,
        ownedCount,
        estimatedTotal,
        percentage: Math.min(percentage, 100),
        totalValue,
        missingCount: Math.max(0, estimatedTotal - ownedCount),
      });
    }

    return result.sort((a, b) => b.percentage - a.percentage);
  }, [collection]);

  if (collection.length === 0) {
    return (
      <div className="p-6 text-center py-16">
        <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">Añade cartas a tu colección para ver el progreso por sets.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Tracker de Sets</h1>
        <p className="text-sm text-muted-foreground">Progreso de completado por set · {sets.length} sets en tu colección</p>
      </div>

      <div className="space-y-4">
        {sets.map((s, i) => (
          <motion.div
            key={s.setCode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.5) }}
            className="gradient-card rounded-xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">{s.setName}</h3>
                <p className="text-xs text-muted-foreground">{s.setCode}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-neon-gold">{formatPrice(s.totalValue, preferences.currency)}</p>
                <p className="text-xs text-muted-foreground">{s.ownedCount}/{s.estimatedTotal} cartas</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progreso</span>
                <span className={`font-bold ${s.percentage === 100 ? "text-neon-emerald" : s.percentage >= 75 ? "text-neon-gold" : "text-primary"}`}>
                  {s.percentage}%
                </span>
              </div>
              <Progress
                value={s.percentage}
                className={`h-2 ${s.percentage === 100 ? "[&>div]:bg-neon-emerald" : s.percentage >= 75 ? "[&>div]:bg-neon-gold" : ""}`}
              />
            </div>

            {s.percentage === 100 ? (
              <div className="flex items-center gap-2 text-xs text-neon-emerald">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="font-semibold">¡Set completado!</span>
              </div>
            ) : s.percentage >= 75 ? (
              <div className="rounded-lg bg-accent/30 border border-border p-3 space-y-1">
                <div className="flex items-center gap-2 text-xs text-neon-gold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="font-semibold">Pack Optimization</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Te faltan <span className="text-foreground font-semibold">{s.missingCount} cartas</span>. Estadísticamente te sale más rentable comprar las cartas sueltas que faltan que abrir otra caja.
                </p>
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
