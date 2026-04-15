import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, CreditCard, Gauge, Crown, Save, Check } from "lucide-react";
import { formatPrice } from "../lib/utils";
import { useAppStore } from "../store/useAppStore";
import type { CurrencyCode, PriceEngine } from "../store/useAppStore";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "USD", label: "US Dollar", symbol: "$" },
];

const priceEngines: { id: PriceEngine; label: string; description: string }[] = [
  { id: "cardmarket", label: "Cardmarket Trend", description: "Precio tendencia del mercado europeo (recomendado)" },
  { id: "tcgApi", label: "TCGPlayer Market", description: "Precio de mercado de TCGPlayer (EE.UU.)" },
  { id: "ebay", label: "eBay Last Sold", description: "Último precio de venta en eBay" },
];

export function ProfilePage() {
  const { preferences, setCurrency, setPriceEngine, setDisplayName, collection, userId } = useAppStore();
  const [name, setName] = useState(preferences.displayName);
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  const totalValue = collection.reduce((sum, c) => sum + c.estimatedPrice, 0);

  useEffect(() => {
    if (!userId) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
    supabase.from("profiles").select("*").eq("user_id", userId).single().then(({ data }) => {
      if (data) {
        if (data.username) setName(data.username);
        if (data.preferred_currency) setCurrency(data.preferred_currency as CurrencyCode);
        if (data.default_price_source) setPriceEngine(data.default_price_source as PriceEngine);
      }
    });
  }, [userId]);

  const handleSave = async () => {
    setDisplayName(name);
    if (userId) {
      await supabase.from("profiles").update({
        username: name,
        preferred_currency: preferences.currency,
        default_price_source: preferences.priceEngine,
      }).eq("user_id", userId);
    }
    setSaved(true);
    toast.success("Preferencias guardadas en tu cuenta");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCurrencyChange = async (code: CurrencyCode) => {
    setCurrency(code);
    if (userId) {
      await supabase.from("profiles").update({ preferred_currency: code }).eq("user_id", userId);
    }
    toast(`Moneda cambiada a ${code === "EUR" ? "Euro" : "US Dollar"}`);
  };

  const handleEngineChange = async (engine: PriceEngine) => {
    setPriceEngine(engine);
    if (userId) {
      await supabase.from("profiles").update({ default_price_source: engine }).eq("user_id", userId);
    }
    toast(`Motor de precio: ${priceEngines.find(e => e.id === engine)?.label}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Mi Perfil</h1>
        <p className="text-sm text-muted-foreground">Configura tu experiencia en DexVault</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="gradient-card rounded-xl p-6 space-y-5 md:col-span-2"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center glow-purple">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-bold text-foreground bg-transparent border-b border-transparent focus:border-primary/50 outline-none transition-colors"
              />
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Valor Total</p>
              <p className="text-lg font-bold text-neon-gold text-glow-gold">{formatPrice(totalValue, preferences.currency)}</p>
              <p className="text-xs text-muted-foreground">{collection.length} cartas</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="gradient-card rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-neon-gold" />
            <h3 className="text-sm font-semibold text-foreground">Moneda Base</h3>
          </div>
          <div className="space-y-2">
            {currencies.map((c) => (
              <button key={c.code} onClick={() => handleCurrencyChange(c.code)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all cursor-pointer active:scale-95 ${
                  preferences.currency === c.code
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-accent/20 text-muted-foreground hover:border-primary/20"
                }`}
              >
                <span className="text-sm font-medium">{c.label}</span>
                <span className="text-lg font-bold">{c.symbol}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="gradient-card rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-neon-emerald" />
            <h3 className="text-sm font-semibold text-foreground">Motor de Precio</h3>
          </div>
          <div className="space-y-2">
            {priceEngines.map((e) => (
              <button key={e.id} onClick={() => handleEngineChange(e.id)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all cursor-pointer active:scale-95 ${
                  preferences.priceEngine === e.id
                    ? "border-neon-emerald/40 bg-neon-emerald/10"
                    : "border-border bg-accent/20 hover:border-neon-emerald/20"
                }`}
              >
                <p className={`text-sm font-medium ${preferences.priceEngine === e.id ? "text-neon-emerald" : "text-foreground"}`}>{e.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{e.description}</p>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="gradient-card rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-neon-gold" />
            <h3 className="text-sm font-semibold text-foreground">Nivel de Cuenta</h3>
          </div>
          <div className="rounded-xl border border-border bg-accent/20 p-5 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mx-auto">
              <span className="text-2xl">🆓</span>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Plan Free</p>
              <p className="text-xs text-muted-foreground">Gestiona hasta 100 cartas con precios básicos</p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 text-left px-4">
              <li>✓ Colección hasta 100 cartas</li>
              <li>✓ 2 fuentes de precio</li>
              <li>✗ Alertas de precio</li>
              <li>✗ Exportación CSV/PDF</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-gold/20 to-primary/20 border border-neon-gold/30 text-neon-gold font-semibold text-sm cursor-not-allowed opacity-80">
              ⭐ Upgrade to Pro — Próximamente
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="gradient-card rounded-xl p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">Guardar cambios</p>
            <p className="text-xs text-muted-foreground">Nombre y preferencias se guardan en tu cuenta</p>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer active:scale-95 ${
              saved ? "bg-price-up text-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90 glow-purple"
            }`}
          >
            {saved ? <><Check className="w-4 h-4" /> Guardado</> : <><Save className="w-4 h-4" /> Guardar</>}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
