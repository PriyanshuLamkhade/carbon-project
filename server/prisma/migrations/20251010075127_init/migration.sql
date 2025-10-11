-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'NCCR');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'INPROGRESS', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."Nonce" (
    "pubkey" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "public"."User" (
    "userId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "phonenumber" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,
    "pubkey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."History" (
    "historyId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "public"."Status" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "History_pkey" PRIMARY KEY ("historyId")
);

-- CreateTable
CREATE TABLE "public"."Carbon" (
    "carbonId" SERIAL NOT NULL,
    "carbonCleaned" INTEGER,
    "tokensIssued" INTEGER,
    "historyId" INTEGER NOT NULL,

    CONSTRAINT "Carbon_pkey" PRIMARY KEY ("carbonId")
);

-- CreateTable
CREATE TABLE "public"."Submission" (
    "submissionId" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "geoTag" JSONB,
    "description" TEXT,
    "areaclaim" INTEGER NOT NULL,
    "historyId" INTEGER NOT NULL,
    "submissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("submissionId")
);

-- CreateTable
CREATE TABLE "public"."Verification" (
    "verificationId" SERIAL NOT NULL,
    "actualArea" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "historyId" INTEGER NOT NULL,
    "verifiedBy" TEXT,
    "verificationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("verificationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nonce_pubkey_key" ON "public"."Nonce"("pubkey");

-- CreateIndex
CREATE UNIQUE INDEX "User_pubkey_key" ON "public"."User"("pubkey");

-- CreateIndex
CREATE UNIQUE INDEX "Carbon_historyId_key" ON "public"."Carbon"("historyId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_historyId_key" ON "public"."Submission"("historyId");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_historyId_key" ON "public"."Verification"("historyId");

-- AddForeignKey
ALTER TABLE "public"."History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Carbon" ADD CONSTRAINT "Carbon_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "public"."History"("historyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "public"."History"("historyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Verification" ADD CONSTRAINT "Verification_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "public"."History"("historyId") ON DELETE RESTRICT ON UPDATE CASCADE;
