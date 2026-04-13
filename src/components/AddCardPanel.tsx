import { useState } from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { conditions, allLanguages, finishes, gradingCompanies, gradingGrades } from "../data/mockData";
import type { GradingInfo } from "../data/mockData";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface AddCardPanelProps {
  cardName: string;
  onClose: () => void;
  onConfirmAdd?: () => void;
}

export function AddCardPanel({ cardName, onClose, onConfirmAdd }: AddCardPanelProps) {
  const [condition, setCondition] = useState("Near Mint");
  const [language, setLanguage] = useState("EN");
  const [finish, setFinish] = useState("Normal");
  const [saved, setSaved] = useState(false);
  const [isGraded, setIsGraded] = useState(false);
  const [gradingCompany, setGradingCompany] = useState<GradingInfo["company"]>("PSA");
  const [gradingGrade, setGradingGrade] = useState<number>(10);

  const handleSave = () => {
    setSaved(true);
    onConfirmAdd?.();
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
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer active:scale-95 transition-transform">
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer active:scale-95 ${
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
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer active:scale-95 ${
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

          {/* Grading toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                ¿Carta Graduada?
              </label>
              <Switch checked={isGraded} onCheckedChange={setIsGraded} />
            </div>

            {isGraded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Empresa</label>
                  <Select value={gradingCompany} onValueChange={(v) => setGradingCompany(v as GradingInfo["company"])}>
                    <SelectTrigger className="bg-accent border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gradingCompanies.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Nota (Grade)</label>
                  <Select value={gradingGrade.toString()} onValueChange={(v) => setGradingGrade(parseFloat(v))}>
                    <SelectTrigger className="bg-accent border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gradingGrades.map((g) => (
                        <SelectItem key={g} value={g.toString()}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saved}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all cursor-pointer active:scale-95 ${
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
