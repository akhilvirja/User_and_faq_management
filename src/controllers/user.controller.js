import { User } from "../models/user.model.js"
import { z } from 'zod'
import { jwtTokenGenerator } from "../services/jwtTokenGenerator.service.js"
import jwt from "jsonwebtoken"

async function userSignup(req, res){
    try {
        const {username, password, email} = req.body
    
        if(!username?.trim() || !password?.trim() || !email?.trim()){
            return res.status(400).json({
                message : "All fields are required",
                success : false
            })
        }
    
        const checkUsernameExist = await User.findOne({username: username})
    
        if(checkUsernameExist){
             return res.status(400).json({
                message : "Username alrady exist",
                success : false
            })
        }
    
        const checkEmailExist = await User.findOne({email: email})
    
        if(checkEmailExist){
             return res.status(400).json({
                message : "Email alrady exist",
                success : false
            })
        }
    
        const createdUser = await User.create({
            username,
            email,
            password,
        })
    
        const user = await User.findById(createdUser._id).select("-password")
    
        return res.status(200).json({
            message: "user created successfully",
            user: user,
            success : true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
                message : "Error in userSignup controller",
                success : false
        })
    }
}

async function userLogin(req,res) {
    try {
        const {email, password} = req.body
    
        const userSchema = z.object({
            email : z.email().min(1, 'Email Is Required'),
            password : z.string().min(1, 'Password is required')
        })
    
        const result = userSchema.safeParse(req.body)
    
        if(!result.success){
            return res.status(400).json({
                error: z.treeifyError(result.error),
                success: false
            })
        }
    
        const user = await User.findOne({email: email})
    
        if(!user){
            return res.status(404).json({
                message : "user Does not exist",
                success : false
            })
        }
    
        const isPasswordValid = await user.isPasswordCorrect(password)
    
        if(!isPasswordValid){
            return res.status(401).json({
                message : "incorrect credentials",
                success : false
            })
        }

        const token = await jwtTokenGenerator({id: user._id})

        res
        .status(200)
        .cookie("token", token, {secure: true})
        .json({
            message : "user logged in successfully",
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
                message : "Error in userLogin controller",
                success : false
            })
    }
}

function userLogout(req,res){
    res.clearCookie("token").status(200).json({
        message: "user logged out successfully",
    })
}

async function updateUser(req,res) {
    try {
        const {username, email, role} = req.body
    
        if( !username && !email && !role){
            return res.status(400).json({
                message : "atleast one fields are required",
                success : false
            })
        }
    
        if(role && role !== "user" && role !== "admin"){
            return res.status(400).json({
                message : "Role must be either user or admin",
                success : false
            })
        }
    
        const existedUsername = await User.findOne({username:username, _id:{$ne : req.user._id}})
    
        if(existedUsername){
            return res.status(400).json({
                message : "Choosen username already exist",
                success : false
            })
        }
    
        const existedEmail = await User.findOne({email: email, _id:{$ne : req.user._id}})
    
        if(existedEmail){
            return res.status(400).json({
                message : "Choosen email already exist",
                success : false
            })
        }
    
        const updatedUser = await User.findByIdAndUpdate(req.user._id,{username, email, role}, {new: true})
    
        return res.status(200).json({
            message : "User Updated successfully",
            data: updatedUser,
            success : true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message : "Error in updateUser controller",
            success : false
        })
    }
}

async function getUserDetails(req,res) {
    return res.status(200).json({
        message: "your details",
        data: req.user,
        success: true,
    })
}

async function changePassword(req,res) {
    try {
        const {oldPassword, newPassword} = req.body
    
        const passwordSchema = z.object({
            oldPassword: z.string().min(1, "old password is required"),
            newPassword: z.string().min(1, "new password is required")
        })
    
        const parsedData = passwordSchema.safeParse(req.body)
    
        if(!parsedData.success){
            return res.status(400).json({
                message : "all data must be valid",
                error : z.treeifyError(parsedData.error) ,
                success : false
            })
        }

        const user = await User.findById(req.user._id)
    
        const isPasswordvalid = await user.isPasswordCorrect(oldPassword)
    
        if(!isPasswordvalid){
            return res.status(400).json({
                message : "password is incorrect!! Enter correct",
                success : false
            })
        }

        const newLastPasswords = user.lastPasswords.filter((lastPassword) => (new Date().getTime() - lastPassword.createdAt.getTime()) < 3600000)
        user.lastPasswords = newLastPasswords
        await user.save()

        if(user.lastPasswords.length >= 3){
            return res.status(400).json({
                message : "You can change password only 3 time in hour",
                success : false
            })
        }
    
        user.password = newPassword
        await user.save()
        
        user.lastPasswords.push({previousPass: user.password})
        await user.save()

        return res.status(200).json({
            message: "passoword updated successfully",
            succes: true,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error in changePassword Controller",
            succes: true,
        })
    }
}

export {userSignup, userLogin, userLogout, updateUser, getUserDetails, changePassword}