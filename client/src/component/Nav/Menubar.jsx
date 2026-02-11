import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Menubar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { auth } = useAuth();

    // Determine the correct Appointment link
    const appointmentLink =
        auth && auth.role === "user" ? "/my-account" : "/login";

    const secNavData = [
        { id: 1, name: "Home", link: "/" },
        { id: 2, name: "About", link: "/aboutus" },
        { id: 3, name: "Services", link: "/services" },
        { id: 4, name: "Team", link: "/team" },
        { id: 5, name: "Appointment", link: appointmentLink },
        { id: 6, name: "Resources", link: "/resources" },
    ];

    return (
        <nav className="bg-transparent border-t border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                {/* Desktop Menu */}
                <ul className="hidden md:flex items-center gap-8">
                    {secNavData.map((item) => (
                        <li key={item.id}>
                            <Link
                                to={item.link}
                                className="text-gray-700 hover:text-[#560606] transition font-medium"
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Mobile Menu Icon */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-[#560606] focus:outline-none"
                >
                    {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white shadow-md">
                    <ul className="flex flex-col items-center gap-4 py-4">
                        {secNavData.map((item) => (
                            <li key={item.id}>
                                <Link
                                    to={item.link}
                                    className="text-gray-700 hover:text-[#560606] font-medium transition"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Menubar;
