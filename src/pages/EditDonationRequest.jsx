import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { bangladeshData, bloodGroups, getUpazilasByDistrict } from '../utils/constants'
import { useAuth } from '../hooks/useAuth'

const initialFormData = {
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

function EditDonationRequest() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { mongoUser } = useAuth()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [formData, setFormData] = useState(initialFormData)

    useEffect(() => {
        const fetchRequestDetails = async () => {
            try {
                const response = await axiosInstance.get(`/donation-requests/${id}`)
                if (response.data.success) {
                    const request = response.data.request
                    
                    // Verify ownership or admin role
                    if (request.requesterEmail !== mongoUser?.email && mongoUser?.role !== 'admin') {
                        setError('You do not have permission to edit this request')
                        setLoading(false)
                        return
                    }

                    if (request.donationStatus !== 'pending' && mongoUser?.role !== 'admin') {
                        setError('Only pending requests can be edited')
                        setLoading(false)
                        return
                    }

                    setFormData({
                        recipientName: request.recipientName,
                        recipientDistrict: request.recipientDistrict,
                        recipientUpazila: request.recipientUpazila,
                        hospitalName: request.hospitalName,
                        fullAddress: request.fullAddress,
                        bloodGroup: request.bloodGroup,
                        donationDate: new Date(request.donationDate).toISOString().split('T')[0],
                        donationTime: request.donationTime,
                        requestMessage: request.requestMessage
                    })
                }
            } catch (err) {
                setError('Failed to fetch request details')
            } finally {
                setLoading(false)
            }
        }

        if (id && mongoUser) {
            fetchRequestDetails()
        }
    }, [id, mongoUser])

    const showError = (message) => {
        setError(message)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const showSuccess = (message) => {
        setSuccess(message)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

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

    const getUpazilas = () => {
        return getUpazilasByDistrict(formData.recipientDistrict)
    }

    const validateForm = () => {
        const hasEmptyField = Object.values(formData).some((value) => {
            return String(value).trim() === ''
        })

        if (hasEmptyField) {
            return 'All fields are required'
        }

        const selectedDate = new Date(formData.donationDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (selectedDate < today) {
            return 'Donation date cannot be in the past'
        }

        if (formData.requestMessage.trim().length < 10) {
            return 'Message must be at least 10 characters long'
        }

        return ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        const validationError = validateForm()

        if (validationError) {
            showError(validationError)
            return
        }

        try {
            setSubmitting(true)

            const response = await axiosInstance.put(`/donation-requests/${id}`, {
                ...formData,
                recipientName: formData.recipientName.trim(),
                hospitalName: formData.hospitalName.trim(),
                fullAddress: formData.fullAddress.trim(),
                requestMessage: formData.requestMessage.trim()
            })

            if (response.data.success) {
                showSuccess('Donation request updated successfully. Redirecting...')

                window.setTimeout(() => {
                    navigate('/dashboard/my-donation-requests')
                }, 1200)
            }
        } catch (err) {
            showError(err.response?.data?.message || err.message || 'Failed to update request')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        )
    }

    if (error && !formData.recipientName) {
        return (
            <div className="bg-red-50 p-8 rounded-xl text-center">
                <p className="text-red-700 font-bold mb-4">{error}</p>
                <Link to="/dashboard/my-donation-requests" className="text-red-600 underline">Back to My Requests</Link>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Edit Donation Request</h1>
                <p className="text-gray-500">Update the details of your donation request</p>
            </div>

            {error && (
                <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700" role="alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 rounded-lg border border-green-300 bg-green-50 p-4 text-green-700" role="status">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Recipient Name</label>
                    <input
                        type="text"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                        disabled={submitting}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Blood Group</label>
                    <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                        disabled={submitting}
                    >
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
                        disabled={submitting}
                    >
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
                        disabled={submitting || !formData.recipientDistrict}
                    >
                        <option value="">Select Upazila</option>
                        {getUpazilas().map((upazila) => (
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
                        disabled={submitting}
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
                        disabled={submitting}
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
                        disabled={submitting}
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
                        disabled={submitting}
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
                        disabled={submitting}
                    />
                </div>

                <div className="md:col-span-2 flex gap-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:bg-red-300"
                    >
                        {submitting ? 'Updating...' : 'Update Request'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/my-donation-requests')}
                        className="px-8 rounded-lg border border-gray-300 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditDonationRequest
