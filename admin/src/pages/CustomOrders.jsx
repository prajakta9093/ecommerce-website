import { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKENDURL; // ✅ Fixed: hardcoded like admin Orders page

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

  // ── UI States ──
  if (loading) return <p className="p-6">Loading custom orders...</p>;

  if (error)
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );

  // ── Main ──
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Custom Orders</h1>
          <span className="text-sm text-gray-500 bg-white border px-3 py-1 rounded-full shadow-sm">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center text-gray-500">
            No custom orders yet
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border p-6 rounded-lg shadow-sm"
              >
                {/* Top row - Name + Contact Badge + Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">
                      {order.firstName} {order.lastName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm">{order.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm">{order.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-sm">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Contact Method Badge */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.contactMethod === "Whatsapp"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.contactMethod === "Whatsapp" ? "📱" : "📧"}{" "}
                    {order.contactMethod}
                  </span>
                </div>

                {/* Message */}
                <div className="bg-gray-50 p-3 rounded mb-4">
                  <p className="text-sm text-gray-500 mb-1">Order Details</p>
                  <p className="text-sm">{order.message}</p>
                </div>

                {/* Delete Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomOrders;