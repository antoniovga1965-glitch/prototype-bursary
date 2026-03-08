-- CreateTable
CREATE TABLE "unifiles" (
    "id" SERIAL NOT NULL,
    "hashedfile" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "applicant_Id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unifiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_applications" (
    "id" SERIAL NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "uni_fullname" TEXT NOT NULL,
    "uni_dob" TEXT NOT NULL,
    "uni_nationalid" TEXT NOT NULL,
    "uni_email" TEXT NOT NULL,
    "uni_phone" TEXT NOT NULL,
    "uni_institution" TEXT NOT NULL,
    "uni_regnumber" TEXT NOT NULL,
    "uni_course" TEXT NOT NULL,
    "uni_year" TEXT NOT NULL,
    "uni_gpa" TEXT NOT NULL,
    "tertiary_email" TEXT NOT NULL,
    "uni_guardian" TEXT NOT NULL,
    "uni_income" TEXT NOT NULL,
    "uni_county" TEXT NOT NULL,
    "uni_subcounty" TEXT NOT NULL,
    "uni_ward" TEXT NOT NULL,
    "uni_birthcert" TEXT,
    "uni_nationalidfile" TEXT,
    "uni_admission" TEXT,
    "uni_transcript" TEXT,
    "uni_kcse" TEXT,
    "uni_kcpe" TEXT,
    "uni_fee" TEXT,
    "uni_income_proof" TEXT,
    "ocr_data" TEXT,
    "flags" TEXT,
    "riskpoints" INTEGER NOT NULL DEFAULT 0,
    "incomeScore" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unifiles_hashedfile_key" ON "unifiles"("hashedfile");
