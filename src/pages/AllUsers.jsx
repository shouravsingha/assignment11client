import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { 
    UserCheck, 
    UserX, 
    ShieldAlert, 
    ShieldCheck, 
    Filter, 
    MoreVertical,
    CheckCircle,
    XCircle,
    UserPlus
} from 'lucide-react';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/users');
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusUpdate = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        if (!window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'unblock' : 'block'} this user?`)) return;

        try {
            setActionLoading(userId);
            const response = await axiosInstance.patch(`/users/${userId}/status`, { status: newStatus });
            if (response.data.success) {
                setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
            }
        } catch (error) {
            alert('Failed to update user status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to make this user a ${newRole}?`)) return;

        try {
            setActionLoading(userId);
            const response = await axiosInstance.patch(`/users/${userId}/role`, { role: newRole });
            if (response.data.success) {
                setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            }
        } catch (error) {
            alert('Failed to update user role');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase()) ||
        user.role.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500">Manage all registered users, roles, and access status</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={user.avatar || 'https://i.ibb.co/default-avatar.png'} 
                                                    alt={user.name} 
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                />
                                                <span className="font-bold text-gray-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'volunteer' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {user.status === 'active' ? (
                                                    <span className="flex items-center gap-1 text-green-600 font-bold">
                                                        <CheckCircle size={14} /> Active
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-red-600 font-bold">
                                                        <XCircle size={14} /> Blocked
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {/* Role Buttons */}
                                                {user.role !== 'admin' && (
                                                    <button 
                                                        disabled={actionLoading === user._id}
                                                        onClick={() => handleRoleUpdate(user._id, 'admin')}
                                                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                                                        title="Make Admin"
                                                    >
                                                        <ShieldCheck size={18} />
                                                    </button>
                                                )}
                                                {user.role !== 'volunteer' && (
                                                    <button 
                                                        disabled={actionLoading === user._id}
                                                        onClick={() => handleRoleUpdate(user._id, 'volunteer')}
                                                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                        title="Make Volunteer"
                                                    >
                                                        <ShieldAlert size={18} />
                                                    </button>
                                                )}
                                                {user.role !== 'donor' && (
                                                    <button 
                                                        disabled={actionLoading === user._id}
                                                        onClick={() => handleRoleUpdate(user._id, 'donor')}
                                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                        title="Make Donor"
                                                    >
                                                        <UserPlus size={18} />
                                                    </button>
                                                )}

                                                <div className="w-px h-6 bg-gray-200 mx-1 self-center"></div>

                                                {/* Status Button */}
                                                <button 
                                                    disabled={actionLoading === user._id}
                                                    onClick={() => handleStatusUpdate(user._id, user.status)}
                                                    className={`p-2 transition-colors ${user.status === 'active' ? 'text-gray-400 hover:text-red-600' : 'text-red-400 hover:text-green-600'}`}
                                                    title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                                                >
                                                    {user.status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllUsers;
