import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
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

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await axios.put(
        `${backendUrl}/api/order/cancel/${orderId}`,
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        alert("Order cancelled successfully");
        fetchOrders();
      }
    } catch (error) {
      alert("Failed to cancel order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-xl">Loading orders...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Order ID: {order._id}
                    </p>

                    {/* ✅ FIXED DATE */}
                    <p className="text-sm text-gray-600">
                      Date:{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "N/A"}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* ITEMS */}
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <p>
                        {item.name} × {item.quantity}
                      </p>
                      <p>₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <hr className="my-4" />

                <div className="flex justify-between items-center">
                  <div>
                    <p>Payment: {order.paymentMethod}</p>
                    <p className="font-bold text-lg">
                      Total: ₹{order.totalAmount}
                    </p>
                  </div>

                  {order.orderStatus === "Processing" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>

                {/* ADDRESS */}
                <div className="mt-4 bg-gray-50 p-4 rounded">
                  <p className="font-semibold">Shipping Address</p>
                  <p>
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state} -{" "}
                    {order.shippingAddress.pincode}
                  </p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
