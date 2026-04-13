import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  accentClass?: string;
  glowClass?: string;
}

export function MetricCard({ title, value, change, icon: Icon, accentClass = "text-primary", glowClass = "glow-purple" }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`gradient-card rounded-xl p-5 ${glowClass} hover:scale-[1.02] transition-transform`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        <div className={`w-9 h-9 rounded-lg bg-accent flex items-center justify-center ${accentClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className={`text-2xl font-bold ${accentClass}`}>{value}</p>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${change >= 0 ? "text-price-up" : "text-price-down"}`}>
          {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{change >= 0 ? "+" : ""}{change}% este mes</span>
        </div>
      )}
    </motion.div>
  );
}
