import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function HomePage() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    return (
        <div>
            {/* Banner Section */}
            <section className="bg-gradient-to-r from-red-500 to-red-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Save Lives Through Blood Donation
                    </h1>
                    <p className="text-xl mb-8">
                        Join our community of donors and help those in need
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <button
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                            className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            {isAuthenticated ? '📊 Go to Dashboard' : '✍️ Join as a Donor'}
                        </button>
                        <button
                            onClick={() => navigate('/donation-requests')}
                            className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition"
                        >
                            View Donation Requests
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Donate Blood?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
                            <div className="text-4xl mb-4">❤️</div>
                            <h3 className="text-xl font-semibold mb-2">Save Lives</h3>
                            <p className="text-gray-600">Your donation can save up to 3 lives.</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
                            <div className="text-4xl mb-4">⏱️</div>
                            <h3 className="text-xl font-semibold mb-2">Quick Process</h3>
                            <p className="text-gray-600">Donate in just 10-15 minutes.</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
                            <div className="text-4xl mb-4">🏥</div>
                            <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                            <p className="text-gray-600">All donations are screened and tested.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-12">Ready to Help?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div 
                            onClick={() => navigate('/search-donors')}
                            className="bg-red-50 p-8 rounded-2xl border-2 border-red-100 cursor-pointer hover:bg-red-100 transition group"
                        >
                            <div className="text-5xl mb-4 group-hover:scale-110 transition">🔍</div>
                            <h3 className="text-2xl font-bold text-red-700 mb-2">Search Donors</h3>
                            <p className="text-red-600/80 mb-6">Find blood donors in your area and contact them directly.</p>
                            <span className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold">Start Searching</span>
                        </div>
                        <div 
                            onClick={() => navigate('/donation-requests')}
                            className="bg-red-50 p-8 rounded-2xl border-2 border-red-100 cursor-pointer hover:bg-red-100 transition group"
                        >
                            <div className="text-5xl mb-4 group-hover:scale-110 transition">🩸</div>
                            <h3 className="text-2xl font-bold text-red-700 mb-2">Active Requests</h3>
                            <p className="text-red-600/80 mb-6">View all current blood donation requests and volunteer today.</p>
                            <span className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold">View Requests</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <form className="bg-white p-8 rounded-lg shadow">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                            />
                            <textarea
                                placeholder="Your Message"
                                rows="4"
                                className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                            ></textarea>
                            <button className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition">
                                Send Message
                            </button>
                        </form>
                        <div className="flex flex-col justify-center">
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-2">📞 Call Us</h3>
                                <p className="text-gray-600">+880 1234-567890</p>
                            </div>
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-2">✉️ Email Us</h3>
                                <p className="text-gray-600">info@blooddonation.com</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">📍 Visit Us</h3>
                                <p className="text-gray-600">Dhaka Medical College Hospital, Dhaka</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage
