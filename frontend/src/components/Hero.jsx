import React from 'react';
import { Link } from 'react-router-dom';
import yarnHeroImage from '../assets/yarn-hero.jpg';

const Hero = () => {
  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ minHeight: 'calc(100vh - 80px)' }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: `url(${yarnHeroImage})`,
          filter: 'brightness(0.75)',
        }}
      />

      {/* Warm Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/20"></div>

      {/* Soft Brown Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-[#c4a484]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#a67c52]/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 py-20 w-full max-w-6xl mx-auto">

        {/* Top Decorative Line */}
        <div className="flex items-center justify-center mb-10">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#c4a484]"></div>
          <div className="mx-4 w-2 h-2 rounded-full bg-[#c4a484]"></div>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#c4a484]"></div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-wider mb-6 animate-fadeInUp">
          <span className="bg-gradient-to-r from-white via-[#f3ede4] to-[#e6d8c3] bg-clip-text text-transparent drop-shadow-xl">
            Yarn Yapper
          </span>
        </h1>

        {/* Underline */}
        <div className="flex justify-center mb-10">
          <div className="h-1 w-40 bg-gradient-to-r from-[#c4a484] via-[#a67c52] to-[#8b5e34] rounded-full"></div>
        </div>

        {/* Tagline */}
        <p className="text-lg sm:text-xl md:text-2xl italic font-light max-w-3xl mx-auto mb-14 animate-fadeInUp animation-delay-300">
          Where every stitch tells a story
        </p>

        {/* CTA Button */}
        <div className="animate-fadeInUp animation-delay-600">
          <Link
            to="/shop"
            className="group relative inline-flex items-center justify-center px-12 py-5 font-semibold rounded-full shadow-2xl overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#8b5e34] via-[#a67c52] to-[#c4a484] group-hover:scale-110 transition-transform duration-500"></span>
            <span className="relative text-white text-lg flex items-center gap-2">
              Explore Shop
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </section>
  );
};

export default Hero;
