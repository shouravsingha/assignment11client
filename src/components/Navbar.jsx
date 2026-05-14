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
        <nav className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold flex items-center gap-2 hover:text-red-100 transition">
                        🩸 Blood Donation
                    </Link>

                    {/* Center Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="hover:text-red-100 transition">Home</Link>
                        <Link to="/donation-requests" className="hover:text-red-100 transition">Donation Requests</Link>
                        {isAuthenticated && (
                            <Link to="/dashboard" className="hover:text-red-100 transition">Dashboard</Link>
                        )}
                    </div>

                    {/* Right Side - Auth Section */}
                    <div className="flex items-center gap-4">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="bg-white text-red-600 px-4 py-2 rounded hover:bg-red-50 transition font-semibold"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded transition font-semibold"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 bg-red-700 hover:bg-red-800 px-4 py-2 rounded transition"
                                >
                                    <img
                                        src={displayUser.avatar || 'https://i.ibb.co/default-avatar.png'}
                                        alt={displayUser.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="hidden sm:inline">{displayUser.name?.split(' ')[0]}</span>
                                    <span className="text-lg">▼</span>
                                </button>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-50">
                                        <div className="px-4 py-3 border-b">
                                            <p className="font-semibold">{displayUser.name}</p>
                                            <p className="text-sm text-gray-500">{displayUser.email}</p>
                                            <p className="text-xs text-red-600 font-semibold mt-1 uppercase">{displayUser.role}</p>
                                        </div>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setShowDropdown(false)}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                                        >
                                            📊 Dashboard
                                        </Link>
                                        <Link
                                            to="/profile"
                                            onClick={() => setShowDropdown(false)}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                                        >
                                            👤 Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 transition font-semibold"
                                        >
                                            🚪 Logout
                                        </button>
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
