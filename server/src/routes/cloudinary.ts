import express,{Router} from 'express'
import cloudinary from 'cloudinary'

const cloudRouter: Router = express.Router();

cloudRouter.post("/upload",async(req,res)=>{
    try {
        const {buffer} = req.body
        const cloud = await cloudinary.v2.uploader.upload(buffer)
    
        res.json({url:cloud.secure_url})
    } catch (error:any) {
        res.status(500).json({message:error.message})
    }
})

export default cloudRouter;
