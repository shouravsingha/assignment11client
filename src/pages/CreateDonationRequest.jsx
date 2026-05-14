import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

function CreateDonationRequest() {
    const navigate = useNavigate()
    const { mongoUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [formData, setFormData] = useState(initialFormData)

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
            setLoading(true)

            const response = await axiosInstance.post('/donation-requests', {
                recipientName: formData.recipientName.trim(),
                recipientDistrict: formData.recipientDistrict,
                recipientUpazila: formData.recipientUpazila,
                hospitalName: formData.hospitalName.trim(),
                fullAddress: formData.fullAddress.trim(),
                bloodGroup: formData.bloodGroup,
                donationDate: formData.donationDate,
                donationTime: formData.donationTime,
                requestMessage: formData.requestMessage.trim()
            })

            if (response.data.success) {
                showSuccess('Donation request created successfully. Redirecting...')

                window.setTimeout(() => {
                    navigate(`/donation-requests/${response.data.request._id}`)
                }, 1200)
            }
        } catch (err) {
            showError(err.response?.data?.message || err.message || 'Failed to create request')
        } finally {
            setLoading(false)
        }
    }

    if (mongoUser?.status === 'blocked') {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-12">
                <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 text-center shadow">
                    <h1 className="text-2xl font-bold text-gray-900">Account Blocked</h1>
                    <p className="mt-3 text-gray-600">Your account cannot create donation requests right now.</p>
                    <Link to="/donation-requests" className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700">
                        View Donation Requests
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">Create Donation Request</h1>
                    <p className="mt-2 text-gray-600">Share the recipient, hospital, date, and message donors need to respond quickly.</p>
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
                            placeholder="Enter recipient's full name"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Blood Group</label>
                        <select
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                            disabled={loading}
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
                            disabled={loading}
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
                            disabled={loading || !formData.recipientDistrict}
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
                            placeholder="Enter hospital name"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Full Address</label>
                        <input
                            type="text"
                            name="fullAddress"
                            value={formData.fullAddress}
                            onChange={handleInputChange}
                            placeholder="Street, ward, floor, room"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                            disabled={loading}
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
                            disabled={loading}
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
                            disabled={loading}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Request Message</label>
                        <textarea
                            name="requestMessage"
                            value={formData.requestMessage}
                            onChange={handleInputChange}
                            placeholder="Write a short message for potential donors"
                            rows="5"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                            disabled={loading}
                        />
                        <p className="mt-1 text-xs text-gray-500">{formData.requestMessage.length} characters</p>
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:bg-red-300"
                        >
                            {loading ? 'Creating Request...' : 'Create Donation Request'}
                        </button>
                        {error && (
                            <p className="mt-3 text-center text-sm font-medium text-red-700" role="alert">
                                {error}
                            </p>
                        )}
                    </div>
                </form>

                <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm text-blue-900">
                        <strong>Note:</strong> Your donation request will be visible to donors. When someone accepts it, their donor information will appear on the request.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CreateDonationRequest
