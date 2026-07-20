/*
  Warnings:

  - You are about to drop the column `vehicleName` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `city` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyRate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'ONLINE');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "vehicleName",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "cnic" TEXT,
ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "dailyRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "dropTime" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "pickupTime" TEXT,
ADD COLUMN     "vehicleId" INTEGER NOT NULL,
ALTER COLUMN "advance" SET DEFAULT 0;
