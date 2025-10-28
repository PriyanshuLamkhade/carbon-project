  import express from 'express'
  import cookieParser from 'cookie-parser'
  import jwt from 'jsonwebtoken'
  import cors from 'cors'
  import {PrismaClient } from "@prisma/client"
  import userRoutes from './routes/userRoutes.js';
  import adminRoutes from './routes/adminRoute.js'; 
  import http from 'http';
  import {WebSocketServer} from "ws"


  export const db = new PrismaClient();

  const app = express();
  app.use(cors({
    credentials:true,
    origin:"http://localhost:3000"
  }))

  app.use(cookieParser())
  app.use(express.json())



  app.use('/users', userRoutes); 
  app.use('/admin', adminRoutes); 

  const server = http.createServer(app);
  const wss = new WebSocketServer({server})

  wss.on("connection",(ws)=>{
      console.log('✅ New WebSocket client connected');
       ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to WebSocket server' }));
     
     ws.on('close', () => {
    console.log('❌ Client disconnected');
  });

  })
  // Server start
  const PORT = 4000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });