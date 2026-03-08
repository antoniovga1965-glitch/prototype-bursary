/*
  Warnings:

  - You are about to drop the column `uni_admission` on the `university_applications` table. All the data in the column will be lost.
  - You are about to drop the column `uni_birthcert` on the `university_applications` table. All the data in the column will be lost.
  - You are about to drop the column `uni_fee` on the `university_applications` table. All the data in the column will be lost.
  - You are about to drop the column `uni_income_proof` on the `university_applications` table. All the data in the column will be lost.
  - You are about to drop the column `uni_kcpe` on the `university_applications` table. All the data in the column will be lost.
  - You are about to drop the column `uni_kcse` on the `university_applications` table. All the data in the column will be lost.
  - You are about to drop the column `uni_nationalidfile` on the `university_applications` table. All the data in the column will be lost.
  - You are about to drop the column `uni_transcript` on the `university_applications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "university_applications" DROP COLUMN "uni_admission",
DROP COLUMN "uni_birthcert",
DROP COLUMN "uni_fee",
DROP COLUMN "uni_income_proof",
DROP COLUMN "uni_kcpe",
DROP COLUMN "uni_kcse",
DROP COLUMN "uni_nationalidfile",
DROP COLUMN "uni_transcript";
