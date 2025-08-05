-- CreateTable
CREATE TABLE "categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "brands" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL NOT NULL,
    "specialPrice" DECIMAL NOT NULL,
    "specialPriceMinQty" INTEGER NOT NULL DEFAULT 100,
    "categoryId" INTEGER NOT NULL,
    "brandId" INTEGER,
    "imageUrl" TEXT,
    "modelsImageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "brand" TEXT,
    CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "kits" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "totalPrice" DECIMAL NOT NULL,
    "discount" DECIMAL NOT NULL DEFAULT 0,
    "colorTheme" TEXT NOT NULL DEFAULT 'purple-pink',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "kit_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kitId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "kit_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "kit_items_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "kits" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tracking_events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "admins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "site_config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "avatarWhatsappUrl" TEXT NOT NULL DEFAULT '/images/whatsapp-avatar.svg',
    "webhookUrl" TEXT,
    "webhookEnabled" BOOLEAN NOT NULL DEFAULT false,
    "webhookSecretKey" TEXT,
    "minSessionTime" INTEGER NOT NULL DEFAULT 300,
    "sessionTimeout" INTEGER NOT NULL DEFAULT 1800,
    "highValueThreshold" DECIMAL NOT NULL DEFAULT 1000,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "faviconUrl" TEXT
);

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

-- CreateTable
CREATE TABLE "orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderNumber" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,
    "originalWhatsapp" TEXT NOT NULL,
    "currentWhatsapp" TEXT NOT NULL,
    "totalValue" DECIMAL NOT NULL,
    "totalItems" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "chatwootContactId" TEXT,
    "assignedSeller" TEXT,
    "sellerAssignedAt" DATETIME,
    "completedAt" DATETIME,
    "completedBy" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL NOT NULL,
    "totalPrice" DECIMAL NOT NULL,
    "isSpecialPrice" BOOLEAN NOT NULL DEFAULT false,
    "specialPriceMinQty" INTEGER,
    CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "whatsapp_changes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "previousNumber" TEXT NOT NULL,
    "newNumber" TEXT NOT NULL,
    "changeReason" TEXT NOT NULL DEFAULT 'user_request',
    "changedBy" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "whatsapp_changes_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "idx_categories_display_order" ON "categories"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE INDEX "idx_brands_display_order" ON "brands"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "idx_products_active_category" ON "products"("isActive", "categoryId");

-- CreateIndex
CREATE INDEX "idx_products_brand" ON "products"("brandId");

-- CreateIndex
CREATE INDEX "idx_products_price" ON "products"("price");

-- CreateIndex
CREATE INDEX "idx_products_special_price" ON "products"("specialPrice");

-- CreateIndex
CREATE INDEX "idx_products_created_at" ON "products"("createdAt");

-- CreateIndex
CREATE INDEX "idx_products_name" ON "products"("name");

-- CreateIndex
CREATE INDEX "idx_products_category" ON "products"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "kits_slug_key" ON "kits"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "kit_items_kitId_productId_key" ON "kit_items"("kitId", "productId");

-- CreateIndex
CREATE INDEX "tracking_events_sessionId_idx" ON "tracking_events"("sessionId");

-- CreateIndex
CREATE INDEX "tracking_events_eventType_idx" ON "tracking_events"("eventType");

-- CreateIndex
CREATE INDEX "tracking_events_phoneNumber_idx" ON "tracking_events"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_journeys_sessionId_key" ON "user_journeys"("sessionId");

-- CreateIndex
CREATE INDEX "idx_user_journey_session" ON "user_journeys"("sessionId");

-- CreateIndex
CREATE INDEX "idx_user_journey_phone" ON "user_journeys"("phoneNumber");

-- CreateIndex
CREATE INDEX "idx_user_journey_webhook" ON "user_journeys"("webhookSent");

-- CreateIndex
CREATE INDEX "idx_user_journey_cart_value" ON "user_journeys"("cartValue");

-- CreateIndex
CREATE INDEX "idx_user_journey_interest_score" ON "user_journeys"("interestScore");

-- CreateIndex
CREATE INDEX "idx_user_journey_session_start" ON "user_journeys"("sessionStart");

-- CreateIndex
CREATE INDEX "idx_user_journey_created_at" ON "user_journeys"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "idx_orders_number" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "idx_orders_original_whatsapp" ON "orders"("originalWhatsapp");

-- CreateIndex
CREATE INDEX "idx_orders_current_whatsapp" ON "orders"("currentWhatsapp");

-- CreateIndex
CREATE INDEX "idx_orders_status" ON "orders"("status");

-- CreateIndex
CREATE INDEX "idx_orders_assigned_seller" ON "orders"("assignedSeller");

-- CreateIndex
CREATE INDEX "idx_orders_created_at" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "idx_orders_status_seller" ON "orders"("status", "assignedSeller");

-- CreateIndex
CREATE INDEX "idx_orders_created_status" ON "orders"("createdAt", "status");

-- CreateIndex
CREATE INDEX "idx_orders_total_value" ON "orders"("totalValue");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- CreateIndex
CREATE INDEX "whatsapp_changes_orderId_idx" ON "whatsapp_changes"("orderId");

-- CreateIndex
CREATE INDEX "whatsapp_changes_previousNumber_idx" ON "whatsapp_changes"("previousNumber");

-- CreateIndex
CREATE INDEX "whatsapp_changes_newNumber_idx" ON "whatsapp_changes"("newNumber");
