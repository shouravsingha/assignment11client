import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../utils/axiosInstance';
import { Edit, Trash2, Eye, Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { donationStatuses, getDistrictName, bloodGroups } from '../utils/constants';

const AllDonationRequests = () => {
    const { mongoUser } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        bloodGroup: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
    });

    const isAdmin = mongoUser?.role === 'admin';

    const fetchAllRequests = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/donation-requests', {
                params: {
                    status: filters.status,
                    bloodGroup: filters.bloodGroup,
                    search: filters.search,
                    page,
                    limit: pagination.limit
                }
            });

            if (response.data.success) {
                setRequests(response.data.requests);
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error('Failed to load donation requests', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllRequests(1);
    }, [filters.status, filters.bloodGroup]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAllRequests(1);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await axiosInstance.put(`/donation-requests/${id}`, {
                donationStatus: newStatus
            });
            if (response.data.success) {
                setRequests(requests.map(req => req._id === id ? response.data.request : req));
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!isAdmin) return;
        if (!window.confirm('Are you sure you want to delete this request?')) return;

        try {
            const response = await axiosInstance.delete(`/donation-requests/${id}`);
            if (response.data.success) {
                setRequests(requests.filter(req => req._id !== id));
            }
        } catch (err) {
            alert('Failed to delete request');
        }
    };

    if (loading && requests.length === 0) {
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
                    <h1 className="text-2xl font-bold text-gray-900">All Donation Requests</h1>
                    <p className="text-gray-500">System-wide view of all blood donation requests</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by recipient, hospital, or address..." 
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition">
                        Search
                    </button>
                </form>

                <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-600">Status:</span>
                        <select 
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            className="text-sm border-none bg-gray-100 rounded px-2 py-1 outline-none font-medium"
                        >
                            <option value="">All Statuses</option>
                            {donationStatuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-600">Blood Group:</span>
                        <select 
                            value={filters.bloodGroup}
                            onChange={(e) => setFilters({...filters, bloodGroup: e.target.value})}
                            className="text-sm border-none bg-gray-100 rounded px-2 py-1 outline-none font-medium"
                        >
                            <option value="">All Groups</option>
                            {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-500 uppercase">Recipient</th>
                                <th className="px-6 py-4 font-bold text-gray-500 uppercase">Requester</th>
                                <th className="px-6 py-4 font-bold text-gray-500 uppercase">Location</th>
                                <th className="px-6 py-4 font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 font-bold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No donation requests found.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((request) => (
                                    <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{request.recipientName}</p>
                                            <p className="text-xs text-red-600 font-bold uppercase">{request.bloodGroup}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{request.requesterName}</p>
                                            <p className="text-xs text-gray-500">{request.requesterEmail}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-600">{request.recipientUpazila}, {getDistrictName(request.recipientDistrict)}</p>
                                            <p className="text-xs text-gray-400">{new Date(request.donationDate).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                                                request.donationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                request.donationStatus === 'inprogress' ? 'bg-blue-100 text-blue-700' :
                                                request.donationStatus === 'done' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {request.donationStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <Link 
                                                    to={`/donation-requests/${request._id}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                
                                                {/* Status Controls for Volunteer/Admin */}
                                                {request.donationStatus === 'inprogress' && (
                                                    <div className="flex gap-1">
                                                        <button 
                                                            onClick={() => handleStatusUpdate(request._id, 'done')}
                                                            className="px-2 py-1 bg-green-600 text-white text-[10px] font-bold rounded hover:bg-green-700"
                                                        >
                                                            Done
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(request._id, 'canceled')}
                                                            className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded hover:bg-red-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Admin Only Actions */}
                                                {isAdmin && (
                                                    <>
                                                        <Link 
                                                            to={`/dashboard/edit-donation-request/${request._id}`}
                                                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit size={18} />
                                                        </Link>
                                                        <button 
                                                            onClick={() => handleDelete(request._id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            Showing page <span className="font-bold text-gray-900">{pagination.page}</span> of <span className="font-bold text-gray-900">{pagination.pages}</span>
                        </p>
                        <div className="flex gap-2">
                            <button 
                                disabled={pagination.page === 1}
                                onClick={() => fetchAllRequests(pagination.page - 1)}
                                className="p-1.5 border border-gray-300 rounded hover:bg-white disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button 
                                disabled={pagination.page === pagination.pages}
                                onClick={() => fetchAllRequests(pagination.page + 1)}
                                className="p-1.5 border border-gray-300 rounded hover:bg-white disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllDonationRequests;
