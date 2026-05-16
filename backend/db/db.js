import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI

const dbConnect = async() => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("Connected to database.");
    } catch (error) {
        console.log("Failed to connect database.");
    }
}

export default dbConnect;