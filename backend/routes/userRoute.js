import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userControllers.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin); // Changed from /admin-login to /admin
userRouter.post("/admin-login", adminLogin); // Keep both for backward compatibility

// Protected routes (require user authentication)
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.put("/profile", authMiddleware, updateUserProfile);

export default userRouter;

