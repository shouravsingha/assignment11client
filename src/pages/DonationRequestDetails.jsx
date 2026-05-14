import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import {
    bangladeshData,
    bloodGroups,
    donationStatuses,
    getDistrictName,
    getUpazilasByDistrict
} from '../utils/constants'
import { useAuth } from '../hooks/useAuth'

const emptyForm = {
    recipientName: '',
    recipientDistrict: '',
    recipientUpazila: '',
    hospitalName: '',
    fullAddress: '',
    bloodGroup: '',
    donationDate: '',
    donationTime: '',
    requestMessage: ''
}

function DonationRequestDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated, mongoUser, user } = useAuth()
    const [request, setRequest] = useState(null)
    const [formData, setFormData] = useState(emptyForm)
    const [donorName, setDonorName] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [showDonateModal, setShowDonateModal] = useState(false)

    const showError = (message) => {
        setError(message)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const showNotice = (message) => {
        setNotice(message)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const currentEmail = mongoUser?.email || user?.email
    const isOwner = request?.requesterEmail === currentEmail
    const isAdmin = mongoUser?.role === 'admin'
    const isVolunteer = mongoUser?.role === 'volunteer'
    const canEdit = isOwner || isAdmin
    const canManageStatus = isOwner || isAdmin || isVolunteer
    const canDonate = isAuthenticated && request?.donationStatus === 'pending' && !isOwner && mongoUser?.status !== 'blocked'

    const upazilas = useMemo(() => {
        return getUpazilasByDistrict(formData.recipientDistrict)
    }, [formData.recipientDistrict])

    const hydrateForm = (requestData) => {
        setFormData({
            recipientName: requestData.recipientName || '',
            recipientDistrict: requestData.recipientDistrict || '',
            recipientUpazila: requestData.recipientUpazila || '',
            hospitalName: requestData.hospitalName || '',
            fullAddress: requestData.fullAddress || '',
            bloodGroup: requestData.bloodGroup || '',
            donationDate: requestData.donationDate ? requestData.donationDate.slice(0, 10) : '',
            donationTime: requestData.donationTime || '',
            requestMessage: requestData.requestMessage || ''
        })
    }

    const fetchRequest = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await axiosInstance.get(`/donation-requests/${id}`)

            if (response.data.success) {
                setRequest(response.data.request)
                hydrateForm(response.data.request)
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load donation request')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRequest()
    }, [id])

    useEffect(() => {
        if (mongoUser?.name) {
            setDonorName(mongoUser.name)
        }
    }, [mongoUser])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
        setError('')
    }

    const handleDistrictChange = (e) => {
        const districtId = e.target.value
        setFormData((prev) => ({
            ...prev,
            recipientDistrict: districtId,
            recipientUpazila: ''
        }))
    }

    const validateForm = () => {
        const hasEmptyField = Object.values(formData).some((value) => {
            return String(value).trim() === ''
        })

        if (hasEmptyField) {
            return 'All request fields are required'
        }

        const selectedDate = new Date(formData.donationDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (selectedDate < today) {
            return 'Donation date cannot be in the past'
        }

        if (formData.requestMessage.trim().length < 10) {
            return 'Request message must be at least 10 characters long'
        }

        return ''
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setError('')
        setNotice('')

        const validationError = validateForm()

        if (validationError) {
            showError(validationError)
            return
        }

        try {
            setSaving(true)
            const response = await axiosInstance.put(`/donation-requests/${id}`, {
                ...formData,
                recipientName: formData.recipientName.trim(),
                hospitalName: formData.hospitalName.trim(),
                fullAddress: formData.fullAddress.trim(),
                requestMessage: formData.requestMessage.trim()
            })

            if (response.data.success) {
                setRequest(response.data.request)
                hydrateForm(response.data.request)
                setIsEditing(false)
                showNotice('Donation request updated successfully.')
            }
        } catch (err) {
            showError(err.response?.data?.message || err.message || 'Failed to update donation request')
        } finally {
            setSaving(false)
        }
    }

    const handleStatusChange = async (e) => {
        const donationStatus = e.target.value
        setError('')
        setNotice('')

        try {
            setSaving(true)
            const response = await axiosInstance.patch(`/donation-requests/${id}/status`, {
                donationStatus,
                donorName: request?.donorName,
                donorEmail: request?.donorEmail
            })

            if (response.data.success) {
                setRequest(response.data.request)
                hydrateForm(response.data.request)
                showNotice('Donation status updated successfully.')
            }
        } catch (err) {
            showError(err.response?.data?.message || err.message || 'Failed to update status')
        } finally {
            setSaving(false)
        }
    }

    const handleDonate = async (e) => {
        e.preventDefault()
        setError('')
        setNotice('')

        if (!donorName.trim()) {
            showError('Please provide your donor name')
            return
        }

        try {
            setSaving(true)
            const response = await axiosInstance.post(`/donation-requests/${id}/donate`, {
                donorName: donorName.trim()
            })

            if (response.data.success) {
                setRequest(response.data.request)
                hydrateForm(response.data.request)
                setShowDonateModal(false)
                showNotice('Thank you. The request is now marked as in progress.')
            }
        } catch (err) {
            showError(err.response?.data?.message || err.message || 'Failed to accept donation request')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        const shouldDelete = window.confirm('Delete this donation request? This action cannot be undone.')

        if (!shouldDelete) {
            return
        }

        try {
            setSaving(true)
            await axiosInstance.delete(`/donation-requests/${id}`)
            navigate('/donation-requests')
        } catch (err) {
            showError(err.response?.data?.message || err.message || 'Failed to delete donation request')
        } finally {
            setSaving(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'inprogress':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'done':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'canceled':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getStatusLabel = (status) => {
        return donationStatuses.find((item) => item.value === status)?.label || status
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-12">
                <div className="mx-auto max-w-5xl text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-red-600"></div>
                    <p className="mt-4 text-gray-600">Loading donation request...</p>
                </div>
            </div>
        )
    }

    if (!request) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-12">
                <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 text-center shadow">
                    <h1 className="text-2xl font-bold text-gray-900">Donation request not found</h1>
                    <Link to="/donation-requests" className="mt-4 inline-block rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700">
                        Back to Requests
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <Link to="/donation-requests" className="text-sm font-semibold text-red-600 hover:text-red-700">
                            Back to donation requests
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold text-gray-950 md:text-4xl">{request.recipientName}</h1>
                        <p className="mt-1 text-gray-600">{request.hospitalName}</p>
                    </div>
                    <span className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-bold ${getStatusBadgeColor(request.donationStatus)}`}>
                        {getStatusLabel(request.donationStatus)}
                    </span>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700" role="alert">
                        {error}
                    </div>
                )}

                {notice && (
                    <div className="mb-6 rounded-lg border border-green-300 bg-green-50 p-4 text-green-700" role="status">
                        {notice}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
                    <section className="rounded-lg bg-white p-6 shadow">
                        {!isEditing ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs font-semibold uppercase text-gray-500">Blood Group</p>
                                        <p className="mt-1 text-2xl font-bold text-red-600">{request.bloodGroup}</p>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs font-semibold uppercase text-gray-500">Date</p>
                                        <p className="mt-1 font-bold text-gray-900">{formatDate(request.donationDate)}</p>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs font-semibold uppercase text-gray-500">Time</p>
                                        <p className="mt-1 font-bold text-gray-900">{request.donationTime}</p>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-xs font-semibold uppercase text-gray-500">Location</p>
                                        <p className="mt-1 font-bold text-gray-900">{getDistrictName(request.recipientDistrict)}</p>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Request Message</h2>
                                    <p className="mt-3 whitespace-pre-line text-gray-700">{request.requestMessage}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900">Hospital Address</h3>
                                        <p className="mt-2 text-gray-700">{request.fullAddress}</p>
                                        <p className="mt-1 text-gray-600">
                                            {request.recipientUpazila}, {getDistrictName(request.recipientDistrict)}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Requester</h3>
                                        <p className="mt-2 text-gray-700">{request.requesterName}</p>
                                        <p className="text-gray-600">{request.requesterEmail}</p>
                                    </div>
                                </div>

                                {request.donationStatus === 'inprogress' && request.donorName && (
                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                        <h3 className="font-bold text-blue-950">Donor Information</h3>
                                        <p className="mt-2 text-blue-900">{request.donorName}</p>
                                        <p className="text-blue-800">{request.donorEmail}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Recipient Name</label>
                                    <input
                                        type="text"
                                        name="recipientName"
                                        value={formData.recipientName}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Blood Group</label>
                                    <select
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                                        disabled={saving}
                                    >
                                        <option value="">Select Blood Group</option>
                                        {bloodGroups.map((bloodGroup) => (
                                            <option key={bloodGroup} value={bloodGroup}>{bloodGroup}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">District</label>
                                    <select
                                        name="recipientDistrict"
                                        value={formData.recipientDistrict}
                                        onChange={handleDistrictChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                                        disabled={saving}
                                    >
                                        <option value="">Select District</option>
                                        {bangladeshData.districts.map((district) => (
                                            <option key={district.id} value={district.id}>{district.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Upazila</label>
                                    <select
                                        name="recipientUpazila"
                                        value={formData.recipientUpazila}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                                        disabled={saving || !formData.recipientDistrict}
                                    >
                                        <option value="">Select Upazila</option>
                                        {upazilas.map((upazila) => (
                                            <option key={upazila} value={upazila}>{upazila}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Hospital Name</label>
                                    <input
                                        type="text"
                                        name="hospitalName"
                                        value={formData.hospitalName}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Full Address</label>
                                    <input
                                        type="text"
                                        name="fullAddress"
                                        value={formData.fullAddress}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Donation Date</label>
                                    <input
                                        type="date"
                                        name="donationDate"
                                        value={formData.donationDate}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().slice(0, 10)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Donation Time</label>
                                    <input
                                        type="time"
                                        name="donationTime"
                                        value={formData.donationTime}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                                        disabled={saving}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Request Message</label>
                                    <textarea
                                        name="requestMessage"
                                        value={formData.requestMessage}
                                        onChange={handleInputChange}
                                        rows="5"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                                        disabled={saving}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">{formData.requestMessage.length} characters</p>
                                </div>

                                <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:bg-red-300"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            hydrateForm(request)
                                            setIsEditing(false)
                                            setError('')
                                        }}
                                        disabled={saving}
                                        className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {error && (
                                    <p className="md:col-span-2 text-sm font-medium text-red-700" role="alert">
                                        {error}
                                    </p>
                                )}
                            </form>
                        )}
                    </section>

                    <aside className="space-y-4">
                        <div className="rounded-lg bg-white p-5 shadow">
                            <h2 className="text-lg font-bold text-gray-900">Actions</h2>

                            {canDonate && (
                                <button
                                    onClick={() => setShowDonateModal(true)}
                                    disabled={saving}
                                    className="mt-4 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:bg-red-300"
                                >
                                    Donate Blood
                                </button>
                            )}

                            {!isAuthenticated && request.donationStatus === 'pending' && (
                                <Link
                                    to="/login"
                                    className="mt-4 block w-full rounded-lg bg-red-600 px-4 py-3 text-center font-semibold text-white hover:bg-red-700"
                                >
                                    Login to Donate
                                </Link>
                            )}

                            {isOwner && request.donationStatus === 'pending' && (
                                <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                                    This is your request. Other donors can accept it from this page.
                                </p>
                            )}

                            {canEdit && !isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    disabled={saving}
                                    className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Edit Request
                                </button>
                            )}

                            {canEdit && (
                                <button
                                    onClick={handleDelete}
                                    disabled={saving || request.donationStatus === 'done'}
                                    className="mt-3 w-full rounded-lg border border-red-300 px-4 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Delete Request
                                </button>
                            )}
                        </div>

                        {canManageStatus && (
                            <div className="rounded-lg bg-white p-5 shadow">
                                <h2 className="text-lg font-bold text-gray-900">Manage Status</h2>
                                <label className="mt-4 block text-sm font-medium text-gray-700">Donation Status</label>
                                <select
                                    value={request.donationStatus}
                                    onChange={handleStatusChange}
                                    disabled={saving}
                                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    {donationStatuses.map((status) => (
                                        <option
                                            key={status.value}
                                            value={status.value}
                                            disabled={status.value === 'inprogress' && !request.donorName}
                                        >
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-3 text-xs text-gray-500">
                                    A pending request becomes in progress when a donor accepts it.
                                </p>
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            {showDonateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Confirm Donation</h2>
                                <p className="mt-1 text-sm text-gray-600">Your contact email will be shared with the requester.</p>
                            </div>
                            <button
                                onClick={() => setShowDonateModal(false)}
                                className="rounded-full px-3 py-1 text-xl text-gray-500 hover:bg-gray-100"
                                aria-label="Close donate modal"
                            >
                                x
                            </button>
                        </div>

                        <form onSubmit={handleDonate} className="mt-5 space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Donor Name</label>
                                <input
                                    type="text"
                                    value={donorName}
                                    onChange={(event) => setDonorName(event.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                                    disabled={saving}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Donor Email</label>
                                <input
                                    type="email"
                                    value={mongoUser?.email || user?.email || ''}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-600"
                                    disabled
                                />
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:bg-red-300"
                                >
                                    {saving ? 'Confirming...' : 'Confirm Donation'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDonateModal(false)}
                                    disabled={saving}
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DonationRequestDetails
