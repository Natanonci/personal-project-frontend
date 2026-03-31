import React from 'react'
import bgImage from '../assets/bgImage.png'
import { useState } from 'react';
import { useNavigate } from 'react-router';
import useUserStore from '../stores/userStore';

function Home() {

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const userLogOut = useUserStore(state => state.logout)

  return (
    
    <div className="min-h-screen w-full relative flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden">

      
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-70"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      
      <nav className="w-full flex justify-between items-center mb-6 z-10 gap-4">

        
        <div className="relative w-full max-w-md group">
          {/* ไอคอน Hamburger (ซ้าย) */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C19A6B] transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <input
            type="text"
            placeholder="Search your favorite place"
            className="w-full py-3.5 pl-12 pr-12 bg-white rounded-full text-sm text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-[#C19A6B]/50 focus:shadow-md transition-all placeholder-gray-400"
          />

          {/* ไอคอนแว่นขยาย (ขวา) */}
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C19A6B] transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>

        {/* เมนูไอคอนด้านขวา */}
        <div className="flex items-center gap-3 md:gap-5 text-gray-700">

          {/* ไอคอน Bookmark */}
          <button className="p-2 hover:text-[#C19A6B] hover:bg-white/50 rounded-full transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 md:w-7 md:h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </button>

          {/* ไอคอน User */}
          <div className="relative">

            {/* ปุ่ม User เดิม เพิ่ม onClick เข้าไปสลับการเปิด/ปิด */}
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-2 hover:text-[#C19A6B] hover:bg-white/50 rounded-full transition focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 md:w-7 md:h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </button>

            {/* เมนู Dropdown จะแสดงก็ต่อเมื่อ isProfileOpen เป็น true */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#FEF5EB] py-2 z-50">

                {/* หมวดหมู่ให้เลือก */}
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FEF5EB] hover:text-[#C19A6B] transition">
                  My Profile
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FEF5EB] hover:text-[#C19A6B] transition">
                  Settings
                </a>

                {/* เส้นคั่น */}
                <div className="border-t border-gray-100 my-1"></div>

                {/* ปุ่ม Logout (ใช้สีแดงให้ชัดเจน) */}
                <button
                  className="w-full text-left block px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition"
                  onClick={userLogOut}>Log out</button>

              </div>
            )}

          </div>

          {/* ไอคอน Chat */}
          <button className="p-2 hover:text-[#C19A6B] hover:bg-white/50 rounded-full transition relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 md:w-7 md:h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
            {/* จุดแจ้งเตือนสีแดง (จุดเล็กๆ มุมขวาบนของไอคอนแชท) ลบออกได้ถ้าไม่ชอบครับ */}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-[#FEF5EB] rounded-full"></span>
          </button>

        </div>
      </nav>

      {/* 4. พื้นที่เนื้อหาหลัก (Main Content Card) */}
      {/* <main className="flex-1 w-full bg-[#FEF5EB] rounded-[30px] md:rounded-[40px] shadow-2xl shadow-[#D8A67B]/20 p-6 md:p-10 flex flex-col z-10 border border-white/40">

        {/* เอาเนื้อหาเว็บของคุณมาใส่ตรงนี้ได้เลยครับ */}
      {/* <div className="w-full h-full border-2 border-dashed border-[#C19A6B]/30 rounded-2xl flex items-center justify-center text-[#C19A6B]/50 font-medium">
          Content goes here...
        </div> */}

      {/* </main> */}

    </div>
  );
}

export default Home