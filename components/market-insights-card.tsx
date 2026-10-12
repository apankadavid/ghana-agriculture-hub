import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { getFeaturedMarketSnapshot, MIN_LISTINGS_FOR_PRICE } from "@/lib/market";
import { commodityLabel } from "@/lib/commodities";

function money(n: number): string {
  return `GHS ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

export default async function MarketInsightsCard({
  showSimulatedTrend = false,
}: {
  showSimulatedTrend?: boolean;
}) {
  const snapshot = await getFeaturedMarketSnapshot();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-sm">Market Insights</h3>
        <Link href="/market" className="text-xs text-green-700 font-medium">
          View all →
        </Link>
      </div>

      {!snapshot ? (
        <p className="text-sm text-gray-400">
          No listings with a product type yet, so there are no insights to show.
        </p>
      ) : (
        <>
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm font-medium">{commodityLabel(snapshot.commodity)}</p>
              <p className="text-xs text-gray-400">All regions</p>
            </div>
            {snapshot.highDemand && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-medium px-2 py-1 rounded">
                High Demand
              </span>
            )}
          </div>

          <p className="text-[11px] text-gray-400">Asking price</p>
          {snapshot.price?.enough ? (
            <>
              <p className="text-lg font-semibold">
                {money(snapshot.price.median!)}{" "}
                <span className="text-sm font-normal text-gray-400">
                  / {snapshot.price.unit}
                </span>
              </p>
              <p className="text-[11px] text-gray-400 mb-2">
                median of {snapshot.price.count} listings
              </p>
            </>
          ) : (
            <p className="text-xs text-gray-400 mb-2">
              Needs {MIN_LISTINGS_FOR_PRICE}+ priced offers in one unit to show a price.
            </p>
          )}

          <div className="flex gap-6 text-xs mb-3">
            <div>
              <p className="text-gray-400">Supply listed</p>
              <p className="font-medium">{snapshot.data.all.supplyCount} offers</p>
            </div>
            <div>
              <p className="text-gray-400">Demand listed</p>
              <p className="font-medium">{snapshot.data.all.demandCount} requests</p>
            </div>
          </div>

          <p className="text-[11px] text-gray-400">
            Listing-based asking prices, not verified transactions.
          </p>

          {showSimulatedTrend && (
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-2">
                <TrendingUp size={12} />
                Simulated trend (historical tracking not yet available)
              </div>
              <svg viewBox="0 0 200 40" className="w-full h-10" preserveAspectRatio="none">
                <polyline
                  points="0,30 30,25 60,28 90,15 120,20 150,8 180,12 200,5"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
              </svg>
              <div className="flex gap-1 mt-2">
                {["7 Days", "30 Days", "6 Months", "1 Year"].map((label, i) => (
                  <span
                    key={label}
                    className={`text-[10px] px-2 py-1 rounded ${
                      i === 0 ? "bg-green-700 text-white" : "text-gray-400 border"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}