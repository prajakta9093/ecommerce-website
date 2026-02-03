import mongoose from "mongoose";

const customOrderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    contactMethod: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "customorders" }
);

export default mongoose.model("CustomOrder", customOrderSchema);