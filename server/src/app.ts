const express = require('express');
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import cors from 'cors'
const app = express();

app.use(cookieParser())
app.use(express.json())
app.use(cors({
  credentials:true,
  origin:"hhtp://localhost:3000"
}))

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount routers
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// Server start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});