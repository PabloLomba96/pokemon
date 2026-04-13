import { motion } from "framer-motion";
import { Rocket, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ComingSoonPageProps {
  title?: string;
  subtitle?: string;
}

export function ComingSoonPage({
  title = "Estamos forjando el mercado definitivo",
  subtitle = "Un marketplace P2P seguro, transparente y diseñado para coleccionistas europeos de TCG.",
}: ComingSoonPageProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success("¡Te has unido a la lista de espera!", {
        description: `Recibirás novedades en ${email}`,
      });
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.93 0.01 260) 1px, transparent 1px), linear-gradient(90deg, oklch(0.93 0.01 260) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-neon-gold/5" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-lg z-10"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8"
        >
          <Rocket className="w-10 h-10 text-primary" />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary via-neon-gold to-neon-emerald bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        <p className="text-muted-foreground mb-10">{subtitle}</p>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card/80">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors glow-purple cursor-pointer whitespace-nowrap"
          >
            Unirse
          </button>
        </form>

        <p className="text-[11px] text-muted-foreground/60 mt-4">
          Sin spam. Solo actualizaciones sobre el lanzamiento.
        </p>
      </motion.div>
    </div>
  );
}
