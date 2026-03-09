import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

const Cart = () => {
  const {
    products,
    cartitems,
    currency,
    removeFromCart,
    updateQuantity,
    getCartAmount,
    delivery_fee,
    backendUrl
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const data = [];
    for (const itemId in cartitems) {
      const item = cartitems[itemId];
      if (item.quantity > 0) {
        data.push({ id: String(itemId), quantity: item.quantity });
      }
    }
    setCartData(data);
    window.scrollTo(0, 0);
  }, [cartitems]);

  const subtotal = getCartAmount();
  const actualDeliveryFee = subtotal >= 500 ? 0 : delivery_fee;
  const total = subtotal > 0 ? subtotal + actualDeliveryFee : 0;

  const getImageUrl = (product) => {
    const imageArray = product.images || product.image;
    if (!imageArray || !imageArray[0]) return "https://via.placeholder.com/400x400?text=No+Image";
    const img = imageArray[0];
    return img.startsWith("http") ? img : `${backendUrl}/${img.replace(/\\/g, "/")}`;
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        {/* Soft Background Accents */}
        <div className="absolute -top-10 left-0 w-[500px] h-[500px] bg-[#d6e2e9] rounded-full blur-[150px] opacity-30 mix-blend-multiply pointer-events-none -translate-x-1/2"></div>
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#f4c2c2] rounded-full blur-[100px] opacity-20 mix-blend-multiply pointer-events-none translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Header */}
          <div className="mb-12 text-center md:text-left border-b border-[#e6dfce] pb-8 relative">
             <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-semibold text-[#2b2824] mb-4">
              Your Basket
            </h1>
            <p className="text-[#6e655a] font-medium text-lg">
              {cartData.length === 0
                ? "Your basket is currently empty."
                : `You have ${cartData.length} unique piece${cartData.length > 1 ? "s" : ""} waiting for you.`}
            </p>
          </div>

          {cartData.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm p-16 text-center max-w-2xl mx-auto border border-[#e6dfce]">
              <div className="w-24 h-24 mx-auto mb-8 bg-[#f4c2c2]/20 rounded-full flex items-center justify-center text-[#f4c2c2]">
                <ShoppingBag size={48} strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[#2b2824] mb-4">
                Nothing to see here yet
              </h2>
              <p className="text-[#6e655a] mb-8 font-medium">
                Our handcrafted collection is full of beautiful, colorful additions to your home.
              </p>
              <Link to="/Shop" className="btn-primary inline-flex text-[#2b2824] font-bold bg-[#f4c2c2] hover:bg-[#eab3b3] shadow-soft border-2 border-[#f4c2c2] hover:border-[#eab3b3]">
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

              {/* Items List */}
              <div className="flex-1 space-y-8">
                {cartData.map((item, index) => {
                  const productData = products.find(
                    (p) => String(p._id) === item.id
                  );
                  if (!productData) return null;

                  return (
                    <div key={index} className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-[#e6dfce] last:border-0 last:pb-0 group">
                      
                      {/* Product Image */}
                      <Link to={`/product/${productData._id}`} className="shrink-0 relative">
                        <div className="w-full sm:w-36 aspect-square bg-[#cce3de] rounded-3xl overflow-hidden shadow-sm group-hover:shadow-soft transition-shadow border-4 border-white">
                          <img
                            src={getImageUrl(productData)}
                            alt={productData.name}
                            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-xs font-bold text-[#6e655a] uppercase tracking-widest mb-2 block bg-white px-2 py-0.5 rounded-md border border-[#e6dfce] w-fit">
                              {productData.category}
                            </span>
                            <Link to={`/product/${productData._id}`}>
                              <h3 className="text-xl font-['Playfair_Display'] font-semibold text-[#2b2824] hover:text-[#f4c2c2] transition-colors line-clamp-2">
                                {productData.name}
                              </h3>
                            </Link>
                          </div>
                          
                          <p className="text-xl font-bold text-[#2b2824] whitespace-nowrap bg-white px-3 py-1 rounded-full shadow-sm border border-[#e6dfce]">
                            {currency}{productData.price}
                          </p>
                        </div>

                        <div className="flex justify-between items-end mt-6 sm:mt-auto">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 bg-white border border-[#e6dfce] rounded-full px-2 py-1 shadow-sm">
                            <button
                              onClick={() => item.quantity <= 1 ? removeFromCart(item.id) : updateQuantity(item.id, null, item.quantity - 1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-[#6e655a] hover:bg-[#fcedda] hover:text-[#2b2824] transition-colors"
                            >
                              <Minus size={16} strokeWidth={2.5}/>
                            </button>
                            <span className="w-4 text-center font-bold text-[#2b2824] text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, null, item.quantity + 1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-[#6e655a] hover:bg-[#cce3de] hover:text-[#2b2824] transition-colors"
                            >
                              <Plus size={16} strokeWidth={2.5}/>
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center gap-2 text-sm font-bold text-[#6e655a] hover:text-[#b35e5e] hover:bg-[#b35e5e]/10 px-3 py-1.5 rounded-full transition-colors"
                          >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary Sidebar */}
              <div className="w-full lg:w-[380px] shrink-0">
                <div className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-[#e6dfce] p-8 sticky top-32">
                  <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[#2b2824] mb-8 pb-4 border-b border-[#e6dfce] flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#f4c2c2]"></span> Order Summary
                  </h2>

                  <div className="space-y-4 mb-8 text-[#6e655a] font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-[#2b2824] font-semibold">{currency}{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-[#2b2824] font-semibold bg-[#cce3de]/40 px-2 rounded-md">
                        {actualDeliveryFee === 0 ? "Complimentary" : `${currency}${delivery_fee}`}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#e6dfce] mb-8 relative">
                    <div className="absolute -top-[1.5px] left-0 w-full flex justify-between">
                       <span className="w-1 h-[3px] bg-[#f4c2c2] rounded-full"></span>
                       <span className="w-1 h-[3px] bg-[#cce3de] rounded-full"></span>
                       <span className="w-1 h-[3px] bg-[#d6e2e9] rounded-full"></span>
                       <span className="w-1 h-[3px] bg-[#e2d4e0] rounded-full"></span>
                       <span className="w-1 h-[3px] bg-[#fcedda] rounded-full"></span>
                    </div>
                    <div className="flex justify-between items-center text-[#2b2824]">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-3xl font-black">{currency}{total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-[#6e655a] font-medium mt-2 text-right">Taxes calculated at checkout</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Link to="/Placeorder" className="btn-primary w-full text-center py-4 text-lg font-bold text-[#2b2824] bg-[#cce3de] hover:bg-[#b5d5cd] border-2 border-[#cce3de] hover:border-[#b5d5cd] shadow-soft">
                      Proceed to Checkout
                    </Link>
                    <Link to="/Shop" className="w-full text-center py-4 font-bold text-[#6e655a] hover:text-[#2b2824] transition-colors bg-[#faf7f2] rounded-full hover:bg-white border-2 border-[#e6dfce] hover:border-[#f4c2c2]">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
