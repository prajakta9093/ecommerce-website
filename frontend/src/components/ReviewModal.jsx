import React, { useState } from "react";

const ReviewModal = ({ product, onClose, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    review: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKENDURL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating ⭐");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${backendUrl}/api/reviews/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          rating,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Review submitted 🤎");
        onReviewSubmit();
        onClose();
      } else {
        setError(data.message || "Failed to submit review");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="relative bg-[#faf8f4] w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slideUp">

        {/* Soft linen header glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#e9e4da] to-transparent rounded-t-3xl"></div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white hover:bg-[#f3efe8] shadow flex items-center justify-center text-[#6b5e4b] transition"
        >
          ✕
        </button>

        <div className="p-8 relative">

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-semibold text-[#5b4a36] mb-1">
              Share Your Experience
            </h2>
            <p className="text-[#7a6f60] text-sm">
              Your thoughts help handmade brands grow
            </p>
          </div>

          {/* Product */}
          <div className="flex items-center gap-4 p-4 bg-[#f3efe8] rounded-2xl mb-6 border border-[#e6e0d6]">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-20 h-20 rounded-xl object-cover shadow"
            />
            <div>
              <p className="font-medium text-[#4a3b2a]">{product.name}</p>
              <p className="text-xs text-[#7a6f60]">Product Review</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 bg-[#fdf2f2] border-l-4 border-red-400 rounded">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Stars */}
          <div className="mb-6 text-center">
            <label className="block text-sm font-medium text-[#5b4a36] mb-3">
              Rate your experience
            </label>
            <div className="flex justify-center gap-2 bg-[#f3efe8] p-4 rounded-2xl">
              {[...Array(5)].map((_, i) => {
                const value = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`text-5xl transition ${
                      value <= (hover || rating)
                        ? "text-[#c2a97e]"
                        : "text-[#d6d0c6]"
                    }`}
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(0)}
                  >
                    ★
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {["name", "email"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-[#5b4a36] mb-1 capitalize">
                  {field}
                </label>
                <input
                  name={field}
                  required
                  type={field === "email" ? "email" : "text"}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border border-[#d6d0c6] rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#c2a97e]"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-[#5b4a36] mb-1">
                Review
              </label>
              <textarea
                name="review"
                rows="4"
                required
                value={formData.review}
                onChange={handleChange}
                className="w-full border border-[#d6d0c6] rounded-xl px-4 py-3 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#c2a97e]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-semibold tracking-wide text-white transition ${
                isSubmitting
                  ? "bg-[#b9b2a6]"
                  : "bg-[#7a6348] hover:bg-[#6b573f]"
              }`}
            >
              {isSubmitting ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0 }
          to { transform: translateY(0); opacity: 1 }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out }
        .animate-slideUp { animation: slideUp 0.35s ease-out }
      `}</style>
    </div>
  );
};

export default ReviewModal;
