import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

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

  /* ---------- BUILD CART DATA ---------- */
  useEffect(() => {
    const data = [];

    for (const itemId in cartitems) {
      const item = cartitems[itemId];

      if (item.quantity > 0) {
        data.push({
          id: String(itemId),
          quantity: item.quantity,
        });
      }
    }

    setCartData(data);
  }, [cartitems]);

  const subtotal = getCartAmount();
  const actualDeliveryFee = subtotal >= 500 ? 0 : delivery_fee;
  const total = subtotal > 0 ? subtotal + actualDeliveryFee : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Shopping Cart 🛒
        </h1>

        {cartData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
            <p className="text-gray-400 mb-6">
              Add some beautiful handmade items to get started!
            </p>
            <Link
              to="/Shop"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* -------- ITEMS -------- */}
            <div className="lg:col-span-2 space-y-4">
              {cartData.map((item, index) => {
                const productData = products.find(
                  (p) => String(p._id) === item.id
                );
                if (!productData) return null;

                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-4 flex gap-4"
                  >
                    <Link to={`/product/${productData._id}`}>
                      <img
                        src={`http://localhost:9000/${productData.images[0]}`}
                        alt={productData.name}
                        className="w-24 h-24 object-cover rounded-lg hover:scale-105 transition"
                      />
                    </Link>

                    <div className="flex-1">
                      <Link to={`/product/${productData._id}`}>
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-pink-600 transition">
                          {productData.name}
                        </h3>
                      </Link>

                      <p className="text-pink-600 font-semibold mt-1">
                        {currency}
                        {productData.price}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() =>
                            item.quantity <= 1
                              ? removeFromCart(item.id)
                              : updateQuantity(
                                  item.id,
                                  null,
                                  item.quantity - 1
                                )
                          }
                          className="w-8 h-8 rounded-full border hover:bg-gray-100 flex items-center justify-center font-bold"
                        >
                          −
                        </button>

                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              null,
                              item.quantity + 1
                            )
                          }
                          className="w-8 h-8 rounded-full border hover:bg-gray-100 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        🗑 Remove
                      </button>

                      <p className="text-lg font-semibold text-gray-800">
                        {currency}
                        {(productData.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* -------- SUMMARY -------- */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>
                      {currency}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    {subtotal >= 500 ? (
                      <span className="text-green-600 font-medium">FREE</span>
                    ) : (
                      <span>
                        {currency}
                        {delivery_fee.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <hr />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-pink-600">
                      {currency}
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link
                  to="/Placeorder"
                  className="w-full bg-pink-600 text-white py-3 rounded-lg block text-center font-semibold hover:bg-pink-700 transition mb-3"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/Shop"
                  className="block text-center text-pink-600 hover:text-pink-700 text-sm font-medium"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
