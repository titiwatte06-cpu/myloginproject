import mongoose from "mongoose";
import propertySchema from "./property.schema.js";

const Property = mongoose.model("Property", propertySchema);

export default Property;
