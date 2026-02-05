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
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6">
          Admin Orders Dashboard
        </h1>

        {/* Filters */}
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
          {filterCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm sm:text-base font-semibold whitespace-nowrap ${
                activeFilter === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {category} ({getStatusCount(category)})
            </button>
          ))}
        </div>

        {/* Orders */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-4 sm:p-6 rounded shadow text-center">
            No orders found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white border p-4 sm:p-6 rounded-lg shadow-sm"
              >
                {/* Top info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Order ID</p>
                    <p className="font-mono text-xs sm:text-sm break-all">
                      {order._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Customer</p>
                    <p className="font-medium text-sm">
                      {order.shippingAddress
                        ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                        : order.userId?.email || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.shippingAddress?.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Total</p>
                    <p className="font-bold text-green-600">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Date</p>
                    <p className="text-sm">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Payment */}
                <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs sm:text-sm bg-gray-100">
                    💳 {order.paymentMethod}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm ${getPaymentBadge(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                {/* Items */}
                <div className="bg-gray-50 p-3 rounded mb-4">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-xs sm:text-sm">
                      • {item.name} × {item.quantity} — ₹{item.price}
                    </p>
                  ))}
                </div>

                {/* Status */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-xs sm:text-sm text-gray-500">
                    Order Status:
                  </label>
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                    className="border p-2 rounded w-full sm:w-auto text-sm"
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
    </div>
  );
};

export default Orders;
