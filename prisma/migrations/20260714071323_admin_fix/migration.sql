/*
  Warnings:

  - The `status` column on the `Admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `companyId` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Admin` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_companyId_fkey";

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "role" SET DEFAULT 'SUB_ADMIN',
ALTER COLUMN "permissions" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "companyId" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "AdminStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "meta" JSONB;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
