/*
  Warnings:

  - Added the required column `CommunityInvolvementLevel` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MGNREGAPersonDays` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantationDate` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speacies1_count` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `species1` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trained` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Level" AS ENUM ('Low', 'Medium', 'High');

-- AlterTable
ALTER TABLE "public"."Submission" ADD COLUMN     "CommunityInvolvementLevel" "public"."Level" NOT NULL,
ADD COLUMN     "MGNREGAPersonDays" INTEGER NOT NULL,
ADD COLUMN     "plantationDate" TEXT NOT NULL,
ADD COLUMN     "speacies1_count" INTEGER NOT NULL,
ADD COLUMN     "speacies2_count" INTEGER,
ADD COLUMN     "speacies3_count" INTEGER,
ADD COLUMN     "species1" TEXT NOT NULL,
ADD COLUMN     "species2" TEXT,
ADD COLUMN     "species3" TEXT,
ADD COLUMN     "trained" BOOLEAN NOT NULL;
