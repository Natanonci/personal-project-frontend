import useUserStore from "../stores/userStore"
import { lazy, Suspense, useEffect, useState } from "react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router"
import LoadingScreen from "../components/Loadingscreen"

// นำเข้า Components
const shareinfo = lazy(() => import('../pages/Shareinfo'))
const Home = lazy(() => import('../pages/Home'))
const Category = lazy(() => import('../pages/Store'))
const Profile = lazy(() => import('../pages/Profile'))
const Login = lazy(() => import('../pages/Login'))
const UserLayout = lazy(() => import('../layouts/UserLayout'))
const History = lazy(() => import('../pages/History'))
const Reservation = lazy(() => import('../pages/Reservation'))

// (ถ้าคุณมีไฟล์ GuestLayout แยก ให้แก้ path ตรงนี้นะครับ แต่ถ้าไม่มี ใช้ UserLayout แทนไปก่อนเพื่อให้แสดงผล Home ได้ปกติ)
const GuestLayout = lazy(() => import('../layouts/GuestLayout'))

const commonPath = [
    { path: '/share', Component: shareinfo }
]

// 1. Router สำหรับคนที่ "ยังไม่ได้ Login"
const guestRouter = createBrowserRouter([
    {
        path: "/",
        Component: GuestLayout,
        children: [
            { path: '', Component: Home },
            { path: 'login', Component: Login },
            { path: "*", element: <Navigate to="/" replace /> },
            ...commonPath
        ]
    }
])

// 2. Router สำหรับคนที่ "Login แล้ว"
const userRouter = createBrowserRouter([
    {
        path: "/",
        Component: GuestLayout,
        children: [
            { index: true, Component: Home },
            { path: 'category', Component: Category },
            { path: 'profile', Component: Profile },
            { path: 'reservation', Component: Reservation },
            { path: 'history', Component: History },
            { path: "*", element: <Navigate to="/" replace /> },
            ...commonPath
        ]
    }
])

function AppRouter() {
    const user = useUserStore(state => state.user)
    
    // 🟢 สร้าง State สำหรับคุมหน้าจอโหลด
    const [isGlobalLoading, setIsGlobalLoading] = useState(true);

    // 🟢 เอฟเฟกต์จำลองการโหลดตอนเข้าแอปครั้งแรก หรือตอนสลับ User/Guest
    useEffect(() => {
        setIsGlobalLoading(true); // สั่งเปิดหน้าโหลด
        
        // ตั้งเวลาหน่วงให้หน้า Loading โชว์อย่างน้อย 1.5 วินาที
        const timer = setTimeout(() => {
            setIsGlobalLoading(false); // สั่งปิดหน้าโหลดเมื่อครบเวลา
        }, 1500); 

        // Cleanup timer
        return () => clearTimeout(timer);
    }, [user]); // ทำงานใหม่ทุกครั้งที่ค่า user เปลี่ยน (Login/Logout)

    const finalRouter = user ? userRouter : guestRouter

    return (
        <>
            {/* 🟢 ถ้า isGlobalLoading เป็น true ให้โชว์หน้า LoadingScreen ทับทุกอย่าง */}
            {isGlobalLoading && <LoadingScreen />}

            {/* 🟢 ส่วน Router ซ่อน Suspense ของจริงไว้ข้างหลัง */}
            <Suspense fallback={<LoadingScreen />}>
                {/* แสดง RouterProvider เสมอ แต่ถ้า isGlobalLoading เป็น true 
                  มันจะโดน LoadingScreen ด้านบนบังไว้ชั่วคราว 
                */}
                <div style={{ display: isGlobalLoading ? 'none' : 'block' }}>
                    <RouterProvider key={user ? 'user' : 'guest'} router={finalRouter} />
                </div>
            </Suspense>
        </>
    )
}

export default AppRouter