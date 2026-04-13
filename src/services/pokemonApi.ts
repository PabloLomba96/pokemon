import type { PokemonCard, CardRegion } from "../data/mockData";

const BASE_URL = "https://api.pokemontcg.io/v2";

interface ApiCard {
  id: string;
  name: string;
  number: string;
  rarity?: string;
  set: {
    id: string;
    name: string;
    series: string;
  };
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    prices?: Record<string, { market?: number; low?: number }>;
  };
  cardmarket?: {
    prices?: {
      trendPrice?: number;
      lowPrice?: number;
      avg1?: number;
      avg7?: number;
      avg30?: number;
    };
  };
}

interface ApiResponse {
  data: ApiCard[];
  totalCount: number;
  page: number;
  pageSize: number;
}

function mapEra(series: string): string {
  const eraMap: Record<string, string> = {
    "Base": "Classic (Base-Neo)",
    "Gym": "Classic (Base-Neo)",
    "Neo": "Classic (Base-Neo)",
    "E-Card": "e-Card",
    "EX": "EX",
    "Diamond & Pearl": "Diamond & Pearl",
    "Platinum": "Platinum",
    "HeartGold & SoulSilver": "HGSS",
    "Black & White": "Black & White",
    "XY": "XY",
    "Sun & Moon": "Sun & Moon",
    "Sword & Shield": "Sword & Shield",
    "Scarlet & Violet": "Scarlet & Violet",
  };
  return eraMap[series] ?? series;
}

function detectRegion(card: ApiCard): CardRegion {
  // The public API mainly has western cards
  return "western";
}

function detectLanguage(_card: ApiCard): string {
  return "EN";
}

function extractPrice(card: ApiCard): number {
  // Prefer cardmarket trend, then tcgplayer market
  if (card.cardmarket?.prices?.trendPrice) {
    return Math.round(card.cardmarket.prices.trendPrice * 100); // cents
  }
  if (card.tcgplayer?.prices) {
    const firstKey = Object.keys(card.tcgplayer.prices)[0];
    if (firstKey) {
      const market = card.tcgplayer.prices[firstKey]?.market;
      if (market) return Math.round(market * 100);
    }
  }
  return 0;
}

function mapApiCard(api: ApiCard): PokemonCard {
  const cmPrices = api.cardmarket?.prices;
  const trendCents = cmPrices?.trendPrice ? Math.round(cmPrices.trendPrice * 100) : 0;
  const lowCents = cmPrices?.lowPrice ? Math.round(cmPrices.lowPrice * 100) : 0;

  let tcgPrice = 0;
  if (api.tcgplayer?.prices) {
    const firstKey = Object.keys(api.tcgplayer.prices)[0];
    if (firstKey) tcgPrice = Math.round((api.tcgplayer.prices[firstKey]?.market ?? 0) * 100);
  }

  const estimatedPrice = trendCents || tcgPrice || 0;

  return {
    id: api.id,
    name: api.name,
    set: api.set.name,
    setCode: api.set.id,
    number: api.number,
    rarity: api.rarity ?? "Unknown",
    era: mapEra(api.set.series),
    image: api.images.large,
    condition: "Near Mint",
    language: detectLanguage(api),
    region: detectRegion(api),
    finish: "Normal",
    prices: {
      tcgApi: tcgPrice,
      cardmarket: trendCents,
      ebay: null,
    },
    priceDetails: cmPrices ? [{
      trendPrice: trendCents,
      lowPrice: lowCents,
      avg1Day: cmPrices.avg1 ? Math.round(cmPrices.avg1 * 100) : null,
      avg7Day: cmPrices.avg7 ? Math.round(cmPrices.avg7 * 100) : null,
      avg30Day: cmPrices.avg30 ? Math.round(cmPrices.avg30 * 100) : null,
      source: "Cardmarket",
    }] : [],
    estimatedPrice,
    priceChange: Math.round((Math.random() * 20 - 5) * 10) / 10, // simulated
    dateAdded: new Date().toISOString().split("T")[0],
  };
}

export async function searchCards(query: string, page = 1, pageSize = 20): Promise<{
  cards: PokemonCard[];
  totalCount: number;
}> {
  if (!query.trim()) return { cards: [], totalCount: 0 };

  const url = `${BASE_URL}/cards?q=name:"${encodeURIComponent(query)}*"&page=${page}&pageSize=${pageSize}&orderBy=name`;

  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 429) throw new Error("RATE_LIMIT");
    throw new Error(`API error: ${res.status}`);
  }

  const data: ApiResponse = await res.json();
  return {
    cards: data.data.map(mapApiCard),
    totalCount: data.totalCount,
  };
}

export async function getCardById(id: string): Promise<PokemonCard | null> {
  const res = await fetch(`${BASE_URL}/cards/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return mapApiCard(data.data);
}
