-- AlterTable
ALTER TABLE "products" ADD COLUMN "modelsImageUrl" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_admins" (
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
INSERT INTO "new_admins" ("createdAt", "email", "id", "isActive", "lastLoginAt", "name", "password", "updatedAt") SELECT "createdAt", "email", "id", "isActive", "lastLoginAt", "name", "password", "updatedAt" FROM "admins";
DROP TABLE "admins";
ALTER TABLE "new_admins" RENAME TO "admins";
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
