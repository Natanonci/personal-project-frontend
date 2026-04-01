import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router'; // 🟢 เพิ่ม useSearchParams
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservationSchema } from '../validations/schema';
import { mainApi } from '../api/mainApi';
import useUserStore from '../stores/userStore';
import { Store, CalendarDays, Users, Banknote, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Framer Motion Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Reservation() {
    const navigate = useNavigate();

    // 🟢 1. ดึงพารามิเตอร์จาก URL
    const [searchParams] = useSearchParams();
    const storeIdFromUrl = searchParams.get('storeId');

    const [stores, setStores] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = useUserStore(state => state.user);

    // 🟢 2. ดึง setValue ออกมาใช้งาน
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(reservationSchema)
    });

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const storeRes = await mainApi.get('/store');
            setStores(storeRes.data || []);

            const revRes = await mainApi.get(`/reservations`);
            setReservations(revRes.data?.data || revRes.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // เช็คสิทธิ์ User
    useEffect(() => {
        if (!user) {
            alert("กรุณาเข้าสู่ระบบก่อนทำการจอง");
            navigate('/');
            return;
        }
        fetchData();
    }, [user, navigate]);

    // 🟢 3. เพิ่ม useEffect นี้เพื่อตั้งค่า Store อัตโนมัติ เมื่อโหลดร้านค้าเสร็จ
    useEffect(() => {
        if (storeIdFromUrl && stores.length > 0) {
            // ตั้งค่าฟิลด์ 'storeId' ให้ตรงกับค่าใน URL
            setValue('storeId', storeIdFromUrl);
        }
    }, [storeIdFromUrl, stores, setValue]);

    const onSubmit = async (data) => {
        try {
            await mainApi.post('/reservations', data);
            alert("จองคิวสำเร็จ!");
            reset();

            // ถ้าจองสำเร็จ ให้ลบ storeId ออกจาก URL เพื่อความสะอาด
            if (storeIdFromUrl) {
                navigate('/reservation', { replace: true });
            }

            fetchData();
        } catch (error) {
            console.error("Booking Error:", error);
            alert(error.response?.data?.message || "เกิดข้อผิดพลาด หรือคุณอาจเคยจองร้านนี้แล้ว");
        }
    };

    const handleCancel = async (id) => {
        const isConfirmed = window.confirm("คุณต้องการยกเลิกการจองคิวนี้ใช่หรือไม่?");
        if (!isConfirmed) return;

        try {
            await mainApi.delete(`/reservations/${id}`);
            fetchData();
        } catch (error) {
            console.error("Cancel Error:", error);
            alert("เกิดข้อผิดพลาดในการยกเลิกการจอง");
        }
    };

    if (!user) {
        return (
            <div className="w-full h-[60vh] flex flex-col justify-center items-center text-[#C19A6B]">
                <span className="loading loading-spinner loading-lg mb-4"></span>
                <p className="font-bold animate-pulse text-gray-500 tracking-wider uppercase text-sm">Verifying...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-[80vh] flex flex-col lg:flex-row gap-8 text-[#4A3F35] font-sans px-4 md:px-8 pb-12"
        >
            {/* --- ฝั่งซ้าย: ฟอร์มสร้างการจองใหม่ --- */}
            <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0">
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white sticky top-28">

                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-[#3f342d] tracking-tight">Book a Visit</h2>
                        <p className="text-sm text-gray-500 mt-2 font-medium">Schedule your next furry adventure.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                        {/* เลือกร้านค้า */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Store size={16} className="text-[#C19A6B]" /> Select Store
                            </label>
                            <div className="relative">
                                <select
                                    {...register('storeId')}
                                    defaultValue={storeIdFromUrl || ""} // 🟢 รองรับค่าเริ่มต้น
                                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#C19A6B]/50 focus:border-[#C19A6B] transition-all appearance-none font-medium text-gray-700 cursor-pointer"
                                >
                                    <option value="" disabled>-- Choose a location --</option>
                                    {stores.map(store => (
                                        <option key={store.id} value={store.id}>
                                            {store.store_name} (Start: ฿{store.price})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.storeId && <p className="text-xs text-red-500 mt-1.5 font-medium ml-1">{errors.storeId.message}</p>}
                        </div>

                        {/* วันที่และเวลา */}
                        <div className="flex flex-col gap-5 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">

                            {/* --- Start Time --- */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <CalendarDays size={16} className="text-[#C19A6B]" /> Start Time
                                </label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        {...register('start_date')}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#C19A6B]/50 focus:border-[#C19A6B] transition-all font-medium text-gray-700 relative cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>
                                {errors.start_date && <p className="text-xs text-red-500 mt-1.5 font-medium ml-1">{errors.start_date.message}</p>}
                            </div>

                            {/* --- End Time --- */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Clock size={16} className="text-[#C19A6B]" /> End Time
                                </label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        {...register('end_date')}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#C19A6B]/50 focus:border-[#C19A6B] transition-all font-medium text-gray-700 relative cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                </div>
                                {errors.end_date && <p className="text-xs text-red-500 mt-1.5 font-medium ml-1">{errors.end_date.message}</p>}
                            </div>

                        </div>

                        {/* จำนวนและราคา */}
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Users size={16} className="text-[#C19A6B]" /> Guests
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="e.g. 2"
                                    {...register('total_guest')}
                                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#C19A6B]/50 focus:border-[#C19A6B] transition-all font-medium text-gray-700"
                                />
                                {errors.total_guest && <p className="text-xs text-red-500 mt-1.5 font-medium ml-1">{errors.total_guest.message}</p>}
                            </div>
                            <div className="w-1/2">
                                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Banknote size={16} className="text-[#C19A6B]" /> Est. Price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">฿</span>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        {...register('price')}
                                        className="w-full p-3.5 pl-8 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#C19A6B]/50 focus:border-[#C19A6B] transition-all font-medium text-gray-700"
                                    />
                                </div>
                                {errors.price && <p className="text-xs text-red-500 mt-1.5 font-medium ml-1">{errors.price.message}</p>}
                            </div>
                        </div>

                        {/* ปุ่ม Submit */}
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full mt-4 bg-[#4A3F35] text-white py-4 rounded-2xl text-base font-bold hover:bg-[#C19A6B] transition-colors shadow-lg shadow-black/10 disabled:opacity-70 flex justify-center items-center gap-2 active:scale-[0.98]"
                        >
                            {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : <CheckCircle2 size={20} />}
                            {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </form>
                </div>
            </div>

            {/* --- ฝั่งขวา: รายการจองของฉัน --- */}
            <div className="flex-1 flex flex-col">
                <div className="mb-6 px-2">
                    <h1 className="text-3xl md:text-4xl font-black text-[#3f342d] tracking-tight">My Reservations</h1>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Manage your upcoming visits.</p>
                </div>

                {isLoading ? (
                    <div className="w-full flex-1 flex flex-col justify-center items-center text-[#C19A6B] min-h-[400px]">
                        <span className="loading loading-spinner loading-lg mb-4 opacity-80"></span>
                        <p className="font-bold animate-pulse text-gray-500 tracking-wider uppercase text-sm">Loading details...</p>
                    </div>
                ) : reservations.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 bg-white/50 backdrop-blur-sm border-2 border-dashed border-[#C19A6B]/30 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center min-h-[400px]"
                    >
                        <div className="w-20 h-20 bg-[#FEF5EB] rounded-full flex items-center justify-center text-[#C19A6B] mb-4 shadow-inner">
                            <CalendarDays size={32} />
                        </div>
                        <p className="text-xl font-black text-[#4A3F35] mb-2">No upcoming visits</p>
                        <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto">Fill out the form on the left to schedule your first appointment.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-5 overflow-y-auto pb-8 pr-2 custom-scrollbar"
                    >
                        <AnimatePresence>
                            {reservations.map((item) => (
                                <motion.div
                                    variants={itemVariants}
                                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                    key={item.id}
                                    className="bg-white p-6 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 gap-6 group"
                                >
                                    {/* ข้อมูลการจอง */}
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-[#FEF5EB] flex items-center justify-center text-[#C19A6B] shrink-0">
                                                <Store size={18} />
                                            </div>
                                            <h2 className="text-xl font-bold text-[#2d241f] line-clamp-1">
                                                {item.store?.store_name || `Store ID: ${item.store_id}`}
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1 sm:pl-13">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <CalendarDays size={16} className="text-[#C19A6B]/70" />
                                                <span><span className="text-gray-400 text-xs uppercase mr-1">In:</span>{new Date(item.start_date).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <Clock size={16} className="text-[#C19A6B]/70" />
                                                <span><span className="text-gray-400 text-xs uppercase mr-1">Out:</span>{new Date(item.end_date).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mt-4 pl-1 sm:pl-13">
                                            <span className="flex items-center gap-1.5 text-xs font-bold bg-gray-50 text-gray-600 px-3 py-1.5 rounded-xl border border-gray-100">
                                                <Users size={14} className="text-gray-400" /> {item.total_guest} Guests
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs font-bold bg-[#FEF5EB] text-[#C19A6B] px-3 py-1.5 rounded-xl border border-[#C19A6B]/20">
                                                <Banknote size={14} /> ฿{item.price}
                                            </span>
                                        </div>
                                    </div>

                                    {/* สถานะ และ ปุ่มยกเลิก */}
                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-3 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                        <div className="bg-[#4A3F35] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                                            <CheckCircle2 size={14} /> Confirmed
                                        </div>
                                        <button
                                            onClick={() => handleCancel(item.id)}
                                            className="text-xs font-bold text-red-400 hover:text-white hover:bg-red-500 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                                        >
                                            <Trash2 size={14} /> Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export default Reservation;