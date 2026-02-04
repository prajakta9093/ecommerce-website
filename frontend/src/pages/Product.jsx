import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Product = () => {
  const { id } = useParams();
  const { products, addToCart } = useContext(ShopContext);
  const [added, setAdded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const backendUrl = import.meta.env.VITE_BACKENDURL;

  const product = products.find((p) => String(p._id) === id);

  if (!product) return (
    <>
      <Navbar />
      <h2 className="text-center mt-20 text-xl text-gray-600">Product Not Found</h2>
      <Footer />
    </>
  );

  const handleAdd = () => {
    addToCart(product._id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // ✅ FIXED: Get images array (support both 'images' and 'image')
  const imageArray = product.images || product.image || [];

  // ✅ NEW: Helper function to get correct image URL (Cloudinary or local)
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://via.placeholder.com/400x400?text=No+Image";
    }

    // If it's a Cloudinary URL (starts with http), return as-is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // For local uploads, normalize path and prepend backend URL
    const normalizedPath = imagePath.replace(/\\/g, '/');
    return `${backendUrl}/${normalizedPath}`;
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col md:flex-row gap-10 p-10 max-w-6xl mx-auto">
        {/* Image Gallery */}
        <div className="flex-1">
          <img
            src={getImageUrl(imageArray[currentImage])}
            alt={product.name}
            className="w-full rounded-lg object-cover"
            onError={(e) => {
              console.log("❌ Main image failed:", e.target.src);
              e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
            }}
          />
          
          {/* Thumbnail Images */}
          {imageArray.length > 1 && (
            <div className="flex gap-3 mt-4">
              {imageArray.map((img, index) => (
                <img
                  key={index}
                  src={getImageUrl(img)}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setCurrentImage(index)}
                  className={`w-20 h-20 rounded-lg object-cover cursor-pointer border-2 transition ${
                    currentImage === index
                      ? "border-purple-600"
                      : "border-gray-300 hover:border-purple-400"
                  }`}
                  onError={(e) => {
                    console.log("❌ Thumbnail failed:", e.target.src);
                    e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl font-semibold text-purple-600 mt-3">₹{product.price}</p>
          
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Category:</span> {product.category}
            </p>
          </div>

          <button
            onClick={handleAdd}
            className={`mt-8 w-full md:w-auto px-8 py-3 rounded-lg font-medium transition ${
              added
                ? "bg-green-600 text-white"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {added ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Product;