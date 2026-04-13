import type { PokemonCard, CardRegion } from "../types/cards";

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

// Japanese sets use specific prefixes in the API
const JAPANESE_SET_PREFIXES = [
  "sv", "s", "sm", "xy", "bw", "dp", "pcg", "web", "vs",
  // but exclude western sv sets
];

function detectRegion(card: ApiCard): CardRegion {
  const setId = card.set.id.toLowerCase();
  // Japanese sets typically have specific IDs
  if (setId.startsWith("sv") && setId.match(/^sv\d/)) return "western"; // sv1, sv2, etc are western
  if (setId.match(/^s\d/) || setId.match(/^sm\d/) || setId.match(/^xy\d/)) return "japanese";
  return "western";
}

function detectLanguage(card: ApiCard): string {
  const region = detectRegion(card);
  if (region === "japanese") return "JP";
  if (region === "korean") return "KR";
  if (region === "chinese") return "ZH-S";
  return "EN";
}

function mapApiCard(api: ApiCard): PokemonCard {
  const cmPrices = api.cardmarket?.prices;
  const trendCents = cmPrices?.trendPrice ? Math.round(cmPrices.trendPrice * 100) : null;
  const lowCents = cmPrices?.lowPrice ? Math.round(cmPrices.lowPrice * 100) : null;

  let tcgPrice: number | null = null;
  if (api.tcgplayer?.prices) {
    const firstKey = Object.keys(api.tcgplayer.prices)[0];
    if (firstKey) {
      const market = api.tcgplayer.prices[firstKey]?.market;
      if (market) tcgPrice = Math.round(market * 100);
    }
  }

  // Use first available real price as estimated
  const estimatedPrice = trendCents ?? tcgPrice ?? 0;

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
      ebay: null, // No eBay data from this API
    },
    priceDetails: cmPrices ? [{
      trendPrice: trendCents ?? 0,
      lowPrice: lowCents ?? 0,
      avg1Day: cmPrices.avg1 ? Math.round(cmPrices.avg1 * 100) : null,
      avg7Day: cmPrices.avg7 ? Math.round(cmPrices.avg7 * 100) : null,
      avg30Day: cmPrices.avg30 ? Math.round(cmPrices.avg30 * 100) : null,
      source: "Cardmarket",
    }] : [],
    estimatedPrice,
    priceChange: 0, // No real historical data from this API
    dateAdded: new Date().toISOString().split("T")[0],
  };
}

export interface SearchOptions {
  query: string;
  region?: CardRegion | "all";
  page?: number;
  pageSize?: number;
}

export async function searchCards(opts: SearchOptions): Promise<{
  cards: PokemonCard[];
  totalCount: number;
}> {
  const { query, region = "all", page = 1, pageSize = 20 } = opts;
  if (!query.trim()) return { cards: [], totalCount: 0 };

  // Build query string with region filtering
  let q = `name:"${query}*"`;

  // The Pokémon TCG API doesn't have a direct language filter,
  // but Japanese sets have specific set IDs we can filter on
  // For now, we filter client-side after fetch to keep it simple
  // and because the API's set categorization isn't 100% aligned with our regions

  const url = `${BASE_URL}/cards?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}&orderBy=name`;

  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 429) throw new Error("RATE_LIMIT");
    throw new Error(`API error: ${res.status}`);
  }

  const data: ApiResponse = await res.json();
  let cards = data.data.map(mapApiCard);

  // Client-side region filter
  if (region !== "all") {
    cards = cards.filter(c => c.region === region);
  }

  return {
    cards,
    totalCount: data.totalCount,
  };
}

export async function getCardById(id: string): Promise<PokemonCard | null> {
  const res = await fetch(`${BASE_URL}/cards/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return mapApiCard(data.data);
}

/**
 * Batch fetch cards by their API IDs (for hydrating collection from DB)
 */
export async function getCardsByIds(ids: string[]): Promise<Map<string, PokemonCard>> {
  if (ids.length === 0) return new Map();

  // API supports OR queries: id:"base1-4" OR id:"swsh7-215"
  const idQuery = ids.map(id => `id:"${id}"`).join(" OR ");
  const url = `${BASE_URL}/cards?q=${encodeURIComponent(idQuery)}&pageSize=${Math.min(ids.length, 250)}`;

  const res = await fetch(url);
  if (!res.ok) return new Map();

  const data: ApiResponse = await res.json();
  const map = new Map<string, PokemonCard>();
  for (const card of data.data) {
    map.set(card.id, mapApiCard(card));
  }
  return map;
}
