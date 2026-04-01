import React from 'react'
import { Outlet } from 'react-router'
import Header from '../components/Header'
import bgImage from '../assets/bgImage.png'
import bgVideo from '../assets/bgVideo.mp4'
import Footer from '../components/Footer'

function GuestLayout() {
    return (

        <div className="min-h-screen">
              <div className="min-h-screen w-full relative flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="fixed top-0 left-0 w-full h-screen object-cover -z-10"
                    src={bgVideo}
                />
                <Header />
                <Outlet />
            </div>
                <Footer/>
        </div>
    )
}

export default GuestLayout