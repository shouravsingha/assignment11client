import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { bangladeshData, bloodGroups } from '../utils/constants'
import { useAuth } from '../hooks/useAuth'

function CreateDonationRequest() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        recipientName: '',
        recipientDistrict: '',
        recipientUpazila: '',
        hospitalName: '',
        fullAddress: '',
        bloodGroup: '',
        donationDate: '',
        donationTime: '',
        requestMessage: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setError('')
    }

    const handleDistrictChange = (e) => {
        const districtId = e.target.value
        setFormData(prev => ({
            ...prev,
            recipientDistrict: districtId,
            recipientUpazila: ''
        }))
    }

    const getUpazilas = () => {
        if (!formData.recipientDistrict) return []
        return bangladeshData.upazilas[formData.recipientDistrict] || []
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        // Validation
        if (!formData.recipientName || !formData.recipientDistrict || !formData.recipientUpazila ||
            !formData.hospitalName || !formData.fullAddress || !formData.bloodGroup ||
            !formData.donationDate || !formData.donationTime || !formData.requestMessage) {
            setError('All fields are required')
            return
        }

        // Validate donation date is in future
        const selectedDate = new Date(formData.donationDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (selectedDate < today) {
            setError('Donation date must be in the future')
            return
        }

        // Validate message length
        if (formData.requestMessage.length < 10) {
            setError('Message must be at least 10 characters long')
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
                setSuccess('Donation request created successfully! Redirecting...')
                
                setTimeout(() => {
                    navigate('/donation-requests')
                }, 1500)
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to create request'
            setError(errorMsg)
            console.error('Create request error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">🩸 Create Donation Request</h1>
                    <p className="text-gray-600 mt-2">Help save lives by creating a blood donation request</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Recipient Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name *</label>
                        <input
                            type="text"
                            name="recipientName"
                            value={formData.recipientName}
                            onChange={handleInputChange}
                            placeholder="Enter recipient's full name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Blood Group */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group *</label>
                        <select
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading}
                        >
                            <option value="">Select Blood Group</option>
                            {bloodGroups.map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                    </div>

                    {/* District */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                        <select
                            name="recipientDistrict"
                            value={formData.recipientDistrict}
                            onChange={handleDistrictChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading}
                        >
                            <option value="">Select District</option>
                            {bangladeshData.districts.map(district => (
                                <option key={district.id} value={district.id}>{district.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Upazila */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upazila *</label>
                        <select
                            name="recipientUpazila"
                            value={formData.recipientUpazila}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading || !formData.recipientDistrict}
                        >
                            <option value="">Select Upazila</option>
                            {getUpazilas().map(upazila => (
                                <option key={upazila} value={upazila}>{upazila}</option>
                            ))}
                        </select>
                    </div>

                    {/* Hospital Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name *</label>
                        <input
                            type="text"
                            name="hospitalName"
                            value={formData.hospitalName}
                            onChange={handleInputChange}
                            placeholder="Enter hospital name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Full Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                        <textarea
                            name="fullAddress"
                            value={formData.fullAddress}
                            onChange={handleInputChange}
                            placeholder="Enter full hospital address including street, ward, etc."
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Donation Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Donation Date *</label>
                        <input
                            type="date"
                            name="donationDate"
                            value={formData.donationDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Donation Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Donation Time *</label>
                        <input
                            type="time"
                            name="donationTime"
                            value={formData.donationTime}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Request Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Request Message *</label>
                        <textarea
                            name="requestMessage"
                            value={formData.requestMessage}
                            onChange={handleInputChange}
                            placeholder="Write a message for potential donors (at least 10 characters)"
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">{formData.requestMessage.length} characters</p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 rounded-lg transition duration-200"
                    >
                        {loading ? 'Creating Request...' : 'Create Donation Request'}
                    </button>
                </form>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                        <strong>ℹ️ Note:</strong> Your donation request will be visible to all registered donors in your area. Donors can reach out to you once you create this request.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CreateDonationRequest
