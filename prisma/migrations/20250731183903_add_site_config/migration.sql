-- CreateTable
CREATE TABLE "site_config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "avatarWhatsappUrl" TEXT NOT NULL DEFAULT '/images/whatsapp-avatar.svg',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
