import shareinfo from '../pages/Shareinfo'
import useUserStore from "../stores/userStore"
import { lazy, Suspense } from "react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router"

const Home = lazy(() => import('../pages/Home'))
const Category = lazy(() => import('../pages/Category'))
const Profile = lazy(() => import('../pages/Profile'))
const Login = lazy(() => import('../pages/Login'))
const UserLayout = lazy(() => import('../layouts/UserLayout'))
const History = lazy(() => import('../pages/History'))
const Reservation = lazy(() => import('../pages/Reservation'))

const commonPath = [
    { path: '/share', Component: shareinfo }
]

const guestRouter = createBrowserRouter([
    { path: "/", Component: Login },
    { path: "*", element: <Navigate to="/" /> },
    ...commonPath
])

const userRouter = createBrowserRouter([
    {
        path: "/", Component: UserLayout,
        children: [

            { path: '', Component: Home },
            // { path: 'login', Component: Login },
            { path: 'category', Component: Category },
            { path: 'profile', Component: Profile },
            { path: 'reservation', Component: Reservation },
            { path: 'history', Component: History },
            { path: "*", element: <Navigate to="/" /> },
            ...commonPath
        ]
    }
])

function AppRouter() {

    const user = useUserStore(state => state.user)
    const finalRouter = user ? userRouter : guestRouter

    return (
        <Suspense fallback={<span className="loading loading-spinner text-info"></span>}>
            <RouterProvider key={user?.id} router={finalRouter} />
        </Suspense>
    )
}

export default AppRouter