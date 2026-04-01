import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Camera, Edit3, 
  Save, X, CheckCircle2, Loader2, PawPrint, BadgeCheck 
} from 'lucide-react';
import useUserStore from '../stores/userStore';
import { mainApi } from '../api/mainApi';

function Profile() {
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);

  // --- States ---
  const [isEditing, setIsEditing] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({ total: 0, favoriteType: 'None' });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // 🟢 ฟังก์ชันคำนวณสถิติจากข้อมูลการจองจริง
  const calculateStats = (data) => {
    if (!data || data.length === 0) {
      setStats({ total: 0, favoriteType: 'None' });
      return;
    }

    const total = data.length;
    const counts = {};
    
    data.forEach(item => {
      // ดึงประเภทจาก item.store.store_type (ปรับตามโครงสร้าง DB ของคุณ)
      const type = item.store?.store_type || 'General';
      counts[type] = (counts[type] || 0) + 1;
    });

    // หาประเภทที่มีจำนวนมากที่สุด
    const favorite = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

    setStats({
      total: total,
      favoriteType: favorite
    });
  };

  // 🟢 ฟังก์ชันดึงข้อมูลทั้งหมด (Profile + Reservations)
  const fetchData = async () => {
    try {
      setIsFetching(true);
      
      // 1. ดึงข้อมูล Profile ล่าสุด
      const resProfile = await mainApi.get('/api/auth/me');
      const latestData = resProfile.data.user || resProfile.data;
      setUser(latestData);
      reset(latestData); // ใส่ข้อมูลลงในฟอร์ม

      // 2. ดึงข้อมูลการจองมาทำสถิติ
      const resReservations = await mainApi.get('/reservations');
      const allReservations = resReservations.data?.data || resReservations.data || [];
      calculateStats(allReservations);

    } catch (error) {
      console.error("Fetch data error:", error);
      if (user) reset(user);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🟢 ฟังก์ชันบันทึกการแก้ไข
  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      setStatusMsg({ type: '', text: '' });
      
      // ใช้ PUT หรือ PATCH ตาม Backend ของคุณ
      const res = await mainApi.put('/api/auth/me/profile', data);
      const updatedData = res.data.user || res.data;

      setUser(updatedData);
      reset(updatedData);
      setStatusMsg({ type: 'success', text: 'อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว' });
      setIsEditing(false);
      
      // หายไปเองใน 3 วินาที
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
    } catch (error) {
      setStatusMsg({ type: 'error', text: error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return (
      <div className="w-full h-[70vh] flex flex-col justify-center items-center text-[#C19A6B]">
        <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin opacity-20" />
            <PawPrint className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="font-bold tracking-widest text-xs uppercase mt-4 text-gray-400 font-sans">Fetching your profile...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto w-full px-4 pt-6 pb-20 font-sans"
    >
      {/* --- Section 1: Hero Header --- */}
      <div className="relative mb-12">
        <div className="h-64 md:h-80 w-full bg-[#4A3F35] rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4A3F35] via-[#5D4F43] to-[#C19A6B] opacity-90"></div>
          {/* Paw Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 flex flex-wrap gap-12 p-8 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => <PawPrint key={i} size={40} className={i % 2 === 0 ? "rotate-12" : "-rotate-12"} />)}
          </div>
        </div>

        {/* Identity Bar */}
        <div className="absolute -bottom-12 left-0 right-0 px-6 md:px-16 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] border-[10px] border-[#FAFAF9] bg-white shadow-2xl overflow-hidden flex items-center justify-center">
                {user?.profile_image ? (
                  <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-[#FEF5EB] w-full h-full flex items-center justify-center text-[#C19A6B]">
                    <User size={80} strokeWidth={1} />
                  </div>
                )}
              </div>
              <button className="absolute bottom-2 right-2 p-3 bg-[#C19A6B] text-white rounded-2xl shadow-xl border-4 border-white hover:bg-[#4A3F35] transition-all">
                <Camera size={18} />
              </button>
            </div>

            <div className="text-center md:text-left mb-4">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-3xl md:text-5xl font-black text-[#3f342d] md:text-white drop-shadow-sm">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Pet Lover"}
                </h1>
                <BadgeCheck className="text-blue-500 fill-white w-8 h-8 hidden md:block" />
              </div>
              <p className="text-[#C19A6B] md:text-white/80 font-bold text-sm tracking-widest mt-1 uppercase">
                Premium Member of Pet Lover Booking
              </p>
            </div>
          </div>

          <div className="mb-4">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn bg-[#4A3F35] hover:bg-[#C19A6B] text-white border-none px-8 rounded-2xl font-black shadow-lg">
                <Edit3 size={18} /> Edit Profile
              </button>
            ) : (
              <button onClick={() => { setIsEditing(false); reset(user); }} className="btn bg-red-50 hover:bg-red-100 text-red-500 border-none px-8 rounded-2xl font-black">
                <X size={18} /> Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- Section 2: Main Grid --- */}
      <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: My Paw-stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100">
            <h3 className="text-[#4A3F35] font-black text-xl mb-8 flex items-center gap-3">
              <div className="p-2 bg-[#FEF5EB] rounded-xl text-[#C19A6B]">
                <PawPrint size={22} fill="currentColor" />
              </div>
              My Paw-stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-5 bg-[#FAFAF9] rounded-[2rem] border border-gray-50">
                <span className="text-gray-500 font-bold text-sm">Total Bookings</span>
                <span className="text-[#4A3F35] font-black text-2xl">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center p-5 bg-[#FEF5EB]/50 rounded-[2rem] border border-[#FEF5EB]">
                <span className="text-gray-500 font-bold text-sm">Favorite Type</span>
                <span className="text-[#C19A6B] font-black">{stats.favoriteType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content: Profile Form */}
        <div className="lg:col-span-8">
          <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-gray-100">
            
            <AnimatePresence>
              {statusMsg.text && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className={`mb-10 p-5 rounded-3xl text-sm font-bold flex items-center justify-center gap-3 shadow-lg ${
                    statusMsg.type === 'success' ? 'bg-[#FEF5EB] text-[#C19A6B]' : 'bg-red-50 text-red-500'
                  }`}
                >
                  <CheckCircle2 size={20} /> {statusMsg.text}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* Group 1: Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[#C19A6B] uppercase tracking-[0.2em] ml-2">First Name</label>
                  <input {...register('firstName', { required: true })} disabled={!isEditing}
                    className={`w-full px-6 py-4 rounded-2xl font-bold transition-all border-2 outline-none
                    ${isEditing ? 'bg-white border-[#FEF5EB] focus:border-[#C19A6B] text-[#4A3F35]' : 'bg-gray-50 border-transparent text-gray-400'}`}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[#C19A6B] uppercase tracking-[0.2em] ml-2">Last Name</label>
                  <input {...register('lastName', { required: true })} disabled={!isEditing}
                    className={`w-full px-6 py-4 rounded-2xl font-bold transition-all border-2 outline-none
                    ${isEditing ? 'bg-white border-[#FEF5EB] focus:border-[#C19A6B] text-[#4A3F35]' : 'bg-gray-50 border-transparent text-gray-400'}`}
                  />
                </div>
              </div>

              {/* Group 2: Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[#C19A6B] uppercase tracking-[0.2em] ml-2">Email (Private)</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input {...register('email')} disabled={true}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl font-bold bg-gray-50 border-2 border-transparent text-gray-300 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-[#C19A6B] uppercase tracking-[0.2em] ml-2">Phone Number</label>
                  <div className="relative">
                    <Phone className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-[#C19A6B]' : 'text-gray-300'}`} size={18} />
                    <input {...register('phone')} disabled={!isEditing}
                      className={`w-full pl-14 pr-6 py-4 rounded-2xl font-bold transition-all border-2 outline-none
                      ${isEditing ? 'bg-white border-[#FEF5EB] focus:border-[#C19A6B] text-[#4A3F35]' : 'bg-gray-50 border-transparent text-gray-400'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Address */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-[#C19A6B] uppercase tracking-[0.2em] ml-2">Delivery Address</label>
                <div className="relative">
                  <MapPin className={`absolute left-5 top-5 transition-colors ${isEditing ? 'text-[#C19A6B]' : 'text-gray-300'}`} size={18} />
                  <textarea {...register('address')} disabled={!isEditing} rows="3"
                    className={`w-full pl-14 pr-6 py-4 rounded-[2rem] font-bold transition-all border-2 outline-none resize-none
                    ${isEditing ? 'bg-white border-[#FEF5EB] focus:border-[#C19A6B] text-[#4A3F35]' : 'bg-gray-50 border-transparent text-gray-400'}`}
                  />
                </div>
              </div>

              {isEditing && (
                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} type="submit" disabled={isSaving}
                  className="w-full bg-[#4A3F35] text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-[#C19A6B] transition-all shadow-xl active:scale-[0.98] disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save size={22} />}
                  {isSaving ? 'Baking changes...' : 'SAVE UPDATED PROFILE'}
                </motion.button>
              )}
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;