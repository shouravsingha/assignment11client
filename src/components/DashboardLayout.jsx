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
        <div className="flex min-h-screen bg-[#f8f9fa]">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 bg-gray-950 min-h-screen flex-shrink-0 shadow-2xl relative z-30">
                <DashboardSidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-72 bg-gray-950 z-50 transform transition-transform duration-500 ease-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full shadow-none'}`}>
                <div className="h-full flex flex-col relative">
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex-1 overflow-y-auto" onClick={() => setIsMobileMenuOpen(false)}>
                        <DashboardSidebar />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Dashboard Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center justify-between px-6 lg:px-10 flex-shrink-0 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-3 bg-gray-50 text-gray-600 lg:hidden rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden lg:block">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">System Overview</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Welcome back, {mongoUser?.name?.split(' ')[0]}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-6">
                        <div className="flex items-center gap-1">
                            <button className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all relative group">
                                <Bell size={20} />
                                <span className="absolute top-3 right-3 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
                                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Notifications</span>
                            </button>
                        </div>
                        
                        <div className="h-8 w-px bg-gray-100 mx-2 hidden sm:block"></div>
                        
                        <div className="flex items-center gap-4 group cursor-pointer p-1.5 pr-4 rounded-2xl hover:bg-gray-50 transition-all" onClick={() => navigate('/dashboard/profile')}>
                            <div className="relative">
                                <img 
                                    src={mongoUser?.avatar || 'https://i.ibb.co/default-avatar.png'} 
                                    alt="Profile" 
                                    className="w-11 h-11 rounded-xl border-2 border-white shadow-sm object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-gray-900 leading-none">{mongoUser?.name}</p>
                                <p className="text-[10px] text-red-600 font-black uppercase tracking-tighter mt-1">{mongoUser?.role}</p>
                            </div>
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                            title="Logout"
                        >
                            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
