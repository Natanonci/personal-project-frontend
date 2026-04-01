import React, { useState, useEffect } from 'react';
import { mainApi } from '../api/mainApi';
import { useSearchParams, useNavigate } from 'react-router'; // เปลี่ยนเป็น react-router-dom เพื่อความชัวร์
import { MapPin, Clock, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useUserStore from '../stores/userStore'; // 🟢 1. Import Store เข้ามา

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
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

function Home() {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const navigate = useNavigate();

  // 🟢 2. ดึงข้อมูล user จาก Zustand Store
  const user = useUserStore(state => state.user);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      const url = type ? `/store?type=${type}` : '/store';
      const res = await mainApi.get(url);
      setStores(res.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [type]);

  // 🟢 3. ฟังก์ชันกลางสำหรับจัดการการคลิกที่ร้านค้า
  const handleStoreClick = (storeId) => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนเข้าชมรายละเอียด");
      navigate('/login');
    } else {
      navigate(`/reservation?storeId=${storeId}`);
    }
  };

  const trendingStores = stores.slice(0, 8);
  const totalPages = Math.ceil(stores.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStores = stores.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full relative flex flex-col px-4 md:px-8 pb-12 overflow-hidden z-0 font-sans"
    >
      <style>
        {`
          @keyframes infiniteScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-infinite-scroll {
            animation: infiniteScroll 35s linear infinite;
            width: max-content;
          }
          .animate-infinite-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <motion.main
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-10 flex flex-col z-10 border border-white"
      >
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full h-[60vh] flex flex-col items-center justify-center text-[#C19A6B]"
          >
            <span className="loading loading-spinner loading-lg mb-6 opacity-80 scale-125"></span>
            <p className="font-bold animate-pulse text-gray-500 tracking-wider uppercase text-sm">Loading experiences...</p>
          </motion.div>
        ) : (
          <div className="flex flex-col w-full">

            {/* --- Section 1: Trending Slider --- */}
            <div className="mb-16">
              <div className="flex justify-between items-end mb-8 px-2">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#3f342d] tracking-tight flex items-center gap-2">
                    Trending Now <Sparkles className="text-[#C19A6B] w-6 h-6" />
                  </h2>
                  <p className="text-sm md:text-base text-gray-500 mt-2 font-medium">Discover the most popular spots right now.</p>
                </div>
                <button className="group text-[#C19A6B] font-bold text-sm flex items-center gap-1 hover:text-[#4A3F35] transition-colors">
                  See all <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="overflow-hidden pb-8 pt-2 w-full">
                <div className="flex gap-5 md:gap-8 animate-infinite-scroll pr-5 md:pr-8">
                  {trendingStores.length > 0 ? (
                    [...trendingStores, ...trendingStores].map((store, index) => (
                      <div
                        key={`trending-${store.id}-${index}`}
                        onClick={() => handleStoreClick(store.id)} // 🟢 ใช้ฟังก์ชันเช็คล็อกอิน
                        className="shrink-0 w-[280px] md:w-[340px] h-[220px] md:h-[260px] relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100/50 bg-gray-100"
                      >
                        <img
                          src={store.url}
                          alt={store.store_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="absolute bottom-0 left-0 p-6 text-white w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <span className="bg-[#C19A6B]/90 backdrop-blur-sm text-[10px] font-black px-3 py-1.5 rounded-full mb-3 inline-block uppercase tracking-wider shadow-sm">
                            {store.pet_type}
                          </span>
                          <h3 className="text-xl md:text-2xl font-bold leading-tight line-clamp-2">{store.store_name}</h3>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 py-10 font-medium w-full text-center">No trending stores found.</div>
                  )}
                </div>
              </div>
            </div>

            {/* --- Section 2: Recommended For You --- */}
            <div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 px-2 gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#3f342d] tracking-tight">
                    {type ? `${type}s` : "Recommended For You"}
                  </h2>
                  <p className="text-sm md:text-base text-gray-500 mt-2 font-medium">
                    {type ? `Showing best results for ${type}` : "Hand-picked selections just for you."}
                  </p>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-3 bg-gray-50/80 p-1.5 rounded-full border border-gray-100">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="p-2.5 rounded-full bg-white text-[#4A3F35] shadow-sm hover:bg-[#C19A6B] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#4A3F35] disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={18} strokeWidth={3} />
                    </button>
                    <span className="text-sm font-black text-gray-600 px-3">
                      {currentPage} <span className="text-gray-300 mx-1">/</span> {totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="p-2.5 rounded-full bg-white text-[#4A3F35] shadow-sm hover:bg-[#C19A6B] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#4A3F35] disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={18} strokeWidth={3} />
                    </button>
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {currentStores.length > 0 ? (
                  <motion.div
                    key={`grid-page-${currentPage}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                  >
                    {currentStores.map((store) => (
                      <motion.div
                        variants={itemVariants}
                        key={store.id}
                        onClick={() => handleStoreClick(store.id)} // 🟢 ใช้ฟังก์ชันเช็คล็อกอิน
                        className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 transition-all duration-500 group cursor-pointer flex flex-col h-full"
                      >
                        <div className="w-full h-[240px] md:h-[280px] relative overflow-hidden bg-gray-100">
                          <img
                            src={store.url}
                            alt={store.store_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#4A3F35] text-sm font-black px-4 py-2 rounded-2xl shadow-sm border border-white/50">
                            ฿{store.price}
                          </div>
                          <div className="absolute top-4 left-4 bg-[#C19A6B]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-2 rounded-2xl uppercase tracking-wider shadow-sm border border-[#C19A6B]/50">
                            {store.store_type}
                          </div>
                        </div>

                        <div className="p-6 md:p-8 flex flex-col flex-1 justify-between bg-white">
                          <div>
                            <h3 className="text-2xl font-black text-[#2d241f] group-hover:text-[#C19A6B] transition-colors mb-2 line-clamp-1">
                              {store.store_name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6 font-medium">
                              {store.summary}
                            </p>
                          </div>

                          <div className="flex flex-col gap-3 pt-5 border-t border-gray-100">
                            <div className="flex items-start gap-3 text-sm text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
                              <MapPin size={18} className="text-[#C19A6B] shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{store.address}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
                              <Clock size={18} className="text-[#C19A6B] shrink-0" />
                              <span className="truncate">{store.open_datetime}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="col-span-full py-20 text-center bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200"
                  >
                    <div className="text-gray-400 text-lg font-semibold">No locations found in this view.</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.main>
    </motion.div>
  );
}

export default Home;