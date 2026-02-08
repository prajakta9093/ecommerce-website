import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const Customorder = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    contactMethod: "Whatsapp",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!/^[A-Za-z]+$/.test(formData.firstName))
      newErrors.firstName = "Only letters allowed";

    if (!/^[A-Za-z]+$/.test(formData.lastName))
      newErrors.lastName = "Only letters allowed";

    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (formData.message.length < 10)
      newErrors.message = "Minimum 10 characters required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/customorders`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!res.data.success) {
        alert("❌ Failed to submit order");
        return;
      }

      alert("🤎 Custom order submitted successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        contactMethod: "Whatsapp",
      });
    } catch {
      alert("❌ Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-2 bg-[#efe6da] text-[#8b6f4e] rounded-full text-sm font-semibold mb-6">
              Custom Creations
            </span>
            <h1 className="text-5xl font-bold text-[#4a3b2a] mb-4">
              Bring Your Vision to Life
            </h1>
            <p className="text-lg text-[#6b5a44]">
              Thoughtfully handmade, just for you
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">

            {/* Info */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-[#4a3b2a] mb-6">
                How It Works
              </h2>

              <div className="space-y-6">
                {["Share idea", "We connect", "Handcraft", "Delivered"].map(
                  (step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#8b6f4e] text-white flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <p className="text-[#6b5a44] font-medium">{step}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-[#4a3b2a] mb-6">
                Tell Us Your Idea
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {["firstName", "lastName", "email", "phone"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    className={`w-full px-5 py-4 rounded-xl border-2 focus:outline-none
                      ${
                        errors[field]
                          ? "border-red-400"
                          : "border-[#cbb59a] focus:border-[#8b6f4e]"
                      }`}
                  />
                ))}

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe your custom order..."
                  className={`w-full px-5 py-4 rounded-xl border-2 resize-none
                    ${
                      errors.message
                        ? "border-red-400"
                        : "border-[#cbb59a] focus:border-[#8b6f4e]"
                    }`}
                />

                {/* Divider line */}
                <div className="h-px bg-[#e6e0d6] my-6"></div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-[#8b6f4e] hover:bg-[#6f563e]
                    text-white py-4 rounded-2xl font-bold transition-all
                    ${loading ? "opacity-50" : "hover:scale-105"}`}
                >
                  {loading ? "Submitting..." : "Submit Custom Order"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Customorder;
