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
  specificLanguage?: string | null;
  manualPrice?: number | null;
  isFavorite?: boolean;
  folderId?: string | null;
  prices: {
    tcgApi: number | null;
    cardmarket: number | null;
    ebay: number | null;
  };
  priceDetails: PriceDetail[];
  estimatedPrice: number;
  priceChange: number;
  dateAdded: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface DbProfile {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  preferred_currency: "EUR" | "USD";
  default_price_source: "cardmarket" | "tcgApi" | "ebay";
  created_at: string;
  updated_at: string;
}

export interface DbUserCard {
  id: string;
  user_id: string;
  api_card_id: string;
  card_name: string;
  card_set: string;
  card_number: string;
  card_image: string;
  card_rarity: string;
  card_era: string;
  region: string;
  language: string;
  condition: string;
  finish: string;
  is_graded: boolean;
  grading_company: string | null;
  grade: number | null;
  purchase_price: number | null;
  estimated_price: number;
  price_change: number;
  acquired_at: string;
  created_at: string;
  manual_price: number | null;
  specific_language: string | null;
  is_favorite: boolean;
  folder_id: string | null;
}
