import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../utils/axiosInstance';
import { Edit, Trash2, Eye, Search, Filter, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { donationStatuses, getDistrictName } from '../utils/constants';

const MyDonationRequests = () => {
    const { mongoUser } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
        total: 0,
        pages: 1
    });

    const fetchMyRequests = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/donation-requests', {
                params: {
                    requesterEmail: mongoUser?.email,
                    status: statusFilter,
                    page,
                    limit: pagination.limit
                }
            });

            if (response.data.success) {
                setRequests(response.data.requests);
                setPagination(response.data.pagination);
            }
        } catch (err) {
            setError('Failed to load your donation requests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mongoUser?.email) {
            fetchMyRequests(1);
        }
    }, [mongoUser?.email, statusFilter]);

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
                    <h1 className="text-2xl font-bold text-gray-900">My Donation Requests</h1>
                    <p className="text-gray-500">Manage and track your blood donation requests</p>
                </div>
                <Link 
                    to="/dashboard/create-donation-request"
                    className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold w-fit"
                >
                    <PlusCircle size={20} />
                    Create New Request
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <Filter size={18} />
                    <span className="font-medium">Filter by Status:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => setStatusFilter('')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${statusFilter === '' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        All
                    </button>
                    {donationStatuses.map(status => (
                        <button 
                            key={status.value}
                            onClick={() => setStatusFilter(status.value)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition ${statusFilter === status.value ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Recipient</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Location</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date & Time</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Blood Group</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Donor Info</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        No donation requests found.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((request) => (
                                    <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{request.recipientName}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600">{request.recipientUpazila}, {getDistrictName(request.recipientDistrict)}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <p className="text-gray-900 font-medium">{new Date(request.donationDate).toLocaleDateString()}</p>
                                            <p className="text-gray-500">{request.donationTime}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-red-100 text-red-600 rounded font-bold text-xs uppercase">
                                                {request.bloodGroup}
                                            </span>
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
                                        <td className="px-6 py-4 text-sm">
                                            {request.donationStatus === 'inprogress' || request.donationStatus === 'done' ? (
                                                <div>
                                                    <p className="font-semibold text-gray-900">{request.donorName}</p>
                                                    <p className="text-gray-500">{request.donorEmail}</p>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">No donor yet</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link 
                                                    to={`/donation-requests/${request._id}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                {request.donationStatus === 'pending' && (
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
                                                {request.donationStatus === 'inprogress' && (
                                                    <div className="flex gap-1">
                                                        <button 
                                                            onClick={() => handleStatusUpdate(request._id, 'done')}
                                                            className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700"
                                                        >
                                                            Done
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(request._id, 'canceled')}
                                                            className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
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
                        <p className="text-sm text-gray-500">
                            Showing page <span className="font-semibold text-gray-900">{pagination.page}</span> of <span className="font-semibold text-gray-900">{pagination.pages}</span>
                        </p>
                        <div className="flex gap-2">
                            <button 
                                disabled={pagination.page === 1}
                                onClick={() => fetchMyRequests(pagination.page - 1)}
                                className="p-2 border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button 
                                disabled={pagination.page === pagination.pages}
                                onClick={() => fetchMyRequests(pagination.page + 1)}
                                className="p-2 border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyDonationRequests;
