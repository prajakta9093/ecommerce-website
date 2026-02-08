import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Shop = () => {
  const { products } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [showCategory, setShowCategory] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKENDURL;
  const categories = ["Hoops", "Paintings", "Crochet", "Hair Accessoires"];

  const getImageUrl = (product) => {
    const imageArray = product.images || product.image;
    if (!imageArray) return "https://via.placeholder.com/400x400?text=No+Image";

    let imagePath = Array.isArray(imageArray) ? imageArray[0] : imageArray;
    if (!imagePath) return "https://via.placeholder.com/400x400?text=No+Image";

    if (imagePath.startsWith("http")) return imagePath;
    return `${backendUrl}/${imagePath.replace(/\\/g, "/")}`;
  };

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

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
    <div className="min-h-screen bg-[#f7f3ee]">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#5b3a29] mb-2">
              Our Collections
            </h1>
            <p className="text-[#7a5a44]">
              Handcrafted with love, just for you
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="md:hidden w-full bg-[#8b5e3c] text-white py-3 rounded-xl font-semibold shadow-md"
            >
              {showFilter ? "Hide Filters ✕" : "Show Filters 🔍"}
            </button>

            {/* Filter Sidebar */}
            <div className={`${showFilter ? "block" : "hidden"} md:block w-full md:w-80`}>
              <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-28">
                <h2 className="text-2xl font-bold text-[#5b3a29] mb-6 flex items-center gap-2">
                  🎨 Filters
                </h2>

                <div
                  className="flex justify-between items-center cursor-pointer mb-4 p-4 bg-[#f3ede7] rounded-xl"
                  onClick={() => setShowCategory(!showCategory)}
                >
                  <h3 className="font-semibold text-[#5b3a29]">Category</h3>
                  <span className="text-xl">{showCategory ? "−" : "+"}</span>
                </div>

                {showCategory && (
                  <div className="space-y-3 mb-6">
                    <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#f3ede7]">
                      <input
                        type="checkbox"
                        checked={category.length === categories.length}
                        onChange={(e) =>
                          setCategory(e.target.checked ? categories : [])
                        }
                        className="w-5 h-5 accent-[#8b5e3c]"
                      />
                      <span className="font-semibold text-[#5b3a29]">
                        All Categories
                      </span>
                    </label>

                    {categories.map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#f3ede7]"
                      >
                        <input
                          type="checkbox"
                          value={item}
                          onChange={toggleCategory}
                          checked={category.includes(item)}
                          className="w-5 h-5 accent-[#8b5e3c]"
                        />
                        <span className="text-[#6d4c3d]">{item}</span>
                      </label>
                    ))}
                  </div>
                )}

                {category.length > 0 && (
                  <button
                    onClick={() => setCategory([])}
                    className="w-full bg-[#6b3f2b] text-white py-3 rounded-xl font-semibold"
                  >
                    Clear Filters ✕
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <p className="text-[#6d4c3d] mb-6">
                <span className="font-semibold text-[#5b3a29]">
                  {filterProducts.length}
                </span>{" "}
                products found
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filterProducts.map((item) => (
                  <Link to={`/product/${item._id}`} key={item._id}>
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
                      <div className="aspect-square bg-[#eee6de]">
                        <img
                          src={getImageUrl(item)}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-4">
                        <p className="text-sm text-[#6d4c3d] truncate">
                          {item.name}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-lg font-bold text-[#8b5e3c]">
                            ₹{item.price}
                          </p>
                          <span className="text-xs bg-[#f3ede7] text-[#6b3f2b] px-3 py-1 rounded-full">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
