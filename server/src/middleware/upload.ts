import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/profile-pics";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, _file, cb) => {
    cb(null, `${req.userId}.jpg`);
  },
});

export const uploadProfilePic = multer({
  storage,
  limits: { fileSize: 300 * 1024 }, // 300 KB
});
