import express from "express";
import {
  industrySignup,
  industryLogin,
  getIndustryMe,
  retireAndGenerateCertificate,
} from "../controller/industry.controller.js";
import { industryMiddleware } from "../middleware/industry.js";


const industryRouter = express.Router();

// 🔐 Auth
industryRouter.post("/signup", industrySignup);
industryRouter.post("/login", industryLogin);

// 🔒 Protected
industryRouter.get("/me", industryMiddleware, getIndustryMe);
industryRouter.post(
  "/retire",
  industryMiddleware,
  retireAndGenerateCertificate
);

export default industryRouter;