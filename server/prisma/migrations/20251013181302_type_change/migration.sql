/*
  Warnings:

  - You are about to drop the column `speacies1_count` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `speacies2_count` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `speacies3_count` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `species1_count` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Submission" DROP COLUMN "speacies1_count",
DROP COLUMN "speacies2_count",
DROP COLUMN "speacies3_count",
ADD COLUMN     "species1_count" INTEGER NOT NULL,
ADD COLUMN     "species2_count" INTEGER,
ADD COLUMN     "species3_count" INTEGER,
ALTER COLUMN "trained" SET DATA TYPE TEXT;
