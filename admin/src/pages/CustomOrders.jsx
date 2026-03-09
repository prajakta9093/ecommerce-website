import { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const CustomOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/customorders/list`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Fetch custom orders error:", err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`${backendUrl}/api/customorders/remove/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
      } else {
        alert("❌ Failed to delete order");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete order");
    }
  };

  if (loading) return <p className="p-4 sm:p-6">Loading custom orders...</p>;

  if (error)
    return (
      <div className="p-4 sm:p-6">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="bg-gray-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-[#2b2824] flex items-center gap-2">
           <span className="text-[#f4c2c2] text-2xl">◆</span> Custom Orders
        </h1>
        <span className="text-sm font-bold text-[#2b2824] bg-white border border-[#e6dfce] px-4 py-2 rounded-full shadow-sm w-fit">
          {orders.length} {orders.length === 1 ? "Request" : "Requests"}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-soft border border-[#e6dfce] text-center text-[#6e655a] font-medium text-lg">
          No custom orders yet
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white/80 backdrop-blur-sm border border-[#e6dfce] p-6 sm:p-8 rounded-3xl shadow-soft group hover:border-white transition-all"
            >
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#6e655a] mb-1">Customer</p>
                  <p className="font-bold text-[#2b2824] text-base">
                    {order.firstName} {order.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#6e655a] mb-1">Email</p>
                  <p className="font-medium text-[#2b2824] text-sm break-all">{order.email}</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#6e655a] mb-1">Phone</p>
                  <p className="font-bold text-[#2b2824] text-sm">{order.phone}</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#6e655a] mb-1">Date</p>
                  <p className="font-medium text-[#2b2824] text-sm">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Contact Method */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm border ${
                    order.contactMethod === "Whatsapp"
                      ? "bg-[#cce3de] text-[#2b2824] border-[#cce3de]/50"
                      : "bg-[#d6e2e9] text-[#2b2824] border-[#d6e2e9]/50"
                  }`}
                >
                  {order.contactMethod === "Whatsapp" ? "📱" : "📧"}{" "}
                  {order.contactMethod}
                </span>
              </div>

              {/* Message */}
              <div className="bg-[#faf7f2] p-6 rounded-2xl mb-6 border border-[#e6dfce]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#6e655a] mb-2">Order Details</p>
                <p className="text-base text-[#2b2824] font-medium break-words leading-relaxed">{order.message}</p>
              </div>

              {/* Delete */}
              <div className="flex justify-end pt-4 border-t border-[#e6dfce] mt-6">
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="border border-[#f8b4b4]/50 bg-white text-[#b35e5e] px-6 py-2.5 rounded-xl hover:bg-[#f8b4b4]/20 hover:border-[#f8b4b4] transition-all shadow-sm font-bold text-sm w-full sm:w-auto"
                >
                  Delete Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomOrders;
