-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "avatar" TEXT,
    "phone" TEXT,
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "lastLoginDevice" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_adminId_key" ON "Profile"("adminId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
