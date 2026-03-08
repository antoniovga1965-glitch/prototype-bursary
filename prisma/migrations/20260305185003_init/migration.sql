-- AlterTable
ALTER TABLE "registered_users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "token" TEXT;
