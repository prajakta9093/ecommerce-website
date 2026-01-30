import Razorpay from "razorpay";
import crypto from "crypto";
import orderModel from "../models/orderModels.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE RAZORPAY ORDER
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    console.log("💳 Creating Razorpay order for amount:", amount);

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    console.log("✅ Razorpay order created:", order.id);

    res.json({
      success: true,
      orderId: order.id,  // This is what frontend expects
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("❌ Razorpay order creation error:", error);
    res.json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

// VERIFY RAZORPAY PAYMENT
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    console.log("🔍 Verifying payment:", {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("✅ Payment signature verified");

      // Create order in database
      const newOrder = new orderModel({
        userId: req.userId,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        deliveryFee: orderData.deliveryFee,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: "Razorpay",
        paymentStatus: "Paid",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        orderStatus: "Processing",
      });

      await newOrder.save();

      console.log("✅ Order saved to database:", newOrder._id);

      res.json({
        success: true,
        message: "Payment verified and order placed",
        orderId: newOrder._id,
      });
    } else {
      console.log("❌ Invalid payment signature");
      res.json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};