/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[pubkey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organisation` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phonenumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pubkey` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'NCCR');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'INPROGRESS', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('Low', 'Medium', 'High');

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_adminId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "password",
DROP COLUMN "photo",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "organisation" TEXT NOT NULL,
ADD COLUMN     "phonenumber" TEXT NOT NULL,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "pubkey" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "surname" TEXT NOT NULL,
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "Room";

-- CreateTable
CREATE TABLE "Admin" (
    "adminId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phonenumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "History" (
    "historyId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "History_pkey" PRIMARY KEY ("historyId")
);

-- CreateTable
CREATE TABLE "Carbon" (
    "carbonId" SERIAL NOT NULL,
    "carbonCleaned" INTEGER,
    "tokensIssued" INTEGER,
    "historyId" INTEGER NOT NULL,

    CONSTRAINT "Carbon_pkey" PRIMARY KEY ("carbonId")
);

-- CreateTable
CREATE TABLE "Submission" (
    "submissionId" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "geoTag" JSONB,
    "description" TEXT,
    "areaclaim" INTEGER NOT NULL,
    "species1" TEXT NOT NULL,
    "species1_count" INTEGER NOT NULL,
    "species2" TEXT,
    "species2_count" INTEGER,
    "species3" TEXT,
    "species3_count" INTEGER,
    "plantationDate" TEXT NOT NULL,
    "CommunityInvolvementLevel" "Level" NOT NULL,
    "MGNREGAPersonDays" INTEGER NOT NULL,
    "trained" TEXT NOT NULL,
    "historyId" INTEGER NOT NULL,
    "submissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("submissionId")
);

-- CreateTable
CREATE TABLE "Verification" (
    "verificationId" SERIAL NOT NULL,
    "actualArea" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "historyId" INTEGER NOT NULL,
    "verifiedBy" TEXT,
    "verificationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("verificationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Carbon_historyId_key" ON "Carbon"("historyId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_historyId_key" ON "Submission"("historyId");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_historyId_key" ON "Verification"("historyId");

-- CreateIndex
CREATE UNIQUE INDEX "User_pubkey_key" ON "User"("pubkey");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carbon" ADD CONSTRAINT "Carbon_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "History"("historyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "History"("historyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "History"("historyId") ON DELETE CASCADE ON UPDATE CASCADE;
