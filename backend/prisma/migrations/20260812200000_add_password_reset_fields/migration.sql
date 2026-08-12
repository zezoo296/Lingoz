-- AlterTable
ALTER TABLE "User" ADD COLUMN "passwordResetOtpHash" TEXT,
ADD COLUMN "passwordResetOtpExpiresAt" TIMESTAMP(3),
ADD COLUMN "passwordResetTokenHash" TEXT,
ADD COLUMN "passwordResetTokenExpiresAt" TIMESTAMP(3);
