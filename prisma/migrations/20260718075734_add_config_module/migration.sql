/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `Config` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE config_id_seq;
ALTER TABLE "Config" ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('config_id_seq'),
ALTER COLUMN "commissionType" SET DEFAULT 'FLAT';
ALTER SEQUENCE config_id_seq OWNED BY "Config"."id";

-- CreateIndex
CREATE UNIQUE INDEX "Config_companyId_key" ON "Config"("companyId");

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
