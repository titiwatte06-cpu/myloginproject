import mongoose from "mongoose";
import schema from "./message.schema.js";

const Message = mongoose.model("Message", schema);

export default Message;
