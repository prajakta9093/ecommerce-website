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
        return "bg-[#fcedda] text-[#2b2824] border border-[#fcedda]/50 shadow-sm";
      case "Shipped":
        return "bg-[#d6e2e9] text-[#2b2824] border border-[#d6e2e9]/50 shadow-sm";
      case "Delivered":
        return "bg-[#cce3de] text-[#2b2824] border border-[#cce3de]/50 shadow-sm";
      case "Cancelled":
        return "bg-[#f8b4b4]/30 text-[#b35e5e] border border-[#f8b4b4]/50 shadow-sm";
      default:
        return "bg-white text-[#6e655a] border border-[#e6dfce] shadow-sm";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f2]">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-[#f4c2c2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#2b2824] font-medium text-lg">Loading your orders…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Navbar />

      <div className="pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
        {/* Soft Background Accents */}
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[#f8b4b4] rounded-full blur-[100px] opacity-20 mix-blend-multiply pointer-events-none -translate-x-1/2"></div>
        <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-[#d6e2e9] rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto relative z-10">

          {/* Header */}
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl lg:text-5xl font-['Playfair_Display'] font-bold text-[#2b2824] mb-4">
              My Orders
            </h1>
            <p className="text-[#6e655a] font-medium text-lg">
              {orders.length === 0
                ? "No orders yet. Let's find you something special."
                : `You have ${orders.length} order${orders.length > 1 ? "s" : ""}. Thanks for supporting handmade!`}
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-[#e6dfce] p-16 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-[#fcedda] rounded-full flex items-center justify-center text-[#2b2824] text-4xl shadow-soft">
                📦
              </div>
              <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#2b2824] mb-4">
                No Orders Yet
              </h2>
              <p className="text-[#6e655a] mb-8 font-medium">
                Your beautiful, handcrafted treasures will appear here once you place an order.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="btn-primary inline-flex text-[#2b2824] font-bold bg-[#f4c2c2] hover:bg-[#eab3b3] px-8 py-4 rounded-full shadow-soft transition-all hover:shadow-soft-hover"
              >
                Discover the Collection
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-[#e6dfce] overflow-hidden group hover:shadow-soft hover:border-white transition-all"
                >

                  {/* Order Header */}
                  <div className="bg-[#fcedda]/30 p-6 md:p-8 border-b border-[#e6dfce]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#6e655a] mb-1">Order ID</p>
                        <p className="font-mono text-sm font-semibold text-[#2b2824] break-all bg-white px-3 py-1 rounded-md inline-block shadow-sm">
                          {order._id}
                        </p>
                        <p className="text-sm font-medium text-[#6e655a] mt-3">
                          Placed on {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short"})}
                        </p>
                      </div>

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm whitespace-nowrap w-fit ${getStatusStyle(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-6 md:p-8">
                    <h3 className="text-lg font-['Playfair_Display'] font-bold text-[#2b2824] mb-6 flex items-center gap-2">
                       <span className="text-[#cce3de] text-xl">◆</span> Order Items
                    </h3>

                    <div className="space-y-4">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-[#faf7f2] p-5 rounded-2xl border border-[#e6dfce] group-hover:bg-white transition-colors"
                        >
                          <div>
                            <p className="font-bold text-[#2b2824] text-lg mb-1">
                              {item.name}
                            </p>
                            <p className="text-sm font-medium text-[#6e655a]">
                              Quantity: <span className="text-[#2b2824] font-bold">{item.quantity}</span>
                            </p>
                          </div>
                          <p className="font-bold text-xl text-[#2b2824]">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="mt-8 pt-8 border-t border-[#e6dfce] flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                      <div>
                        <p className="text-sm font-medium text-[#6e655a] mb-2 px-1">
                          Payment Method: <span className="font-bold text-[#2b2824]">{order.paymentMethod}</span>
                        </p>
                        <div className="bg-[#fcedda] px-6 py-4 rounded-2xl shadow-sm border border-white">
                           <p className="text-sm uppercase tracking-widest font-bold text-[#6e655a] mb-1">Total Amount</p>
                           <p className="text-3xl font-bold text-[#2b2824]">
                             ₹{order.totalAmount}
                           </p>
                        </div>
                      </div>

                      {order.orderStatus === "Processing" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="btn-outline border-[#f8b4b4]/50 text-[#b35e5e] hover:bg-[#f8b4b4]/20 hover:border-[#f8b4b4] px-8 py-3 bg-white"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>

                    {/* Address */}
                    <div className="mt-8 bg-[#faf7f2] p-6 rounded-2xl border border-[#e6dfce]">
                      <h4 className="font-bold text-[#2b2824] mb-3 flex items-center gap-2">
                         <span className="text-[#f4c2c2] text-xl">◆</span> Shipping Address
                      </h4>
                      <div className="text-[#6e655a] font-medium space-y-1 ml-6 border-l-2 border-[#e6dfce] pl-4">
                        <p className="text-[#2b2824] font-bold">
                          {order.shippingAddress.firstName}{" "}
                          {order.shippingAddress.lastName}
                        </p>
                        <p>
                          {order.shippingAddress.address}
                        </p>
                         <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state} –{" "}
                          {order.shippingAddress.pincode}
                        </p>
                        <p className="pt-2 text-[#2b2824]">
                          📞 {order.shippingAddress.phone}
                        </p>
                      </div>
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
