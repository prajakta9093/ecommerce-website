import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Shop = () => {
  const { products } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [showCategory, setShowCategory] = useState(true);

  const backendUrl = "http://localhost:9000";
  const categories = ["Hoops", "Paintings", "Crochet", "Hair Accessoires"];

  // Helper function to get image URL safely
  const getImageUrl = (product) => {
    // Check for both 'images' (backend) and 'image' (possible old data)
    const imageArray = product.images || product.image;
    
    if (!imageArray) {
      console.log("❌ No image property found for:", product.name);
      return "https://via.placeholder.com/400x400?text=No+Image";
    }
    
    let imagePath = '';
    
    // If it's an array, get first element
    if (Array.isArray(imageArray)) {
      imagePath = imageArray[0] || '';
    }
    // If it's a string
    else if (typeof imageArray === 'string') {
      imagePath = imageArray;
    }
    
    if (!imagePath) {
      console.log("❌ Empty image path for:", product.name);
      return "https://via.placeholder.com/400x400?text=No+Image";
    }
    
    // Backend saves paths as "uploads/filename.jpg" (with forward slashes)
    // Just prepend the backend URL with a forward slash
    const finalUrl = `${backendUrl}/${imagePath}`;
    
    return finalUrl;
  };

  // Toggle category
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Filter products
  useEffect(() => {
    if (category.length === 0) {
      setFilterProducts(products);
    } else {
      setFilterProducts(
        products.filter((item) => category.includes(item.category))
      );
    }
  }, [category, products]);

  // Initial load
  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  
  return (
    <>
      <Navbar />

      <div className="flex flex-col sm:flex-row gap-6 pt-10 px-4 sm:px-8">
        
        {/* FILTER SIDEBAR */}
        <div className="min-w-[280px] bg-white border border-gray-200 rounded-lg p-6 h-fit">
          <h2 className="text-2xl font-light mb-6 text-center">Filter by</h2>
          <hr className="mb-6 border-gray-200" />

          <div className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => setShowCategory(!showCategory)}
            >
              <h3 className="text-base font-medium">Category</h3>
              <span className="text-xl">{showCategory ? "−" : "+"}</span>
            </div>

            {showCategory && (
              <div className="space-y-3">
                {/* ALL */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-gray-800"
                    checked={category.length === categories.length}
                    onChange={(e) =>
                      setCategory(e.target.checked ? categories : [])
                    }
                  />
                  <span className="font-medium">All</span>
                </label>

                {/* INDIVIDUAL */}
                {categories.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={item}
                      className="w-4 h-4 accent-gray-800"
                      onChange={toggleCategory}
                      checked={category.includes(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            )}

            {category.length > 0 && (
              <button
                onClick={() => setCategory([])}
                className="mt-4 w-full py-2 bg-pink-800 text-white text-sm rounded-md hover:bg-black transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-medium">All Collections</h1>
            <p className="text-sm text-gray-600">
              Showing {filterProducts.length} products
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.map((item) => (
              <Link
                to={`/product/${item._id}`}
                key={item._id}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={getImageUrl(item)}
                    alt={item.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition"
                    onError={(e) => {
                      console.log("❌ Image FAILED:", e.target.src);
                      e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                    }}
                  />
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-700 mb-1">{item.name}</p>
                  <p className="text-base font-semibold text-gray-900">
                    ₹{item.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {filterProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No products found</p>
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;