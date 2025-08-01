import { prisma } from "@/lib/prisma";

export interface BackupData {
  timestamp: string;
  version: string;
  data: {
    products: any[];
    categories: any[];
    kits: any[];
    kitItems: any[];
    tracking: any[];
    siteConfig: any[];
  };
  metadata: {
    totalRecords: number;
    exportedAt: string;
    databaseProvider: string;
  };
}

export async function exportDatabase(): Promise<BackupData> {
  try {
    // Calculate date 30 days ago for tracking data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Export all data
    const [products, categories, kits, kitItems, tracking, siteConfig] = await Promise.all([
      prisma.product.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.category.findMany(),
      prisma.kit.findMany(),
      prisma.kitItem.findMany({
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          kit: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.trackingEvent.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.siteConfig.findMany(),
    ]);

    // Convert Decimal fields to strings for JSON serialization
    const serializedProducts = products.map(product => ({
      ...product,
      price: product.price.toString(),
      specialPrice: product.specialPrice.toString(),
    }));

    const serializedKits = kits.map(kit => ({
      ...kit,
      totalPrice: kit.totalPrice.toString(),
      discount: kit.discount.toString(),
    }));

    const totalRecords = products.length + categories.length + kits.length + kitItems.length + tracking.length + siteConfig.length;

    const backupData: BackupData = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      data: {
        products: serializedProducts,
        categories,
        kits: serializedKits,
        kitItems,
        tracking,
        siteConfig,
      },
      metadata: {
        totalRecords,
        exportedAt: new Date().toISOString(),
        databaseProvider: "sqlite",
      },
    };

    return backupData;
  } catch (error) {
    console.error('Error exporting database:', error);
    throw new Error('Failed to export database');
  }
}

export async function validateBackup(data: any): Promise<boolean> {
  try {
    // Check if data has required structure
    if (!data.timestamp || !data.version || !data.data || !data.metadata) {
      return false;
    }

    // Check if required collections exist
    const requiredCollections = ['products', 'categories', 'kits', 'kitItems', 'tracking', 'siteConfig'];
    for (const collection of requiredCollections) {
      if (!Array.isArray(data.data[collection])) {
        return false;
      }
    }

    // Validate products structure
    if (data.data.products.length > 0) {
      const product = data.data.products[0];
      if (!product.id || !product.name || !product.price) {
        return false;
      }
    }

    // Validate categories structure
    if (data.data.categories.length > 0) {
      const category = data.data.categories[0];
      if (!category.id || !category.name || !category.slug) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error validating backup:', error);
    return false;
  }
}

export async function importDatabase(data: BackupData): Promise<void> {
  try {
    // Validate backup first
    if (!validateBackup(data)) {
      throw new Error('Invalid backup data');
    }

    // This would be used for restore functionality (future implementation)
    // For now, we'll just validate the structure
    console.log('Backup validation successful');
    console.log(`Backup contains ${data.metadata.totalRecords} total records`);
    console.log(`Created at: ${data.metadata.exportedAt}`);
  } catch (error) {
    console.error('Error importing database:', error);
    throw new Error('Failed to import database');
  }
}

export function generateBackupFilename(): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `backup-${timestamp}.json`;
}

export function formatBackupSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}