export interface PokemonCard {
  id: string;
  name: string;
  set: string;
  setCode: string;
  number: string;
  rarity: string;
  image: string;
  condition: string;
  language: string;
  finish: string;
  prices: {
    tcgApi: number;
    cardmarket: number;
    ebay: number | null;
  };
  estimatedPrice: number;
  priceChange: number; // percentage
  dateAdded: string;
}

export const mockCards: PokemonCard[] = [
  {
    id: "base1-4",
    name: "Charizard",
    set: "Base Set",
    setCode: "BS",
    number: "4/102",
    rarity: "Holo Rare",
    image: "https://images.pokemontcg.io/base1/4_hires.png",
    condition: "Near Mint",
    language: "English",
    finish: "Holo",
    prices: { tcgApi: 42000, cardmarket: 38500, ebay: 45000 },
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
    image: "https://images.pokemontcg.io/swsh7/215_hires.png",
    condition: "Mint",
    language: "English",
    finish: "Alternate Art",
    prices: { tcgApi: 28000, cardmarket: 25000, ebay: 31000 },
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
    image: "https://images.pokemontcg.io/base1/58_hires.png",
    condition: "Excellent",
    language: "Japanese",
    finish: "Normal",
    prices: { tcgApi: 1500, cardmarket: 1200, ebay: 1800 },
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
    image: "https://images.pokemontcg.io/swsh9/136_hires.png",
    condition: "Mint",
    language: "English",
    finish: "Rainbow Rare",
    prices: { tcgApi: 18500, cardmarket: 16000, ebay: 20000 },
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
    image: "https://images.pokemontcg.io/neo3/20_hires.png",
    condition: "Near Mint",
    language: "English",
    finish: "Holo",
    prices: { tcgApi: 8500, cardmarket: 7800, ebay: 9200 },
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
    image: "https://images.pokemontcg.io/sm35/39_hires.png",
    condition: "Near Mint",
    language: "Spanish",
    finish: "Full Art",
    prices: { tcgApi: 3200, cardmarket: 2800, ebay: null },
    estimatedPrice: 3000,
    priceChange: -0.5,
    dateAdded: "2024-05-12",
  },
];

export const portfolioHistory = [
  { month: "Oct", value: 82000 },
  { month: "Nov", value: 85400 },
  { month: "Dec", value: 88200 },
  { month: "Ene", value: 91000 },
  { month: "Feb", value: 89500 },
  { month: "Mar", value: 96500 },
];

export const conditions = ["Mint", "Near Mint", "Excellent", "Good", "Light Played", "Played", "Poor"] as const;
export const languages = [
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "ES", label: "Español", flag: "🇪🇸" },
  { code: "FR", label: "Français", flag: "🇫🇷" },
  { code: "DE", label: "Deutsch", flag: "🇩🇪" },
  { code: "IT", label: "Italiano", flag: "🇮🇹" },
  { code: "JP", label: "日本語", flag: "🇯🇵" },
] as const;
export const finishes = ["Normal", "Holo", "Reverse Holo", "Full Art", "Alternate Art", "Rainbow Rare", "Gold"] as const;
