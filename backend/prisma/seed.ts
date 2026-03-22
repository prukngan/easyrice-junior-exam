import "dotenv/config";
import { PrismaClient, Shape, Condition } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from 'fs';
import * as path from 'path';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required for Prisma.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    const jsonPath = path.join(__dirname, '../data/standards.json');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    for (const standardData of data) {
      console.log(`Processing Standard: ${standardData.name} (ID: ${standardData.id})`);

      // 1. Upsert Standard
      const standard = await prisma.standard.upsert({
        where: { id: standardData.id },
        update: {
          name: standardData.name,
          createDate: new Date(standardData.createDate),
        },
        create: {
          id: standardData.id,
          name: standardData.name,
          createDate: new Date(standardData.createDate),
        },
      });

      // 2. Clear old SubStandards for this standard to ensure clean seed
      await prisma.subStandard.deleteMany({
        where: { standardId: standard.id },
      });

      // 3. Create SubStandards
      if (standardData.standardData && Array.isArray(standardData.standardData)) {
        for (const subItem of standardData.standardData) {
          await prisma.subStandard.create({
            data: {
              key: subItem.key,
              name: subItem.name,
              maxLength: subItem.maxLength,
              minLength: subItem.minLength,
              conditionMax: subItem.conditionMax as Condition,
              conditionMin: subItem.conditionMin as Condition,
              shapes: subItem.shape as Shape[], // Mapping 'shape' in JSON to 'shapes' in DB
              standardId: standard.id,
            },
          });
        }
      }
    }

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
