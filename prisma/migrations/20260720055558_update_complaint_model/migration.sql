/*
  Warnings:

  - You are about to drop the column `adminId` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `resolved` on the `Complaint` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Complaint` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED');

-- DropForeignKey
ALTER TABLE "Complaint" DROP CONSTRAINT "Complaint_adminId_fkey";

-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "adminId",
DROP COLUMN "resolved",
ADD COLUMN     "assignedToId" INTEGER,
ADD COLUMN     "escalated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "ComplaintStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
