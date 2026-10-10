-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "commodity" TEXT;

-- CreateIndex
CREATE INDEX "listings_commodity_region_idx" ON "listings"("commodity", "region");
