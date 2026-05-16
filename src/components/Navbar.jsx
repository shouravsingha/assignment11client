import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

function Navbar() {
    const navigate = useNavigate()
    const { isAuthenticated, user, mongoUser, logout } = useAuth()
    const [showDropdown, setShowDropdown] = useState(false)

    const handleLogout = () => {
        logout()
        setShowDropdown(false)
        navigate('/')
    }

    const displayUser = mongoUser || {
        name: user?.displayName,
        email: user?.email,
        avatar: user?.photoURL,
        role: 'donor' // fallback
    }

    return (
        <nav className="glass sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-black flex items-center gap-2 text-red-600 group transition-all duration-300">
                        <div className="bg-red-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-red-200">
                            🩸
                        </div>
                        <span className="tracking-tighter">BloodCare</span>
                    </Link>

                    {/* Center Links */}
                    <div className="hidden md:flex items-center space-x-10">
                        <Link to="/" className="text-gray-600 font-bold hover:text-red-600 transition-colors relative group">
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link to="/donation-requests" className="text-gray-600 font-bold hover:text-red-600 transition-colors relative group">
                            Requests
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link to="/search-donors" className="text-gray-600 font-bold hover:text-red-600 transition-colors relative group">
                            Find Donors
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link to="/funding" className="text-gray-600 font-bold hover:text-red-600 transition-colors relative group">
                            Funding
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                        </Link>
                        {isAuthenticated && (
                            <Link to="/dashboard" className="text-gray-600 font-bold hover:text-red-600 transition-colors relative group">
                                Dashboard
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                            </Link>
                        )}
                    </div>

                    {/* Right Side - Auth Section */}
                    <div className="flex items-center gap-4">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-900 px-5 py-2.5 rounded-xl transition-all font-bold hover:bg-gray-100"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl transition-all font-bold shadow-lg shadow-red-200 premium-button"
                                >
                                    Join Now
                                </Link>
                            </>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-3 bg-white border border-gray-100 p-1.5 pr-4 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
                                >
                                    <img
                                        src={displayUser.avatar || 'https://i.ibb.co/default-avatar.png'}
                                        alt={displayUser.name}
                                        className="w-10 h-10 rounded-xl object-cover shadow-sm border-2 border-white"
                                    />
                                    <div className="text-left hidden sm:block">
                                        <p className="text-xs font-black text-gray-900 leading-none">{displayUser.name?.split(' ')[0]}</p>
                                        <p className="text-[10px] text-red-600 font-black uppercase tracking-widest mt-0.5">{displayUser.role}</p>
                                    </div>
                                    <span className="text-gray-400 text-[10px]">▼</span>
                                </button>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-50 overflow-hidden z-50 animate-slide-down">
                                        <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100">
                                            <p className="font-black text-gray-900">{displayUser.name}</p>
                                            <p className="text-xs text-gray-500 font-medium truncate">{displayUser.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setShowDropdown(false)}
                                                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all font-bold group"
                                            >
                                                <span className="group-hover:scale-110 transition-transform">📊</span> Dashboard
                                            </Link>
                                            <Link
                                                to="/dashboard/profile"
                                                onClick={() => setShowDropdown(false)}
                                                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all font-bold group"
                                            >
                                                <span className="group-hover:scale-110 transition-transform">👤</span> Profile
                                            </Link>
                                            <div className="h-px bg-gray-100 my-2 mx-4"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-red-100 text-red-600 transition-all font-bold group"
                                            >
                                                <span className="group-hover:scale-110 transition-transform">🚪</span> Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
