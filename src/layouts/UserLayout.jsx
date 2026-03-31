
import React from 'react'
import { Outlet } from 'react-router'

function UserLayout() {
    return (

            <div className="min-h-screen">                    
                <Outlet />
                </div>
    )
}

export default UserLayout