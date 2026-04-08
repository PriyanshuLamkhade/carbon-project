/*
  Warnings:

  - The values [APPROVED] on the enum `AssignmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AssignmentStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'EXPIRED');
ALTER TABLE "public"."Assignment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Assignment" ALTER COLUMN "status" TYPE "AssignmentStatus_new" USING ("status"::text::"AssignmentStatus_new");
ALTER TYPE "AssignmentStatus" RENAME TO "AssignmentStatus_old";
ALTER TYPE "AssignmentStatus_new" RENAME TO "AssignmentStatus";
DROP TYPE "public"."AssignmentStatus_old";
ALTER TABLE "Assignment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
