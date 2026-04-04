/*
  Warnings:

  - Added the required column `AGB` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `BGB` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annualCO2` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgHeight` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boundaryMatch` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confidence` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `decision` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `density` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `illegalActivity` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantationHealth` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantingMethod` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pollution` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soilCarbon` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soilCondition` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soilQuality` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `survivalRate` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCarbon` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waterCondition` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "AGB" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "BGB" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "annualCO2" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "avgHeight" TEXT NOT NULL,
ADD COLUMN     "boundaryMatch" TEXT NOT NULL,
ADD COLUMN     "boundaryPoints" JSON,
ADD COLUMN     "confidence" TEXT NOT NULL,
ADD COLUMN     "decision" "Status" NOT NULL,
ADD COLUMN     "density" TEXT NOT NULL,
ADD COLUMN     "illegalActivity" TEXT NOT NULL,
ADD COLUMN     "images" JSON,
ADD COLUMN     "mortalityCause" TEXT,
ADD COLUMN     "plantationHealth" TEXT NOT NULL,
ADD COLUMN     "plantingMethod" TEXT NOT NULL,
ADD COLUMN     "pollution" TEXT NOT NULL,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "score" INTEGER NOT NULL,
ADD COLUMN     "soilCarbon" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "soilCondition" TEXT NOT NULL,
ADD COLUMN     "soilQuality" TEXT NOT NULL,
ADD COLUMN     "survivalRate" INTEGER NOT NULL,
ADD COLUMN     "totalCarbon" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "waterCondition" TEXT NOT NULL;
