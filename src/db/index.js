import mongoose from 'mongoose'

export async function connectDB(){
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB Connected !!! host is "+ connection.connection.host)
    } catch (error) {
        console.error("Something went wrong while connecting database")
        process.exit(1)
    }
}