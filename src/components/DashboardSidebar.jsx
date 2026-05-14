import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
    LayoutDashboard, 
    UserCircle, 
    PlusCircle, 
    ClipboardList, 
    Users, 
    HeartHandshake,
    Wallet
} from 'lucide-react';

const DashboardSidebar = () => {
    const { mongoUser } = useAuth();
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
        <div className="bg-gray-900 text-gray-100 w-full py-6 px-4">
            <div className="flex items-center gap-3 mb-10 px-2">
                <span className="text-2xl font-bold text-red-500">🩸 BloodCare</span>
            </div>

            <nav className="space-y-2">
                {currentMenu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive 
                                ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-10 pt-6 border-t border-gray-800">
                <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Current Role</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-semibold text-white uppercase">{role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSidebar;
