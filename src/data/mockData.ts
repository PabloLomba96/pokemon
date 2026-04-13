export type CardRegion = "western" | "japanese" | "korean" | "chinese";

export interface PriceDetail {
  trendPrice: number;
  lowPrice: number;
  avg1Day: number | null;
  avg7Day: number | null;
  avg30Day: number | null;
  source: string;
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

export const regions: { id: CardRegion; label: string; flag: string; description: string }[] = [
  { id: "western", label: "Occidental", flag: "🌍", description: "EN, ES, FR, DE, IT — Numeración y trasera occidental" },
  { id: "japanese", label: "Japonesa", flag: "🇯🇵", description: "Sets exclusivos JP, borde dorado, trasera japonesa" },
  { id: "korean", label: "Coreana", flag: "🇰🇷", description: "Numeración propia KR, trasera estándar" },
  { id: "chinese", label: "China", flag: "🇨🇳", description: "S-Chinese/T-Chinese, sellos de autenticidad propios" },
];

/** Catalog cards — these are the "database" of available cards */
export const catalogCards: PokemonCard[] = [
  {
    id: "base1-4",
    name: "Charizard",
    set: "Base Set",
    setCode: "BS",
    number: "4/102",
    rarity: "Holo Rare",
    era: "Classic (Base-Neo)",
    image: "https://images.pokemontcg.io/base1/4_hires.png",
    condition: "Near Mint",
    language: "EN",
    region: "western",
    finish: "Holo",
    prices: { tcgApi: 42000, cardmarket: 38500, ebay: 45000 },
    priceDetails: [
      { trendPrice: 40250, lowPrice: 35000, avg1Day: 41000, avg7Day: 40500, avg30Day: 39800, source: "Cardmarket" },
      { trendPrice: 42000, lowPrice: 38000, avg1Day: null, avg7Day: 42500, avg30Day: 41000, source: "TCG API" },
    ],
    estimatedPrice: 40250,
    priceChange: 5.2,
    dateAdded: "2024-01-15",
  },
  {
    id: "swsh7-215",
    name: "Umbreon VMAX",
    set: "Evolving Skies",
    setCode: "EVS",
    number: "215/203",
    rarity: "Secret Rare",
    era: "Sword & Shield",
    image: "https://images.pokemontcg.io/swsh7/215_hires.png",
    condition: "Mint",
    language: "EN",
    region: "western",
    finish: "Alternate Art",
    prices: { tcgApi: 28000, cardmarket: 25000, ebay: 31000 },
    priceDetails: [
      { trendPrice: 26500, lowPrice: 22000, avg1Day: 27000, avg7Day: 26000, avg30Day: 25500, source: "Cardmarket" },
    ],
    estimatedPrice: 26500,
    priceChange: -2.1,
    dateAdded: "2024-03-20",
  },
  {
    id: "base1-58",
    name: "Pikachu",
    set: "Base Set",
    setCode: "BS",
    number: "58/102",
    rarity: "Common",
    era: "Classic (Base-Neo)",
    image: "https://images.pokemontcg.io/base1/58_hires.png",
    condition: "Excellent",
    language: "JP",
    region: "japanese",
    finish: "Normal",
    prices: { tcgApi: 1500, cardmarket: 1200, ebay: 1800 },
    priceDetails: [
      { trendPrice: 1350, lowPrice: 900, avg1Day: 1400, avg7Day: 1300, avg30Day: 1250, source: "Cardmarket" },
    ],
    estimatedPrice: 1350,
    priceChange: 1.8,
    dateAdded: "2024-02-10",
  },
  {
    id: "swsh45sv-SV107",
    name: "Charizard VSTAR",
    set: "Brilliant Stars",
    setCode: "BRS",
    number: "SV107/SV122",
    rarity: "Secret Rare",
    era: "Sword & Shield",
    image: "https://images.pokemontcg.io/swsh9/136_hires.png",
    condition: "Mint",
    language: "EN",
    region: "western",
    finish: "Rainbow Rare",
    prices: { tcgApi: 18500, cardmarket: 16000, ebay: 20000 },
    priceDetails: [
      { trendPrice: 17250, lowPrice: 14000, avg1Day: 18000, avg7Day: 17500, avg30Day: 17000, source: "Cardmarket" },
    ],
    estimatedPrice: 17250,
    priceChange: 8.4,
    dateAdded: "2024-04-05",
  },
  {
    id: "neo3-20",
    name: "Lugia",
    set: "Neo Revelation",
    setCode: "N3",
    number: "20/64",
    rarity: "Holo Rare",
    era: "Classic (Base-Neo)",
    image: "https://images.pokemontcg.io/neo3/20_hires.png",
    condition: "Near Mint",
    language: "EN",
    region: "western",
    finish: "Holo",
    prices: { tcgApi: 8500, cardmarket: 7800, ebay: 9200 },
    priceDetails: [
      { trendPrice: 8150, lowPrice: 6500, avg1Day: 8300, avg7Day: 8100, avg30Day: 7900, source: "Cardmarket" },
    ],
    estimatedPrice: 8150,
    priceChange: 3.1,
    dateAdded: "2024-01-28",
  },
  {
    id: "sm35-1",
    name: "Mewtwo GX",
    set: "Shining Legends",
    setCode: "SLG",
    number: "1/73",
    rarity: "Ultra Rare",
    era: "Sun & Moon",
    image: "https://images.pokemontcg.io/sm35/39_hires.png",
    condition: "Near Mint",
    language: "ES",
    region: "western",
    finish: "Full Art",
    prices: { tcgApi: 3200, cardmarket: 2800, ebay: null },
    priceDetails: [
      { trendPrice: 3000, lowPrice: 2200, avg1Day: 3100, avg7Day: 2900, avg30Day: 2800, source: "Cardmarket" },
    ],
    estimatedPrice: 3000,
    priceChange: -0.5,
    dateAdded: "2024-05-12",
  },
  {
    id: "s8b-272",
    name: "Rayquaza VMAX",
    set: "VMAX Climax",
    setCode: "S8b",
    number: "272/184",
    rarity: "Character Super Rare",
    era: "Sword & Shield",
    image: "https://images.pokemontcg.io/swsh7/218_hires.png",
    condition: "Mint",
    language: "JP",
    region: "japanese",
    finish: "Alternate Art",
    prices: { tcgApi: 15000, cardmarket: 13500, ebay: 16800 },
    priceDetails: [
      { trendPrice: 14500, lowPrice: 11000, avg1Day: 15200, avg7Day: 14800, avg30Day: 14000, source: "Cardmarket" },
    ],
    estimatedPrice: 14500,
    priceChange: 6.3,
    dateAdded: "2024-06-01",
  },
  {
    id: "s12a-210",
    name: "Giratina VSTAR",
    set: "VSTAR Universe",
    setCode: "S12a",
    number: "210/172",
    rarity: "Art Rare",
    era: "Sword & Shield",
    image: "https://images.pokemontcg.io/swsh11/131_hires.png",
    condition: "Mint",
    language: "JP",
    region: "japanese",
    finish: "Alternate Art",
    prices: { tcgApi: 9500, cardmarket: 8800, ebay: 10200 },
    priceDetails: [
      { trendPrice: 9200, lowPrice: 7500, avg1Day: 9800, avg7Day: 9400, avg30Day: 9000, source: "Cardmarket" },
    ],
    estimatedPrice: 9200,
    priceChange: 4.7,
    dateAdded: "2024-07-15",
  },
  {
    id: "s8bk-272",
    name: "Mew VMAX",
    set: "VMAX Climax (KR)",
    setCode: "S8bK",
    number: "269/184",
    rarity: "Character Super Rare",
    era: "Sword & Shield",
    image: "https://images.pokemontcg.io/swsh8/114_hires.png",
    condition: "Near Mint",
    language: "KR",
    region: "korean",
    finish: "Alternate Art",
    prices: { tcgApi: 4500, cardmarket: 3800, ebay: 5200 },
    priceDetails: [
      { trendPrice: 4200, lowPrice: 3000, avg1Day: 4400, avg7Day: 4100, avg30Day: 3900, source: "Cardmarket" },
    ],
    estimatedPrice: 4200,
    priceChange: 2.5,
    dateAdded: "2024-08-10",
  },
  {
    id: "cs5c-079",
    name: "Charizard ex",
    set: "Scarlet & Violet (CN)",
    setCode: "CS5C",
    number: "079/073",
    rarity: "Special Art Rare",
    era: "Scarlet & Violet",
    image: "https://images.pokemontcg.io/sv3pt5/215_hires.png",
    condition: "Mint",
    language: "ZH-S",
    region: "chinese",
    finish: "Full Art",
    prices: { tcgApi: 6200, cardmarket: 5500, ebay: null },
    priceDetails: [
      { trendPrice: 5800, lowPrice: 4200, avg1Day: 6000, avg7Day: 5700, avg30Day: 5500, source: "Cardmarket" },
    ],
    estimatedPrice: 5800,
    priceChange: 3.9,
    dateAdded: "2024-09-01",
  },
];

/** Backward compat alias */
export const mockCards = catalogCards;

export const portfolioHistory = [
  { month: "Oct", value: 82000 },
  { month: "Nov", value: 85400 },
  { month: "Dec", value: 88200 },
  { month: "Ene", value: 91000 },
  { month: "Feb", value: 89500 },
  { month: "Mar", value: 96500 },
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
