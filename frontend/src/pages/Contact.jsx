import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    email: "",
    message: ""
  });

  const [touched, setTouched] = useState({
    firstName: false,
    email: false,
    message: false
  });

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        else if (value.trim().length < 2) error = "At least 2 characters";
        else if (!/^[a-zA-Z\s]+$/.test(value)) error = "Only letters allowed";
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email address";
        break;

      case "message":
        if (!value.trim()) error = "Message is required";
        else if (value.trim().length < 10)
          error = "Minimum 10 characters";
        else if (value.trim().length > 500)
          error = "Maximum 500 characters";
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      firstName: validateField("firstName", formData.firstName),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message)
    };

    setErrors(newErrors);
    setTouched({ firstName: true, email: true, message: true });

    if (!Object.values(newErrors).some(Boolean)) {
      try {
        const response = await fetch(
          "http://localhost:9000/api/contact/submit",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
          }
        );

        const data = await response.json();

        if (data.success) {
          alert("🤎 Thank you! We’ll get back to you soon.");
          setFormData({ firstName: "", email: "", message: "" });
          setErrors({ firstName: "", email: "", message: "" });
          setTouched({ firstName: false, email: false, message: false });
        } else {
          alert("❌ Failed to submit. Try again.");
        }
      } catch (error) {
        alert("❌ Network error. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#5C3A21] mb-3">
              Get in Touch
            </h1>
            <p className="text-lg text-[#8B5E3C] font-medium">
              We'd love to hear from you 🤎
            </p>
            <div className="w-24 h-1 bg-[#8B5E3C] mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* First Name */}
              <div>
                <label className="block text-[#5C3A21] font-medium mb-2">
                  Your First Name
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your first name"
                  className={`w-full px-4 py-3 rounded-lg border
                    focus:outline-none focus:ring-2 transition
                    ${
                      errors.firstName && touched.firstName
                        ? "border-red-500 focus:ring-red-300"
                        : "border-[#EADBC8] focus:ring-[#8B5E3C]"
                    }`}
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#5C3A21] font-medium mb-2">
                  Your Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 rounded-lg border
                    focus:outline-none focus:ring-2 transition
                    ${
                      errors.email && touched.email
                        ? "border-red-500 focus:ring-red-300"
                        : "border-[#EADBC8] focus:ring-[#8B5E3C]"
                    }`}
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-[#5C3A21] font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="5"
                  placeholder="Type your message here..."
                  className={`w-full px-4 py-3 rounded-lg border resize-none
                    focus:outline-none focus:ring-2 transition
                    ${
                      errors.message && touched.message
                        ? "border-red-500 focus:ring-red-300"
                        : "border-[#EADBC8] focus:ring-[#8B5E3C]"
                    }`}
                />
                <div className="flex justify-between mt-1">
                  {errors.message && touched.message && (
                    <p className="text-red-500 text-sm">
                      {errors.message}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm">
                    {formData.message.length}/500
                  </p>
                </div>
              </div>

              {/* Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="bg-[#5C3A21] hover:bg-[#8B5E3C]
                             text-white font-semibold px-10 py-3
                             rounded-full shadow-md transition
                             transform hover:scale-105"
                >
                  Send Message
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
