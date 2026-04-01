import React, { useState, useRef, useEffect } from 'react';
import useUserStore from '../stores/userStore';
import { Book, Search, Bookmark, User, MessageCircle, LogIn, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router'; // ใช้ react-router-dom
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import CategoryMenu from './Category';

function Header() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const userLogOut = useUserStore(state => state.logout);
    const navigate = useNavigate();
    const user = useUserStore(state => state.user);
    const dropdownRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();

    const handleReservationClick = () => {
        if (!user) {
            alert("กรุณาเข้าสู่ระบบก่อนใช้งานหน้านี้");
            navigate('/login');
        } else {
            navigate('/reservation');
        }
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();

        // 🟢 เช็คว่าล็อกอินหรือยัง
        if (!user) {
            alert("กรุณาเข้าสู่ระบบก่อนใช้งานฟังก์ชันค้นหา");
            navigate('/login');
            return;
        }

        if (searchTerm.trim()) {
            const currentParams = new URLSearchParams(location.search);
            const currentType = currentParams.get('type');
            let url = `/category?search=${encodeURIComponent(searchTerm)}`;
            if (currentType && location.pathname === '/category') {
                url += `&type=${encodeURIComponent(currentType)}`;
            }
            navigate(url);
        }
    };

    // 🟢 ดักจับการกด Enter ในช่อง Input
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // ปิด Dropdown อัตโนมัติเมื่อคลิกพื้นที่อื่นบนหน้าจอ
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <nav className="w-full flex justify-between items-center py-6 mb-4 z-50 relative">

                {/* --- ส่วนซ้าย: Search Bar --- */}
                <div className="flex-1 flex justify-start items-center">
                    <div className="relative w-full max-w-md group">

                        {/* ไอคอน Book (Link ไปหน้า Category) */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (!user) {
                                    alert("กรุณาเข้าสู่ระบบเพื่อดูหมวดหมู่");
                                    navigate('/login');
                                } else {
                                    navigate('/category');
                                }
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#C19A6B] hover:bg-[#FEF5EB] rounded-full transition-all duration-300 z-20 cursor-pointer"
                        >
                            <Book size={20} />
                        </button>

                        {/* 🟢 ช่อง Input: เพิ่ม value, onChange และ onKeyDown */}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search your favorite place..."
                            className="w-full py-3.5 pl-14 pr-14 bg-white/80 backdrop-blur-md rounded-full text-sm text-[#4A3F35] font-medium shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#C19A6B]/40 focus:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 placeholder-gray-400"
                        />

                        {/* 🟢 ปุ่มแว่นขยาย: เพิ่ม onClick */}
                        <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white bg-[#4A3F35] hover:bg-[#C19A6B] rounded-full transition-colors duration-300 shadow-sm cursor-pointer"
                        >
                            <Search size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* --- ส่วนกลาง: Logo --- */}
                <div className="flex-none flex justify-center items-center px-4">
                    <Link to="/home" className="group relative flex items-center justify-center">
                        {/* แสงวงกลมเรืองแสงด้านหลังโลโก้ตอน Hover */}
                        <div className="absolute inset-0 bg-[#C19A6B]/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-16 md:h-20 lg:h-24 w-auto object-contain relative z-10 drop-shadow-sm group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                    </Link>
                </div>

                {/* --- ส่วนขวา: Action Icons --- */}
                <div className="flex-1 flex justify-end items-center">
                    <div className="flex items-center p-1.5 gap-1 text-[#4A3F35] bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-gray-100/80">

                        <button
                            onClick={handleReservationClick}
                            className="p-2.5 hover:text-[#C19A6B] hover:bg-[#FEF5EB] rounded-full transition-colors duration-300 cursor-pointer relative group"
                        >
                            <Bookmark size={20} />
                            {/* Tooltip เล็กๆ */}
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-[#4A3F35] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Bookmarks</span>
                        </button>

                        <button className="p-2.5 hover:text-[#C19A6B] hover:bg-[#FEF5EB] rounded-full transition-colors duration-300 cursor-pointer relative group">
                            <MessageCircle size={20} />
                            {/* จุดแจ้งเตือนสีแดง (Notification Dot) */}
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        {/* เส้นคั่นบางๆ */}
                        <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>

                        {/* Profile & Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={`p-2.5 rounded-full transition-all duration-300 cursor-pointer border-2 ${isProfileOpen ? 'bg-[#FEF5EB] text-[#C19A6B] border-[#C19A6B]/30' : 'hover:bg-gray-50 border-transparent hover:text-[#C19A6B]'}`}
                            >
                                <User size={20} />
                            </button>

                            {/* --- Framer Motion Dropdown --- */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-[0_20px_40px_rgb(0,0,0,0.1)] border border-gray-100 py-3 overflow-hidden z-50 origin-top-right"
                                    >

                                        {/* ส่วนหัว Dropdown (แสดงสถานะ User) */}
                                        <div className="px-5 py-3 border-b border-gray-50 mb-2">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account</p>
                                            <p className="text-sm font-extrabold text-[#4A3F35] truncate mt-0.5">
                                                {user ? `Welcome ${user.firstName || "User"}` : "Guest User"}
                                            </p>
                                        </div>

                                        {/* เมนูหลัก */}
                                        <div className="px-2">
                                            <button
                                                onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                                                className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-[#FEF5EB] hover:text-[#C19A6B] rounded-xl transition-colors cursor-pointer"
                                            >
                                                My Profile
                                            </button>
                                            <button
                                                onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                                                className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-[#FEF5EB] hover:text-[#C19A6B] rounded-xl transition-colors cursor-pointer"
                                            >
                                                Settings
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-100 my-2 mx-4"></div>

                                        <div className="px-2">
                                            {user ? (
                                                <button
                                                    onClick={() => { userLogOut(); setIsProfileOpen(false); navigate('/login'); }}
                                                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                                >
                                                    <LogOut size={16} strokeWidth={2.5} />
                                                    Log out
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => { navigate('/login'); setIsProfileOpen(false); }}
                                                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#C19A6B] hover:bg-[#FEF5EB] rounded-xl transition-colors cursor-pointer"
                                                >
                                                    <LogIn size={16} strokeWidth={2.5} />
                                                    Login / Register
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                </div>
            </nav>

            {/* ส่วนของ Modal Category เดิมของคุณ */}
            <dialog id="category" className="modal">
                <CategoryMenu />
            </dialog>
        </>
    );
}

export default Header;