import mongoose , { Schema }from "mongoose";

const schema = new mongoose.Schema({
    email:String,
    password: String,
    name: String,
    authProvider: {
        type: String,
        default: 'local'
    },
    oauthProviders: {
        google: String,
        facebook: String,
        github: String
    }
})

export default schema
