import React from "react";
import { FaHeart, FaMapMarkedAlt, FaPhoneAlt, FaUser } from "react-icons/fa";

const TopNav = () => {
    return (
        <div className="hidden md:block w-full bg-gradient-to-r from-pink-100 via-pink-50 to-pink-100 border-b border-pink-200/60 shadow-md backdrop-blur">
            <div className="xl:mx-40 md:mx-20 px-6 py-3 flex justify-between items-center text-sm text-gray-700">

                {/* Left */}
                <div className="flex items-center gap-8">
                    <a
                        href=""
                        className="text-pink-700 font-semibold tracking-wide hover:text-pink-900 transition-all duration-300 relative"
                    >
                        About Us
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-pink-600 hover:w-full transition-all duration-300 rounded-full"></span>
                    </a>

                    <a
                        href=""
                        className="text-pink-700 font-semibold tracking-wide hover:text-pink-900 transition-all duration-300 relative"
                    >
                        Contact Us
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-pink-600 hover:w-full transition-all duration-300 rounded-full"></span>
                    </a>
                </div>

                {/* Right */}
                <div className="flex items-center gap-8">

                    <a
                        href=""
                        className="flex items-center gap-2 group"
                    >
                        <FaMapMarkedAlt className="text-pink-600 text-lg group-hover:text-pink-800 transition-all duration-300 group-hover:scale-110" />
                        <span className="text-pink-700 font-semibold group-hover:text-pink-900 transition-all">Locations</span>
                    </a>

                    <a
                        href=""
                        className="flex items-center gap-2 group"
                    >
                        <FaPhoneAlt className="text-pink-600 text-lg group-hover:text-pink-800 transition-all duration-300 group-hover:scale-110" />
                        <span className="text-pink-700 font-semibold group-hover:text-pink-900 transition-all">+94 711758851</span>
                    </a>

                    <a
                        href=""
                        className="flex items-center gap-2 group"
                    >
                        <FaHeart className="text-pink-600 text-lg group-hover:text-pink-800 transition-all duration-300 group-hover:scale-110" />
                        <span className="text-pink-700 font-semibold group-hover:text-pink-900 transition-all">WishList</span>
                    </a>

                    <a
                        href=""
                        className="flex items-center gap-2 group"
                    >
                        <FaUser className="text-pink-600 text-lg group-hover:text-pink-800 transition-all duration-300 group-hover:scale-110" />
                        <span className="text-pink-700 font-semibold group-hover:text-pink-900 transition-all">Login / Register</span>
                    </a>

                </div>
            </div>
        </div>
    );
};

export default TopNav;
