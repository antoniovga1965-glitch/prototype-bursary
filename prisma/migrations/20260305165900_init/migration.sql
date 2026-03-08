-- CreateTable
CREATE TABLE "Registered_users" (
    "id" SERIAL NOT NULL,
    "REGISTERNAME" TEXT NOT NULL,
    "REGISTEREMAIL" TEXT NOT NULL,
    "PHONENO" TEXT NOT NULL,
    "REGPASS1" TEXT NOT NULL,

    CONSTRAINT "Registered_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Registered_users_REGISTEREMAIL_key" ON "Registered_users"("REGISTEREMAIL");
