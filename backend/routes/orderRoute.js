import express from "express";
import authMiddleware from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getSingleOrder,
} from "../controllers/orderControllers.js";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/razorpayControllers.js";

const router = express.Router();

// User routes
router.post("/place", authMiddleware, placeOrder);
router.get("/user", authMiddleware, getUserOrders);
router.get("/user/:orderId", authMiddleware, getSingleOrder);
router.put("/cancel/:orderId", authMiddleware, cancelOrder);

// ✅ Razorpay routes - THESE MATCH YOUR FRONTEND
router.post("/create-razorpay-order", authMiddleware, createRazorpayOrder);
router.post("/verify-razorpay-payment", authMiddleware, verifyRazorpayPayment);

// Admin routes
router.get("/all", adminAuth, getAllOrders);
router.put("/status/:orderId", adminAuth, updateOrderStatus);

export default router;