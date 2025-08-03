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
CREATE INDEX "whatsapp_changes_orderId_idx" ON "whatsapp_changes"("orderId");

-- CreateIndex
CREATE INDEX "whatsapp_changes_previousNumber_idx" ON "whatsapp_changes"("previousNumber");

-- CreateIndex
CREATE INDEX "whatsapp_changes_newNumber_idx" ON "whatsapp_changes"("newNumber");
