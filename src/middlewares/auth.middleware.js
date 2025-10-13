import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

async function verifyJWT(req, res, next){
    try {
        const token = req.cookies?.token
    
        if(!token){
            return res.status(401).json({
                message : "Unauthorised request",
                success : false
            })
        }
    
        const decodedValue = jwt.verify(token, process.env.JWT_SECRET)
    
        const user = await User.findById(decodedValue?.id).select("-password")
    
        if(!user){
            return res.status(400).json({
                message : "Token is not valid",
                success : false
            })
        }
        
        req.user = user
        next()
    } catch (error) {
        return res.status(400).json({
            message : "Token is not valid",
            success : false
        })
    }
}

async function verifyAdmin(req,res,next) {
    try {
        if(req.user.role !== "admin"){
            return res.status(401).json({
                message : "Unauthorised request",
                success : false
            })
        }
        next()
    } catch (error) {
        return res.status(400).json({
            message : "Error in verify admin middleware",
            success : false
        })
    }
}

export { verifyJWT, verifyAdmin }