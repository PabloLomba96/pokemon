export type CardRegion = "western" | "japanese" | "korean" | "chinese";

export interface PriceDetail {
  trendPrice: number;
  lowPrice: number;
  avg1Day: number | null;
  avg7Day: number | null;
  avg30Day: number | null;
  source: string;
}

export interface GradingInfo {
  company: "PSA" | "BGS" | "CGC" | "PCA";
  grade: number;
}

export interface PokemonCard {
  id: string;
  name: string;
  set: string;
  setCode: string;
  number: string;
  rarity: string;
  era: string;
  image: string;
  condition: string;
  language: string;
  region: CardRegion;
  finish: string;
  grading?: GradingInfo;
  prices: {
    tcgApi: number;
    cardmarket: number;
    ebay: number | null;
  };
  priceDetails: PriceDetail[];
  estimatedPrice: number;
  priceChange: number;
  dateAdded: string;
}

export const gradingCompanies = ["PSA", "BGS", "CGC", "PCA"] as const;
export const gradingGrades = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10] as const;

export const regions: { id: CardRegion; label: string; flag: string; description: string }[] = [
  { id: "western", label: "Occidental", flag: "🌍", description: "EN, ES, FR, DE, IT — Numeración y trasera occidental" },
  { id: "japanese", label: "Japonesa", flag: "🇯🇵", description: "Sets exclusivos JP, borde dorado, trasera japonesa" },
  { id: "korean", label: "Coreana", flag: "🇰🇷", description: "Numeración propia KR, trasera estándar" },
  { id: "chinese", label: "China", flag: "🇨🇳", description: "S-Chinese/T-Chinese, sellos de autenticidad propios" },
];

export const conditions = ["Mint", "Near Mint", "Excellent", "Good", "Light Played", "Played", "Poor"] as const;

export const westernLanguages = [
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "NL", label: "Nederlands", flag: "🇳🇱" },
  { code: "DE", label: "Deutsch", flag: "🇩🇪" },
  { code: "FR", label: "Français", flag: "🇫🇷" },
  { code: "IT", label: "Italiano", flag: "🇮🇹" },
  { code: "ES", label: "Español", flag: "🇪🇸" },
  { code: "ES-LA", label: "Español (LATAM)", flag: "🇲🇽" },
  { code: "PT", label: "Português", flag: "🇵🇹" },
  { code: "PT-BR", label: "Português (BR)", flag: "🇧🇷" },
  { code: "RU", label: "Русский", flag: "🇷🇺" },
  { code: "PL", label: "Polski", flag: "🇵🇱" },
] as const;

export const allLanguages = [
  ...westernLanguages,
  { code: "JP", label: "日本語", flag: "🇯🇵" },
  { code: "KR", label: "한국어", flag: "🇰🇷" },
  { code: "ZH-S", label: "简体中文", flag: "🇨🇳" },
  { code: "ZH-T", label: "繁體中文", flag: "🇹🇼" },
] as const;

export const languagesByRegion: Record<CardRegion, typeof allLanguages[number][]> = {
  western: [...westernLanguages],
  japanese: [{ code: "JP", label: "日本語", flag: "🇯🇵" }],
  korean: [{ code: "KR", label: "한국어", flag: "🇰🇷" }],
  chinese: [{ code: "ZH-S", label: "简体中文", flag: "🇨🇳" }, { code: "ZH-T", label: "繁體中文", flag: "🇹🇼" }],
};

export function getFlagForLanguage(langCodeOrName: string): string {
  const found = allLanguages.find(
    l => l.code === langCodeOrName || l.label.toLowerCase() === langCodeOrName.toLowerCase()
  );
  return found?.flag ?? "";
}

export const finishes = ["Normal", "Holo", "Reverse Holo", "Full Art", "Alternate Art", "Rainbow Rare", "Gold"] as const;
