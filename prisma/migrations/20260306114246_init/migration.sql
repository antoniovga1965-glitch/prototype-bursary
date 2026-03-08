-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "hashedfile" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "applicant_Id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "files_hashedfile_key" ON "files"("hashedfile");
