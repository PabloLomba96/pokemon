import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAppStore } from "../store/useAppStore";

export function PortfolioChart() {
  const { preferences, collection } = useAppStore();
  const sym = preferences.currencySymbol;

  // Generate portfolio history from collection data
  const totalValue = collection.reduce((sum, c) => sum + c.estimatedPrice, 0);
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
  const portfolioHistory = months.map((month, i) => {
    // Simulate growth curve ending at current value
    const factor = 0.7 + (i / (months.length - 1)) * 0.3;
    const noise = 1 + (Math.sin(i * 2.5) * 0.05);
    return { month, value: Math.round(totalValue * factor * noise) };
  });

  if (collection.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="gradient-card rounded-xl p-6"
    >
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Evolución del Portafolio — 6 Meses
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={portfolioHistory}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.65 0.25 300)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="oklch(0.65 0.25 300)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260)" />
            <XAxis dataKey="month" stroke="oklch(0.5 0.02 260)" fontSize={12} />
            <YAxis stroke="oklch(0.5 0.02 260)" fontSize={12} tickFormatter={(v) => `${sym}${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.17 0.02 260)",
                border: "1px solid oklch(0.28 0.03 260)",
                borderRadius: "8px",
                color: "oklch(0.93 0.01 260)",
              }}
              formatter={(value) => [`${sym}${Number(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, "Valor"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="oklch(0.65 0.25 300)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
