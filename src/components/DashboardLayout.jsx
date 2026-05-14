import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardSidebar from './DashboardSidebar';
import { Menu, X, Bell, LogOut } from 'lucide-react';

const DashboardLayout = () => {
    const { mongoUser, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 bg-gray-900 min-h-screen flex-shrink-0">
                <DashboardSidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 z-50 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-4 flex justify-end">
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400">
                            <X size={24} />
                        </button>
                    </div>
                    <div onClick={() => setIsMobileMenuOpen(false)}>
                        <DashboardSidebar />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Dashboard Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 mr-4 text-gray-600 md:hidden"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800 hidden md:block">Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        <div className="h-8 w-px bg-gray-200 mx-2"></div>
                        
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">{mongoUser?.name}</p>
                                <p className="text-xs text-gray-500 uppercase">{mongoUser?.role}</p>
                            </div>
                            <img 
                                src={mongoUser?.avatar || 'https://i.ibb.co/default-avatar.png'} 
                                alt="Profile" 
                                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                            />
                            <button 
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
