import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`${backendUrl}/api/order/user`, {
        headers: { token },
      });
      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Cancel this order?")) return;

    try {
      const res = await axios.put(
        `${backendUrl}/api/order/cancel/${orderId}`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        alert("Order cancelled");
        fetchOrders();
      }
    } catch {
      alert("Failed to cancel order");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Processing":
        return "bg-[#efe6dc] text-[#6b4226] border border-[#d6c3b2]";
      case "Shipped":
        return "bg-[#e6ddd3] text-[#5a3a22] border border-[#cbb8a6]";
      case "Delivered":
        return "bg-[#e8f0e4] text-[#3f5e3b] border border-[#c7d6c1]";
      case "Cancelled":
        return "bg-[#f3e1e1] text-[#8b3a3a] border border-[#e0bcbc]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f6f2]">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-[#a8744c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#6b4226] text-lg">Loading your orders…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f6f2]">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-[#6b4226] mb-2">
              My Orders
            </h1>
            <p className="text-[#7a5a44]">
              {orders.length === 0
                ? "No orders yet"
                : `You have ${orders.length} order${orders.length > 1 ? "s" : ""}`}
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-14 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-semibold text-[#6b4226] mb-3">
                No Orders Yet
              </h2>
              <p className="text-[#7a5a44] mb-6">
                Your handmade treasures will appear here
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="bg-[#a8744c] hover:bg-[#92623f] text-white px-8 py-3 rounded-full font-medium transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                >

                  {/* Order Header */}
                  <div className="bg-[#efe6dc] p-6 border-b border-[#dccbb9]">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                      <div>
                        <p className="text-xs text-[#7a5a44]">Order ID</p>
                        <p className="font-mono text-sm text-[#6b4226] break-all">
                          {order._id}
                        </p>
                        <p className="text-xs text-[#7a5a44] mt-1">
                          📅 {new Date(order.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-6">
                    <h3 className="font-semibold text-[#6b4226] mb-4">
                      🧺 Order Items
                    </h3>

                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between bg-[#f9f6f2] p-4 rounded-xl"
                        >
                          <div>
                            <p className="font-medium text-[#6b4226]">
                              {item.name}
                            </p>
                            <p className="text-sm text-[#7a5a44]">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-[#a8744c]">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="mt-6 pt-6 border-t border-[#e0d2c4] flex flex-col sm:flex-row sm:justify-between gap-4">
                      <div>
                        <p className="text-sm text-[#7a5a44]">
                          💳 Payment: {order.paymentMethod}
                        </p>
                        <p className="text-2xl font-bold text-[#6b4226]">
                          Total ₹{order.totalAmount}
                        </p>
                      </div>

                      {order.orderStatus === "Processing" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="bg-[#8b3a3a] hover:bg-[#732f2f] text-white px-6 py-3 rounded-xl transition"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>

                    {/* Address */}
                    <div className="mt-6 bg-[#efe6dc] p-6 rounded-xl border border-[#dccbb9]">
                      <h4 className="font-semibold text-[#6b4226] mb-2">
                        📍 Shipping Address
                      </h4>
                      <p className="text-sm text-[#7a5a44]">
                        {order.shippingAddress.firstName}{" "}
                        {order.shippingAddress.lastName}
                      </p>
                      <p className="text-sm text-[#7a5a44]">
                        {order.shippingAddress.address},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} –{" "}
                        {order.shippingAddress.pincode}
                      </p>
                      <p className="text-sm text-[#7a5a44] mt-1">
                        📞 {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Orders;
