import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;