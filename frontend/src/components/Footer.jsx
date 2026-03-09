import React from "react";
import { Link } from "react-router-dom";
import { Instagram, MapPin, Mail, Phone, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#e6dfce] border-top border-[#e6dfce] pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto relative">
        {/* Soft Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#fcedda] rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#e2d4e0] rounded-full blur-[100px] opacity-30 mix-blend-multiply pointer-events-none translate-y-1/2"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center md:text-left relative z-10">

          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold tracking-wide text-[#2b2824] font-['Playfair_Display'] mb-4 relative inline-block">
              YarnYapper
              <span className="absolute -top-1 -right-4 text-[#f4c2c2]"><Heart size={16} fill="currentColor" /></span>
            </h2>
            <p className="text-[#6e655a] font-medium leading-relaxed max-w-sm">
              Thoughtfully handcrafted, stitch by stitch. Creating beautiful, sustainable yarn art to warm your space and soul.
            </p>
            <div className="flex gap-4 mt-6 text-[#2b2824]">
              <a href="https://www.instagram.com/gaurishirkee/?igsh=MXdxbnRsZnY0aDZ2bw==" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#f4c2c2]/20 rounded-full hover:bg-[#f4c2c2] transition-colors cursor-pointer group">
                <Instagram size={20} className="group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold text-[#2b2824] mb-4">Explore</h3>
            <ul className="flex flex-col gap-3 text-[#6e655a] font-semibold">
              <li><Link to="/Shop" className="hover:text-[#f4c2c2] transition-colors relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#cce3de] text-xs">◆</span> Curated Shop</Link></li>
              <li><Link to="/Customorder" className="hover:text-[#cce3de] text-[#2b2824] transition-colors relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#f4c2c2] text-xs">◆</span> bespoke Custom Orders</Link></li>
              <li><Link to="/About" className="hover:text-[#d6e2e9] transition-colors relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#fcedda] text-xs">◆</span> Our Story</Link></li>
              <li><Link to="/Contact" className="hover:text-[#e2d4e0] transition-colors relative group"><span className="absolute -left-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#cce3de] text-xs">◆</span> Get in Touch</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold text-[#2b2824] mb-4">Contact</h3>
            <ul className="flex flex-col gap-4 text-[#6e655a] font-medium">
              <li className="flex items-center gap-3 bg-[#faf7f2] px-4 py-2 rounded-xl">
                <MapPin size={18} className="text-[#f4c2c2]" />
                Mumbai, Maharashtra, India
              </li>
              <li className="flex items-center gap-3 hover:bg-[#cce3de]/10 px-4 py-2 rounded-xl transition-colors">
                <Mail size={18} className="text-[#cce3de]" />
                <a href="mailto:contact@yarnyapper.com" className="font-semibold text-[#2b2824] hover:text-[#cce3de] transition-colors">contact@yarnyapper.com</a>
              </li>
              <li className="flex items-center gap-3 hover:bg-[#d6e2e9]/10 px-4 py-2 rounded-xl transition-colors">
                <Phone size={18} className="text-[#d6e2e9]" />
                <a href="tel:+917620874930" className="font-semibold text-[#2b2824] hover:text-[#d6e2e9] transition-colors">+91 7620874930</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#e6dfce] flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[#6e655a] font-medium relative z-10">
          <p>© {new Date().getFullYear()} Yarn Yapper. Handcrafted with <Heart size={12} className="inline text-[#f4c2c2] fill-[#f4c2c2] mx-1" /> love.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#f4c2c2] transition-colors font-semibold">Privacy Policy</a>
            <a href="#" className="hover:text-[#cce3de] transition-colors font-semibold">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
