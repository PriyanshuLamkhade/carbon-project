-- DropForeignKey
ALTER TABLE "public"."Carbon" DROP CONSTRAINT "Carbon_historyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."History" DROP CONSTRAINT "History_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Submission" DROP CONSTRAINT "Submission_historyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Verification" DROP CONSTRAINT "Verification_historyId_fkey";

-- CreateTable
CREATE TABLE "Admin" (
    "adminId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phonenumber" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId")
);

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carbon" ADD CONSTRAINT "Carbon_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "History"("historyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "History"("historyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "History"("historyId") ON DELETE CASCADE ON UPDATE CASCADE;
