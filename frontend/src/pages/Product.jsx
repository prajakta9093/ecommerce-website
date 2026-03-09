import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReviewModal from "../components/ReviewModal";
import { Star, Truck, ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Product = () => {
  const { id } = useParams();
  const { products, addToCart, toggleWishlist, isInWishlist } = useContext(ShopContext);
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
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
          <p className="text-2xl text-[#2b2824] font-['Playfair_Display'] mb-4">Piece not found</p>
          <Link to="/shop" className="btn-outline">Return to Collection</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product._id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const imageArray = product.images || product.image || [];

  const getImageUrl = (img) =>
    img?.startsWith("http")
      ? img
      : `${backendUrl}/${img?.replace(/\\/g, "/")}`;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        {/* Soft Background Accents */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#fcedda] rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Breadcrumb / Back Link */}
          <Link to="/shop" className="inline-flex items-center gap-2 text-[#6e655a] hover:text-[#f4c2c2] transition-colors mb-10 font-bold text-sm w-fit bg-white/60 px-4 py-2 rounded-full border border-[#e6dfce] shadow-sm">
            <ArrowLeft size={16} /> Back to Collection
          </Link>

          <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">

            {/* Product Image Gallery */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="w-full aspect-[4/5] bg-[#e2d4e0]/30 rounded-[2.5rem] overflow-hidden shadow-soft border-4 border-white">
                <img
                  src={getImageUrl(imageArray[currentImage])}
                  alt={product.name}
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>

              {/* Thumbnails */}
              {imageArray.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x mt-2">
                  {imageArray.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`relative shrink-0 w-24 aspect-square rounded-[1.5rem] overflow-hidden transition-all snap-start
                        ${currentImage === i
                          ? "ring-4 ring-[#f4c2c2] opacity-100 scale-95"
                          : "opacity-60 hover:opacity-100 border-2 border-white hover:border-[#f4c2c2]"
                        }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`${product.name} view ${i + 1}`}
                        className="w-full h-full object-cover bg-white"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <div className="mb-8">
                <span className="inline-block px-3 py-1 bg-[#cce3de] text-[#2b2824] rounded-md text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-[#cce3de]/50">
                  {product.category}
                </span>

                <h1 className="text-4xl lg:text-5xl font-['Playfair_Display'] font-semibold text-[#2b2824] leading-tight mb-4">
                  {product.name}
                </h1>

                <p className="text-3xl text-[#2b2824] font-bold tracking-wide">
                  ₹{product.price}
                </p>
              </div>

              {/* Reviews & Badges */}
              <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-[#e6dfce]">
                {reviews.length > 0 ? (
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#e6dfce]">
                    <div className="flex text-[#f4c2c2]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < Math.round(averageRating) ? "currentColor" : "none"} strokeWidth={i < Math.round(averageRating) ? 0 : 2} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-[#6e655a] ml-1">
                      {averageRating} <span className="mx-1">·</span> <a href="#reviews" className="underline hover:text-[#f4c2c2] transition-colors">{reviews.length} Reviews</a>
                    </span>
                  </div>
                ) : (
                  <a href="#reviews" className="text-sm font-bold text-[#f4c2c2] underline hover:text-[#2b2824] bg-white px-4 py-2 rounded-full shadow-sm border border-[#e6dfce] transition-colors">Leave the first review</a>
                )}
                
                <div className="flex items-center gap-2 text-sm font-bold text-[#2b2824] bg-[#cce3de]/40 px-4 py-2 rounded-full border border-[#cce3de]">
                  <Truck size={16} className="text-[#2b2824]"/> Free Shipping
                </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                <p className="text-[#6e655a] leading-relaxed text-lg font-medium bg-white/60 p-6 rounded-3xl border border-[#e6dfce] shadow-sm">
                  {product.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button
                  onClick={handleAdd}
                  disabled={added}
                  className={`flex-1 py-4 px-8 rounded-full font-bold text-lg transition-all duration-300 shadow-soft border-2
                    ${added
                      ? "bg-[#cce3de] text-[#2b2824] border-[#cce3de]"
                      : "bg-[#f4c2c2] text-[#2b2824] border-[#f4c2c2] hover:bg-[#eab3b3] hover:border-[#eab3b3] hover:-translate-y-1 hover:shadow-soft-hover"
                    }`}
                >
                  {added ? "Added to Cart ✓" : "Add to Cart"}
                </button>
                <button 
                  onClick={() => toggleWishlist(product._id)}
                  className={`w-full sm:w-auto aspect-square sm:px-4 py-4 rounded-full border-2 transition-all flex items-center justify-center bg-white shadow-soft hover:shadow-soft-hover hover:-translate-y-1
                  ${isInWishlist(product._id) 
                    ? 'border-[#f8b4b4] text-[#f8b4b4]' 
                    : 'border-[#d6e2e9] text-[#2b2824] hover:bg-[#d6e2e9]'}`}
                >
                   <Heart size={24} fill={isInWishlist(product._id) ? "currentColor" : "none"} strokeWidth={isInWishlist(product._id) ? 0 : 2} className="transition-colors"/>
                </button>
              </div>
              
              <div className="mt-8 text-center sm:text-left text-sm text-[#6e655a] font-bold flex gap-4 justify-center sm:justify-start">
                <span className="flex items-center gap-1"><span className="text-[#cce3de]">◆</span> Handcrafted</span>
                <span className="flex items-center gap-1"><span className="text-[#f4c2c2]">◆</span> Secure</span>
                <span className="flex items-center gap-1"><span className="text-[#d6e2e9]">◆</span> Returns</span>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div id="reviews" className="mt-32 pt-16 border-t border-[#e6dfce]">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-['Playfair_Display'] font-bold text-[#2b2824] mb-4">
                  Love Notes
                </h2>
                <p className="text-[#6e655a] font-medium text-lg">Hear what others are saying about this piece.</p>
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="btn-outline whitespace-nowrap bg-white border-[#e6dfce] hover:border-[#f4c2c2] hover:bg-[#f4c2c2]"
              >
                Write a Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-sm p-12 rounded-3xl text-center shadow-sm border border-[#e6dfce]">
                <div className="w-16 h-16 bg-[#fcedda] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart size={24} className="text-[#2b2824]" />
                </div>
                <p className="text-[#6e655a] text-lg font-semibold">Be the first to share your thoughts on the {product.name}.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {reviews.map((r) => (
                  <div
                    key={r._id}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-[#e6dfce] hover:shadow-soft transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <p className="font-bold text-[#2b2824] text-lg">{r.name}</p>
                      <div className="flex gap-1 text-[#f4c2c2]">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} size={16} fill={i < r.rating ? "currentColor" : "none"} strokeWidth={i < r.rating ? 0 : 2} className="stroke-[#f4c2c2]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#6e655a] leading-relaxed italic font-medium">"{r.review}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

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
