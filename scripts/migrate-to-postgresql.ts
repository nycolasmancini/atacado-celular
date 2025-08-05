import { PrismaClient as SqlitePrismaClient } from '@prisma/client';
import { PrismaClient as PostgresqlPrismaClient } from '@prisma/client';

// Configuração para SQLite (dados existentes)
const sqliteClient = new SqlitePrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db'
    }
  }
});

// Configuração para PostgreSQL (destino)
const postgresqlClient = new PostgresqlPrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://nycolasmancini@localhost:5432/atacado_celular?schema=public'
    }
  }
});

interface MigrationStats {
  table: string;
  exported: number;
  imported: number;
  status: 'success' | 'error';
  error?: string;
}

async function migrateData(): Promise<MigrationStats[]> {
  const stats: MigrationStats[] = [];

  try {
    console.log('🚀 Iniciando migração SQLite → PostgreSQL...\n');

    // 1. Migrar Categories
    console.log('📁 Migrando Categorias...');
    const categories = await sqliteClient.category.findMany();
    
    try {
      await postgresqlClient.$transaction(async (tx) => {
        for (const category of categories) {
          await tx.category.upsert({
            where: { slug: category.slug },
            update: {
              name: category.name,
              description: category.description,
              isActive: category.isActive,
              updatedAt: category.updatedAt,
            },
            create: {
              name: category.name,
              slug: category.slug,
              description: category.description,
              isActive: category.isActive,
              createdAt: category.createdAt,
              updatedAt: category.updatedAt,
            }
          });
        }
      });

      stats.push({
        table: 'categories',
        exported: categories.length,
        imported: categories.length,
        status: 'success'
      });
      console.log(`✅ ${categories.length} categorias migradas com sucesso`);
    } catch (error) {
      stats.push({
        table: 'categories',
        exported: categories.length,
        imported: 0,
        status: 'error',
        error: String(error)
      });
      console.error('❌ Erro ao migrar categorias:', error);
    }

    // 2. Migrar Products
    console.log('\n🛍️ Migrando Produtos...');
    const products = await sqliteClient.product.findMany();
    
    try {
      await postgresqlClient.$transaction(async (tx) => {
        for (const product of products) {
          await tx.product.upsert({
            where: { slug: product.slug },
            update: {
              name: product.name,
              description: product.description,
              price: product.price,
              specialPrice: product.specialPrice,
              specialPriceMinQty: product.specialPriceMinQty,
              categoryId: product.categoryId,
              imageUrl: product.imageUrl,
              modelsImageUrl: product.modelsImageUrl,
              isActive: product.isActive,
              updatedAt: product.updatedAt,
            },
            create: {
              name: product.name,
              slug: product.slug,
              description: product.description,
              price: product.price,
              specialPrice: product.specialPrice,
              specialPriceMinQty: product.specialPriceMinQty,
              categoryId: product.categoryId,
              imageUrl: product.imageUrl,
              modelsImageUrl: product.modelsImageUrl,
              isActive: product.isActive,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
            }
          });
        }
      });

      stats.push({
        table: 'products',
        exported: products.length,
        imported: products.length,
        status: 'success'
      });
      console.log(`✅ ${products.length} produtos migrados com sucesso`);
    } catch (error) {
      stats.push({
        table: 'products',
        exported: products.length,
        imported: 0,
        status: 'error',
        error: String(error)
      });
      console.error('❌ Erro ao migrar produtos:', error);
    }

    // 3. Migrar Kits
    console.log('\n📦 Migrando Kits...');
    const kits = await sqliteClient.kit.findMany({
      include: { items: true }
    });
    
    try {
      await postgresqlClient.$transaction(async (tx) => {
        for (const kit of kits) {
          await tx.kit.upsert({
            where: { slug: kit.slug },
            update: {
              name: kit.name,
              description: kit.description,
              imageUrl: kit.imageUrl,
              totalPrice: kit.totalPrice,
              discount: kit.discount,
              colorTheme: kit.colorTheme,
              isActive: kit.isActive,
              updatedAt: kit.updatedAt,
            },
            create: {
              name: kit.name,
              slug: kit.slug,
              description: kit.description,
              imageUrl: kit.imageUrl,
              totalPrice: kit.totalPrice,
              discount: kit.discount,
              colorTheme: kit.colorTheme,
              isActive: kit.isActive,
              createdAt: kit.createdAt,
              updatedAt: kit.updatedAt,
            }
          });

          // Migrar itens do kit
          for (const item of kit.items) {
            await tx.kitItem.upsert({
              where: {
                kitId_productId: {
                  kitId: item.kitId,
                  productId: item.productId
                }
              },
              update: {
                quantity: item.quantity,
              },
              create: {
                kitId: item.kitId,
                productId: item.productId,
                quantity: item.quantity,
              }
            });
          }
        }
      });

      stats.push({
        table: 'kits',
        exported: kits.length,
        imported: kits.length,
        status: 'success'
      });
      console.log(`✅ ${kits.length} kits migrados com sucesso`);
    } catch (error) {
      stats.push({
        table: 'kits',
        exported: kits.length,
        imported: 0,
        status: 'error',
        error: String(error)
      });
      console.error('❌ Erro ao migrar kits:', error);
    }

    // 4. Migrar Admins
    console.log('\n👤 Migrando Administradores...');
    const admins = await sqliteClient.admin.findMany();
    
    try {
      await postgresqlClient.$transaction(async (tx) => {
        for (const admin of admins) {
          await tx.admin.upsert({
            where: { email: admin.email },
            update: {
              name: admin.name,
              password: admin.password,
              role: admin.role,
              isActive: admin.isActive,
              lastLoginAt: admin.lastLoginAt,
              updatedAt: admin.updatedAt,
            },
            create: {
              email: admin.email,
              name: admin.name,
              password: admin.password,
              role: admin.role,
              isActive: admin.isActive,
              lastLoginAt: admin.lastLoginAt,
              createdAt: admin.createdAt,
              updatedAt: admin.updatedAt,
            }
          });
        }
      });

      stats.push({
        table: 'admins',
        exported: admins.length,
        imported: admins.length,
        status: 'success'
      });
      console.log(`✅ ${admins.length} administradores migrados com sucesso`);
    } catch (error) {
      stats.push({
        table: 'admins',
        exported: admins.length,
        imported: 0,
        status: 'error',
        error: String(error)
      });
      console.error('❌ Erro ao migrar administradores:', error);
    }

    // 5. Migrar Site Config
    console.log('\n⚙️ Migrando Configurações...');
    const siteConfigs = await sqliteClient.siteConfig.findMany();
    
    try {
      await postgresqlClient.$transaction(async (tx) => {
        for (const config of siteConfigs) {
          await tx.siteConfig.upsert({
            where: { id: config.id },
            update: {
              avatarWhatsappUrl: config.avatarWhatsappUrl,
              webhookUrl: config.webhookUrl,
              webhookEnabled: config.webhookEnabled,
              webhookSecretKey: config.webhookSecretKey,
              minSessionTime: config.minSessionTime,
              sessionTimeout: config.sessionTimeout,
              highValueThreshold: config.highValueThreshold,
              updatedAt: config.updatedAt,
            },
            create: {
              avatarWhatsappUrl: config.avatarWhatsappUrl,
              webhookUrl: config.webhookUrl,
              webhookEnabled: config.webhookEnabled,
              webhookSecretKey: config.webhookSecretKey,
              minSessionTime: config.minSessionTime,
              sessionTimeout: config.sessionTimeout,
              highValueThreshold: config.highValueThreshold,
              createdAt: config.createdAt,
              updatedAt: config.updatedAt,
            }
          });
        }
      });

      stats.push({
        table: 'site_config',
        exported: siteConfigs.length,
        imported: siteConfigs.length,
        status: 'success'
      });
      console.log(`✅ ${siteConfigs.length} configurações migradas com sucesso`);
    } catch (error) {
      stats.push({
        table: 'site_config',
        exported: siteConfigs.length,
        imported: 0,
        status: 'error',
        error: String(error)
      });
      console.error('❌ Erro ao migrar configurações:', error);
    }

    // 6. Migrar Tracking Events (tabela com muitos dados - fazer em lotes)
    console.log('\n📊 Migrando Eventos de Tracking...');
    const trackingEventsCount = await sqliteClient.trackingEvent.count();
    const BATCH_SIZE = 1000;
    let trackingMigrated = 0;
    
    try {
      for (let skip = 0; skip < trackingEventsCount; skip += BATCH_SIZE) {
        const trackingEvents = await sqliteClient.trackingEvent.findMany({
          skip,
          take: BATCH_SIZE,
          orderBy: { id: 'asc' }
        });

        await postgresqlClient.$transaction(async (tx) => {
          for (const event of trackingEvents) {
            await tx.trackingEvent.create({
              data: {
                sessionId: event.sessionId,
                eventType: event.eventType,
                phoneNumber: event.phoneNumber,
                userAgent: event.userAgent,
                ipAddress: event.ipAddress,
                metadata: event.metadata,
                createdAt: event.createdAt,
              }
            });
          }
        });

        trackingMigrated += trackingEvents.length;
        console.log(`📈 Migrados ${trackingMigrated}/${trackingEventsCount} eventos de tracking...`);
      }

      stats.push({
        table: 'tracking_events',
        exported: trackingEventsCount,
        imported: trackingMigrated,
        status: 'success'
      });
      console.log(`✅ ${trackingMigrated} eventos de tracking migrados com sucesso`);
    } catch (error) {
      stats.push({
        table: 'tracking_events',
        exported: trackingEventsCount,
        imported: trackingMigrated,
        status: 'error',
        error: String(error)
      });
      console.error('❌ Erro ao migrar eventos de tracking:', error);
    }

    return stats;

  } catch (error) {
    console.error('💥 Erro geral na migração:', error);
    throw error;
  } finally {
    await sqliteClient.$disconnect();
    await postgresqlClient.$disconnect();
  }
}

// Executar migração
async function main() {
  try {
    const stats = await migrateData();
    
    console.log('\n📋 RESUMO DA MIGRAÇÃO:');
    console.log('═══════════════════════════════════════');
    
    let totalExported = 0;
    let totalImported = 0;
    let successfulTables = 0;
    
    stats.forEach(stat => {
      const status = stat.status === 'success' ? '✅' : '❌';
      console.log(`${status} ${stat.table.padEnd(20)} | ${stat.imported}/${stat.exported} registros`);
      
      if (stat.error) {
        console.log(`   Erro: ${stat.error.substring(0, 100)}...`);
      }
      
      totalExported += stat.exported;
      totalImported += stat.imported;
      if (stat.status === 'success') successfulTables++;
    });
    
    console.log('═══════════════════════════════════════');
    console.log(`📊 Total: ${totalImported}/${totalExported} registros migrados`);
    console.log(`🎯 Sucesso: ${successfulTables}/${stats.length} tabelas`);
    
    if (successfulTables === stats.length) {
      console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
      console.log('Agora você pode usar PostgreSQL com performance otimizada.');
    } else {
      console.log('\n⚠️ MIGRAÇÃO PARCIALMENTE CONCLUÍDA');
      console.log('Algumas tabelas apresentaram erros. Verifique os logs acima.');
    }
    
  } catch (error) {
    console.error('\n💥 FALHA NA MIGRAÇÃO:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { migrateData };