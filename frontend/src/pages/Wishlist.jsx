import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { Heart } from "lucide-react";

const Wishlist = () => {
  const { products, wishlist } = useContext(ShopContext);
  const [wishlistProducts, setWishlistProducts] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter(item => wishlist.includes(item._id));
      setWishlistProducts(filtered);
    }
  }, [products, wishlist]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#faf7f2]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        {/* Soft Decorative Background Elements */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#f8b4b4] rounded-full blur-[150px] opacity-20 mix-blend-multiply pointer-events-none -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#e2d4e0] rounded-full blur-[120px] opacity-30 mix-blend-multiply pointer-events-none translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Header */}
          <div className="mb-12 text-center md:text-left border-b border-[#e6dfce] pb-8 relative">
             <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-semibold text-[#2b2824] mb-4">
              Your Wishlist
            </h1>
            <p className="text-[#6e655a] font-medium text-lg">
              {wishlistProducts.length === 0
                ? "You haven't added any favorites yet."
                : `You have saved ${wishlistProducts.length} piece${wishlistProducts.length > 1 ? "s" : ""} you love.`}
            </p>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm p-16 text-center max-w-2xl mx-auto border border-[#e6dfce]">
              <div className="w-24 h-24 mx-auto mb-8 bg-[#f8b4b4]/20 rounded-full flex items-center justify-center text-[#f8b4b4]">
                <Heart size={48} strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[#2b2824] mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-[#6e655a] mb-8 font-medium">
                Save your favorite handcrafted items here to easily find them later.
              </p>
              <Link to="/Shop" className="btn-primary inline-flex text-[#2b2824] font-bold bg-[#f8b4b4] hover:bg-[#eab3b3] shadow-soft border-2 border-[#f8b4b4] hover:border-[#eab3b3]">
                Discover Pieces to Love
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {wishlistProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
