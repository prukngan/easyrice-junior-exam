import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    const count = await prisma.standard.count();
    console.log('STANDARD_COUNT=' + count);
    const records = await prisma.standard.findMany();
    console.log('RECORDS=', JSON.stringify(records));
}

main().finally(() => prisma.$disconnect());
