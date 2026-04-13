import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

interface AuthPageProps {
  onLogin: () => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — holographic art */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background">
        {/* Animated gradient mesh */}
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
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(oklch(0.65 0.25 300 / 0.3) 1px, transparent 1px),
                linear-gradient(90deg, oklch(0.65 0.25 300 / 0.3) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-8 glow-purple">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Poké<span className="text-primary text-glow-purple">Vault</span>
            </h1>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
              El centro de mandos definitivo para coleccionistas europeos de Trading Card Games
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {["Precios en tiempo real", "4 regiones TCG", "Dashboard personalizable", "Inventario experto"].map((f) => (
                <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent/60 text-muted-foreground border border-border">
                  {f}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Floating card mockups */}
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
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
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

          {/* Social login */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border bg-accent/30 text-foreground font-medium hover:bg-accent/60 transition-colors cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border bg-accent/30 text-foreground font-medium hover:bg-accent/60 transition-colors cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              Continuar con Discord
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">o con email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
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
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Email
              </label>
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
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Contraseña
              </label>
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

            {mode === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-primary hover:underline cursor-pointer">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all glow-purple cursor-pointer"
            >
              {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

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
