import React from 'react';
import { Link } from 'react-router-dom';
import yarnHeroImage from '../assets/yarn-hero.jpg';

const Hero = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col md:flex-row items-center justify-between bg-transparent pt-24 px-6 md:px-12 lg:px-24 overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#f4c2c2] rounded-full blur-[120px] opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#cce3de] rounded-full blur-[150px] opacity-40 translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      {/* Text Content */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left pt-12 md:pt-0 mb-12 md:mb-0">
        
        <div className="inline-block px-5 py-2 mb-6 border border-[#f4c2c2] rounded-full text-[#6e655a] text-sm uppercase tracking-widest font-semibold bg-white/60 backdrop-blur-sm shadow-sm">
          Aesthetic Handmade Crafts
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] text-[#2b2824] leading-[1.1] mb-6 tracking-tight">
          Handcrafted <br />
          <span className="italic text-[#6e655a]">with Love & Yarn</span>
        </h1>
        
        <p className="text-[#6e655a] text-lg sm:text-lg font-medium max-w-lg mb-10 leading-relaxed">
          Discover a curated collection of beautiful, sustainable yarn art designed to bring warmth, color, and elegance to your space.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to="/shop"
            className="btn-primary flex items-center justify-center gap-2 group w-full sm:w-auto"
          >
            Explore Collection
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            to="/about"
            className="btn-outline flex items-center justify-center w-full sm:w-auto"
          >
            Our Story
          </Link>
        </div>
      </div>

      {/* Image Gallery Area */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end relative mt-8 md:mt-0">
        {/* Soft Decorative Blob Behind Image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[#fcedda] rounded-[4rem] mix-blend-multiply filter blur-2xl opacity-70 z-0 rotate-6"></div>

        {/* Main Image */}
        <div className="relative z-10 w-[85%] md:w-[90%] max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-soft group border-4 border-white">
          <img 
            src={yarnHeroImage} 
            alt="Handcrafted Yarn Art" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2b2824]/10 to-transparent pointer-events-none"></div>
        </div>

        {/* Floating Accent Badge */}
        <div className="absolute bottom-6 -left-2 md:-left-8 z-20 bg-white/95 backdrop-blur-md px-5 py-4 rounded-2xl shadow-soft border border-[#e6dfce] flex items-center gap-4 animate-bounce-slow">
           <div className="w-12 h-12 bg-[#cce3de] rounded-full flex items-center justify-center text-[#2b2824] font-['Playfair_Display'] font-bold text-xl shadow-sm">
             100%
           </div>
           <div>
             <p className="text-[#2b2824] font-bold text-sm">Premium Quality</p>
             <p className="text-[#6e655a] text-xs font-medium">Sustainable Materials</p>
           </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
