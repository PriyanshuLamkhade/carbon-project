/*
  Warnings:

  - You are about to drop the column `verifiedBy` on the `Verification` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ValidatorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "verifiedBy",
ADD COLUMN     "validatorId" INTEGER;

-- CreateTable
CREATE TABLE "Validator" (
    "validatorId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "activeProjects" INTEGER NOT NULL DEFAULT 0,
    "maxActiveProjects" INTEGER NOT NULL DEFAULT 3,
    "totalAssigned" INTEGER NOT NULL DEFAULT 0,
    "totalAccepted" INTEGER NOT NULL DEFAULT 0,
    "totalRejected" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "ValidatorStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Validator_pkey" PRIMARY KEY ("validatorId")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "assignmentId" SERIAL NOT NULL,
    "validatorId" INTEGER NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("assignmentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Validator_userId_key" ON "Validator"("userId");

-- AddForeignKey
ALTER TABLE "Validator" ADD CONSTRAINT "Validator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "Validator"("validatorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("submissionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "Validator"("validatorId") ON DELETE SET NULL ON UPDATE CASCADE;
