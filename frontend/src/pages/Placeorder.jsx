import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const Placeorder = () => {
  const {
    products,
    cartitems,
    getCartAmount,
    delivery_fee,
    clearCart,
  } = useContext(ShopContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  /* =========================
     FORM HANDLERS
  ========================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* =========================
     LOAD RAZORPAY SCRIPT
  ========================= */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /* =========================
     RAZORPAY PAYMENT FLOW
  ========================= */
  const handleRazorpayPayment = async (orderData) => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // ✅ Create Razorpay Order
      const result = await axios.post(
        `${backendUrl}/api/order/create-razorpay-order`,
        { amount: orderData.totalAmount },
        { headers: { token } }
      );

      if (!result.data.success) {
        alert(result.data.message || "Failed to create payment order");
        setLoading(false);
        return;
      }

      const { orderId, amount, currency } = result.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Ecommerce Store",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${backendUrl}/api/order/verify-razorpay-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData,
              },
              { headers: { token } }
            );

            if (verifyRes.data.success) {
              alert("Payment successful!");
              clearCart();
              navigate("/orders");
            } else {
              alert("Payment verification failed");
            }
          } catch (error) {
            console.error(error);
            alert("Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#16a34a" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", () => {
        alert("Payment failed");
        setLoading(false);
      });

    } catch (error) {
      console.error("Razorpay error:", error);
      alert("Failed to initialize payment");
      setLoading(false);
    }
  };

  /* =========================
     PLACE ORDER
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    // Prepare cart items
    const orderItems = [];
    for (const itemId in cartitems) {
      const product = products.find((p) => p._id === itemId);
      if (product && cartitems[itemId].quantity > 0) {
        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: cartitems[itemId].quantity,
          image: product.images?.[0] || "",
        });
      }
    }

    if (orderItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    const totalAmount = getCartAmount() + delivery_fee;

    // 🔴 Razorpay minimum ₹1
    if (paymentMethod === "Razorpay" && totalAmount < 1) {
      alert("Minimum order amount is ₹1");
      return;
    }

    const orderData = {
      items: orderItems,
      totalAmount,
      deliveryFee: delivery_fee,
      shippingAddress: formData,
      paymentMethod,
    };

    setLoading(true);

    try {
      if (paymentMethod === "Razorpay") {
        await handleRazorpayPayment(orderData);
      } else {
        const res = await axios.post(
          `${backendUrl}/api/order/place`,
          orderData,
          { headers: { token } }
        );

        if (res.data.success) {
          alert("Order placed successfully");
          clearCart();
          navigate("/orders");
        } else {
          alert(res.data.message || "Order failed");
        }
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Order failed");
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
  <>
    <Navbar />

    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* SHIPPING DETAILS */}
          <div className="bg-white p-6 rounded-xl shadow space-y-5">
            <h2 className="text-xl font-semibold text-gray-700">
              Shipping Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(formData).map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-sm text-gray-600 capitalize mb-1">
                    {field}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ))}
            </div>

            {/* PAYMENT METHOD */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">
                Payment Method
              </h3>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="Razorpay"
                  checked={paymentMethod === "Razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Pay Online (Razorpay)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {loading
                ? "Processing..."
                : paymentMethod === "Razorpay"
                ? "Proceed to Payment"
                : "Place Order"}
            </button>
          </div>

          {/* ORDER SUMMARY */}
          {/* ORDER SUMMARY */}
<div className="bg-white p-6 rounded-xl shadow h-fit space-y-4">
  <h2 className="text-xl font-semibold text-gray-700">
    Order Summary
  </h2>

  {/* PRODUCT LIST */}
  <div className="space-y-3 max-h-64 overflow-y-auto">
    {Object.keys(cartitems).map((itemId) => {
      const product = products.find(
        (p) => String(p._id) === String(itemId)
      );

      if (!product || cartitems[itemId].quantity === 0) return null;

      return (
        <div
          key={itemId}
          className="flex justify-between items-start border-b pb-2 text-sm"
        >
          <div>
            <p className="font-medium text-gray-800">
              {product.name}
            </p>
            <p className="text-gray-500">
              Qty: {cartitems[itemId].quantity}
            </p>
          </div>

          <p className="font-semibold text-green-600">
            ₹{product.price * cartitems[itemId].quantity}
          </p>
        </div>
      );
    })}
  </div>

  <hr />

  {/* TOTALS */}
  <div className="space-y-2 text-sm">
    <div className="flex justify-between text-gray-600">
      <span>Subtotal</span>
      <span>₹{getCartAmount()}</span>
    </div>

    <div className="flex justify-between text-gray-600">
      <span>Delivery</span>
      <span>₹{delivery_fee}</span>
    </div>
  </div>

  <hr />

  <div className="flex justify-between text-lg font-bold text-gray-800">
    <span>Total</span>
    <span>₹{getCartAmount() + delivery_fee}</span>
  </div>
</div>

        </form>
      </div>
    </div>
  </>
);
};

export default Placeorder;