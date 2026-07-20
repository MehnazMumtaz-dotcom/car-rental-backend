-- CreateEnum
CREATE TYPE "BookingSource" AS ENUM ('WALK_IN', 'ONLINE');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "source" "BookingSource" NOT NULL DEFAULT 'WALK_IN';

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "updatedAt" DROP DEFAULT;
