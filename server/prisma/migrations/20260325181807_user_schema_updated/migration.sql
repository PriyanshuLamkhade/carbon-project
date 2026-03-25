/*
  Warnings:

  - You are about to drop the column `Password` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'VALIDATOR';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Password",
ALTER COLUMN "organisation" DROP NOT NULL,
ALTER COLUMN "phonenumber" DROP NOT NULL,
ALTER COLUMN "surname" DROP NOT NULL;
