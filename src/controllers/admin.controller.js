import { FAQ } from "../models/faq.model.js"
import { User } from "../models/user.model.js"

async function addUser(req,res){
    try {
        const {username, password, email, role} = req.body
    
        if( !username?.trim() || !password?.trim() || !email?.trim() || !role?.trim()){
            return res.status(400).json({
                message : "All fields are required",
                success : false
            })
        }
    
        const checkUsernameExist = await User.findOne({username: username})
    
        if(checkUsernameExist){
             return res.status(400).json({
                message : "Username alrady exists",
                success : false
            })
        }
    
        const checkEmailExist = await User.findOne({email: email})
    
        if(checkEmailExist){
            return res.status(400).json({
                message : "Email alrady exists",
                success : false
            })
        }
        
        if(role && role?.trim() !== "user" && role?.trim() !== "admin"){
            return res.status(400).json({
                message : "Role must be user or admin",
                success : false
            })
        }

        const createdUser = await User.create({
            username,
            email,
            password,
            role,
        })
    
        const user = await User.findById(createdUser._id).select("-password")
    
        return res.status(200).json({
            message: "user created successfully",
            user: user,
            success : true,
        })
    } catch (error) {
        return res.status(500).json({
            message : "Error in adduser controller",
            success : false
        })
    }
}

async function showAllUsers(req,res) {
    try {
        const allUsers = await User.find({}).select("-password")

        res.status(200).json({
            message: "all users data",
            data: allUsers,
            success: true,
        })
    } catch (error) {
        return res.status(500).json({
            message : "Error in showAllUsers controller",
            success : false
        })
    }
}

async function showAllFaq(req,res) {
    try {
        const allFaqs = await FAQ.find({}).populate("cat_id").populate("created_by")

        res.status(200).json({
            message: "all faq data",
            data: allFaqs,
            success: true,
        })
    } catch (error) {
        return res.status(500).json({
            message : "Error in showAllFaq controller",
            success : false
        })
    }
}

export {
    addUser,
    showAllFaq,
    showAllUsers,
}