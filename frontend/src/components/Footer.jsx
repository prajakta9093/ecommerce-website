import React from "react";

const Footer = () => {
  return (
    <footer className="mt-10 bg-pink-200 text-gray-800 shadow-md border-t border-pink-300 w-full overflow-x-hidden">
      
      {/* Footer Content */}
      <div className="flex flex-col items-center justify-center text-center gap-4 py-8 max-w-4xl mx-auto px-4">

        {/* Contact Section */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">

          <a
            href="tel:+917620874930"
            className="hover:text-pink-600 font-medium transition flex items-center gap-2"
          >
            📞 <span className="break-all">+91 7620874930</span>
          </a>

          <span className="hidden sm:block text-gray-500">|</span>

          <a
            href="mailto:contact@yarnyapper.com"
            className="hover:text-pink-600 font-medium transition flex items-center gap-2"
          >
            ✉️ <span className="break-all">contact@yarnyapper.com</span>
          </a>

          <span className="hidden sm:block text-gray-500">|</span>

          <div className="flex items-center gap-2 font-medium">
            📍 Mumbai, Maharashtra, India
          </div>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-pink-400">
        <p className="py-3 text-center text-xs font-medium text-gray-700 px-4">
          © {new Date().getFullYear()} Yarn Yapper — All Rights Reserved.
        </p>
      </div>

    </footer>
  );
};

export default Footer;
