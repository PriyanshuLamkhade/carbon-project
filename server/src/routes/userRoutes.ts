import express from 'express';
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import cors from 'cors'
const app = express();
app.use(cookieParser())




const userRouter = express.Router();

userRouter.get('/generateNonce',(req,res)=>{
    const nonce = Math.random().toString(36).substring(2);
    res.json({ nonce });
})
userRouter.get('/verify',(req,res)=>{
    
})
userRouter.get('/history',(req,res)=>{

})

userRouter.get('/data',(req,res)=>{
    
})

userRouter.post('/userForm',(req,res)=>{
    
})
