import mongoose from "mongoose";
import schema from "./user.schema.js";

const User = mongoose.model("User",schema)

export default User;