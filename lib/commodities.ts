type Option = { value: string; label: string };

export const COMMODITIES: readonly Option[] = [
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
];

export const LIVESTOCK_TYPES: readonly Option[] = [
  { value: "cattle", label: "Cattle" },
  { value: "sheep", label: "Sheep" },
  { value: "goat", label: "Goat" },
  { value: "pig", label: "Pig" },
  { value: "chicken", label: "Chicken" },
  { value: "guinea-fowl", label: "Guinea fowl" },
  { value: "turkey", label: "Turkey" },
  { value: "duck", label: "Duck" },
  { value: "rabbit", label: "Rabbit" },
  { value: "grasscutter", label: "Grasscutter" },
  { value: "other-livestock", label: "Other" },
];

// "Other" can't be compared meaningfully, so the market page leaves these out.
export const MARKET_EXCLUDED: readonly string[] = ["other", "other-livestock"];

// Which categories use the "kind" picker, and which list each one uses.
export function commodityOptionsFor(category: string): readonly Option[] | null {
  if (category === "PRODUCT") return COMMODITIES;
  if (category === "LIVESTOCK") return LIVESTOCK_TYPES;
  return null;
}

export function isValidCommodityFor(category: string, value: string): boolean {
  const options = commodityOptionsFor(category);
  return !!options && options.some((o) => o.value === value);
}

export function isKnownCommodity(value: string): boolean {
  return [...COMMODITIES, ...LIVESTOCK_TYPES].some((o) => o.value === value);
}

export function commodityLabel(value: string | null): string {
  return (
    [...COMMODITIES, ...LIVESTOCK_TYPES].find((o) => o.value === value)?.label ??
    "Uncategorized"
  );
}