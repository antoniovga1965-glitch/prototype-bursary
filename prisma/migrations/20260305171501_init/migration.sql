/*
  Warnings:

  - You are about to drop the `Registered_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Registered_users";

-- CreateTable
CREATE TABLE "registered_users" (
    "id" SERIAL NOT NULL,
    "REGISTERNAME" TEXT NOT NULL,
    "REGISTEREMAIL" TEXT NOT NULL,
    "PHONENO" TEXT NOT NULL,
    "REGPASS1" TEXT NOT NULL,

    CONSTRAINT "registered_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "registered_users_REGISTEREMAIL_key" ON "registered_users"("REGISTEREMAIL");
