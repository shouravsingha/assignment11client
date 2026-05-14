import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../utils/axiosInstance';
import { PlusCircle, ClipboardList, Eye, ArrowRight } from 'lucide-react';
import { getDistrictName } from '../utils/constants';

const DashboardHome = () => {
    const navigate = useNavigate();
    const { mongoUser } = useAuth();
    const [recentRequests, setRecentRequests] = useState([]);
    const [adminStats, setAdminStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAdminOrVolunteer = mongoUser?.role === 'admin' || mongoUser?.role === 'volunteer';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch recent requests (user specific if donor, all if admin/volunteer)
                const requestsParams = isAdminOrVolunteer ? { limit: 3 } : { requesterEmail: mongoUser?.email, limit: 3 };
                const requestsRes = await axiosInstance.get('/donation-requests', { params: requestsParams });
                
                if (requestsRes.data.success) {
                    setRecentRequests(requestsRes.data.requests);
                }

                // Fetch Admin/Volunteer Stats
                if (isAdminOrVolunteer) {
                    const [userStatsRes, donationStatsRes] = await Promise.all([
                        axiosInstance.get('/users/admin-stats'),
                        axiosInstance.get('/donation-requests/get-stats')
                    ]);

                    if (userStatsRes.data.success && donationStatsRes.data.success) {
                        setAdminStats({
                            ...userStatsRes.data.stats,
                            ...donationStatsRes.data.stats
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (mongoUser?.email) {
            fetchData();
        }
    }, [mongoUser?.email, mongoUser?.role]);

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {mongoUser?.name}!</h1>
                <p className="text-red-100 text-lg">
                    {isAdminOrVolunteer 
                        ? `System Overview: You are logged in as a ${mongoUser?.role}.` 
                        : 'Ready to save a life today? Manage your donation requests here.'}
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
                        <span className="text-sm text-red-100 block">Blood Group</span>
                        <span className="text-xl font-bold uppercase">{mongoUser?.bloodGroup}</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
                        <span className="text-sm text-red-100 block">Status</span>
                        <span className="text-xl font-bold uppercase tracking-wider">{mongoUser?.status}</span>
                    </div>
                </div>
            </div>

            {/* Admin Stats Cards */}
            {isAdminOrVolunteer && adminStats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Users</p>
                        <p className="text-3xl font-black text-gray-900 mt-1">{adminStats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Requests</p>
                        <p className="text-3xl font-black text-red-600 mt-1">{adminStats.totalRequests}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending</p>
                        <p className="text-3xl font-black text-yellow-600 mt-1">{adminStats.pendingRequests}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Funded (Mock)</p>
                        <p className="text-3xl font-black text-green-600 mt-1">BDT 0</p>
                    </div>
                </div>
            )}

            {/* Quick Stats/Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-shadow">
                    <div className="p-4 bg-red-100 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
                        <PlusCircle size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Need Blood?</h3>
                        <p className="text-gray-500 mb-4">Create a new donation request for yourself or someone else.</p>
                        <Link 
                            to="/dashboard/create-donation-request"
                            className="text-red-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
                        >
                            Create Request <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-shadow">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                        <ClipboardList size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Manage Requests</h3>
                        <p className="text-gray-500 mb-4">Track, edit, or update the status of your existing requests.</p>
                        <Link 
                            to="/dashboard/my-donation-requests"
                            className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
                        >
                            My Requests <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Requests Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Your Recent Requests</h2>
                    <Link 
                        to="/dashboard/my-donation-requests"
                        className="text-sm font-bold text-red-600 hover:text-red-700"
                    >
                        View All
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 inline-block"></div>
                            <p className="text-gray-500 mt-2">Loading recent requests...</p>
                        </div>
                    ) : recentRequests.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 mb-4">You haven't created any donation requests yet.</p>
                            <Link 
                                to="/dashboard/create-donation-request"
                                className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                            >
                                Create Your First Request
                            </Link>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Recipient</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Location</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentRequests.map((request) => (
                                    <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-900">{request.recipientName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {request.recipientUpazila}, {getDistrictName(request.recipientDistrict)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                                request.donationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                request.donationStatus === 'inprogress' ? 'bg-blue-100 text-blue-700' :
                                                request.donationStatus === 'done' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {request.donationStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                to={`/donation-requests/${request._id}`}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors inline-block"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
