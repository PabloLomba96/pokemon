import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, UserX } from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

interface AuthPageProps {
  onLogin: () => void;
  onGuest: () => void;
}

export function AuthPage({ onLogin, onGuest }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Completa todos los campos");
      return;
    }
    setLoading(true);
    try {
      if (mode === "register") {
        if (!username.trim()) {
          toast.error("Introduce un nombre de usuario");
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: username },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("¡Cuenta creada! Revisa tu email para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin();
      }
    } catch (err: any) {
      const msg = err?.message?.includes("already registered")
        ? "Este email ya está registrado"
        : err?.message?.includes("Invalid login")
          ? "Email o contraseña incorrectos"
          : err?.message || "Error de autenticación";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — holographic art */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-neon-emerald/10 to-neon-gold/15" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
            style={{
              background: `conic-gradient(from 0deg, 
                oklch(0.65 0.25 300 / 0.08) 0%, 
                oklch(0.7 0.2 160 / 0.05) 25%, 
                oklch(0.8 0.15 85 / 0.08) 50%, 
                oklch(0.65 0.25 300 / 0.05) 75%, 
                oklch(0.7 0.2 160 / 0.08) 100%)`,
            }}
          />
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(oklch(0.65 0.25 300 / 0.3) 1px, transparent 1px),
                linear-gradient(90deg, oklch(0.65 0.25 300 / 0.3) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-8 glow-purple">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Poké<span className="text-primary text-glow-purple">Vault</span>
            </h1>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
              El centro de mandos definitivo para coleccionistas europeos de Trading Card Games
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {["Precios en tiempo real", "4 regiones TCG", "Dashboard personalizable", "Inventario experto"].map((f) => (
                <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent/60 text-muted-foreground border border-border">
                  {f}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-12 left-12 w-24 h-34 rounded-lg gradient-card opacity-40 rotate-[-12deg]"
          />
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-16 right-16 w-20 h-28 rounded-lg gradient-card opacity-30 rotate-[8deg]"
          />
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">PokéVault</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {mode === "login" ? "Bienvenido de vuelta" : "Crea tu cuenta"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login"
                ? "Accede a tu colección y sigue tus inversiones"
                : "Únete a la comunidad de coleccionistas TCG"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div key="username" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Nombre de usuario
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-accent/20 focus-within:border-primary/50 transition-colors">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="tu_nombre"
                      className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Email</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-accent/20 focus-within:border-primary/50 transition-colors">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Contraseña</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-accent/20 focus-within:border-primary/50 transition-colors">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all glow-purple cursor-pointer active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">o</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Guest access */}
          <button
            onClick={onGuest}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-border bg-accent/30 text-muted-foreground font-medium hover:bg-accent/60 hover:text-foreground transition-all cursor-pointer active:scale-95"
          >
            <UserX className="w-4 h-4" />
            Acceder como Invitado
          </button>
          <p className="text-[11px] text-muted-foreground text-center mt-2">
            Puedes explorar el catálogo, pero necesitarás una cuenta para guardar cartas.
          </p>

          {/* Toggle mode */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              {mode === "login" ? "Regístrate" : "Inicia Sesión"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
