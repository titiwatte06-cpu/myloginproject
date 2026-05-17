import mongoose , { Schema }from "mongoose";

const schema = new mongoose.Schema({
    email:String,
    password: String   
})

export default schema