import React, { useState } from 'react';
import DashSide from '../component/Dashboard/DashSide';
import { Outlet } from 'react-router-dom';
import DashNav from '../component/Dashboard/DashNav';
import DashFooter from '../component/Dashboard/Dashfooter';
import { MdOutlineClose } from 'react-icons/md';
import { TiThMenu } from 'react-icons/ti';
import { useAuth } from '../context/AuthContext';
import { useLocation } from "react-router-dom";

const Dashboard = () => {
    const [openside, setOpenSide] = useState(false);
    const { auth } = useAuth()
    const toggleMenu = () => setOpenSide(prev => !prev);
    const location = useLocation()

    return (
        <div className="h-screen w-screen flex overflow-hidden">

            {/* DESKTOP SIDEBAR (UNCHANGED) */}
            <aside
                className="
                    hidden
                    xl:flex 
                    w-[15%] h-screen bg-white border-r border-gray-200
                "
            >
                <DashSide />
            </aside>

            {/* MOBILE/TABLET SIDEBAR */}
            {openside && (
                <aside
                    className="
                        fixed top-0 left-0 z-30
                        w-64 h-screen bg-white border-r border-gray-200
                        animate-slideIn
                        xl:hidden
                    "
                >
                    <DashSide />
                </aside>
            )}

            {/* OVERLAY */}
            {openside && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 xl:hidden"
                    onClick={() => setOpenSide(false)}
                />
            )}

            {/* MENU BUTTON FOR MOBILE/TABLET */}
            <button
                className="xl:hidden fixed top-3 left-3 z-40 bg-white p-2.5 rounded-lg shadow-md"
                onClick={toggleMenu}
            >
                {openside ? (
                    <MdOutlineClose className="text-blue-600 h-7 w-7" />
                ) : (
                    <TiThMenu className="text-blue-600 h-7 w-7" />
                )}
            </button>

            {/* MAIN WRAPPER */}
            <div className="flex-1 flex flex-col h-screen">

                {/* NAVBAR (STAYS SAME) */}
                <header className="top-0 left-0 w-full bg-white z-20 shadow-sm">
                    <DashNav />
                </header>

                {/* PAGE CONTENT */}
                <div className="pb-4 flex-1 overflow-y-auto bg-[#f8f9fa]">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 ml-8">
                        <div className="space-y-1 sm:space-y-2">
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 capitalize break-words">
                                {auth.role} Dashboard
                            </h1>
                            <p className="text-xs sm:text-sm md:text-base text-gray-500 capitalize break-words">
                                {location.pathname}
                            </p>
                        </div>

                    </div>
                    <div className='mt-6 md:ml-8 ml-4 mr-2'>
                        <Outlet />
                    </div>

                    <footer className="mt-6 px-4 pb-4">
                        <DashFooter />
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
