import express from "express";
import cookieParser from "cookie-parser";
import jwt, { type JwtPayload } from "jsonwebtoken";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import validatorRoutes from "./routes/validatorRoutes.js";
import http from "http";
import { WebSocketServer } from "ws";
import { instance } from "./stateManager.js";
import "dotenv/config";
import cloudinary from 'cloudinary'

import {PrismaPg} from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client";
import adminRouter from "./routes/adminRoutes.js";
import industryRouter from "./routes/industry.Routes.js";
import certificateRouter from "./routes/certificateRoutes.js";


const app = express();
const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL})
const JWT_USER_SECRET = process.env.JWT_USER_SECRET;
if (!JWT_USER_SECRET) {
  throw new Error(
    "JWT_USER_SECRET is not defined in the environment variables"
  );
}
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;
if (!JWT_ADMIN_SECRET) {
  throw new Error(
    "JWT_ADMIN_SECRET is not defined in the environment variables"
  );
}
export const db = new PrismaClient({adapter:adapter});
app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({limit:"50mb",extended:true}))

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(cookieParser());
app.use(express.json());

const{CLOUD_NAME,CLOUD_API_KEY,CLOUD_SECRET_KEY} = process.env;

if(!CLOUD_NAME||!CLOUD_API_KEY||!CLOUD_SECRET_KEY){
  throw new Error("Missing Cloudinary environment variables")
}

cloudinary.v2.config({
  cloud_name:CLOUD_NAME,
  api_key:CLOUD_API_KEY,
  api_secret:CLOUD_SECRET_KEY
})

app.use("/users", userRoutes);
app.use("/validator", validatorRoutes);
app.use("/admin",adminRouter)
app.use("/industry", industryRouter);
app.use("/certificate", certificateRouter );

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// wss.on("connection", (ws, req) => {
//   if (!req.url) return ws.close();

//   const params = new URLSearchParams(req.url?.split("?")[1]);
//   const token = params.get("token");
//   const role = params.get("role");

//   if (!token || !role) {
//     ws.close();
//     return;
//   }

//   try {
//     let decoded :any;

//     if (role === "user") {
//       decoded = jwt.verify(token, JWT_USER_SECRET) as JwtPayload & {
//         userId: number;
//       };
//       instance.addUser(decoded.userId, ws);
//       console.log(`User ${decoded.userId} connected`);
//     } else if (role === "admin") {
//       decoded = jwt.verify(token, JWT_ADMIN_SECRET);
//       instance.addAdmin(ws);
//       console.log(`Admin connected`);
//     } else {
//       ws.close(); // invalid role
//     }
//     ws.on("close", () => {
//       if (role === "user" && decoded?.userId) {
//         instance.removeUser(decoded.userId, ws);
//       } else if (role === "admin") {
//         instance.removeAdmin(ws);
//       }
//       console.log(`${role} disconnected`);
//     });
//   } catch (err) {
//     console.error("Invalid token:", err);
//     ws.close();
//   }
// });

// Server start
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
