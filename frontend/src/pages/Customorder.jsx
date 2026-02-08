import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const backendUrl = import.meta.env.VITE_BACKENDURL;

// 🔴 Replace with your WhatsApp number (country code + number, no +)
const WHATSAPP_NUMBER = "917620874930";

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

  const buildMessage = () => `
New Custom Order 🧵

Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}

Message:
${formData.message}
  `;

  const openContactApp = () => {
    const text = encodeURIComponent(buildMessage());

    if (formData.contactMethod === "Whatsapp") {
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,
        "_blank"
      );
    } else {
      window.location.href = `mailto:${formData.email}?subject=Custom Order Request&body=${text}`;
    }
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
      openContactApp();

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
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-14">
      
            <h1 className="text-5xl font-bold text-[#4a3b2a] mb-4">
              Bring Your Vision to Life
            </h1>
            <p className="text-lg text-[#6b5a44]">
              Thoughtfully handmade, just for you
            </p>
          </div>

          {/* Form Only */}
          <div className="bg-white rounded-3xl shadow-2xl p-10">
            <h2 className="text-3xl font-bold text-[#4a3b2a] mb-8 text-center">
              Tell Us Your Idea
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Contact Method */}
              <div>
                <label className="block mb-3 font-semibold text-[#6b5a44]">
                  Preferred Contact Method
                </label>
                <div className="flex gap-4">
                  {["Whatsapp", "Email"].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() =>
                        setFormData({ ...formData, contactMethod: method })
                      }
                      className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all
                        ${
                          formData.contactMethod === method
                            ? "bg-[#8b6f4e] text-white border-[#8b6f4e]"
                            : "border-[#cbb59a] text-[#6b5a44]"
                        }`}
                    >
                      {method === "Whatsapp" ? "💬 WhatsApp" : "✉️ Email"}
                    </button>
                  ))}
                </div>
              </div>

              {["firstName", "lastName", "email", "phone"].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  className="w-full px-5 py-4 rounded-xl border-2 border-[#cbb59a] focus:outline-none focus:border-[#8b6f4e]"
                />
              ))}

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Describe your custom order..."
                className="w-full px-5 py-4 rounded-xl border-2 border-[#cbb59a] resize-none focus:outline-none focus:border-[#8b6f4e]"
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#8b6f4e] text-white py-4 rounded-2xl font-bold transition-all
                  ${loading ? "opacity-50" : "hover:scale-105"}`}
              >
                {loading ? "Submitting..." : "Submit Custom Order"}
              </button>
            </form>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Customorder;
