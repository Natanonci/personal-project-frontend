import React from 'react';
import { Link } from 'react-router';

function Footer() {
  return (
    <footer className="w-full mt-20">
      {/* ส่วนบน: ตกแต่งขอบมนให้เข้ากับ Card ในเว็บ */}
      <div className="bg-[#4A3F35] rounded-t-[3rem] pt-16 pb-10 px-10 md:px-20 text-[#FEF5EB]">
        <div className="footer sm:footer-horizontal gap-10 md:gap-24 max-w-7xl mx-auto">
          
          {/* Brand Column */}
          <aside className="flex flex-col gap-4 max-w-xs">
            <div className="flex items-center gap-3">
              {/* Logo SVG: Paw Icon */}
              <div className="p-3 bg-[#C19A6B] rounded-2xl shadow-lg shadow-black/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm5.5-1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-11 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8.5-4.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase">
                Pet Lover <span className="text-[#C19A6B]">Booking</span>
              </span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed font-medium">
              ศูนย์รวมการจองคาเฟ่สัตว์เลี้ยงที่พรีเมียมที่สุด ค้นหาสถานที่พักผ่อนกับเพื่อนตัวน้อยของคุณได้ง่ายๆ เพียงไม่กี่คลิก
            </p>
          </aside>

          {/* Nav Columns */}
          <nav>
            <h6 className="footer-title text-[#C19A6B] opacity-100 font-black tracking-widest mb-4">Quick Links</h6>
            <Link to="/home" className="link link-hover opacity-60 hover:opacity-100 hover:text-[#C19A6B] transition-all mb-2 block">Home</Link>
            <Link to="/category" className="link link-hover opacity-60 hover:opacity-100 hover:text-[#C19A6B] transition-all mb-2 block">All Categories</Link>
            <Link to="/reservation" className="link link-hover opacity-60 hover:opacity-100 hover:text-[#C19A6B] transition-all mb-2 block">My Booking</Link>
          </nav>

          <nav>
            <h6 className="footer-title text-[#C19A6B] opacity-100 font-black tracking-widest mb-4">Support</h6>
            <a className="link link-hover opacity-60 hover:opacity-100 mb-2 block">About Us</a>
            <a className="link link-hover opacity-60 hover:opacity-100 mb-2 block">Contact</a>
            <a className="link link-hover opacity-60 hover:opacity-100 mb-2 block">Privacy Policy</a>
          </nav>

          {/* Social Column */}
          <nav>
            <h6 className="footer-title text-[#C19A6B] opacity-100 font-black tracking-widest mb-4">Social</h6>
            <div className="flex gap-4">
              <a className="p-3 bg-white/5 rounded-xl hover:bg-[#C19A6B] hover:text-white transition-all duration-300">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
              </a>
              <a className="p-3 bg-white/5 rounded-xl hover:bg-[#C19A6B] hover:text-white transition-all duration-300">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* ส่วนล่าง: Copyright พื้นหลังเข้มขึ้นนิดหน่อย */}
      <div className="bg-[#3D332B] px-10 md:px-20 py-6 border-t border-white/5 text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-[#FEF5EB]/40 uppercase tracking-[0.2em]">
            © 2026 Pet Lover Booking. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C19A6B]/60 uppercase tracking-widest">
            Made with 
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#C19A6B]"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            by Pet Lovers
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;