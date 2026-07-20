-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "escalatedAt" TIMESTAMP(3),
ALTER COLUMN "slaDeadline" DROP NOT NULL;
