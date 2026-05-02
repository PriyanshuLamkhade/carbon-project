import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import puppeteer from "puppeteer";
import QRCode from "qrcode";

export const generateCertificatePDF = async (data: any) => {
  try {
    console.log("STEP 1: start");

    const filePath = path.join(process.cwd(), "templates", "certificate.hbs");
    console.log("STEP 2: path =", filePath);

    const html = fs.readFileSync(filePath, "utf-8");
    console.log("STEP 3: template loaded");

    const template = handlebars.compile(html);

    let qr = "";
    try {
      qr = await QRCode.toDataURL(
        `http://localhost:3000/certificate/${data.certificateId}`,
      );
      console.log("STEP 4: QR done");
    } catch {
      console.log("QR failed");
    }

    const finalHtml = template({
      ...data,
      wallet: data.wallet?.slice(0, 6) + "..." + data.wallet?.slice(-4),
      qr,
      date: new Date().toDateString(),
    });

    console.log("STEP 5: launching browser");

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    console.log("STEP 6: browser launched");

    const page = await browser.newPage();

    console.log("STEP 7: setting content");

    await page.setContent(finalHtml, {
      waitUntil: "load",
      timeout: 30000,
    });

    console.log("STEP 8: generating PDF");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    console.log("STEP 9: closing browser");

    await browser.close();

    console.log("STEP 10: done");

    return pdf;
  } catch (err) {
    console.error("🔥 REAL PDF ERROR:", err);
    throw err;
  }
};
