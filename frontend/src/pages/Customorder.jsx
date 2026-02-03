import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const backendUrl = "http://localhost:9000"; // ✅ Fixed: hardcoded like Orders page

const Customorder = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    contactMethod: "Whatsapp",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Save the current formData before resetting
    const currentData = { ...formData };

    try {
      const res = await axios.post(`${backendUrl}/api/customorders`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.data.success) {
        alert("❌ Failed to submit order");
        setLoading(false);
        return;
      }

      // ✅ Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        contactMethod: "Whatsapp",
      });

      alert("💖 Custom order submitted successfully!");

      // ✅ Send WhatsApp/Email using saved currentData
      const orderMessage =
        `NEW CUSTOM ORDER REQUEST\n\n` +
        `Name: ${currentData.firstName} ${currentData.lastName}\n` +
        `Email: ${currentData.email}\n` +
        `Phone: ${currentData.phone}\n\n` +
        `Order Details:\n${currentData.message}`;

      setTimeout(() => {
        if (currentData.contactMethod === "Whatsapp") {
          window.open(
            `https://wa.me/917620874930?text=${encodeURIComponent(orderMessage)}`,
            "_blank"
          );
        } else {
          window.open(
            `mailto:prajaktashinde9093@gmail.com?subject=Custom Order Request&body=${encodeURIComponent(orderMessage)}`,
            "_blank"
          );
        }
      }, 500);
    } catch (error) {
      console.error("CUSTOM ORDER ERROR:", error.response?.data || error);
      alert("❌ Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-10 py-20 flex flex-col lg:flex-row gap-14">

        {/* Left */}
        <div className="w-full lg:w-1/2">
          <p className="text-lg">
            Looking for something special? Tell us your idea 💕
          </p>
        </div>

        {/* Right - Form */}
        <form onSubmit={handleSubmit} className="w-full lg:w-1/2 space-y-4">
          <input
            name="firstName"
            value={formData.firstName}
            placeholder="First Name *"
            required
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            name="lastName"
            value={formData.lastName}
            placeholder="Last Name *"
            required
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email *"
            required
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            name="phone"
            value={formData.phone}
            placeholder="Phone *"
            required
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <textarea
            name="message"
            value={formData.message}
            rows="4"
            placeholder="Describe your order..."
            required
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <div className="flex gap-6">
            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="radio"
                name="contactMethod"
                value="Whatsapp"
                checked={formData.contactMethod === "Whatsapp"}
                onChange={handleChange}
              />
              WhatsApp
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="radio"
                name="contactMethod"
                value="Email"
                checked={formData.contactMethod === "Email"}
                onChange={handleChange}
              />
              Email
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`text-white py-3 w-full transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Submitting..." : "Submit Custom Order"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Customorder;