import { prisma } from "@/lib/prisma";

export const MIN_LISTINGS_FOR_PRICE = 3;

const UNIT_ALIASES: Record<string, string> = {
  mt: "MT",
  tonne: "MT",
  tonnes: "MT",
  ton: "MT",
  tons: "MT",
  "metric ton": "MT",
  "metric tons": "MT",
  "metric tonne": "MT",
  "metric tonnes": "MT",
  kg: "kg",
  kgs: "kg",
  kilo: "kg",
  kilos: "kg",
  kilogram: "kg",
  kilograms: "kg",
  bag: "bag",
  bags: "bag",
  sack: "bag",
  sacks: "bag",
};

export function normalizeUnit(raw: string): string {
  const cleaned = raw.trim().toLowerCase().replace(/\./g, "").replace(/\s+/g, " ");
  return UNIT_ALIASES[cleaned] ?? cleaned;
}

export function normalizeRegion(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*region$/, "");
}

export function regionLabel(key: string): string {
  const title = key.replace(/\b\w/g, (c) => c.toUpperCase());
  return `${title} Region`;
}

export type PriceStat = {
  unit: string;
  count: number;
  enough: boolean;
  median?: number;
  average?: number;
  min?: number;
  max?: number;
};

export type RegionStat = {
  key: string;
  label: string;
  supplyCount: number;
  demandCount: number;
  supplyQuantity: Record<string, number>;
  demandQuantity: Record<string, number>;
  supplyQuantityStated: number;
  demandQuantityStated: number;
  prices: PriceStat[];
};

export type MarketData = {
  commodity: string;
  totalListings: number;
  all: RegionStat;
  regions: RegionStat[];
};

type Row = {
  type: "OFFER" | "REQUEST";
  region: string;
  price: number | null;
  priceUnit: string | null;
  quantity: number | null;
  quantityUnit: string | null;
};

function sumQuantities(list: Row[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of list) {
    if (r.quantity === null || !r.quantityUnit) continue;
    const unit = normalizeUnit(r.quantityUnit);
    out[unit] = (out[unit] ?? 0) + r.quantity;
  }
  return out;
}

function buildStat(key: string, label: string, rows: Row[]): RegionStat {
  const supply = rows.filter((r) => r.type === "OFFER");
  const demand = rows.filter((r) => r.type === "REQUEST");

  const byUnit = new Map<string, number[]>();
  for (const r of supply) {
    if (r.price === null || !r.priceUnit) continue;
    const unit = normalizeUnit(r.priceUnit);
    const values = byUnit.get(unit) ?? [];
    values.push(r.price);
    byUnit.set(unit, values);
  }

  const prices: PriceStat[] = [...byUnit.entries()]
    .map(([unit, values]): PriceStat => {
      const sorted = [...values].sort((a, b) => a - b);
      const count = sorted.length;

      if (count < MIN_LISTINGS_FOR_PRICE) {
        return { unit, count, enough: false };
      }

      const mid = Math.floor(count / 2);
      const median =
        count % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
      const average = sorted.reduce((a, b) => a + b, 0) / count;

      return {
        unit,
        count,
        enough: true,
        median,
        average,
        min: sorted[0],
        max: sorted[count - 1],
      };
    })
    .sort((a, b) => b.count - a.count);

  return {
    key,
    label,
    supplyCount: supply.length,
    demandCount: demand.length,
    supplyQuantity: sumQuantities(supply),
    demandQuantity: sumQuantities(demand),
    supplyQuantityStated: supply.filter((r) => r.quantity !== null && r.quantityUnit).length,
    demandQuantityStated: demand.filter((r) => r.quantity !== null && r.quantityUnit).length,
    prices,
  };
}

export async function getMarketData(commodity: string): Promise<MarketData> {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE", category: "PRODUCT", commodity },
    select: {
      type: true,
      region: true,
      price: true,
      priceUnit: true,
      quantity: true,
      quantityUnit: true,
    },
  });

  const rows: Row[] = listings.map((l) => {
    const price = l.price ? Number(l.price.toString()) : null;
    const quantity = l.quantity ? Number(l.quantity.toString()) : null;
    return {
      type: l.type,
      region: l.region,
      price: price !== null && price > 0 ? price : null,
      priceUnit: l.priceUnit,
      quantity: quantity !== null && quantity > 0 ? quantity : null,
      quantityUnit: l.quantityUnit,
    };
  });

  const groups = new Map<string, Row[]>();
  for (const r of rows) {
    const key = normalizeRegion(r.region);
    const list = groups.get(key) ?? [];
    list.push(r);
    groups.set(key, list);
  }

  const regions = [...groups.entries()]
    .map(([key, list]) => buildStat(key, regionLabel(key), list))
    .sort(
      (a, b) =>
        b.supplyCount + b.demandCount - (a.supplyCount + a.demandCount)
    );

  return {
    commodity,
    totalListings: rows.length,
    all: buildStat("all", "All regions", rows),
    regions,
  };
}

export async function getCommoditiesWithListings() {
  const groups = await prisma.listing.groupBy({
    by: ["commodity"],
    where: {
      status: "ACTIVE",
      category: "PRODUCT",
      commodity: { not: null },
    },
    _count: { _all: true },
  });

  return groups
    .filter((g) => g.commodity && g.commodity !== "other")
    .map((g) => ({ value: g.commodity as string, count: g._count._all }))
    .sort((a, b) => b.count - a.count);
}