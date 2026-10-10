export const COMMODITIES = [
  { value: "maize", label: "Maize" },
  { value: "rice", label: "Rice" },
  { value: "soybean", label: "Soybean" },
  { value: "sorghum", label: "Sorghum" },
  { value: "millet", label: "Millet" },
  { value: "groundnut", label: "Groundnut" },
  { value: "cowpea", label: "Cowpea" },
  { value: "cassava", label: "Cassava" },
  { value: "yam", label: "Yam" },
  { value: "plantain", label: "Plantain" },
  { value: "cocoyam", label: "Cocoyam" },
  { value: "tomato", label: "Tomato" },
  { value: "pepper", label: "Pepper" },
  { value: "onion", label: "Onion" },
  { value: "okra", label: "Okra" },
  { value: "pineapple", label: "Pineapple" },
  { value: "mango", label: "Mango" },
  { value: "cocoa", label: "Cocoa" },
  { value: "cashew", label: "Cashew" },
  { value: "shea", label: "Shea nut" },
  { value: "oil-palm", label: "Oil palm" },
  { value: "other", label: "Other" },
] as const;

// "Other" can't be compared meaningfully, so the market page leaves it out.
export const MARKET_COMMODITIES = COMMODITIES.filter((c) => c.value !== "other");

export function isValidCommodity(value: string): boolean {
  return COMMODITIES.some((c) => c.value === value);
}

export function commodityLabel(value: string | null): string {
  return COMMODITIES.find((c) => c.value === value)?.label ?? "Uncategorized";
}