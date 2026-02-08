import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import gauriPhoto from "../assets/dp.png";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf8f3] to-white text-[#5a4634]">
      <Navbar />

      <main className="pt-10 sm:pt-10 lg:pt-20 pb-10 sm:pb-20 lg:pb-30">
        <div className="max-w-7xl mx-auto px-6">

         

          {/* Modern Card Layout */}
          <section className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">

            {/* Image Card */}
            <div className="order-2 lg:order-1">
              <div className="relative group">
                {/* Decorative background */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[#fde7f1] to-[#f8dfe8] rounded-3xl opacity-50 blur-2xl group-hover:opacity-70 transition-opacity duration-500"></div>
                
                {/* Main image container */}
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#f0e6dc]">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={gauriPhoto}
                      alt="Founder of Yarn Yapper"
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Name badge */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <p className="text-[#5a4634] font-semibold text-lg">Founder & Artisan</p>
                    <p className="text-[#8b6a4f] text-sm">Creating magic, one stitch at a time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Card */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl border border-[#f0e6dc]">
                <div className="inline-block mb-6">
                  <span className="bg-gradient-to-r from-[#fde7f1] to-[#f8dfe8] text-[#8b6a4f] px-4 py-2 rounded-full text-sm font-medium">
                    ✨ Welcome to Our World
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-serif text-[#5a4634] mb-6">
                  Hey There!
                </h2>

                <div className="space-y-5 text-[#6b5846] leading-relaxed text-base">
                  <p className="border-l-4 border-[#fde7f1] pl-4">
                    At <span className="font-semibold text-[#5a4634]">Yarn Yapper</span>, every product is handcrafted with care, precision, and a whole lot of heart.
                  </p>

                  <p>
                    What makes us different is our <span className="font-semibold text-[#8b6a4f]">fully customizable approach</span> — from colors and sizes to patterns — combined with the fact that every piece is <span className="font-semibold text-[#8b6a4f]">100% handmade</span>.
                  </p>

                  <p>
                    Every creation carries a part of our story, and whether you're here for something cozy, colorful, or custom — thank you for supporting our handmade dream.
                  </p>

                  <div className="pt-6 mt-6 border-t border-[#f0e6dc]">
                    <p className="italic text-[#5a4634] flex items-center gap-2">
                      <span className="text-2xl">🧵</span>
                      <span>
                        With love,<br />
                        <span className="font-semibold text-[#8b6a4f] not-italic">
                          Gauri
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats/Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#fde7f1] to-[#f8dfe8] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#5a4634]">100%</div>
                  <div className="text-xs text-[#8b6a4f] mt-1">Handmade</div>
                </div>
                <div className="bg-gradient-to-br from-[#fde7f1] to-[#f8dfe8] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#5a4634]">Custom</div>
                  <div className="text-xs text-[#8b6a4f] mt-1">Designs</div>
                </div>
                <div className="bg-gradient-to-br from-[#fde7f1] to-[#f8dfe8] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#5a4634]">♥</div>
                  <div className="text-xs text-[#8b6a4f] mt-1">Made with Love</div>
                </div>
              </div>
            </div>

          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;