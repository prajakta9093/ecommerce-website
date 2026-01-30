import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Customorder = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    contactMethod: "Whatsapp",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ ORDER MESSAGE (single line breaks for email compatibility)
    const orderMessage =
      `NEW CUSTOM ORDER REQUEST\n\n` +
      `Name: ${formData.firstName} ${formData.lastName}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n\n` +
      `Order Details:\n${formData.message}`;

    if (formData.contactMethod === "Whatsapp") {
      window.open(
        `https://wa.me/917620874930?text=${encodeURIComponent(orderMessage)}`,
        "_blank"
      );
    } 
    else {
      // ✅ WORKING EMAIL (Gmail, Outlook, Mail app)
      window.location.href =
        `mailto:prajaktashinde9093@gmail.com` +
        `?subject=${encodeURIComponent("Custom Order Request")}` +
        `&body=${encodeURIComponent(orderMessage)}`;
    } 
    

    // ✅ SUCCESS POPUP
    setTimeout(() => {
      alert("💖 Custom order request submitted successfully!");
      window.location.reload(); // 🔄 REFRESH PAGE
    }, 800);
  };

  return (
    <>
      <Navbar />

      <div className="px-10 py-20 flex flex-col lg:flex-row gap-14 text-gray-800">
        
        {/* LEFT INFO */}
        <div className="w-full lg:w-1/2">
          <p className="text-lg leading-7">
            Looking for something special?  
            Tell us your idea and we’ll connect with you personally 💕
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full lg:w-1/2 space-y-4">

          <input
            name="firstName"
            placeholder="First Name *"
            required
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <input
            type="email"
            name="email"
            placeholder="Email *"
            required
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <input
            name="phone"
            placeholder="Phone *"
            required
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <textarea
            name="message"
            placeholder="Describe your custom order..."
            rows="4"
            required
            onChange={handleChange}
            className="border p-2 w-full"
          />

          {/* CONTACT METHOD */}
          <div className="space-y-2">
            <p className="font-medium">Contact me via:</p>

            <label className="flex gap-2">
              <input
                type="radio"
                name="contactMethod"
                value="Whatsapp"
                checked={formData.contactMethod === "Whatsapp"}
                onChange={handleChange}
              />
              WhatsApp
            </label>

           
            <label className="flex gap-2">
              <input
                type="radio"
                name="contactMethod"
                value="Email"
                onChange={handleChange}
              />
              Email
            </label>
          </div>

          <button className="bg-black text-white py-3 w-full rounded hover:bg-pink-600 transition">
            Submit Custom Order
          </button>
        </form>
      </div>
    </>
  );
};

export default Customorder;
