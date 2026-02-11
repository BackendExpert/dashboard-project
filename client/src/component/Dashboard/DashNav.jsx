import React, { useState, useEffect, useRef } from "react";
import {
    FiSearch,
    FiGrid,
    FiSettings,
    FiBell,
    FiMail,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import defultUser from "../../assets/user.png";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

const DashNav = () => {
    const navigate = useNavigate()
    const { auth, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const dropdownRef = useRef(null);
    const token = localStorage.getItem("token");

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* NAVBAR */}
            <motion.header
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full border-b border-gray-200 bg-white shadow-sm"
            >
                <div className="flex items-center justify-between px-4 lg:px-8 h-14">

                    {/* LEFT: Desktop Search / Mobile Icon */}
                    <div className="flex items-center">

                        {/* Mobile Search Icon */}
                        <button
                            onClick={() => setShowMobileSearch(true)}
                            className="md:hidden text-gray-500 hover:text-gray-700"
                        >
                            <FiSearch className="text-xl" />
                        </button>

                        {/* Desktop Search Bar */}
                        <div className="hidden md:block relative w-64">
                            <FiSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full border border-gray-300 text-sm rounded-md pl-8 pr-8 py-1.5
                                           focus:outline-none focus:ring-1 focus:ring-gray-300"
                            />
                            <div className="absolute right-2 top-1.5 text-[10px] text-gray-400 border border-gray-300 px-1.5 rounded">
                                CTRL + /
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE: Desktop Icons (Hide on Mobile) */}
                    <div className="hidden md:flex items-center gap-4 text-gray-500">
                        <FiGrid className="text-lg hover:text-gray-700" />
                        <FiSettings className="text-lg hover:text-gray-700" />
                    </div>

                    {/* RIGHT: Profile & Notifications */}
                    <div className="flex items-center gap-4" ref={dropdownRef}>

                        {/* Hide on very small screens */}
                        <button className="hidden sm:block text-gray-500 hover:text-gray-700">
                            <FiMail className="text-lg" />
                        </button>

                        <button className="text-gray-500 hover:text-gray-700">
                            <FiBell className="text-lg" />
                        </button>

                        {/* Profile Image */}
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-8 h-8 rounded-full overflow-hidden shadow-sm"
                            >
                                <img
                                    src={defultUser}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </button>

                            {/* Dropdown */}
                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-56 bg-white border border-gray-200
                                                   rounded-lg shadow-lg py-3 z-20"
                                    >
                                        <div className="flex items-center gap-3 px-4 pb-3">
                                            <img
                                                src={defultUser}
                                                alt="User"
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {auth?.user?.username || "User"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {auth?.user?.email || ""}
                                                </p>
                                            </div>
                                        </div>

                                        <ul className="py-1 text-sm text-gray-600">
                                            <li>
                                                <Link
                                                    to="/Dashboard/settings/account"
                                                    className="block px-4 py-2 hover:bg-gray-50"
                                                >
                                                    My Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
                                                    Settings
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => logout(navigate)}
                                                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50"
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* MOBILE SEARCH MODAL */}
            <AnimatePresence>
                {showMobileSearch && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-6"
                        onClick={() => setShowMobileSearch(false)}
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="bg-white w-full p-4 rounded-lg shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Search..."
                                    className="w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 focus:ring-1 focus:ring-gray-400"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DashNav;
