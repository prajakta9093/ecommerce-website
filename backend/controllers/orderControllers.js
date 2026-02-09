import orderModel from "../models/orderModels.js";
import userModel from "../models/userModels.js";
import { sendSMS } from "../utils/sendSMS.js";

/* =========================
   ADMIN: GET ALL ORDERS
========================= */
const formatPhone = (phone) => {
  if (!phone) return null;
  return phone.startsWith("+") ? phone : `+91${phone}`;
};

export const getAllOrders = async (req, res) => {
  try {
    console.log("📦 Fetching all orders...");

    const orders = await orderModel
      .find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    console.log("✅ Found orders:", orders.length);
    res.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Get all orders error:", error);
    res.json({ success: false, message: "Failed to fetch orders" });
  }
};

/* =========================
   PLACE ORDER (COD)
========================= */
export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      deliveryFee,
      shippingAddress,
      paymentMethod,
    } = req.body;

    // 1️⃣ Create order
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

    // 2️⃣ Fetch user
    const user = await userModel.findById(req.userId);

    // 3️⃣ Resolve customer phone safely
    const customerPhone = user?.profile?.phone;
    const adminPhone = formatPhone(process.env.ADMIN_PHONE);


    console.log("📞 Customer phone:", customerPhone);
    console.log("📞 Admin phone:", adminPhone);

    /* ================= CUSTOMER SMS ================= */
    if (customerPhone) {
      try {
        await sendSMS(
          customerPhone,
          `Hi ${user.name} 👋
Your order ${order._id} has been placed successfully 🎉
Amount: ₹${totalAmount}
Payment: COD

Thank you for shopping with us 💖`
        );
      } catch (err) {
        console.error("❌ Customer SMS failed:", err.message);
      }
    } else {
      console.log("⚠️ Customer phone missing, SMS skipped");
    }

    /* ================= ADMIN SMS ================= */
    if (adminPhone) {
      try {
        await sendSMS(
          process.env.ADMIN_PHONE,
          `📦 New Order Alert!
Order ID: ${order._id}
Customer: ${user?.name}
Amount: ₹${totalAmount}
Payment: COD`
        );
      } catch (err) {
        console.error("❌ Admin SMS failed:", err.message);
      }
    } else {
      console.log("⚠️ ADMIN_PHONE not set in .env");
    }

    // 4️⃣ Final response
    res.json({ success: true, order });

  } catch (err) {
    console.error("❌ Place order error:", err);
    res.json({ success: false, message: "Order failed" });
  }
};

/* =========================
   USER: GET MY ORDERS
========================= */
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

/* =========================
   USER: GET SINGLE ORDER
========================= */
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

/* =========================
   ADMIN: UPDATE ORDER STATUS
========================= */
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

/* =========================
   USER: CANCEL ORDER
========================= */
export const cancelOrder = async (req, res) => {
  try {
    const order = await orderModel.findOneAndUpdate(
      { _id: req.params.orderId, userId: req.userId },
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
