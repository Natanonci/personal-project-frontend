import React from 'react';
// อย่าลืม import โลโก้ของคุณให้ถูก path นะครับ
import logo from '../assets/logo.png'; 

function LoadingScreen() {
    return (
        // บังคับให้คลุมเต็มหน้าจอ (fixed inset-0) และอยู่บนสุด (z-[9999])
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FEF5EB] overflow-hidden">
            
            {/* วงกลม Effect เรืองแสงด้านหลังโลโก้ (ทำให้ดูมีมิติ) */}
            <div className="absolute w-64 h-64 bg-[#D8A67B]/20 rounded-full blur-3xl animate-pulse"></div>

            {/* ตัวโลโก้พร้อมแอนิเมชัน */}
            <div className="relative z-10 flex flex-col items-center">
                <img 
                    src={logo} 
                    alt="Loading..." 
                    // 🟢 animate-pulse ทำให้โลโก้สว่าง/มืด สลับกันเหมือนกำลังหายใจ
                    // ถ้าชอบแบบเด้งๆ ให้เปลี่ยนเป็น animate-bounce ครับ
                    className="h-24 md:h-32 w-auto object-contain animate-pulse drop-shadow-lg" 
                />
                
                {/* ข้อความ Loading ด้านล่าง */}
                <div className="mt-8 flex items-center gap-2 text-[#C19A6B] font-extrabold text-sm md:text-base tracking-[0.2em] uppercase">
                    Loading
                    {/* จุดไข่ปลาขยับได้ (ใช้คลาสของ daisyUI ที่คุณมีอยู่แล้ว) */}
                    <span className="loading loading-dots loading-sm mt-1"></span>
                </div>
            </div>

        </div>
    );
}

export default LoadingScreen;