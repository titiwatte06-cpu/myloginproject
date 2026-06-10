import mongoose from "mongoose";
import schema from "./conversation.schema.js";

const Conversation = mongoose.model("Conversation", schema);

export default Conversation;
