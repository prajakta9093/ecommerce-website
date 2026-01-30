import orderModel from "../models/orderModels.js";

// ADMIN ORDERS - NOW WITH POPULATE
export const getAllOrders = async (req, res) => {
  try {
    console.log("📦 Fetching all orders...");
    
    const orders = await orderModel
      .find()
      .populate("userId", "email name")  // ✅ Now this will work
      .sort({ createdAt: -1 });

    console.log("✅ Found orders:", orders.length);
    res.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Get all orders error:", error);
    res.json({ success: false, message: "Failed to fetch orders" });
  }
};

// COD ORDER
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryFee, shippingAddress, paymentMethod } = req.body;

    const order = await orderModel.create({
      userId: req.userId,
      items,
      totalAmount,
      deliveryFee,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: "Pending",
    });

    console.log("✅ Order placed:", order._id);
    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Place order error:", err);
    res.json({ success: false, message: "Order failed" });
  }
};

// USER ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Get user orders error:", error);
    res.json({ success: false, message: "Failed to fetch orders" });
  }
};

// GET SINGLE ORDER
export const getSingleOrder = async (req, res) => {
  try {
    const order = await orderModel.findOne({
      _id: req.params.orderId,
      userId: req.userId,
    });

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Get single order error:", error);
    res.json({ success: false, message: "Failed to fetch order" });
  }
};

// UPDATE STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    const order = await orderModel.findByIdAndUpdate(
      req.params.orderId,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    console.log("✅ Order status updated:", order._id, "->", orderStatus);
    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Update status error:", error);
    res.json({ success: false, message: "Failed to update status" });
  }
};

// CANCEL ORDER
export const cancelOrder = async (req, res) => {
  try {
    const order = await orderModel.findOneAndUpdate(
      {
        _id: req.params.orderId,
        userId: req.userId,
      },
      { orderStatus: "Cancelled" },
      { new: true }
    );

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    console.log("✅ Order cancelled:", order._id);
    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Cancel order error:", error);
    res.json({ success: false, message: "Failed to cancel order" });
  }
};