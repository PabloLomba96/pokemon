import { useState } from "react";

export type WidgetType = "metrics" | "chart" | "carousel" | "topCards" | "regionBreakdown" | "recentlyAdded";

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  label: string;
  enabled: boolean;
  order: number;
}

const defaultWidgets: DashboardWidget[] = [
  { id: "metrics", type: "metrics", label: "Métricas", enabled: true, order: 0 },
  { id: "chart", type: "chart", label: "Gráfica de Evolución", enabled: true, order: 1 },
  { id: "carousel", type: "carousel", label: "Carrusel de Cartas", enabled: true, order: 2 },
  { id: "topCards", type: "topCards", label: "Top Cartas Valiosas", enabled: true, order: 3 },
  { id: "regionBreakdown", type: "regionBreakdown", label: "Desglose por Región", enabled: true, order: 4 },
  { id: "recentlyAdded", type: "recentlyAdded", label: "Añadidas Recientemente", enabled: true, order: 5 },
];

const STORAGE_KEY = "pokevault_widgets";

function loadWidgets(): DashboardWidget[] {
  if (typeof window === "undefined") return defaultWidgets;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultWidgets;
  } catch {
    return defaultWidgets;
  }
}

export function useDashboardWidgets() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(loadWidgets);

  const toggleWidget = (id: string) => {
    setWidgets((prev) => {
      const next = prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const moveWidget = (id: string, direction: "up" | "down") => {
    setWidgets((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((w) => w.id === id);
      if (idx < 0) return prev;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const tempOrder = sorted[idx].order;
      sorted[idx] = { ...sorted[idx], order: sorted[swapIdx].order };
      sorted[swapIdx] = { ...sorted[swapIdx], order: tempOrder };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
      return sorted;
    });
  };

  return { widgets: [...widgets].sort((a, b) => a.order - b.order), toggleWidget, moveWidget };
}
