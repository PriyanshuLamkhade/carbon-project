-- AlterTable
ALTER TABLE "Monitoring" ADD COLUMN     "mintedAt" TIMESTAMP(3),
ADD COLUMN     "tokensIssued" DOUBLE PRECISION,
ADD COLUMN     "txHash" TEXT;
