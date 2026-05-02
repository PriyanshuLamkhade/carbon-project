-- CreateTable
CREATE TABLE "Certificate" (
    "certificateId" TEXT NOT NULL,
    "industryId" INTEGER NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "tokensRetired" DOUBLE PRECISION NOT NULL,
    "carbonOffset" DOUBLE PRECISION NOT NULL,
    "txHash" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("certificateId")
);

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("industryId") ON DELETE RESTRICT ON UPDATE CASCADE;
