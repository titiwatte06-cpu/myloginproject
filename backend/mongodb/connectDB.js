import mongoose, { Schema } from 'mongoose'

const uri = process.env.MONGODB_URI;

async function connectDB() {
    try {
        await mongoose.connect(uri)
        console.log("Successfully")
    } catch {
        console.log("Failed")
    }
}


export default connectDB
