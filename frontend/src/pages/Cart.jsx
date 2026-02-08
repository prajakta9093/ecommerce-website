import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Cart = () => {
  const {
    products,
    cartitems,
    currency,
    removeFromCart,
    updateQuantity,
    getCartAmount,
    delivery_fee,
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
  }, [cartitems]);

  const subtotal = getCartAmount();
  const actualDeliveryFee = subtotal >= 500 ? 0 : delivery_fee;
  const total = subtotal > 0 ? subtotal + actualDeliveryFee : 0;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#faf8f4] pt-24 pb-12 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#5a3e2b] mb-2">
              Shopping Cart
            </h1>
            <p className="text-[#7a6a5a]">
              {cartData.length === 0
                ? "Your cart is waiting to be filled"
                : `${cartData.length} item${cartData.length > 1 ? "s" : ""} in your cart`}
            </p>
          </div>

          {cartData.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
              <div className="w-28 h-28 mx-auto mb-6 bg-[#e6d8c3] rounded-full flex items-center justify-center">
                <span className="text-5xl">🧺</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#5a3e2b] mb-4">
                Your cart is empty
              </h2>
              <p className="text-[#7a6a5a] mb-8">
                Add something handmade and beautiful 🌾
              </p>
              <Link
                to="/Shop"
                className="inline-block bg-[#8b5e34] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#74492b] transition"
              >
                Explore Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Items */}
              <div className="lg:col-span-2 space-y-5">
                {cartData.map((item, index) => {
                  const productData = products.find(
                    (p) => String(p._id) === item.id
                  );
                  if (!productData) return null;

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
                    >
                      <div className="flex flex-col sm:flex-row gap-6">

                        {productData.images?.[0] && (
                          <Link to={`/product/${productData._id}`}>
                            <img
                              src={productData.images[0]}
                              alt={productData.name}
                              className="w-28 h-28 object-cover rounded-xl ring-1 ring-[#e6d8c3]"
                            />
                          </Link>
                        )}

                        <div className="flex-1">
                          <Link to={`/product/${productData._id}`}>
                            <h3 className="text-xl font-semibold text-[#5a3e2b] hover:text-[#8b5e34] transition">
                              {productData.name}
                            </h3>
                          </Link>

                          <p className="mt-2 text-lg font-bold text-[#8b5e34]">
                            {currency}{productData.price}
                          </p>

                          {/* Quantity */}
                          <div className="flex items-center gap-3 mt-4">
                            <button
                              onClick={() =>
                                item.quantity <= 1
                                  ? removeFromCart(item.id)
                                  : updateQuantity(item.id, null, item.quantity - 1)
                              }
                              className="w-8 h-8 rounded-full bg-[#e6d8c3] text-[#5a3e2b] font-bold"
                            >
                              −
                            </button>

                            <span className="w-10 text-center font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(item.id, null, item.quantity + 1)
                              }
                              className="w-8 h-8 rounded-full bg-[#e6d8c3] text-[#5a3e2b] font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-[#7a6a5a]">Subtotal</p>
                          <p className="text-2xl font-bold text-[#8b5e34]">
                            {currency}{(productData.price * item.quantity).toFixed(2)}
                          </p>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="mt-3 text-sm text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div>
                <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-28">
                  <h2 className="text-2xl font-serif font-bold text-[#5a3e2b] mb-6 text-center">
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        {currency}{subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span className="font-semibold">
                        {actualDeliveryFee === 0 ? "FREE" : `${currency}${delivery_fee}`}
                      </span>
                    </div>

                    <hr />

                    <div className="flex justify-between text-lg font-bold text-[#8b5e34]">
                      <span>Total</span>
                      <span>{currency}{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link
                    to="/Placeorder"
                    className="block mt-8 bg-[#8b5e34] text-white py-4 rounded-full text-center font-semibold hover:bg-[#74492b] transition"
                  >
                    Proceed to Checkout
                  </Link>

                  <Link
                    to="/Shop"
                    className="block text-center mt-4 text-[#8b5e34] hover:underline"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
