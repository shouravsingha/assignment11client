import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
    LayoutDashboard, 
    UserCircle, 
    PlusCircle, 
    ClipboardList, 
    Users, 
    HeartHandshake,
    Wallet,
    Heart
} from 'lucide-react';

const DashboardSidebar = () => {
    const { mongoUser } = useAuth();
    const navigate = useNavigate();
    const role = mongoUser?.role || 'donor';

    const menuItems = {
        donor: [
            { path: '/dashboard', name: 'Dashboard Home', icon: <LayoutDashboard size={20} /> },
            { path: '/dashboard/my-donation-requests', name: 'My Donation Requests', icon: <ClipboardList size={20} /> },
            { path: '/dashboard/create-donation-request', name: 'Create Donation Request', icon: <PlusCircle size={20} /> },
            { path: '/dashboard/profile', name: 'Profile', icon: <UserCircle size={20} /> },
        ],
        volunteer: [
            { path: '/dashboard', name: 'Dashboard Home', icon: <LayoutDashboard size={20} /> },
            { path: '/dashboard/all-donation-requests', name: 'All Donation Requests', icon: <ClipboardList size={20} /> },
            { path: '/dashboard/profile', name: 'Profile', icon: <UserCircle size={20} /> },
        ],
        admin: [
            { path: '/dashboard', name: 'Dashboard Home', icon: <LayoutDashboard size={20} /> },
            { path: '/dashboard/all-users', name: 'All Users', icon: <Users size={20} /> },
            { path: '/dashboard/all-donation-requests', name: 'All Donation Requests', icon: <ClipboardList size={20} /> },
            { path: '/dashboard/content-management', name: 'Content Management', icon: <HeartHandshake size={20} /> },
            { path: '/dashboard/funding', name: 'Funding', icon: <Wallet size={20} /> },
            { path: '/dashboard/profile', name: 'Profile', icon: <UserCircle size={20} /> },
        ]
    };

    const currentMenu = menuItems[role] || menuItems.donor;

    return (
        <div className="bg-gray-950 text-gray-100 h-full py-10 px-6 flex flex-col">
            <div className="flex items-center gap-3 mb-12 px-2 group cursor-pointer" onClick={() => navigate('/')}>
                <div className="bg-red-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-red-900/50">
                    <Heart size={24} fill="currentColor" className="text-white" />
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">BloodCare</span>
            </div>

            <div className="flex-1 space-y-1.5">
                <p className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Main Menu</p>
                {currentMenu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                                isActive 
                                ? 'bg-red-600 text-white shadow-xl shadow-red-900/40 translate-x-1' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                                    {item.icon}
                                </span>
                                <span className="font-bold text-sm tracking-tight">{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            <div className="mt-auto pt-8 border-t border-white/5">
                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/10 rounded-full -mr-8 -mt-8 blur-xl group-hover:bg-red-600/20 transition-all"></div>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3">Your Account</p>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-xs font-black text-white uppercase tracking-tighter">{role} Mode</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System v0.1</span>
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Live</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSidebar;
