import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAppStore } from "../store/useAppStore";

interface PriceHistoryChartProps {
  basePrice: number;
  priceChange: number;
}

type TimeRange = "1S" | "1M" | "6M" | "1A";

function generatePriceHistory(basePrice: number, change: number, days: number) {
  const data: { date: string; price: number }[] = [];
  const startPrice = basePrice / (1 + change / 100);
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const progress = (days - i) / days;
    const noise = (Math.sin(i * 0.7) * 0.03 + Math.cos(i * 1.3) * 0.02) * basePrice;
    const trend = startPrice + (basePrice - startPrice) * progress;
    const price = Math.max(Math.round(trend + noise), 1);
    const label = days <= 14
      ? d.toLocaleDateString("es", { day: "2-digit", month: "short" })
      : days <= 60
        ? d.toLocaleDateString("es", { day: "2-digit", month: "short" })
        : d.toLocaleDateString("es", { month: "short", year: "2-digit" });
    data.push({ date: label, price });
  }
  return data;
}

const ranges: { key: TimeRange; label: string; days: number }[] = [
  { key: "1S", label: "1S", days: 7 },
  { key: "1M", label: "1M", days: 30 },
  { key: "6M", label: "6M", days: 180 },
  { key: "1A", label: "1A", days: 365 },
];

export function PriceHistoryChart({ basePrice, priceChange }: PriceHistoryChartProps) {
  const [range, setRange] = useState<TimeRange>("1M");
  const { preferences } = useAppStore();
  const sym = preferences.currencySymbol;

  const selectedRange = ranges.find((r) => r.key === range)!;
  const data = useMemo(
    () => generatePriceHistory(basePrice, priceChange, selectedRange.days),
    [basePrice, priceChange, selectedRange.days]
  );

  const isUp = priceChange >= 0;
  const color = isUp ? "oklch(0.72 0.19 160)" : "oklch(0.65 0.2 25)";

  const formatNum = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Historial de Precio
        </p>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                range === r.key
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "text-muted-foreground hover:text-foreground bg-accent/30 border border-transparent"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-44 md:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="oklch(0.5 0.02 260)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="oklch(0.5 0.02 260)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={50}
              tickFormatter={(v) => `${sym}${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.17 0.02 260)",
                border: "1px solid oklch(0.28 0.03 260)",
                borderRadius: "8px",
                color: "oklch(0.93 0.01 260)",
                fontSize: "12px",
              }}
              formatter={(value) => [`${sym}${formatNum(Number(value))}`, "Precio"]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill="url(#priceGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
