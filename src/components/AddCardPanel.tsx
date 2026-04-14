import { useState } from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { conditions, gradingCompanies, gradingGrades, languagesByRegion } from "../constants/cards";
import type { PokemonCard, GradingInfo } from "../types/cards";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";

interface AddCardPanelProps {
  card: PokemonCard;
  onClose: () => void;
  onConfirmAdd: (card: PokemonCard) => void;
}

export function AddCardPanel({ card, onClose, onConfirmAdd }: AddCardPanelProps) {
  const [condition, setCondition] = useState("Near Mint");
  const [finish, setFinish] = useState(card.finish || "Normal");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isGraded, setIsGraded] = useState(false);
  const [gradingCompany, setGradingCompany] = useState<GradingInfo["company"]>("PSA");
  const [gradingGrade, setGradingGrade] = useState<number>(10);
  const [specificLanguage, setSpecificLanguage] = useState(card.language);
  const [manualPriceInput, setManualPriceInput] = useState("");

  const availableFinishes = getFinishesFromRarity(card.rarity);
  const availableLanguages = languagesByRegion[card.region] ?? [];

  const handleSave = async () => {
    setSaving(true);
    const manualCents = manualPriceInput.trim()
      ? Math.round(parseFloat(manualPriceInput.replace(",", ".")) * 100)
      : null;

    const cardToAdd: PokemonCard = {
      ...card,
      condition,
      finish,
      specificLanguage,
      manualPrice: manualCents,
      grading: isGraded ? { company: gradingCompany, grade: gradingGrade } : undefined,
    };
    try {
      await onConfirmAdd(cardToAdd);
      setSaved(true);
      setTimeout(onClose, 1200);
    } catch {
      setSaving(false);
    }
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Añadir Carta</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer active:scale-95 transition-transform">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <img src={card.image} alt={card.name} className="w-16 h-22 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-semibold text-foreground">{card.name}</p>
              <p className="text-xs text-muted-foreground">{card.set} — {card.number}</p>
              <p className="text-xs text-primary mt-0.5">{card.rarity}</p>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Estado</label>
            <div className="grid grid-cols-2 gap-2">
              {conditions.map((c) => (
                <button key={c} onClick={() => setCondition(c)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer active:scale-95 ${
                    condition === c
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-accent text-muted-foreground border border-border hover:border-primary/20"
                  }`}
                >{c}</button>
              ))}
            </div>
          </div>

          {/* Finish — derived from rarity */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Acabado</label>
            {availableFinishes.length <= 1 ? (
              <p className="text-sm text-muted-foreground px-3 py-2 rounded-lg bg-accent/30 border border-border">
                {availableFinishes[0] || "Normal"} <span className="text-xs opacity-60">(único disponible)</span>
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {availableFinishes.map((f) => (
                  <button key={f} onClick={() => setFinish(f)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer active:scale-95 ${
                      finish === f
                        ? "bg-neon-gold/20 text-neon-gold border border-neon-gold/40"
                        : "bg-accent text-muted-foreground border border-border hover:border-neon-gold/20"
                    }`}
                  >{f}</button>
                ))}
              </div>
            )}
          </div>

          {/* Language selector — dynamic by region */}
          {availableLanguages.length > 1 && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Idioma Específico</label>
              <Select value={specificLanguage} onValueChange={setSpecificLanguage}>
                <SelectTrigger className="bg-accent border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((l) => (
                    <SelectItem key={l.code} value={l.code}>{l.flag} {l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {availableLanguages.length <= 1 && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Idioma</label>
              <p className="text-sm text-muted-foreground px-3 py-2 rounded-lg bg-accent/30 border border-border">
                {availableLanguages[0]?.flag} {availableLanguages[0]?.label ?? card.language} <span className="text-xs opacity-60">(fijado por región)</span>
              </p>
            </div>
          )}

          {/* Manual price */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Precio de Compra / Valor Manual</label>
            <div className="flex items-center gap-2">
              <Input
                value={manualPriceInput}
                onChange={(e) => setManualPriceInput(e.target.value)}
                placeholder="0,00"
                className="bg-accent border-border"
              />
              <span className="text-sm text-muted-foreground">€</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Opcional. Si se introduce, se usará como valor del portafolio.</p>
          </div>

          {/* Grading */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">¿Carta Graduada?</label>
              <Switch checked={isGraded} onCheckedChange={setIsGraded} />
            </div>
            {isGraded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Empresa</label>
                  <Select value={gradingCompany} onValueChange={(v) => setGradingCompany(v as GradingInfo["company"])}>
                    <SelectTrigger className="bg-accent border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {gradingCompanies.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Nota (Grade)</label>
                  <Select value={gradingGrade.toString()} onValueChange={(v) => setGradingGrade(parseFloat(v))}>
                    <SelectTrigger className="bg-accent border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {gradingGrades.map((g) => (<SelectItem key={g} value={g.toString()}>{g}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saved || saving}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all cursor-pointer active:scale-95 ${
              saved
                ? "bg-price-up text-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90 glow-purple"
            } disabled:opacity-60`}
          >
            {saved ? (
              <><Check className="w-5 h-5" /> ¡Añadida!</>
            ) : saving ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              "Confirmar y Añadir"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function getFinishesFromRarity(rarity: string): string[] {
  const r = rarity.toLowerCase();
  if (r.includes("rainbow") || r.includes("secret")) return ["Rainbow Rare"];
  if (r.includes("full art") || r.includes("illustration")) return ["Full Art"];
  if (r.includes("alt") || r.includes("alternate")) return ["Alternate Art"];
  if (r.includes("gold") || r.includes("hyper")) return ["Gold"];
  if (r.includes("holo") && r.includes("reverse")) return ["Reverse Holo"];
  if (r.includes("holo") || r.includes("ultra") || r.includes("rare v") || r.includes("rare ex") || r.includes("rare gx")) return ["Holo", "Reverse Holo"];
  if (r.includes("rare")) return ["Normal", "Reverse Holo"];
  if (r.includes("uncommon") || r.includes("common")) return ["Normal", "Reverse Holo"];
  return ["Normal"];
}
