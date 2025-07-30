-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_kits" (
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
INSERT INTO "new_kits" ("colorTheme", "createdAt", "description", "id", "imageUrl", "isActive", "name", "slug", "totalPrice", "updatedAt") SELECT "colorTheme", "createdAt", "description", "id", "imageUrl", "isActive", "name", "slug", "totalPrice", "updatedAt" FROM "kits";
DROP TABLE "kits";
ALTER TABLE "new_kits" RENAME TO "kits";
CREATE UNIQUE INDEX "kits_slug_key" ON "kits"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
