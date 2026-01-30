import mongoose from "mongoose";

const customOrderSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  message: String,
  contactMethod: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("customOrder", customOrderSchema);
