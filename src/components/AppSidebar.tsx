import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Compass,
  Library,
  Search,
  Store,
  ArrowLeftRight,
  Package,
  Shield,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  User,
  Settings,
  BarChart3,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";

const mainNav = [
  { icon: Compass, label: "Explorar", id: "explore" },
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Library, label: "Colección", id: "collection" },
  { icon: BarChart3, label: "Tracker de Sets", id: "set-tracker" },
  { icon: Search, label: "Buscador", id: "search" },
  { icon: Settings, label: "Perfil", id: "profile" },
];

const comingSoon = [
  { icon: Store, label: "Marketplace P2P", id: "marketplace" },
  { icon: Package, label: "Sobres y Cajas", id: "packs" },
  { icon: Shield, label: "Accesorios", id: "accessories" },
  { icon: ArrowLeftRight, label: "Mis Intercambios", id: "trades" },
];

interface AppSidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onLogout?: () => void;
}

export function AppSidebar({ activeView, onNavigate, onLogout }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { preferences } = useAppStore();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 flex flex-col border-r border-border bg-sidebar overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="font-bold text-lg text-foreground whitespace-nowrap"
            >Dex<span className="text-primary">Vault</span></motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {mainNav.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer ${
                isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-primary" : ""}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >{item.label}</motion.span>
                )}
              </AnimatePresence>
              {isActive && !collapsed && (
                <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}

        {/* Coming soon */}
        <div className="pt-6">
          <AnimatePresence>
            {!collapsed && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
              >Comunidad & Tienda</motion.p>
            )}
          </AnimatePresence>
          {comingSoon.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive ? "bg-primary/15 text-primary" : "text-muted-foreground/60 hover:bg-accent hover:text-muted-foreground"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 whitespace-nowrap"
                    >
                      <span className="text-sm">{item.label}</span>
                      <span className="flex items-center gap-1 text-[10px] bg-accent/50 px-1.5 py-0.5 rounded-full">
                        <Lock className="w-2.5 h-2.5" />Pronto
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User & Logout */}
      <div className="px-3 pb-2 space-y-1">
        <button
          onClick={() => onNavigate("profile")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{preferences.displayName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{preferences.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-price-down hover:bg-price-down/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >Cerrar Sesión</motion.span>
              )}
            </AnimatePresence>
          </button>
        )}

        <button onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
