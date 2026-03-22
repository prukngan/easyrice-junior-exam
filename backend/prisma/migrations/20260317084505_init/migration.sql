-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('GE', 'LE', 'GT', 'LT', 'EQ', 'NE');

-- CreateTable
CREATE TABLE "histories" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inspection_id" TEXT NOT NULL,
    "standard_id" TEXT NOT NULL,
    "note" TEXT,
    "standard_name" TEXT,
    "sampling_date" TIMESTAMP(3),
    "sampling_point" TEXT[],
    "price" DOUBLE PRECISION,
    "image_link" TEXT,
    "standard_data" JSONB NOT NULL,

    CONSTRAINT "histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standards" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "standard_name" TEXT,
    "standard_data" JSONB NOT NULL,

    CONSTRAINT "standards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "histories_inspection_id_key" ON "histories"("inspection_id");
