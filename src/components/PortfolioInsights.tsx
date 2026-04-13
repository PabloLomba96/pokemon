import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";
import type { PokemonCard } from "../data/mockData";
import { regions } from "../data/mockData";
import { useAppStore } from "../store/useAppStore";

interface PortfolioInsightsProps {
  cards: PokemonCard[];
}

const REGION_COLORS: Record<string, string> = {
  western: "hsl(var(--primary))",
  japanese: "#F59E0B",
  korean: "#10B981",
  chinese: "#EF4444",
};

export function PortfolioInsights({ cards }: PortfolioInsightsProps) {
  const { preferences } = useAppStore();
  const sym = preferences.currencySymbol;
  const formatNum = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const totalValue = cards.reduce((s, c) => s + c.estimatedPrice, 0);

  const regionData = regions
    .map((r) => {
      const value = cards.filter((c) => c.region === r.id).reduce((s, c) => s + c.estimatedPrice, 0);
      return { name: r.label, value, color: REGION_COLORS[r.id], flag: r.flag };
    })
    .filter((d) => d.value > 0);

  const topGainers = [...cards]
    .sort((a, b) => b.priceChange - a.priceChange)
    .slice(0, 3);

  if (cards.length === 0) return null;

  return (
    <div className="gradient-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Insights del Portafolio
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut chart */}
        <div>
          <p className="text-xs text-muted-foreground mb-3">Distribución por Región</p>
          <div className="relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {regionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${sym}${formatNum(value)}`, "Valor"]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{sym}{formatNum(totalValue)}</p>
                <p className="text-[10px] text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {regionData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-muted-foreground">{d.flag} {d.name}</span>
                <span className="font-semibold text-foreground">
                  {totalValue > 0 ? ((d.value / totalValue) * 100).toFixed(0) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top gainers */}
        <div>
          <p className="text-xs text-muted-foreground mb-3">Top Movimientos (Semana)</p>
          <div className="space-y-3">
            {topGainers.map((card, i) => (
              <div
                key={card.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/20 border border-border/50"
              >
                <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                <img src={card.image} alt={card.name} className="w-8 h-11 object-contain rounded" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{card.name}</p>
                  <p className="text-xs text-muted-foreground">{card.set}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-neon-gold">{sym}{formatNum(card.estimatedPrice)}</span>
                  <div className="flex items-center gap-0.5 justify-end">
                    <TrendingUp className="w-3 h-3 text-price-up" />
                    <span className="text-xs font-semibold text-price-up">+{card.priceChange}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
