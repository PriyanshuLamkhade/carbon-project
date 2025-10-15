import express from 'express'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import {PrismaClient } from "@prisma/client"

export const db = new PrismaClient();

const app = express();
app.use(cors({
  credentials:true,
  origin:"http://localhost:3000"
}))

app.use(cookieParser())
app.use(express.json())

import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoute.js';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken, requireRole } from './middleware/auth.js';

app.use('/auth', authRoutes);
app.use('/users', authenticateToken, userRoutes);
app.use('/admin', authenticateToken, requireRole(['ADMIN']), adminRoutes);


// Server start
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});