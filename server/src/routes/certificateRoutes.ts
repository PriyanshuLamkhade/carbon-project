import express from "express";
import { db } from "../index.js";
import { generateCertificatePDF } from "../utils/generateCertificate.js";

const certificateRouter = express.Router();

certificateRouter.get("/:id/download", async (req, res) => {
    try {
      console.log("Launching browser...");
    const cert = await db.certificate.findUnique({
      where: { certificateId: req.params.id },
      include: { industry: true },
    });

    if (!cert) return res.status(404).json({ error: "Not found" });
console.log("Starting1111 PDF generation");
    const pdf = await generateCertificatePDF({
      certificateId: cert.certificateId,
      companyName: cert.industry.companyName,
      tokens: cert.tokensRetired,
      carbon: cert.carbonOffset,
      wallet: cert.walletAddress,
      txHash: cert.txHash,
      reason: cert.reason,
    });
console.log("Starting PDF generation");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=carbon-certificate-${cert.industry.companyName}.pdf`,
    );

    res.send(pdf);
  } catch (error) {
    res.status(500).json({ error: "PDF generation failed" });
  }
});
certificateRouter.get("/:id", async (req, res) => {
  try {
    const cert = await db.certificate.findUnique({
      where: { certificateId: req.params.id },
      include: { industry: true },
    });

    if (!cert) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(cert);
  } catch (err) {
     console.error("PDF ERROR:", err);
  res.status(500).json({ error: "PDF generation failed" });
  }
});

export default certificateRouter;
