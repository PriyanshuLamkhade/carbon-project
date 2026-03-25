import jwt from "jsonwebtoken";

import { oauth2client } from "../config/googleConfig.js";
import axios from "axios";
import TryCatch from "../middleware/trycatch.js";
import { db } from "../index.js";
import { AuthenticatedRequest } from "../middleware/users.js";

export const loginUser = TryCatch(async (req, res) => {
  const { code } = req.body;
   const userId = req.userId;
  if (!code) {
    return res.status(400).json({
      message: "Authorization code is required",
    });
  }

  const googleRes = await oauth2client.getToken(code);

  oauth2client.setCredentials(googleRes.tokens);

  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
  );
  const { email, name, picture } = userRes.data;

  let user = await db.user.findFirst({ where: {email} });

  if (!user) {
    user = await db.user.create({
      data: {
        name,
        email,
        profileImage: picture,
      },
    });
  }

  const token = jwt.sign({ userId: user.userId }, process.env.JWT_USER_SECRET as string, {
  expiresIn: "15d",
});
  res.cookie("token", token, {
      httpOnly: true, // Required for security
      secure: false, // false for localhost (true only on HTTPS)
      sameSite: "lax", // "lax" is fine for same-origin-ish setup
      // sameSite: "none",     // use this if frontend/backend are on different domains AND you're using HTTPS
      path: "/",
    })
    .json({ message: "Signup successful" });
});

const allowedRoles = ["USER","VALIDATOR","NCCR"] as const;
type Role = (typeof allowedRoles)[number];

export const addUserRole = TryCatch(async (req:AuthenticatedRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  const { role } = req.body as { role: Role };
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      message: "Invalid Role",
    });
  }
  const user = await db.user.update({
    where:{ userId },
    data: { role},
  }
  );
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  const token = jwt.sign({ userId }, process.env.JWT_USER_SECRET as string, {
    expiresIn: "15d",
  });

  res.json({ user, token });
});

export const myProfile = TryCatch(async (req, res) => {
  const userId = req.userId;
  if(!userId){
    return res.json({"message":"user not found"})
  }
  const user = await db.user.findUnique({where:{userId}})
  res.json(user);
});
