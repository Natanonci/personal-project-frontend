import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router'; // 🟢 เพิ่ม useNavigate เข้ามาตรงนี้
import { mainApi } from '../api/mainApi';
import { Cat, Dog, Bird, Rabbit, LayoutGrid, Turtle, MapPin, Clock, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categoryList = [
    { name: 'All', icon: <LayoutGrid size={18} />, value: '' },
    { name: 'Cat Cafe', icon: <Cat size={18} />, value: 'Cat Cafe' },
    { name: 'Dog Cafe', icon: <Dog size={18} />, value: 'Dog Cafe' },
    { name: 'Exotic', icon: <Turtle size={18} />, value: 'Exotic Pet Cafe' },
    { name: 'Rabbit Cafe', icon: <Rabbit size={18} />, value: 'Rabbit Cafe' },
    { name: 'Bird Cafe', icon: <Bird size={18} />, value: 'Bird Cafe' },
];

// Framer Motion Variants for Staggered Animations
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1 // Delay between each card animating in
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

const handleCategoryClick = (val) => {
    if (!user) {
        alert("กรุณาเข้าสู่ระบบเพื่อเข้าถึงหมวดหมู่");
        navigate('/login');
        return;
    }
    setSearchParams(val ? { type: val } : {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function CategoryPage() {
    const [stores, setStores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate(); // 🟢 เรียกใช้งาน navigate

    const currentType = searchParams.get('type') || '';
    const searchQuery = searchParams.get('search') || ''; // 🟢 ดึงคำค้นหาจาก URL

    const fetchStores = async () => {
        try {
            setIsLoading(true);

            // 🟢 สร้าง URL สำหรับ API รองรับทั้ง type และ search
            let url = '/store?';
            if (currentType) url += `type=${currentType}&`;
            if (searchQuery) url += `search=${searchQuery}`;

            const res = await mainApi.get(url);
            // console.log(res)
            setStores(res.data || []);
        } catch (error) {
            console.error("Error fetching category stores:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 🟢 ดึงข้อมูลใหม่ทุกครั้งที่หมวดหมู่หรือคำค้นหาเปลี่ยน
    useEffect(() => {
        fetchStores();
    }, [currentType, searchQuery]);

    const handleCategoryClick = (val) => {
        // 🟢 เวลาเปลี่ยนหมวดหมู่ จะลบคำค้นหา (search) ทิ้งไป เพื่อโชว์ร้านทั้งหมดในหมวดนั้น
        setSearchParams(val ? { type: val } : {});
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen w-full bg-[#FAFAF9] flex flex-col pb-20 font-sans"
        >

            {/* --- Premium Sticky Header --- */}
            <header className="sticky top-0 z-40 w-full bg-[#FAFAF9]/80 backdrop-blur-xl border-b border-[#C19A6B]/20 pt-8 pb-4 px-6 md:px-12 transition-all shadow-sm">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-[#3f342d] tracking-tight">
                            {/* 🟢 เปลี่ยนหัวข้อถ้ามีการค้นหา */}
                            {searchQuery ? `Search Results for "${searchQuery}"` : "Explore"}
                        </h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                            {searchQuery ? "Here is what we found based on your search" : "Find the perfect place for your next furry adventure"}
                        </p>
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-xs font-bold text-[#C19A6B] bg-[#C19A6B]/10 px-4 py-2 rounded-full w-fit uppercase tracking-widest"
                    >
                        {stores.length} {stores.length === 1 ? 'Location' : 'Locations'}
                    </motion.div>
                </div>

                {/* --- Animated Category Chips --- */}
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
                    {categoryList.map((cat) => {
                        const isActive = currentType === cat.value && !searchQuery; // 🟢 ยกเลิก highlight ถ้ากำลัง search อยู่
                        return (
                            <button
                                key={cat.name}
                                onClick={() => handleCategoryClick(cat.value)}
                                className={`relative flex items-center gap-2 min-w-max px-6 py-3 rounded-full transition-colors duration-300 snap-start font-semibold text-sm outline-none focus:outline-none ${isActive ? 'text-white' : 'text-gray-500 hover:text-[#4A3F35] hover:bg-black/5'
                                    }`}
                            >
                                {/* Framer Motion active background highlight */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeCategory"
                                        className="absolute inset-0 bg-[#4A3F35] rounded-full shadow-md"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* Icon and Text (Relative to sit above the animated background) */}
                                <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-white' : ''}`}>
                                    <span className={isActive ? 'text-[#C19A6B]' : 'text-gray-400'}>
                                        {cat.icon}
                                    </span>
                                    {cat.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* --- Results Area --- */}
            <main className="w-full px-6 md:px-12 mt-8">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-[50vh] flex flex-col items-center justify-center text-[#C19A6B]"
                        >
                            <span className="loading loading-spinner loading-lg mb-4 opacity-80"></span>
                            <p className="font-medium animate-pulse text-gray-500 tracking-wide">Curating best spots...</p>
                        </motion.div>
                    ) : stores.length > 0 ? (
                        <motion.div
                            key="grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {stores.map((store) => (
                                <motion.div
                                    variants={itemVariants}
                                    key={store.id}
                                    onClick={() => navigate(`/reservation?storeId=${store.id}`)} // 🟢 เพิ่ม onClick ให้ไปหน้าจอง
                                    className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 transition-all duration-500 group cursor-pointer flex flex-col h-full"
                                >
                                    {/* Image Container */}
                                    <div className="w-full h-[240px] relative overflow-hidden bg-gray-100">
                                        <img
                                            src={store.url}
                                            alt={store.store_name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        {/* Overlay Gradients */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        {/* Frosted Glass Badges */}
                                        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-[#4A3F35] text-xs font-black px-4 py-2 rounded-2xl shadow-sm border border-white/50">
                                            ฿{store.price}
                                        </div>
                                        <div className="absolute top-4 left-4 bg-[#C19A6B]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-2 rounded-2xl uppercase tracking-wider shadow-sm border border-[#C19A6B]/50">
                                            {store.store_type}
                                        </div>
                                    </div>

                                    {/* Content Container */}
                                    <div className="p-6 flex flex-col flex-1 justify-between bg-white">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#2d241f] group-hover:text-[#C19A6B] transition-colors mb-2 line-clamp-1">
                                                {store.store_name}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6 font-medium">
                                                {store.summary}
                                            </p>
                                        </div>

                                        {/* Footer Meta */}
                                        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                                            <div className="flex items-start gap-3 text-xs text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
                                                <MapPin size={16} className="text-[#C19A6B] shrink-0 mt-0.5" />
                                                <span className="line-clamp-1">{store.address}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
                                                <Clock size={16} className="text-[#C19A6B] shrink-0" />
                                                <span className="truncate">{store.open_datetime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full bg-white rounded-[2rem] p-16 text-center border border-gray-100 flex flex-col items-center justify-center mt-4 shadow-sm"
                        >
                            <div className="w-24 h-24 bg-[#FEF5EB] rounded-full flex items-center justify-center text-[#C19A6B] mb-6 shadow-inner">
                                <Search size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-[#4A3F35] mb-3">No locations found</h3>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm font-medium leading-relaxed">
                                {searchQuery
                                    ? `We couldn't find any spots matching "${searchQuery}". Try using different keywords!`
                                    : "We couldn't find any spots in this category right now. Try exploring our other furry friends!"}
                            </p>
                            <button
                                onClick={() => handleCategoryClick('')}
                                className="bg-[#4A3F35] text-white px-8 py-4 rounded-full font-bold hover:bg-[#C19A6B] transition-colors shadow-lg shadow-black/10 active:scale-95"
                            >
                                View All Categories
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

        </motion.div>
    );
}

export default CategoryPage;