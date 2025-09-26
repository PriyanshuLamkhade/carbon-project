import express from 'express'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import cors from 'cors'
const app = express();

app.use(cookieParser())
app.use(express.json())
app.use(cors({
  credentials:true,
  origin:"http://localhost:3000"
}))

import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoute.js'; 

app.use('/users', userRoutes); 
app.use('/admin', adminRoutes); 


// Server start
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});