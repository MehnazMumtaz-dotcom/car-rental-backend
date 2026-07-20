/*
  Warnings:

  - You are about to drop the column `city` on the `Admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "city";

-- CreateIndex
CREATE INDEX "Complaint_companyId_idx" ON "Complaint"("companyId");

-- CreateIndex
CREATE INDEX "Complaint_assignedToId_idx" ON "Complaint"("assignedToId");

-- CreateIndex
CREATE INDEX "Complaint_createdById_idx" ON "Complaint"("createdById");
