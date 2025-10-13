import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

const lastPasswordsSchema = new Schema(
    {
        previousPass: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

const userSchema = new mongoose.Schema(
    {
        username : {
            type: String,
            unique: true,
            trim: true,
            required: true,
        },
        password : {
            type: String,
            required: true,
        },
        email : {
            type: String,
            unique: true,
            required: true,
        },
        role : {
            type: String,
            enum : ['admin', 'user'],
            default : 'user',
        },
        lastPasswords : [
            lastPasswordsSchema,
        ]
    },
    {
        timestamps: true
    }
)

userSchema.pre("save",async function(next){
    if (!this.isModified("password")){
        next()
    }

    this.password = await bcrypt.hash(this.password, 7)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)