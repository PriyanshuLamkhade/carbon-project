import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express, { Router } from "express";
import fs from "fs";

import jwt from "jsonwebtoken";
import { db } from "../index.js";
import { z } from "zod";
import "dotenv/config";
import { userMiddleware } from "../middleware/users.js";
import { uploadProfilePic } from "../middleware/upload.js";
import { addUserRole, loginUser, myProfile } from "../controller/auth.js";


// import { ed25519 } from "@noble/curves/ed25519.js";
const JWT_USER_SECRET = process.env.JWT_USER_SECRET;
if (!JWT_USER_SECRET) {
  throw new Error(
    "JWT_USER_SECRET is not defined in the environment variables",
  );
}

const userRouter: Router = express.Router();
const phoneSchema = z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits");

userRouter.post("/auth/signup", async (req, res) => {
  
  const { name, surname, phonenumber, organisation, email, password } = req.body;
  const validatedPhoneNumber = phoneSchema.safeParse(phonenumber);

  if (!validatedPhoneNumber.success) {
    res.json({
      message: "Incorrect format",
      error: validatedPhoneNumber.error,
    });
    return;
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser)
    return res.status(409).json({ message: "User already exists" });
  
  const newUser = await db.user.create({
    data: {
      name,
      surname,
      phonenumber: validatedPhoneNumber.data,
      organisation,
      email,
      Password:password
    },
  });

  const token = jwt.sign({ userId: newUser.userId }, JWT_USER_SECRET, {
    expiresIn: "24h",
  });
  res
    .cookie("token", token, {
      httpOnly: true, // Required for security
      secure: false, // false for localhost (true only on HTTPS)
      sameSite: "lax", // "lax" is fine for same-origin-ish setup
      // sameSite: "none",     // use this if frontend/backend are on different domains AND you're using HTTPS
      path: "/",
    })
    .json({ message: "Signup successful" });
});
userRouter.post("/auth/signin", async (req, res) => {
  ;
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }
  const user = await db.user.findUnique({
    where: { email },
  });
  if (!user) {
    res.json({
      message: "User doesnot exists",
    });
    return;
  }
  if (password === user.Password) {
    const token = jwt.sign({ userId: user.userId }, JWT_USER_SECRET, {
      expiresIn: "24h",
    });
    res
      .cookie("token", token, {
        httpOnly: true, // Required for security
        secure: false, // false for localhost (true only on HTTPS)
        sameSite: "lax", // "lax" is fine for same-origin-ish setup
        // sameSite: "none",     // use this if frontend/backend are on different domains AND you're using HTTPS
        path: "/",
      })
      .json({ message: "Signin successful" });
  } else {
    res.json({ message: "Incorrect password" });
  }
});

userRouter.get("/userDetails", userMiddleware, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await db.user.findUnique({
    where: { userId },
    select: {
      userId: true,
      name: true,
      email: true,
      phonenumber: true,
      profileImage: true,
      organisation:true
    },
  });

  res.json({ userDetails: user });
});
userRouter.post(
  "/me/profile-picture",
  userMiddleware,
  uploadProfilePic.single("file"),
  async (req, res) => {
    const userId = req.userId;

    if (!userId || !req.file) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const imagePath = `profile-pics/${userId}.jpg`;

    await db.user.update({
      where: { userId },
      data: { profileImage: imagePath },
    });

    res.json({ message: "Profile picture updated" });
  }
);


userRouter.post("/login",loginUser)
userRouter.put("/add/role",userMiddleware,addUserRole)
userRouter.get("/me",userMiddleware,myProfile)


userRouter.post("/userForm", userMiddleware, async (req, res) => {
  try {
    const {
      location,
      longitude,
      latitude,
      description,
      areaclaim,
      species1,
      species1_count,
      species2,
      species2_count,
      species3,
      species3_count,
      plantationDate,
      CommunityInvolvementLevel,
      MGNREGAPersonDays,
      trained,
      profileImage, // this can be your live camera or uploaded image
    } = req.body;

    const userId = req.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!location || !areaclaim)
      return res
        .status(400)
        .json({ message: "Location and area claim are required" });

    // ✅ Save image locally if present
    let profileImageFileName = null;
    if (profileImage) {
      const buffer = Buffer.from(profileImage, "base64");
      const fileName = `profile_${userId}_${Date.now()}.jpg`;
      const filePath = path.join(__dirname, "../uploads", fileName);

      // Ensure uploads folder exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, buffer);

      profileImageFileName = fileName;

      // Update user profile image in DB (optional, or could be a new column for live image)
      await db.user.update({
        where: { userId },
        data: { profileImage: profileImageFileName },
      });
    }

    // ✅ Create history record
    const history = await db.history.create({
      data: { user: { connect: { userId } }, status: "PENDING" },
    });

    // ✅ Create submission record
    const submission = await db.submission.create({
      data: {
        location,
        longitude,
        latitude,
        description,
        areaclaim,
        species1,
        species1_count,
        species2: species2 || null,
        species2_count: species2_count || null,
        species3: species3 || null,
        species3_count: species3_count || null,
        plantationDate,
        CommunityInvolvementLevel,
        MGNREGAPersonDays,
        trained,
        history: { connect: { historyId: history.historyId } },
      },
    });

    res.json({
      message: "Submission Completed",
      submissionId: submission.submissionId,
      profileImage: profileImageFileName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
});


userRouter.get("/allhistory", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }

    const histories = await db.history.findMany({
      where: {
        userId: userId,
      },
      include: { submission: { select: { location: true } } },
      orderBy: {
        timestamp: "asc",
      },
    });
    return res.status(200).json({ histories: histories });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch history", error });
  }
});

userRouter.post("/previewData", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { historyId } = req.body;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }
    const previewData = await db.history.findUnique({
      where: {
        historyId,
      },
      include: {
        carbon: true,
        submission: true,
      },
    });
    return res.status(200).json({ previewData: previewData });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch previews", error });
  }
});
userRouter.delete("/deleteSubmission", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { historyId } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }

    const data = await db.history.findUnique({ where: { historyId } });

    if (!data) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (data.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: Not your record" });
    }

    if (data.status !== "PENDING") {
      return res.status(400).json({
        message: "Only records with status 'INPROGRESS' can be deleted",
      });
    }

    await db.history.delete({ where: { historyId } });

    return res.status(200).json({ message: "Record deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete record", error });
  }
});

export default userRouter;
