-- CreateTable
CREATE TABLE "listing_views" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "viewDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listing_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "listing_views_listingId_visitorId_viewDate_key" ON "listing_views"("listingId", "visitorId", "viewDate");

-- AddForeignKey
ALTER TABLE "listing_views" ADD CONSTRAINT "listing_views_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
