import Link from "next/link";
import type { Metadata } from "next";
import {
  getMarketData,
  getCommoditiesWithListings,
  MIN_LISTINGS_FOR_PRICE,
  type PriceStat,
} from "@/lib/market";
import { commodityLabel, isValidCommodity } from "@/lib/commodities";

export const metadata: Metadata = {
  title: "Market Information — Ghana Agriculture Hub",
  description:
    "Asking prices, supply and demand for agricultural products across Ghana, based on active marketplace listings.",
};

function money(n: number): string {
  return `GHS ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function quantities(record: Record<string, number>): string {
  const entries = Object.entries(record);
  if (entries.length === 0) return "—";
  return entries
    .map(
      ([unit, qty]) =>
        `${qty.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${unit}`
    )
    .join(", ");
}

function quantityLine(
  record: Record<string, number>,
  stated: number,
  total: number
): string {
  if (total === 0) return "—";
  if (stated === 0) return "no quantity stated";
  const amounts = quantities(record);
  return stated === total ? amounts : `${amounts} (stated on ${stated} of ${total})`;
}

function PriceCell({ prices, detailed }: { prices: PriceStat[]; detailed?: boolean }) {
  if (prices.length === 0) {
    return <span className="text-gray-400 text-sm">No priced offers yet</span>;
  }

  return (
    <div className="space-y-2">
      {prices.map((p) =>
        p.enough ? (
          <div key={p.unit}>
            <p className="font-semibold">
              {money(p.median!)} <span className="text-gray-400 font-normal">/ {p.unit}</span>
            </p>
            <p className="text-xs text-gray-400">
              median of {p.count} listings
              {detailed && (
                <>
                  {" · "}average {money(p.average!)} · range {money(p.min!)} to{" "}
                  {money(p.max!)}
                </>
              )}
            </p>
          </div>
        ) : (
          <p key={p.unit} className="text-xs text-gray-400">
            {p.count} priced {p.count === 1 ? "listing" : "listings"} per {p.unit}. Needs{" "}
            {MIN_LISTINGS_FOR_PRICE}+ to show a price.
          </p>
        )
      )}
    </div>
  );
}

export default async function MarketPage({
  searchParams,
}: {
  searchParams: Promise<{ commodity?: string }>;
}) {
  const params = await searchParams;
  const available = await getCommoditiesWithListings();

  const requested = params.commodity ?? "";
  const selected =
    isValidCommodity(requested) && available.some((c) => c.value === requested)
      ? requested
      : available[0]?.value ?? null;

  const data = selected ? await getMarketData(selected) : null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1">Market Information</h1>
        <p className="text-gray-500 text-sm mb-4">
          Supply, demand and asking prices for agricultural products across Ghana.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-sm text-amber-900">
          <strong>Listing-based information.</strong> These figures come from asking
          prices in active listings on this platform. They are not verified
          transaction prices and may differ from what deals actually close at.
        </div>

        {available.length === 0 || !data ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-sm mb-3">
              No product listings with a product type yet, so there&apos;s nothing to
              show here.
            </p>
            <Link href="/listings/new" className="text-green-700 font-medium text-sm">
              Post a listing →
            </Link>
          </div>
        ) : (
          <>
            <div className="flex gap-2 flex-wrap mb-6">
              {available.map((c) => (
                <Link
                  key={c.value}
                  href={`/market?commodity=${c.value}`}
                  className={`px-3 py-1.5 rounded text-sm font-medium border ${
                    c.value === selected
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white text-gray-600"
                  }`}
                >
                  {commodityLabel(c.value)}{" "}
                  <span className="opacity-60">({c.count})</span>
                </Link>
              ))}
            </div>

            <h2 className="text-lg font-semibold mb-3">
              {commodityLabel(data.commodity)} — all regions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs text-gray-400 mb-1">Asking price</p>
                <PriceCell prices={data.all.prices} detailed />
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs text-gray-400 mb-1">Supply listed</p>
                <p className="text-xl font-bold">{data.all.supplyCount}</p>
                <p className="text-xs text-gray-400">
                  offers · {quantityLine(data.all.supplyQuantity, data.all.supplyQuantityStated, data.all.supplyCount)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs text-gray-400 mb-1">Demand listed</p>
                <p className="text-xl font-bold">{data.all.demandCount}</p>
                <p className="text-xs text-gray-400">
                  requests · {quantityLine(data.all.demandQuantity, data.all.demandQuantityStated,data.all.demandCount)}
                </p>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-3">By region</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b">
                    <th className="p-3 font-medium">Region</th>
                    <th className="p-3 font-medium">Asking price</th>
                    <th className="p-3 font-medium">Supply</th>
                    <th className="p-3 font-medium">Demand</th>
                  </tr>
                </thead>
                <tbody>
                  {data.regions.map((r) => (
                    <tr key={r.key} className="border-b last:border-0 align-top">
                      <td className="p-3 font-medium">{r.label}</td>
                      <td className="p-3">
                        <PriceCell prices={r.prices} />
                      </td>
                      <td className="p-3">
                        {r.supplyCount}
                        <span className="block text-xs text-gray-400">
                          {quantityLine(r.supplyQuantity, r.supplyQuantityStated, r.supplyCount)}
                        </span>
                      </td>
                      <td className="p-3">
                        {r.demandCount}
                        <span className="block text-xs text-gray-400">
                          {quantityLine(r.demandQuantity, r.demandQuantityStated, r.demandCount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Prices are only compared within the same unit. Offers without a price
              unit are left out of price figures. Based on {data.totalListings} active{" "}
              {data.totalListings === 1 ? "listing" : "listings"}.
            </p>
          </>
        )}
      </div>
    </div>
  );
}