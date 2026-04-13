import { motion } from "framer-motion";
import { Vault, Sparkles } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({
  title = "Tu bóveda está vacía",
  message = "Empieza tu legado TCG. Explora el catálogo y añade tus primeras cartas.",
  ctaLabel = "Explorar Catálogo",
  onCta,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4, type: "spring", stiffness: 200 }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Vault className="w-12 h-12 text-primary" />
        </div>
        <motion.div
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-6 h-6 text-neon-gold" />
        </motion.div>
      </motion.div>

      <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">{message}</p>

      {onCta && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onCta}
          className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-purple hover:bg-primary/90 transition-colors cursor-pointer"
        >
          {ctaLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
