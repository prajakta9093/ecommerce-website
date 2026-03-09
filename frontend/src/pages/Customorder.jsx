import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MessageCircle, Mail } from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKENDURL;
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
New Custom Order Request 🎨

Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}

Details:
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
        alert("Failed to submit inquiry. Please try again.");
        return;
      }

      alert("Thank you! Your custom order request has been received.");
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
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-semibold text-[#3f3a34] mb-4">
              Bring Your Vision to Life
            </h1>
            <p className="text-lg text-[#7a6f63] font-medium max-w-xl mx-auto">
              Looking for something completely unique? Let's collaborate to create a bespoke, handmade piece just for you.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-soft p-8 sm:p-12 border border-[#f5f0eb]">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Contact Method Navigation */}
              <div>
                <h3 className="text-sm font-semibold text-[#7a6f63] mb-4 px-1">How should we reach you?</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  {[
                     { id: "Whatsapp", icon: MessageCircle, label: "WhatsApp" },
                     { id: "Email", icon: Mail, label: "Email" }
                  ].map((method) => (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => setFormData({ ...formData, contactMethod: method.id })}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl border transition-all text-sm font-semibold
                        ${
                          formData.contactMethod === method.id
                            ? "bg-[#e8d5cc] border-[#e8d5cc] text-[#3f3a34] shadow-sm"
                            : "bg-[#fdfbf7] border-[#f0ede6] text-[#7a6f63] hover:border-[#e8d5cc] hover:bg-white"
                        }`}
                    >
                      <method.icon size={18} />
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#7a6f63] mb-2 px-1">First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Jane"
                    className="w-full px-5 py-4 bg-[#fdfbf7] border border-[#f0ede6] rounded-xl focus:outline-none focus:border-[#e8d5cc] focus:ring-2 focus:ring-[#e8d5cc]/20 transition-all text-[#3f3a34] placeholder:text-[#a39a90]"
                  />
                  {errors.firstName && <span className="text-xs text-red-500 mt-1 ml-1">{errors.firstName}</span>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#7a6f63] mb-2 px-1">Last Name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full px-5 py-4 bg-[#fdfbf7] border border-[#f0ede6] rounded-xl focus:outline-none focus:border-[#e8d5cc] focus:ring-2 focus:ring-[#e8d5cc]/20 transition-all text-[#3f3a34] placeholder:text-[#a39a90]"
                  />
                  {errors.lastName && <span className="text-xs text-red-500 mt-1 ml-1">{errors.lastName}</span>}
                </div>
                <div>
                   <label className="block text-sm font-semibold text-[#7a6f63] mb-2 px-1">Email Address</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full px-5 py-4 bg-[#fdfbf7] border border-[#f0ede6] rounded-xl focus:outline-none focus:border-[#e8d5cc] focus:ring-2 focus:ring-[#e8d5cc]/20 transition-all text-[#3f3a34] placeholder:text-[#a39a90]"
                  />
                  {errors.email && <span className="text-xs text-red-500 mt-1 ml-1">{errors.email}</span>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#7a6f63] mb-2 px-1">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10 digit number"
                    className="w-full px-5 py-4 bg-[#fdfbf7] border border-[#f0ede6] rounded-xl focus:outline-none focus:border-[#e8d5cc] focus:ring-2 focus:ring-[#e8d5cc]/20 transition-all text-[#3f3a34] placeholder:text-[#a39a90]"
                  />
                  {errors.phone && <span className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</span>}
                </div>
              </div>

               <div>
                 <label className="block text-sm font-semibold text-[#7a6f63] mb-2 px-1">Your Idea</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell us about the piece you have in mind (colors, textures, sizing, inspiration)..."
                  className="w-full px-5 py-4 bg-[#fdfbf7] border border-[#f0ede6] rounded-xl focus:outline-none focus:border-[#e8d5cc] focus:ring-2 focus:ring-[#e8d5cc]/20 transition-all text-[#3f3a34] placeholder:text-[#a39a90] resize-y"
                />
                {errors.message && <span className="text-xs text-red-500 mt-1 ml-1">{errors.message}</span>}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-medium text-lg transition-all shadow-soft text-[#3f3a34] ${
                    loading 
                      ? "bg-[#dce2d6] opacity-70 cursor-not-allowed shadow-none" 
                      : "bg-[#e8d5cc] hover:bg-[#d8c3b9] hover:shadow-soft-hover"
                  }`}
                >
                  {loading ? "Sending Inquiry..." : "Submit Inquiry"}
                </button>
                <p className="text-center text-xs text-[#a39a90] mt-4 font-medium">
                  We'll review your request and get back to you within 24-48 hours.
                </p>
              </div>

            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Customorder;
