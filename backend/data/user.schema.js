import mongoose , { Schema }from "mongoose";

const schema = new mongoose.Schema({
    email:String,
    password: String,
    name: String,
    firstName: { type: String, default: '' },
  lastName:  { type: String, default: '' },
  avatar:    { type: String, default: '' },
  role:      { type: String, default: 'user' },
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
