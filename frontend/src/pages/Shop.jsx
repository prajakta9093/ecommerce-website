import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  const { products, search } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const categories = ["Hoops", "Paintings", "Crochet", "Hair Accessoires"];

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  useEffect(() => {
    let filtered = products;

    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.category));
    }

    if (search) {
      filtered = filtered.filter((item) => 
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilterProducts(filtered);
  }, [category, search, products]);

  useEffect(() => {
    // Only set raw products if search and category are empty. The dependency above handles it better.
    // Removed to prevent overriding the filter logic.
  }, [products]);

  return (
    <div className="flex flex-col min-h-screen bg-[#faf7f2]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        {/* Soft Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#e2d4e0] rounded-full blur-[150px] opacity-30 mix-blend-multiply pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#cce3de] rounded-full blur-[120px] opacity-30 mix-blend-multiply pointer-events-none translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Header */}
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] text-[#2b2824] mb-4">
              Curated Collection
            </h1>
            <p className="text-[#6e655a] font-medium text-lg max-w-2xl">
              Explore our full range of handcrafted aesthetic pieces, designed to bring warmth, color, and elegance to your everyday life.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-12 lg:gap-16">

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="md:hidden w-full btn-outline flex items-center justify-center gap-2"
            >
              {showFilter ? "Close Filters" : "Filter Collection"}
            </button>

            {/* Filter Sidebar */}
            <div className={`${showFilter ? "block" : "hidden"} md:block w-full md:w-64 lg:w-72 shrink-0`}>
              <div className="sticky top-32 bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-[#e6dfce]">
                <div className="pb-6 border-b border-[#e6dfce] mb-6">
                  <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#2b2824] mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f4c2c2]"></span> Categories
                  </h2>

                  <div className="space-y-4">
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${category.length === categories.length || category.length === 0 ? 'bg-[#cce3de] border-[#cce3de]' : 'border-[#d6e2e9] bg-white group-hover:border-[#cce3de]'}`}>
                        {(category.length === categories.length || category.length === 0) && (
                          <svg className="w-3.5 h-3.5 text-[#2b2824]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={category.length === categories.length || category.length === 0}
                        onChange={(e) =>
                          setCategory(e.target.checked ? [] : [])
                        }
                        className="hidden"
                      />
                      <span className={`font-semibold  transition-colors ${category.length === categories.length || category.length === 0 ? 'text-[#2b2824]' : 'text-[#6e655a] group-hover:text-[#2b2824]'}`}>
                        Everything
                      </span>
                    </label>

                    {categories.map((item, index) => {
                      // Alternate colors for checkboxes to add a playful pastel vibe
                      const activeBgColor = index % 2 === 0 ? 'bg-[#f4c2c2]' : 'bg-[#e2d4e0]';
                      const activeBorderColor = index % 2 === 0 ? 'border-[#f4c2c2]' : 'border-[#e2d4e0]';
                      const hoverBorderColor = index % 2 === 0 ? 'group-hover:border-[#f4c2c2]' : 'group-hover:border-[#e2d4e0]';

                      return (
                      <label key={item} className="flex items-center gap-4 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${category.includes(item) ? `${activeBgColor} ${activeBorderColor}` : `border-[#d6e2e9] bg-white ${hoverBorderColor}`}`}>
                          {category.includes(item) && (
                            <svg className="w-3.5 h-3.5 text-[#2b2824]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          value={item}
                          onChange={toggleCategory}
                          checked={category.includes(item)}
                          className="hidden"
                        />
                        <span className={`font-semibold transition-colors ${category.includes(item) ? 'text-[#2b2824]' : 'text-[#6e655a] group-hover:text-[#2b2824]'}`}>{item}</span>
                      </label>
                    )})}
                  </div>
                </div>

                {category.length > 0 && (
                  <button
                    onClick={() => setCategory([])}
                    className="text-sm font-bold text-[#6e655a] hover:text-[#f4c2c2] transition-colors flex items-center gap-2"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-8 bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-[#e6dfce]">
                <p className="text-[#6e655a] font-semibold">
                  Showing <span className="text-[#2b2824] bg-[#fcedda] px-2 py-0.5 rounded-md mx-1">{filterProducts.length}</span> pieces
                  {search && <span className="ml-2"> for "{search}"</span>}
                </p>
                {/* Optional: Add a subtle select dropdown for sorting here if desired */}
              </div>

              {filterProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {filterProducts.map((item) => (
                    <ProductCard key={item._id} product={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-3xl border border-[#e6dfce] shadow-sm">
                  <p className="text-xl text-[#6e655a] font-['Playfair_Display']">No pieces found in this category.</p>
                  <button onClick={() => setCategory([])} className="mt-6 btn-outline">Show All Collection</button>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
