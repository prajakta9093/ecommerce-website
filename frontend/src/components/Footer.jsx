import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#6B3E2E] text-white">

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-12 flex flex-col items-center text-center gap-5">

        {/* Brand line */}
        <p className="text-sm sm:text-base font-light tracking-wide text-white/90">
          Thoughtfully handmade, stitch by stitch
        </p>

        {/* Divider */}
        <div className="w-20 h-[2px] bg-[#8B5A3C] rounded-full"></div>

        {/* Contact */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-white/90">

          <a
            href="tel:+917620874930"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            📞 <span className="break-all">+91 7620874930</span>
          </a>

          <span className="hidden sm:block text-white/40">|</span>

          <a
            href="mailto:contact@yarnyapper.com"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            ✉️ <span className="break-all">contact@yarnyapper.com</span>
          </a>

          <span className="hidden sm:block text-white/40">|</span>

          <div className="flex items-center gap-2">
            📍 Mumbai, Maharashtra, India
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/25">
        <p className="py-4 text-center text-[11px] sm:text-xs text-white/80 tracking-wide">
          © {new Date().getFullYear()} Yarn Yapper · All Rights Reserved
        </p>
      </div>

    </footer>
  );
};

export default Footer;
