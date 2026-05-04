-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "lastMonitoringDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Monitoring" (
    "monitoringId" SERIAL NOT NULL,
    "historyId" INTEGER NOT NULL,
    "validatorId" INTEGER NOT NULL,
    "survivalRate" DOUBLE PRECISION NOT NULL,
    "avgHeight" TEXT NOT NULL,
    "plantationHealth" TEXT NOT NULL,
    "waterCondition" TEXT NOT NULL,
    "soilQuality" TEXT NOT NULL,
    "remarks" TEXT,
    "AGB" DOUBLE PRECISION NOT NULL,
    "BGB" DOUBLE PRECISION NOT NULL,
    "soilCarbon" DOUBLE PRECISION NOT NULL,
    "totalCarbon" DOUBLE PRECISION NOT NULL,
    "annualCO2" DOUBLE PRECISION NOT NULL,
    "images" JSONB,
    "monitoredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Monitoring_pkey" PRIMARY KEY ("monitoringId")
);

-- AddForeignKey
ALTER TABLE "Monitoring" ADD CONSTRAINT "Monitoring_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "History"("historyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoring" ADD CONSTRAINT "Monitoring_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "Validator"("validatorId") ON DELETE RESTRICT ON UPDATE CASCADE;
