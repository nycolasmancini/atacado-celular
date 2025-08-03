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

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_originalWhatsapp_idx" ON "orders"("originalWhatsapp");

-- CreateIndex
CREATE INDEX "orders_currentWhatsapp_idx" ON "orders"("currentWhatsapp");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_assignedSeller_idx" ON "orders"("assignedSeller");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");
