import { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const Orders = ({ onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchOrders = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setError("No admin token found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/order/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(`${backendUrl}/api/order/status/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        setOrders(
          orders.map((o) =>
            o._id === orderId ? { ...o, orderStatus: newStatus } : o
          )
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <p className="p-4 sm:p-6">Loading orders...</p>;

  if (error)
    return (
      <div className="p-4 sm:p-6">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            onLogout();
          }}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back to Login
        </button>
      </div>
    );

  const filterCategories = [
    "All",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === activeFilter);

  const getStatusCount = (status) => {
    if (status === "All") return orders.length;
    return orders.filter((order) => order.orderStatus === status).length;
  };

  const getPaymentBadge = (status) => {
    if (status === "Paid") return "bg-green-100 text-green-700";
    if (status === "Failed") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-[#2b2824] flex items-center gap-2">
           <span className="text-[#cce3de] text-2xl">◆</span> Admin Orders Dashboard
        </h1>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {filterCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm border ${
              activeFilter === category
                ? "bg-[#2b2824] text-white border-[#2b2824]"
                : "bg-white text-[#6e655a] border-[#e6dfce] hover:border-[#cce3de] hover:bg-[#faf7f2]"
            }`}
          >
            {category} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeFilter === category ? "bg-white/20" : "bg-[#fcedda] text-[#2b2824]"}`}>{getStatusCount(category)}</span>
          </button>
        ))}
      </div>

        {/* Orders */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-soft border border-[#e6dfce] text-center text-[#6e655a] font-medium text-lg">
            No orders found
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white/80 backdrop-blur-sm border border-[#e6dfce] p-6 sm:p-8 rounded-3xl shadow-soft group hover:border-white transition-all"
              >
                {/* Top info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#6e655a] mb-1">Order ID</p>
                    <p className="font-mono text-sm font-bold text-[#2b2824] break-all bg-[#faf7f2] px-3 py-1.5 rounded-lg border border-[#e6dfce] inline-block shadow-sm">
                      {order._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#6e655a] mb-1">Customer</p>
                    <p className="font-bold text-[#2b2824] text-base mb-0.5">
                      {order.shippingAddress
                        ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                        : order.userId?.email || "N/A"}
                    </p>
                    <p className="text-sm font-medium text-[#6e655a]">
                      {order.shippingAddress?.email}
                    </p>
                  </div>

                  <div className="bg-[#fcedda]/50 px-4 py-3 rounded-xl border border-[#e6dfce]">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#6e655a] mb-1">Total Amount</p>
                    <p className="font-bold text-2xl text-[#2b2824]">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#6e655a] mb-1">Date</p>
                    <p className="text-sm font-bold text-[#2b2824]">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Payment */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-[#e6dfce] bg-white text-[#2b2824] shadow-sm">
                    💳 {order.paymentMethod}
                  </span>

                  <span
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border shadow-sm ${
                      order.paymentStatus === "Paid" 
                        ? "bg-[#cce3de] text-[#2b2824] border-[#cce3de]/50" 
                        : "bg-[#fcedda] text-[#2b2824] border-[#fcedda]/50"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                {/* Items */}
                <div className="bg-[#faf7f2] p-5 rounded-2xl mb-6 border border-[#e6dfce] space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#6e655a] mb-3">Order Items</p>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-white px-4 py-3 rounded-xl border border-[#e6dfce] shadow-sm">
                      <p className="text-sm font-bold text-[#2b2824]">
                        {item.name} <span className="text-[#6e655a] font-medium mx-2">×</span> {item.quantity}
                      </p>
                      <p className="font-bold text-[#2b2824]">₹{item.price}</p>
                    </div>
                  ))}
                </div>

                {/* Status */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-[#e6dfce] mt-6">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#6e655a]">
                    Update Status
                  </label>
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                    className="border-2 border-[#e6dfce] bg-white text-[#2b2824] font-bold px-4 py-2.5 rounded-xl w-full sm:w-auto text-sm focus:outline-none focus:border-[#cce3de] transition-colors cursor-pointer shadow-sm appearance-none"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
};

export default Orders;
