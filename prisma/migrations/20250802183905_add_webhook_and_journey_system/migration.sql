-- CreateTable
CREATE TABLE "user_journeys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "location" TEXT,
    "device" TEXT,
    "trafficSource" TEXT,
    "sessionStart" DATETIME NOT NULL,
    "sessionEnd" DATETIME,
    "totalTime" INTEGER,
    "pagesVisited" INTEGER NOT NULL DEFAULT 0,
    "productsViewed" JSONB,
    "searchQueries" JSONB,
    "cartItems" JSONB,
    "cartAbandoned" BOOLEAN NOT NULL DEFAULT false,
    "cartValue" DECIMAL,
    "checkoutAttempts" INTEGER NOT NULL DEFAULT 0,
    "interestScore" DECIMAL NOT NULL DEFAULT 0,
    "urgencySignals" JSONB,
    "behaviorFlags" JSONB,
    "webhookSent" BOOLEAN NOT NULL DEFAULT false,
    "webhookSentAt" DATETIME,
    "webhookResponse" JSONB,
    "endReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_site_config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "avatarWhatsappUrl" TEXT NOT NULL DEFAULT '/images/whatsapp-avatar.svg',
    "webhookUrl" TEXT,
    "webhookEnabled" BOOLEAN NOT NULL DEFAULT false,
    "webhookSecretKey" TEXT,
    "minSessionTime" INTEGER NOT NULL DEFAULT 300,
    "sessionTimeout" INTEGER NOT NULL DEFAULT 1800,
    "highValueThreshold" DECIMAL NOT NULL DEFAULT 1000,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_site_config" ("avatarWhatsappUrl", "createdAt", "id", "updatedAt") SELECT "avatarWhatsappUrl", "createdAt", "id", "updatedAt" FROM "site_config";
DROP TABLE "site_config";
ALTER TABLE "new_site_config" RENAME TO "site_config";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "user_journeys_sessionId_key" ON "user_journeys"("sessionId");

-- CreateIndex
CREATE INDEX "user_journeys_sessionId_idx" ON "user_journeys"("sessionId");

-- CreateIndex
CREATE INDEX "user_journeys_phoneNumber_idx" ON "user_journeys"("phoneNumber");

-- CreateIndex
CREATE INDEX "user_journeys_webhookSent_idx" ON "user_journeys"("webhookSent");
