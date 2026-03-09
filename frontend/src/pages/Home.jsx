import React, { useContext } from 'react';
import Hero from '../components/Hero.jsx';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { ShopContext } from '../context/ShopContext.jsx';
import { Link } from 'react-router-dom';

const Home = () => {
  const { products } = useContext(ShopContext);
  
  // Get 4 featured products for the home page showcase
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-[#faf7f2]">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Featured Collection Section */}
        <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full relative">
          {/* Subtle background flair */}
          <div className="absolute top-10 right-10 w-40 h-40 bg-[#e2d4e0] rounded-full blur-[80px] opacity-40 mix-blend-multiply pointer-events-none"></div>

          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 relative z-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-['Playfair_Display'] text-[#2b2824] mb-4">
                Curated Favorites
              </h2>
              <p className="text-[#6e655a] font-medium text-lg leading-relaxed">
                Discover our most loved pieces, hand-picked for your inspired living spaces.
              </p>
            </div>
            
            <Link to="/shop" className="group flex items-center gap-2 text-[#2b2824] font-semibold hover:text-[#2b2824] transition-colors pb-1 relative">
              View All Collection
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span className="absolute left-0 bottom-0 h-[2px] w-full bg-[#f4c2c2] group-hover:h-[4px] transition-all duration-300 rounded-full"></span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 relative z-10">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
