import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const Placeorder = () => {
  const { products, cartitems, getCartAmount, delivery_fee, clearCart } =
    useContext(ShopContext);
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay Payment
  const handleRazorpayPayment = async (orderData) => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Create Razorpay order
      const result = await axios.post(
        `${backendUrl}/api/order/create-razorpay-order`,
        { amount: orderData.totalAmount },
        { headers: { token } }
      );

      if (!result.data.success) {
        alert("Failed to create payment order");
        setLoading(false);
        return;
      }

      const { orderId, amount, currency } = result.data;

      // Razorpay options
      const options = {
        key: "rzp_test_Rx5W4zFT5hTEkw", // Replace with your actual Key ID
        amount: amount,
        currency: currency,
        name: "Your Store Name",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response) {
          console.log("✅ Payment successful:", response);

          try {
            const verifyRes = await axios.post(
              `${backendUrl}/api/order/verify-razorpay-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: orderData,
              },
              { headers: { token } }
            );

            if (verifyRes.data.success) {
              alert("Payment successful! Order placed.");
              clearCart();
              navigate("/orders");
            } else {
              alert("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
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
        theme: {
          color: "#10b981",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function (response) {
        alert("Payment failed! Please try again.");
        console.error("Payment failed:", response.error);
        setLoading(false);
      });
    } catch (error) {
      console.error("Razorpay error:", error);
      alert("Failed to initialize payment");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to place order");
      navigate("/login");
      return;
    }

    // Prepare order items
    const orderItems = [];
    for (const itemId in cartitems) {
      const product = products.find((p) => String(p._id) === String(itemId));
      if (product && cartitems[itemId].quantity > 0) {
        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: cartitems[itemId].quantity,
          image: product.images ? product.images[0] : "",
        });
      }
    }

    if (orderItems.length === 0) {
      alert("Your cart is empty");
      return;
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
        // Handle Razorpay payment
        await handleRazorpayPayment(orderData);
      } else {
        // Handle COD
        const res = await axios.post(
          `${backendUrl}/api/order/place`,
          orderData,
          { headers: { token } }
        );

        if (res.data.success) {
          alert("Order placed successfully!");
          clearCart();
          navigate("/orders");
        } else {
          alert(res.data.message || "Failed to place order");
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Shipping Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <textarea
                name="address"
                placeholder="Address"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.pincode}
                onChange={handleChange}
                required
              />

              {/* Payment Methods */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Payment Method</h3>
                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-lg">
                        💵 Cash on Delivery
                      </div>
                      <div className="text-sm text-gray-500">
                        Pay when you receive your order
                      </div>
                    </div>
                  </label>

                  {/* Razorpay */}
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="Razorpay"
                      checked={paymentMethod === "Razorpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-lg">
                        💳 Pay Online (Razorpay)
                      </div>
                      <div className="text-sm text-gray-500">
                        UPI, Cards, NetBanking, Wallets
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-400 transition mt-6 shadow-lg"
              >
                {loading
                  ? "Processing..."
                  : paymentMethod === "Razorpay"
                  ? "Proceed to Payment →"
                  : "Place Order"}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {Object.keys(cartitems).map((itemId) => {
                const product = products.find((p) => String(p._id) === itemId);
                if (!product || cartitems[itemId].quantity === 0) return null;

                return (
                  <div
                    key={itemId}
                    className="flex justify-between text-sm border-b pb-2"
                  >
                    <span className="font-medium">
                      {product.name} x {cartitems[itemId].quantity}
                    </span>
                    <span className="text-green-600 font-semibold">
                      ₹{product.price * cartitems[itemId].quantity}
                    </span>
                  </div>
                );
              })}
            </div>

            <hr className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{getCartAmount()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee:</span>
                <span className="font-semibold">₹{delivery_fee}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between font-bold text-xl text-green-600">
                <span>Total:</span>
                <span>₹{getCartAmount() + delivery_fee}</span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-green-700 flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Secure Payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Placeorder;