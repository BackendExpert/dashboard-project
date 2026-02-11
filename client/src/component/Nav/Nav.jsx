import React, { useState } from "react";
import Logo from "../../assets/cakewhite.png";
import {
    FaBars,
    FaTimes,
    FaSearch,
    FaShoppingCart,
    FaChevronDown,
} from "react-icons/fa";

export default function Nav() {
    const [menu, setMenu] = useState(false);
    const [drop, setDrop] = useState(false);
    const [mega, setMega] = useState(false);

    // Updated: categories with links only where NO submenu exists
    const categories = [
        { name: "Cakes", link: null },
        { name: "Cupcakes", link: null },
        { name: "Desserts", link: null },
        { name: "Custom Orders", link: "/custom-orders" },
        { name: "Birthday Cakes", link: "/birthday-cakes" },
        { name: "Wedding Cakes", link: "/wedding-cakes" },
        { name: "Gifts", link: "/gifts" },
    ];

    // Updated with links for each submenu item
    const megaMenu = {
        Cakes: [
            { name: "Chocolate", link: "/cakes/chocolate" },
            { name: "Vanilla", link: "/cakes/vanilla" },
            { name: "Strawberry", link: "/cakes/strawberry" },
            { name: "Black Forest", link: "/cakes/black-forest" },
        ],
        Cupcakes: [
            { name: "Choco Chip", link: "/cupcakes/choco-chip" },
            { name: "Red Velvet", link: "/cupcakes/red-velvet" },
            { name: "Cream Frosted", link: "/cupcakes/cream-frosted" },
        ],
        Desserts: [
            { name: "Brownies", link: "/desserts/brownies" },
            { name: "Pudding", link: "/desserts/pudding" },
            { name: "Cheesecake", link: "/desserts/cheesecake" },
        ],
    };

    return (
        <div className="w-full bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 text-white shadow sticky top-0 z-50 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <a href="/" className="flex items-center gap-3 group">
                    <img src={Logo} className="h-14 drop-shadow-xl group-hover:scale-110 transition duration-300" />
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-widest">Cake Shop</h1>
                        <p className="-mt-1 text-sm opacity-80 tracking-wide">Your Cake Partner</p>
                    </div>
                </a>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-10">

                    {/* Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDrop(!drop)}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl border border-white/10 backdrop-blur-md transition font-semibold shadow-lg"
                        >
                            Categories
                            <FaChevronDown className={`${drop ? "rotate-180" : ""} transition`} />
                        </button>

                        {drop && (
                            <div className="absolute left-0 mt-3 bg-white text-gray-700 w-72 rounded-2xl shadow border border-pink-200 py-4 animate-fadeIn backdrop-blur-xl z-50">
                                {categories.map((cat, i) => (
                                    <div key={i} className="relative">

                                        {/* Categories WITHOUT submenu → link */}
                                        {cat.link ? (
                                            <a
                                                href={cat.link}
                                                className="block px-5 py-2 hover:bg-pink-50 hover:text-pink-600 font-medium rounded-lg cursor-pointer"
                                            >
                                                {cat.name}
                                            </a>
                                        ) : (
                                            /* Categories WITH submenu → button */
                                            <button
                                                onMouseEnter={() => setMega(cat.name)}
                                                className="w-full text-left px-5 py-2 hover:bg-pink-50 hover:text-pink-600 font-medium rounded-lg flex justify-between items-center cursor-pointer"
                                            >
                                                {cat.name}
                                                <FaChevronDown className="opacity-40" />
                                            </button>
                                        )}

                                        {/* Mega Menu */}
                                        {!cat.link && mega === cat.name && megaMenu[cat.name] && (
                                            <div className="absolute top-0 left-72 w-64 bg-white rounded-xl shadow border border-pink-200 py-4 px-3 animate-fadeIn">
                                                {megaMenu[cat.name].map((sub, s) => (
                                                    <a
                                                        key={s}
                                                        href={sub.link}
                                                        className="block px-4 py-2 font-medium hover:bg-pink-50 hover:text-pink-600 rounded-lg cursor-pointer"
                                                    >
                                                        {sub.name}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Extra links */}
                    <a href="/best-deals" className="font-semibold hover:text-yellow-200 transition">Best Deals</a>
                    <a href="/top-picks" className="font-semibold hover:text-yellow-200 transition">Top Picks</a>
                    <a href="/gift-packs" className="font-semibold hover:text-yellow-200 transition">Gift Packs</a>
                    <a href="/offers" className="font-semibold hover:text-yellow-200 transition">Offers</a>

                    {/* Search */}
                    <div className="relative w-72">
                        <input
                            type="text"
                            placeholder="Search cakes..."
                            className="bg-white text-gray-700 w-full px-4 py-2 rounded-full shadow-md focus:ring-2 focus:ring-pink-300 outline-none text-sm"
                        />
                        <FaSearch className="absolute right-4 top-2.5 text-pink-600" />
                    </div>

                    {/* Cart */}
                    <div className="relative cursor-pointer hover:text-yellow-200 transition">
                        <FaShoppingCart className="text-3xl" />
                        <span className="absolute -top-2 -right-2 bg-white text-pink-600 text-xs font-bold px-2 py-[2px] rounded-full shadow">
                            2
                        </span>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenu(!menu)}
                    className="lg:hidden text-3xl hover:scale-110 transition"
                >
                    {menu ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {menu && (
                <div className="lg:hidden bg-pink-600/20 backdrop-blur-xl px-6 py-5 space-y-6 animate-fadeIn rounded-b-2xl">

                    <button
                        onClick={() => setDrop(!drop)}
                        className="w-full flex items-center justify-between bg-white/20 px-5 py-3 rounded-xl text-lg font-semibold"
                    >
                        Categories
                        <FaChevronDown className={`${drop ? "rotate-180" : ""} transition`} />
                    </button>

                    {drop && (
                        <div className="bg-white text-gray-700 rounded-xl shadow-xl border border-pink-200 py-3 animate-fadeIn">
                            {categories.map((cat, i) => (
                                <div key={i}>
                                    {cat.link ? (
                                        <a
                                            href={cat.link}
                                            className="block px-5 py-2 hover:bg-pink-50 hover:text-pink-600 font-medium"
                                        >
                                            {cat.name}
                                        </a>
                                    ) : (
                                        <span className="block px-5 py-2 font-medium text-gray-500">
                                            {cat.name}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <a className="font-semibold text-lg hover:text-yellow-200 transition" href="/best-deals">Best Deals</a>
                    <a className="font-semibold text-lg hover:text-yellow-200 transition" href="/top-picks">Top Picks</a>
                    <a className="font-semibold text-lg hover:text-yellow-200 transition" href="/gift-packs">Gift Packs</a>
                    <a className="font-semibold text-lg hover:text-yellow-200 transition" href="/offers">Offers</a>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search cakes..."
                            className="bg-white text-gray-700 w-full px-4 py-2 rounded-full shadow-md focus:ring-2 focus:ring-pink-300 outline-none text-sm"
                        />
                        <FaSearch className="absolute right-4 top-2.5 text-pink-600" />
                    </div>

                    <div className="relative cursor-pointer hover:text-yellow-200 transition">
                        <FaShoppingCart className="text-3xl" />
                        <span className="absolute -top-2 -right-2 bg-white text-pink-600 text-xs font-bold px-2 py-[2px] rounded-full shadow">
                            2
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
