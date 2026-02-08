import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReviewModal from "../components/ReviewModal";

const Product = () => {
  const { id } = useParams();
  const { products, addToCart } = useContext(ShopContext);
  const [added, setAdded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKENDURL;
  const product = products.find((p) => String(p._id) === id);

  const fetchReviews = () => {
    fetch(`${backendUrl}/api/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => data.success && setReviews(data.reviews));
  };

  useEffect(() => {
    if (id) fetchReviews();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f7f4ef]">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl text-[#6b4a2f]">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product._id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const imageArray = product.images || [];

  const getImageUrl = (img) =>
    img?.startsWith("http")
      ? img
      : `${backendUrl}/${img?.replace(/\\/g, "/")}`;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar />

      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Images */}
          <div>
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <img
                src={getImageUrl(imageArray[currentImage])}
                className="w-full h-96 object-cover rounded-2xl"
                alt={product.name}
              />
            </div>

            <div className="flex gap-3 mt-4">
              {imageArray.map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img)}
                  onClick={() => setCurrentImage(i)}
                  className={`w-20 h-20 rounded-xl object-cover cursor-pointer
                    ${currentImage === i
                      ? "ring-4 ring-[#a8744c]"
                      : "ring-2 ring-[#e6dccf]"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <span className="inline-block bg-[#efe7dc] text-[#7a5537] px-4 py-1 rounded-full text-sm mb-4">
              {product.category}
            </span>

            <h1 className="text-4xl font-bold text-[#4a2f1b] mb-4">
              {product.name}
            </h1>

            <p className="text-3xl font-bold text-[#a8744c] mb-4">
              ₹{product.price}
            </p>

            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"}
                  >
                    ★
                  </span>
                ))}
                <span className="text-sm text-[#6b4a2f]">
                  {averageRating} ({reviews.length})
                </span>
              </div>
            )}

            <p className="text-[#6b4a2f] mb-8 leading-relaxed">
              {product.description}
            </p>

            <button
              onClick={handleAdd}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all
                ${added
                  ? "bg-green-600 text-white"
                  : "bg-[#a8744c] text-white hover:bg-[#8f5e3c]"
                }`}
            >
              {added ? "✓ Added to Cart" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#4a2f1b]">
              Customer Reviews
            </h2>
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-[#a8744c] text-white px-6 py-3 rounded-xl hover:bg-[#8f5e3c]"
            >
              Write Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl text-center shadow">
              <p className="text-[#6b4a2f] mb-4">No reviews yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="bg-white p-6 rounded-2xl shadow"
                >
                  <p className="font-semibold text-[#4a2f1b]">{r.name}</p>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < r.rating ? "text-yellow-400" : "text-gray-300"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-[#6b4a2f] mt-2">{r.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal
          product={product}
          onClose={() => setShowReviewModal(false)}
          onReviewSubmit={fetchReviews}
        />
      )}

      <Footer />
    </div>
  );
};

export default Product;
