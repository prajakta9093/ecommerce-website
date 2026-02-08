import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (orderData) => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const result = await axios.post(
        `${backendUrl}/api/order/create-razorpay-order`,
        { amount: orderData.totalAmount },
        { headers: { token } }
      );

      const { orderId, amount, currency } = result.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Yarn Yapper",
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
              clearCart();
              navigate("/orders");
            } else {
              alert("Payment verification failed");
            }
          } catch {
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
        theme: { color: "#6f4e37" }, // cocoa brown
      };

      new window.Razorpay(options).open();
    } catch {
      alert("Failed to initialize payment");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const orderItems = [];
    for (const itemId in cartitems) {
      const product = products.find((p) => p._id === itemId);
      if (product && cartitems[itemId].quantity > 0) {
        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: cartitems[itemId].quantity,
        });
      }
    }

    const totalAmount = getCartAmount() + delivery_fee;
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
        await axios.post(
          `${backendUrl}/api/order/place`,
          orderData,
          { headers: { token } }
        );
        clearCart();
        navigate("/orders");
      }
    } catch {
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-4xl font-bold text-[#6f4e37] mb-6">
            Checkout
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >

            {/* Shipping */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow p-8">
              <h2 className="text-2xl font-bold text-[#5a3e2b] mb-6">
                Shipping Details
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">
                {Object.keys(formData).map((field) => (
                  <div key={field} className={field === "address" ? "sm:col-span-2" : ""}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                      {field}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#6f4e37] focus:ring-2 focus:ring-[#6f4e37]/20"
                    />
                  </div>
                ))}
              </div>

              {/* Payment */}
              <div className="mt-8">
                <h3 className="font-bold mb-4 text-[#5a3e2b]">
                  Payment Method
                </h3>

                {["COD", "Razorpay"].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center p-4 mb-3 border rounded-xl cursor-pointer ${
                      paymentMethod === method
                        ? "border-[#6f4e37] bg-[#f3ece6]"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#6f4e37]"
                    />
                    <span className="ml-3 font-medium">
                      {method === "COD" ? "Cash on Delivery" : "Pay Online (Razorpay)"}
                    </span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-[#6f4e37] text-white py-4 rounded-2xl font-bold hover:bg-[#5a3e2b] transition"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-3xl shadow p-8 sticky top-28">
              <h2 className="text-2xl font-bold text-[#5a3e2b] mb-6">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getCartAmount()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₹{delivery_fee}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#f3ece6] rounded-xl flex justify-between font-bold text-[#6f4e37]">
                <span>Total</span>
                <span>₹{getCartAmount() + delivery_fee}</span>
              </div>
            </div>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Placeorder;
