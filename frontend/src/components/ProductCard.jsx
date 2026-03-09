import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

const backendUrl = import.meta.env.VITE_BACKENDURL;

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useContext(ShopContext);
  const inWishlist = isInWishlist(product._id);

  const getImageUrl = () => {
    const imageArray = product.images || product.image;
    if (!imageArray || !imageArray[0]) return "https://via.placeholder.com/400x500?text=No+Image";
    
    let imagePath = Array.isArray(imageArray) ? imageArray[0] : imageArray;
    if (!imagePath) return "https://via.placeholder.com/400x500?text=No+Image";

    if (imagePath.startsWith("http")) return imagePath;
    return `${backendUrl}/${imagePath.replace(/\\/g, "/")}`;
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  return (
    <div className="group flex flex-col items-center cursor-pointer relative">
      
      {/* Image Container with Soft Shadow and Zoom */}
      <div className="w-full aspect-[4/5] overflow-hidden rounded-2xl bg-[#fcedda] mb-5 shadow-sm transition-all duration-500 group-hover:shadow-soft-hover relative border-4 border-white">
        <Link to={`/product/${product._id}`} className="absolute inset-0 z-10"></Link>
        <img 
          src={getImageUrl()} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 mix-blend-multiply"
        />

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistClick}
          className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white shadow-sm border ${
            inWishlist 
              ? 'border-[#f8b4b4] text-[#f8b4b4]' 
              : 'border-[#e6dfce] text-[#a39a90] hover:text-[#f8b4b4] hover:border-[#f8b4b4] opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart size={20} fill={inWishlist ? "currentColor" : "none"} strokeWidth={inWishlist ? 0 : 2} />
        </button>
      </div>

      {/* Typography and Price */}
      <div className="text-center w-full px-2">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg text-[#2b2824] font-['Playfair_Display'] font-semibold mb-1 truncate hover:text-[#f4c2c2] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[#6e655a] text-xs font-bold mb-2 uppercase tracking-widest">{product.category}</p>
        <p className="text-[#2b2824] font-bold text-lg tracking-wide">
          ₹{product.price}
        </p>
      </div>

    </div>
  );
};

export default ProductCard;
