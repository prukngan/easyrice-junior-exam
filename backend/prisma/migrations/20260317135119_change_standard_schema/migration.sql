/*
  Warnings:

  - You are about to drop the column `standard_data` on the `standards` table. All the data in the column will be lost.
  - You are about to drop the column `standard_name` on the `standards` table. All the data in the column will be lost.
  - Made the column `name` on table `histories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `note` on table `histories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `standards` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "histories" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "note" SET NOT NULL;

-- AlterTable
ALTER TABLE "standards" DROP COLUMN "standard_data",
DROP COLUMN "standard_name",
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "sub_standards" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shape" TEXT[],
    "max_length" DOUBLE PRECISION NOT NULL,
    "min_length" DOUBLE PRECISION NOT NULL,
    "condition_max" "Condition" NOT NULL,
    "condition_min" "Condition" NOT NULL,
    "standard_id" TEXT NOT NULL,

    CONSTRAINT "sub_standards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sub_standards" ADD CONSTRAINT "sub_standards_standard_id_fkey" FOREIGN KEY ("standard_id") REFERENCES "standards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
