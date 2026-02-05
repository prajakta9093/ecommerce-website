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

    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-4 sm:p-6 rounded-lg shadow"
            >
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 break-all">
                    Order ID: {order._id}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
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
                  className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs sm:text-sm ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* ITEMS */}
              <div className="space-y-2 text-sm">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between gap-2"
                  >
                    <p className="flex-1">
                      {item.name} × {item.quantity}
                    </p>
                    <p className="font-medium">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              {/* TOTAL + ACTION */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <p className="text-sm">
                    Payment: {order.paymentMethod}
                  </p>
                  <p className="font-bold text-lg text-pink-600">
                    Total: ₹{order.totalAmount}
                  </p>
                </div>

                {order.orderStatus === "Processing" && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded 
                               text-sm w-full sm:w-auto"
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              {/* ADDRESS */}
              <div className="mt-4 bg-gray-50 p-3 sm:p-4 rounded text-sm">
                <p className="font-semibold mb-1">
                  Shipping Address
                </p>
                <p>
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} –{" "}
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
