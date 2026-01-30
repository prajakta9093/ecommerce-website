import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";



// ----------- IMAGE IMPORTS -----------
import bandana from "./bandana.jpeg";
import bouquet from "./bouqet.jpeg";
import bow from "./bow.jpeg";
import eyeCharm from "./eye charm.jpeg";
import gajra from "./gajra.jpeg";
import pot from "./pot.jpeg";
import rakhi from "./rakhi.jpeg";
import rakhiall from "./rakhiall.jpeg";
import shadhi1 from "./shadhi1.jpeg";
import shadhi2 from "./shadhi2.jpeg";
import top from "./top.jpeg";
import wall from "./wall.jpeg";
import painting from "./painting.jpeg";

// ----------- PRODUCT LIST WITH DESCRIPTION -----------

export const productList = [
  {
    id: 1,
    name: "Crochet Pet Bandana",
    image: bandana,
    price: 299,
    category: "Hair Accessoires",
    description: "A cute soft crochet bandana for pets — made with comfort and charm."
  },
  {
    id: 2,
    name: "Crochet Flower Bouquet",
    image: bouquet,
    price: 899,
    category: "Crochet",
    description: "Beautiful handmade bouquet that lasts forever — perfect gift choice."
  },
  {
    id: 3,
    name: "Crochet Hair Bow",
    image: bow,
    price: 149,
    category: "Hair Accessoires",
    description: "Lightweight and adorable — adds a cute touch to any hairstyle."
  },
  {
    id: 4,
    name: "Evil Eye Dreamcatcher",
    image: eyeCharm,
    price: 499,
    category: "Crochet",
    description: "Designed to protect energy and create a peaceful, aesthetic vibe."
  },
  {
    id: 5,
    name: "Crochet Hair Gajra",
    image: gajra,
    price: 199,
    category: "Hair Accessoires",
    description: "Reusable festive gajra — inspired by Indian tradition and elegance."
  },
  {
    id: 6,
    name: "Sunflower Pot Decor",
    image: pot,
    price: 599,
    category: "Crochet",
    description: "A cheerful handmade sunflower decor piece for your favorite corner."
  },
  {
    id: 7,
    name: "Handmade Rakhi",
    image: rakhi,
    price: 99,
    category: "Crochet",
    description: "A simple yet meaningful rakhi — made with warmth and care."
  },
  {
    id: 8,
    name: "Crochet Rakhi Collection",
    image: rakhiall,
    price: 349,
    category: "Crochet",
    description: "A festive set of beautiful handcrafted rakhis — perfect for gifting."
  },
  {
    id: 9,
    name: "Custom Name Hoop - Floral",
    image: shadhi1,
    price: 999,
    category: "Hoops",
    description: "A personalized floral hoop — ideal for events, walls, and gifting."
  },
  {
    id: 10,
    name: "Custom Baby Name Hoop",
    image: shadhi2,
    price: 1299,
    category: "Hoops",
    description: "A special keepsake hoop to celebrate your baby’s name and identity."
  },
  {
    id: 11,
    name: "Crochet Halter Top",
    image: top,
    price: 699,
    category: "Crochet",
    description: "Trendy handmade halter top — stylish, soft, and uniquely crafted."
  },
  {
    id: 12,
    name: "Custom Wall Frame",
    image: wall,
    price: 1499,
    category: "Paintings",
    description: "Premium customized wall frame to match your personality and space."
  },
  {
    id: 13,
    name: "Acrylic Painting",
    image: painting,
    price: 1999,
    category: "Paintings",
    description: "Hand-painted acrylic art piece — bold, meaningful, and beautiful."
  },
];

// -------------------- COMPONENT --------------------

export default function ProductsPage() {
  const [cart, setCart] = useState([]);

  // -------- Load cart from localStorage --------
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // -------- Save cart to localStorage --------
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        {/* ---- Cart Indicator ---- */}
        <h2 style={{ textAlign: "right", marginRight: "20px", fontWeight: "500" }}>
          🛒 Cart: {cart.length} item{cart.length !== 1 ? "s" : ""}
        </h2>

        {/* ---- Product Grid ---- */}
        <div style={styles.grid}>
          {productList.map((item) => (
            <div key={item.id} style={styles.card}>
              <img src={item.image} alt={item.name} style={styles.img} />
              <h3 style={styles.name}>{item.name}</h3>
              <p style={styles.desc}>{item.description}</p>
              <p style={styles.price}>₹{item.price}</p>

              <button style={styles.btn} onClick={() => addToCart(item)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

// ----------- STYLES -----------

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "10px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    textAlign: "center",
    padding: "15px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
  },
  img: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  name: {
    fontSize: "18px",
    fontWeight: "600",
    marginTop: "10px",
  },
  desc: {
    fontSize: "14px",
    color: "#666",
    margin: "6px 0 10px",
    height: "48px",
    overflow: "hidden",
  },
  price: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#7A00CC",
    margin: "5px 0",
  },
  btn: {
    width: "100%",
    background: "#7A00CC",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
};
