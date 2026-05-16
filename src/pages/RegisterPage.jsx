import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { bangladeshData, bloodGroups } from '../utils/constants'
import { useAuth } from '../hooks/useAuth'
import { uploadImage } from '../utils/imageUpload'
import { Heart, Shield, CheckCircle, AlertCircle } from 'lucide-react'

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
        <div className="min-h-screen bg-white flex items-center justify-center py-20 px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-red-50/50 -skew-x-12 transform origin-top-right -z-10"></div>
            
            <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-12 relative animate-slide-up">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600 rounded-[2.5rem] rotate-12 flex items-center justify-center text-white shadow-xl shadow-red-200 -z-10">
                    <Heart size={48} fill="currentColor" className="animate-pulse" />
                </div>

                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        <Shield size={14} /> Secure Registration
                    </div>
                    <h2 className="text-4xl font-black text-gray-950 tracking-tighter">Join BloodCare</h2>
                    <p className="text-gray-500 font-bold mt-2">Become a life-saver in just a few steps.</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                {success && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
                        <CheckCircle size={20} /> {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold premium-input"
                                disabled={loading}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="john@example.com"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold premium-input"
                                disabled={loading}
                            />
                        </div>

                        {/* Blood Group */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Blood Group</label>
                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold premium-input"
                                disabled={loading}
                            >
                                <option value="">Select Group</option>
                                {bloodGroups.map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>

                        {/* Avatar Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Profile Picture</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
                                    disabled={loading || uploading}
                                />
                                {uploading && <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[10px] font-black text-red-600 animate-pulse uppercase tracking-widest">Uploading...</div>}
                            </div>
                        </div>

                        {/* District */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">District</label>
                            <select
                                value={selectedDistrict}
                                onChange={handleDistrictChange}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold premium-input"
                                disabled={loading}
                            >
                                <option value="">Select District</option>
                                {bangladeshData.districts.map(district => (
                                    <option key={district.id} value={district.id}>{district.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Upazila */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Upazila</label>
                            <select
                                name="upazila"
                                value={formData.upazila}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold premium-input disabled:opacity-50"
                                disabled={loading || !selectedDistrict}
                            >
                                <option value="">Select Upazila</option>
                                {getUpazilas().map(upazila => (
                                    <option key={upazila} value={upazila}>{upazila}</option>
                                ))}
                            </select>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold premium-input"
                                disabled={loading}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold premium-input"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full bg-red-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-red-700 transition-all shadow-xl shadow-red-200 premium-button disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center gap-3"
                    >
                        {loading ? 'Creating Account...' : <><CheckCircle size={24} /> Register as Donor</>}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-12 text-center border-t border-gray-50 pt-8">
                    <p className="text-gray-500 font-bold">Already part of the community?{' '}
                        <Link to="/login" className="text-red-600 hover:text-red-700 font-black tracking-tight">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
