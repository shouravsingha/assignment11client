import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import {
    bangladeshData,
    bloodGroups,
    donationStatuses,
    getDistrictName,
    getUpazilasByDistrict
} from '../utils/constants'
import { useAuth } from '../hooks/useAuth'

function DonationRequests() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [filters, setFilters] = useState({
        search: '',
        bloodGroup: '',
        district: '',
        upazila: '',
        status: 'pending'
    })
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    })

    const upazilaOptions = useMemo(() => {
        return getUpazilasByDistrict(filters.district)
    }, [filters.district])

    const fetchRequests = useCallback(async (page = 1) => {
        try {
            setLoading(true)
            setError('')

            const params = new URLSearchParams()
            if (filters.search.trim()) params.append('search', filters.search.trim())
            if (filters.bloodGroup) params.append('bloodGroup', filters.bloodGroup)
            if (filters.district) params.append('district', filters.district)
            if (filters.upazila) params.append('upazila', filters.upazila)
            if (filters.status) params.append('status', filters.status)
            params.append('page', page)
            params.append('limit', pagination.limit)

            const response = await axiosInstance.get(`/donation-requests?${params.toString()}`)

            if (response.data.success) {
                setRequests(response.data.requests)
                setPagination(response.data.pagination)
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch donation requests')
        } finally {
            setLoading(false)
        }
    }, [filters, pagination.limit])

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            fetchRequests(1)
        }, 250)

        return () => window.clearTimeout(timeoutId)
    }, [fetchRequests])

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleDistrictChange = (e) => {
        const districtId = e.target.value
        setFilters((prev) => ({
            ...prev,
            district: districtId,
            upazila: ''
        }))
    }

    const resetFilters = () => {
        setFilters({
            search: '',
            bloodGroup: '',
            district: '',
            upazila: '',
            status: 'pending'
        })
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'inprogress':
                return 'bg-blue-100 text-blue-800'
            case 'done':
                return 'bg-green-100 text-green-800'
            case 'canceled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusLabel = (status) => {
        return donationStatuses.find((item) => item.value === status)?.label || status
    }

    const goToCreateRequest = () => {
        navigate(isAuthenticated ? '/create-donation-request' : '/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">Blood Donation Requests</h1>
                        <p className="mt-2 text-gray-600">Find pending requests, filter by location, and help someone nearby.</p>
                    </div>
                    <button
                        onClick={goToCreateRequest}
                        className="w-full rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 md:w-auto"
                    >
                        Create Request
                    </button>
                </div>

                <section className="mb-8 rounded-lg bg-white p-5 shadow">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div className="lg:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">Search</label>
                            <input
                                type="search"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Recipient, hospital, address"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Blood Group</label>
                            <select
                                name="bloodGroup"
                                value={filters.bloodGroup}
                                onChange={handleFilterChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <option value="">All Groups</option>
                                {bloodGroups.map((bloodGroup) => (
                                    <option key={bloodGroup} value={bloodGroup}>{bloodGroup}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">District</label>
                            <select
                                name="district"
                                value={filters.district}
                                onChange={handleDistrictChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <option value="">All Districts</option>
                                {bangladeshData.districts.map((district) => (
                                    <option key={district.id} value={district.id}>{district.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Upazila</label>
                            <select
                                name="upazila"
                                value={filters.upazila}
                                onChange={handleFilterChange}
                                disabled={!filters.district}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50"
                            >
                                <option value="">All Upazilas</option>
                                {upazilaOptions.map((upazila) => (
                                    <option key={upazila} value={upazila}>{upazila}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 md:max-w-xs"
                            >
                                <option value="">All Statuses</option>
                                {donationStatuses.map((status) => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={resetFilters}
                            className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Reset Filters
                        </button>
                    </div>
                </section>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="py-16 text-center">
                        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-red-600"></div>
                        <p className="mt-4 text-gray-600">Loading requests...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="rounded-lg bg-white p-12 text-center shadow">
                        <h2 className="text-2xl font-bold text-gray-900">No donation requests found</h2>
                        <p className="mt-2 text-gray-600">Try a different filter or create a new request.</p>
                        <button
                            onClick={goToCreateRequest}
                            className="mt-6 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                        >
                            Create Request
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {requests.map((request) => (
                            <article key={request._id} className="rounded-lg bg-white p-6 shadow transition hover:shadow-md">
                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-950">{request.recipientName}</h2>
                                        <p className="mt-1 text-sm text-gray-600">{request.hospitalName}</p>
                                    </div>
                                    <span className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${getStatusBadgeColor(request.donationStatus)}`}>
                                        {getStatusLabel(request.donationStatus)}
                                    </span>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-gray-500">Blood</p>
                                        <p className="text-2xl font-bold text-red-600">{request.bloodGroup}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-gray-500">Location</p>
                                        <p className="font-semibold text-gray-900">{request.recipientUpazila}</p>
                                        <p className="text-sm text-gray-500">{getDistrictName(request.recipientDistrict)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-gray-500">Date</p>
                                        <p className="font-semibold text-gray-900">{formatDate(request.donationDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-gray-500">Time</p>
                                        <p className="font-semibold text-gray-900">{request.donationTime}</p>
                                    </div>
                                </div>

                                <p className="mt-5 line-clamp-2 text-gray-700">{request.requestMessage}</p>

                                {request.donationStatus === 'inprogress' && request.donorName && (
                                    <div className="mt-5 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                                        Donor: <span className="font-semibold">{request.donorName}</span>
                                    </div>
                                )}

                                <div className="mt-5 flex flex-col justify-between gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">
                                    <p className="text-sm text-gray-500">Requested by {request.requesterName}</p>
                                    <Link
                                        to={`/donation-requests/${request._id}`}
                                        className="rounded-lg border border-red-200 px-4 py-2 text-center font-semibold text-red-700 hover:bg-red-50"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {pagination.pages > 1 && (
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        <button
                            onClick={() => fetchRequests(pagination.page - 1)}
                            disabled={pagination.page === 1 || loading}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>

                        {Array.from({ length: pagination.pages }, (_, index) => index + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => fetchRequests(page)}
                                disabled={loading}
                                className={`rounded-lg px-4 py-2 font-semibold ${
                                    page === pagination.page
                                        ? 'bg-red-600 text-white'
                                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => fetchRequests(pagination.page + 1)}
                            disabled={pagination.page === pagination.pages || loading}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DonationRequests
