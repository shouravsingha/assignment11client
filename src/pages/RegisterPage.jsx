import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { bangladeshData, bloodGroups } from '../utils/constants'
import { useAuth } from '../hooks/useAuth'
import { uploadImage } from '../utils/imageUpload'

function RegisterPage() {
    const navigate = useNavigate()
    const { createUser, updateUserProfile } = useAuth()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: '',
        bloodGroup: '',
        district: '',
        upazila: ''
    })

    const [selectedDistrict, setSelectedDistrict] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setError('')
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            setUploading(true)
            setError('')
            const imageUrl = await uploadImage(file)
            setFormData(prev => ({ ...prev, avatar: imageUrl }))
        } catch (err) {
            setError('Image upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const handleDistrictChange = (e) => {
        const districtId = e.target.value
        setSelectedDistrict(districtId)
        setFormData(prev => ({
            ...prev,
            district: districtId,
            upazila: ''
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword ||
            !formData.bloodGroup || !formData.district || !formData.upazila) {
            setError('All fields are required')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address')
            return
        }

        try {
            setLoading(true)

            // 1. Create user in Firebase
            const userCredential = await createUser(formData.email, formData.password)
            const firebaseUid = userCredential.user.uid

            // 2. Update Firebase profile
            await updateUserProfile(formData.name, formData.avatar || 'https://i.ibb.co/default-avatar.png')

            // 3. Sync with MongoDB (include Firebase UID)
            const response = await axiosInstance.post('/auth/register', {
                firebaseUid: firebaseUid,
                name: formData.name,
                email: formData.email,
                avatar: formData.avatar || 'https://i.ibb.co/default-avatar.png',
                bloodGroup: formData.bloodGroup,
                district: formData.district,
                upazila: formData.upazila
            })

            if (response.data.success) {
                setSuccess('Registration successful! Redirecting...')

                // Redirect after 1.5 seconds
                setTimeout(() => {
                    navigate('/dashboard')
                }, 1500)
            }
        } catch (err) {
            setError(err.message || err.response?.data?.message || 'Registration failed. Please try again.')
            console.error('Registration error:', err)
        } finally {
            setLoading(false)
        }
    }

    const getUpazilas = () => {
        if (!selectedDistrict) return []
        const districtData = bangladeshData.districts.find(d => d.id === parseInt(selectedDistrict))
        if (!districtData) return []
        return bangladeshData.upazilas[selectedDistrict] || []
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">🩸 Join Us</h2>
                    <p className="text-gray-600 mt-2">Create an account to start donating blood</p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Avatar Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading || uploading}
                        />
                        {uploading && <p className="text-xs text-blue-600 mt-1">Uploading image...</p>}
                        {formData.avatar && !uploading && <p className="text-xs text-green-600 mt-1">Image uploaded successfully!</p>}
                    </div>

                    {/* Blood Group */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                        <select
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                        <select
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upazila</label>
                        <select
                            name="upazila"
                            value={formData.upazila}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading || !selectedDistrict}
                        >
                            <option value="">Select Upazila</option>
                            {getUpazilas().map(upazila => (
                                <option key={upazila} value={upazila}>{upazila}</option>
                            ))}
                        </select>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter password (min 6 characters)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 rounded-lg transition duration-200"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">Already have an account?{' '}
                        <Link to="/login" className="text-red-600 hover:text-red-700 font-semibold">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
