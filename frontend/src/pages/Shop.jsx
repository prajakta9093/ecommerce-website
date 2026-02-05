import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Shop = () => {
  const { products } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [showCategory, setShowCategory] = useState(true);
  const [showFilter, setShowFilter] = useState(false); // 🔹 mobile filter toggle

  const backendUrl = import.meta.env.VITE_BACKENDURL;
  const categories = ["Hoops", "Paintings", "Crochet", "Hair Accessoires"];

  // IMAGE URL HANDLER (unchanged logic)
  const getImageUrl = (product) => {
    const imageArray = product.images || product.image;
    if (!imageArray) return "https://via.placeholder.com/400x400?text=No+Image";

    let imagePath = Array.isArray(imageArray) ? imageArray[0] : imageArray;
    if (!imagePath) return "https://via.placeholder.com/400x400?text=No+Image";

    if (imagePath.startsWith("http")) return imagePath;
    return `${backendUrl}/${imagePath.replace(/\\/g, "/")}`;
  };

  // CATEGORY TOGGLE
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // FILTER PRODUCTS
  useEffect(() => {
    if (category.length === 0) setFilterProducts(products);
    else
      setFilterProducts(
        products.filter((item) => category.includes(item.category))
      );
  }, [category, products]);

  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  return (
    <>
      <Navbar />

      <div className="flex flex-col sm:flex-row gap-6 pt-6 sm:pt-10 px-4 sm:px-8">

        {/* MOBILE FILTER BUTTON */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="sm:hidden w-full py-2 bg-pink-700 text-white rounded-lg mb-2"
        >
          {showFilter ? "Hide Filters" : "Show Filters"}
        </button>

        {/* FILTER SIDEBAR */}
        <div
          className={`${
            showFilter ? "block" : "hidden"
          } sm:block min-w-[260px] bg-white border border-gray-200 rounded-lg p-4 sm:p-6 h-fit`}
        >
          <h2 className="text-xl sm:text-2xl font-light mb-4 text-center">
            Filter by
          </h2>
          <hr className="mb-4" />

          <div>
            <div
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => setShowCategory(!showCategory)}
            >
              <h3 className="text-sm sm:text-base font-medium">Category</h3>
              <span className="text-xl">{showCategory ? "−" : "+"}</span>
            </div>

            {showCategory && (
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={category.length === categories.length}
                    onChange={(e) =>
                      setCategory(e.target.checked ? categories : [])
                    }
                  />
                  <span className="font-medium">All</span>
                </label>

                {categories.map((item) => (
                  <label key={item} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      value={item}
                      onChange={toggleCategory}
                      checked={category.includes(item)}
                    />
                    <span className="text-sm">{item}</span>
                  </label>
                ))}
              </div>
            )}

            {category.length > 0 && (
              <button
                onClick={() => setCategory([])}
                className="mt-4 w-full py-2 bg-pink-700 text-white text-sm rounded-md"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h1 className="text-xl sm:text-2xl font-medium">
              All Collections
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Showing {filterProducts.length} products
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filterProducts.map((item) => (
              <Link
                to={`/product/${item._id}`}
                key={item._id}
                className="group"
              >
                <div className="overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={getImageUrl(item)}
                    alt={item.name}
                    className="w-full h-44 sm:h-56 object-cover group-hover:scale-105 transition"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/400x400?text=No+Image")
                    }
                  />
                </div>

                <div className="mt-2">
                  <p className="text-xs sm:text-sm text-gray-700 truncate">
                    {item.name}
                  </p>
                  <p className="text-sm sm:text-base font-semibold">
                    ₹{item.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {filterProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500">No products found</p>
              <p className="text-sm text-gray-400">
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
