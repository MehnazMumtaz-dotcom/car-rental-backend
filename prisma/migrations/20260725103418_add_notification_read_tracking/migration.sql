-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "readBy" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- CreateIndex
CREATE INDEX "Notification_companyId_idx" ON "Notification"("companyId");
