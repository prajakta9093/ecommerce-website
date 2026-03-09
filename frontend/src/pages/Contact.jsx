import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import emailjs from '@emailjs/browser';

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

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);

      try {
        // Initialize EmailJS with your public key
        emailjs.init('-BFJJB88AxS0eYlUZ'); // Replace with your actual public key

        // Template parameters - matching your EmailJS template variables
        const templateParams = {
          name: formData.firstName,      // Changed from from_name to name
          email: formData.email,          // Changed from from_email to email
          message: formData.message,
          title: "Contact Form Submission" // For {{title}} in subject
        };

        const response = await emailjs.send(
          'service_i2g13cn',      // Replace with your service ID
          'template_gp1ed59',     // Replace with your template ID
          templateParams
        );

        console.log('SUCCESS!', response.status, response.text);
        alert("🤎 Thank you! We'll get back to you soon.");
        
        setFormData({ firstName: "", email: "", message: "" });
        setErrors({ firstName: "", email: "", message: "" });
        setTouched({ firstName: false, email: false, message: false });

      } catch (error) {
        console.error('FAILED...', error);
        alert(`❌ Failed to send message: ${error.text || error.message || 'Unknown error'}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center py-12 px-4 mt-20">
        <div className="w-full max-w-2xl relative">
          
          {/* Decorative Blooms */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#f4c2c2] blur-[80px] rounded-full opacity-40 mix-blend-multiply pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#cce3de] blur-[80px] rounded-full opacity-40 mix-blend-multiply pointer-events-none"></div>

          {/* Header */}
          <div className="text-center mb-10 relative z-10">
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-[#2b2824] mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-[#6e655a] font-medium">
              We'd love to hear from you
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-[#e6dfce] p-8 md:p-12 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* First Name */}
              <div>
                <label className="block text-[#2b2824] font-bold mb-2">
                  Your First Name
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your first name"
                  className={`w-full px-5 py-4 rounded-xl border-2 bg-white/50
                    focus:outline-none transition-colors
                    ${
                      errors.firstName && touched.firstName
                        ? "border-[#f8b4b4] focus:border-[#f8b4b4]"
                        : "border-[#e6dfce] focus:border-[#cce3de]"
                    }`}
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-[#f8b4b4] text-sm mt-2 font-bold">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#2b2824] font-bold mb-2">
                  Your Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="your.email@example.com"
                  className={`w-full px-5 py-4 rounded-xl border-2 bg-white/50
                    focus:outline-none transition-colors
                    ${
                      errors.email && touched.email
                        ? "border-[#f8b4b4] focus:border-[#f8b4b4]"
                        : "border-[#e6dfce] focus:border-[#cce3de]"
                    }`}
                />
                {errors.email && touched.email && (
                  <p className="text-[#f8b4b4] text-sm mt-2 font-bold">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-[#2b2824] font-bold mb-2">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="5"
                  placeholder="Type your message here..."
                  className={`w-full px-5 py-4 rounded-xl border-2 bg-white/50 resize-none
                    focus:outline-none transition-colors
                    ${
                      errors.message && touched.message
                        ? "border-[#f8b4b4] focus:border-[#f8b4b4]"
                        : "border-[#e6dfce] focus:border-[#cce3de]"
                    }`}
                />
                <div className="flex justify-between mt-2">
                  {errors.message && touched.message && (
                    <p className="text-[#f8b4b4] text-sm font-bold">
                      {errors.message}
                    </p>
                  )}
                  <p className="text-[#a39a90] text-sm ml-auto font-medium">
                    {formData.message.length}/500
                  </p>
                </div>
              </div>

              {/* Button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary bg-[#cce3de] hover:bg-[#b0d4cc] text-[#2b2824] w-full font-bold px-10 py-4
                             rounded-full shadow-soft transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed
                             disabled:transform-none`}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
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