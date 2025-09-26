import express from 'express';
import cookieParser from 'cookie-parser'

const app = express();
app.use(cookieParser())


const userRouter = express.Router();

userRouter.get('/auth/nonce',(req,res)=>{
    const nonce = Math.random().toString(36).substring(2);
    res.json({ nonce });
})
userRouter.post('/api/auth/verify',(req,res)=>{
    
})
userRouter.get('/history',(req,res)=>{

})

userRouter.get('/data',(req,res)=>{
    
})

userRouter.post('/userForm',(req,res)=>{
    
})
export default userRouter;