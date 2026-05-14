import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { useAuth } from '../hooks/useAuth'

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">🩸 Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Login to your Blood Donation account</p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={handleRememberChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            disabled={loading}
                        />
                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition duration-200"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Register here
                        </Link>
                    </p>
                </div>

                {/* Demo Credentials */}
                <div className="mt-8 p-4 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm text-gray-600 text-center font-semibold">Demo Credentials</p>
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Email: test@example.com<br />
                        Password: testpass123
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
