import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { useAuth } from '../hooks/useAuth'
import { Heart, Shield, LogIn, Mail, Lock, AlertCircle } from 'lucide-react'

function LoginPage() {
    const navigate = useNavigate()
    const { signIn, mongoUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validation
        if (!formData.email || !formData.password) {
            setError('Email and password are required')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address')
            return
        }

        try {
            setLoading(true)
            
            // Firebase Sign In
            await signIn(formData.email, formData.password)

            // Store remember me preference
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true')
                localStorage.setItem('rememberedEmail', formData.email)
            } else {
                localStorage.removeItem('rememberMe')
                localStorage.removeItem('rememberedEmail')
            }

            // Redirect will be handled by the effect or we can do it here if we wait for mongoUser
            // For now, let's navigate to dashboard, and AuthContext will ensure they are logged in
            navigate('/dashboard')
            
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.')
            console.error('Login error:', err)
        } finally {
            setLoading(false)
        }
    }

    // Load remembered email on mount
    const handleRememberChange = () => {
        setRememberMe(!rememberMe)
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center py-20 px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-red-50/50 -skew-x-12 transform origin-top-right -z-10"></div>
            
            <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-12 relative animate-slide-up">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-600 rounded-[2.5rem] -rotate-12 flex items-center justify-center text-white shadow-xl shadow-red-200 -z-10">
                    <Heart size={48} fill="currentColor" className="animate-pulse" />
                </div>

                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        <Shield size={14} /> System Access
                    </div>
                    <h2 className="text-4xl font-black text-gray-950 tracking-tighter">Welcome Back</h2>
                    <p className="text-gray-500 font-bold mt-2">Continue your life-saving journey.</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="john@example.com"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold premium-input"
                                disabled={loading}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Password</label>
                        <div className="relative">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold premium-input"
                                disabled={loading}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={handleRememberChange}
                                className="hidden"
                                disabled={loading}
                            />
                            <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-red-600 border-red-600' : 'border-gray-200 group-hover:border-red-600'}`}>
                                {rememberMe && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className="text-sm font-bold text-gray-500">Remember me</span>
                        </label>
                        <Link to="/" className="text-sm font-bold text-red-600 hover:text-red-700">Forgot Password?</Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-red-700 transition-all shadow-xl shadow-red-200 premium-button disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center gap-3"
                    >
                        {loading ? 'Verifying...' : <><LogIn size={24} /> Secure Login</>}
                    </button>
                </form>

                {/* Register Link */}
                <div className="mt-12 text-center border-t border-gray-50 pt-8">
                    <p className="text-gray-500 font-bold">New to BloodCare?{' '}
                        <Link to="/register" className="text-red-600 hover:text-red-700 font-black tracking-tight">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
