import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router' // เพิ่ม useLocation
import Header from '../components/Header'
import bgImage from '../assets/bgImage.png'
import LoadingScreen from '../components/Loadingscreen';

function UserLayout() {
    const location = useLocation(); // ตัวดักจับการเปลี่ยน URL
    const [isPageLoading, setIsPageLoading] = useState(false);

    // 🟢 ส่วนควบคุมการแสดงหน้าโหลดเมื่อเปลี่ยนหน้า
    useEffect(() => {
        // 1. เมื่อเริ่มเปลี่ยนหน้า ให้เปิดหน้าโหลด
        setIsPageLoading(true);
        
        // 2. ตั้งเวลาหน่วงไว้ (เช่น 800ms หรือ 0.8 วินาที) เพื่อให้เห็นแอนิเมชันโลโก้
        const timer = setTimeout(() => {
            setIsPageLoading(false); // ปิดหน้าโหลด
        }, 800);

        // Cleanup function เมื่อออกจากหน้า
        return () => clearTimeout(timer);
    }, [location.pathname]); // ให้ทำงานทุกครั้งที่ pathname (URL) เปลี่ยนแปลง

    return (
        <div className="min-h-screen relative">
            {/* พื้นหลังแบบ Fixed (ล็อคให้นิ่ง) */}
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-70"
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>

            <div className="min-h-screen w-full flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden">
                <Header />

                {/* 🟢 ส่วนแสดงเนื้อหา */}
                <main className="flex-1 relative">
                    {isPageLoading ? (
                        /* ถ้ากำลังโหลด ให้แสดง LoadingScreen ทับส่วนเนื้อหา */
                        /* ใช้ absolute เพื่อให้โหลดอยู่ภายในกรอบของหน้าจอ ไม่ทับ Header */
                        <div className="absolute inset-0 z-50 flex items-center justify-center min-h-[50vh]">
                            <LoadingScreen />
                        </div>
                    ) : (
                        /* ถ้าโหลดเสร็จแล้ว ให้แสดงเนื้อหาหน้าเว็บจริง (Outlet) */
                        <Outlet />
                    )}
                </main>
            </div>
        </div>
    )
}

export default UserLayout