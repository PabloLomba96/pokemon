import { useState } from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { conditions, allLanguages, finishes } from "../data/mockData";

interface AddCardPanelProps {
  cardName: string;
  onClose: () => void;
}

export function AddCardPanel({ cardName, onClose }: AddCardPanelProps) {
  const [condition, setCondition] = useState("Near Mint");
  const [language, setLanguage] = useState("EN");
  const [finish, setFinish] = useState("Normal");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-card border-l border-border overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Añadir Carta</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground">
            Añadiendo <span className="text-primary font-semibold">{cardName}</span> a tu colección
          </p>

          {/* Condition */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Estado
            </label>
            <div className="grid grid-cols-2 gap-2">
              {conditions.map((c) => (
                <button
                  key={c}
                  onClick={() => setCondition(c)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    condition === c
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-accent text-muted-foreground border border-border hover:border-primary/20"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Idioma
            </label>
            <div className="grid grid-cols-3 gap-2">
              {allLanguages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    language === l.code
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-accent text-muted-foreground border border-border hover:border-primary/20"
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Finish */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Acabado
            </label>
            <div className="grid grid-cols-2 gap-2">
              {finishes.map((f) => (
                <button
                  key={f}
                  onClick={() => setFinish(f)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    finish === f
                      ? "bg-neon-gold/20 text-neon-gold border border-neon-gold/40"
                      : "bg-accent text-muted-foreground border border-border hover:border-neon-gold/20"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saved}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all cursor-pointer ${
              saved
                ? "bg-price-up text-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90 glow-purple"
            }`}
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                ¡Añadida!
              </>
            ) : (
              "Confirmar y Añadir"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
