-- AlterTable
ALTER TABLE "Monitoring" ADD COLUMN     "blockchainTx" TEXT,
ADD COLUMN     "metadataHash" TEXT,
ADD COLUMN     "metadataJson" JSONB;
