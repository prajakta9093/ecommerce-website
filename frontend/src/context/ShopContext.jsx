import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 50;
  const backendUrl = "http://localhost:9000";

  const [products, setProducts] = useState([]);
  const [cartitems, setCartItems] = useState({});

  /* ---------- FETCH PRODUCTS ---------- */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      console.log("Fetched products:", res.data);
      
      if (res.data.success) {
        setProducts(res.data.products || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------- REFRESH PRODUCTS ---------- */
  const refreshProducts = async () => {
    await fetchProducts();
  };

  /* ---------- ADD TO CART ---------- */
  const addToCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };

      if (!updated[itemId]) {
        updated[itemId] = { quantity: 1 };
      } else {
        updated[itemId].quantity += 1;
      }

      return updated;
    });
  };

  /* ---------- REMOVE ITEM ---------- */
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  /* ---------- UPDATE QUANTITY ---------- */
  const updateQuantity = (itemId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prev) => ({
      ...prev,
      [itemId]: { quantity },
    }));
  };

  /* ---------- TOTAL AMOUNT ---------- */
  const getCartAmount = () => {
    let total = 0;

    for (const itemId in cartitems) {
      const product = products.find(
        (p) => String(p._id) === String(itemId)
      );
      if (product) {
        total += product.price * cartitems[itemId].quantity;
      }
    }
    return total;
  };

  /* ---------- TOTAL ITEMS ---------- */
  const getCartCount = () => {
    let count = 0;
    for (const itemId in cartitems) {
      count += cartitems[itemId].quantity;
    }
    return count;
  };

  /* ---------- CLEAR CART ---------- */
  const clearCart = () => {
    setCartItems({});
  };

  const value = {
    products,
    cartitems,
    currency,
    delivery_fee,
    backendUrl, // Export this so other components can use it
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartAmount,
    getCartCount,
    clearCart,
    refreshProducts,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;