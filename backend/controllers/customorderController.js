import CustomOrder from "../models/customOrderModel.js";

/* ===============================
   CREATE CUSTOM ORDER
================================ */
export const createCustomOrder = async (req, res) => {
  try {
    const order = new CustomOrder(req.body);
    await order.save();
    res.json({ success: true, message: "Custom order submitted" });
  } catch (error) {
    console.error("Create Custom Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===============================
   LIST CUSTOM ORDERS (ADMIN)
================================ */
export const listCustomOrders = async (req, res) => {
  try {
    const orders = await CustomOrder.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("List Custom Orders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===============================
   DELETE CUSTOM ORDER (ADMIN)
================================ */
export const deleteCustomOrder = async (req, res) => {
  try {
    const order = await CustomOrder.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.error("Delete Custom Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};