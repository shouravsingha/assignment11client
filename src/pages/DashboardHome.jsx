import { useAuth } from '../hooks/useAuth'

function DashboardHome() {
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg p-8 mb-8">
                    <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}! 👋</h1>
                    <p className="text-lg">Your Role: <span className="font-semibold uppercase">{user?.role}</span></p>
                    <p className="text-red-100 mt-2">Blood Group: <span className="font-semibold text-xl">{user?.bloodGroup}</span></p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Users</p>
                                <p className="text-3xl font-bold text-gray-800">245</p>
                            </div>
                            <div className="text-4xl">👥</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Donation Requests</p>
                                <p className="text-3xl font-bold text-gray-800">38</p>
                            </div>
                            <div className="text-4xl">🩸</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Funding</p>
                                <p className="text-3xl font-bold text-gray-800">৳125k</p>
                            </div>
                            <div className="text-4xl">💰</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-8">
                    <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition">
                            ➕ Create Donation Request
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition">
                            📋 View My Requests
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition">
                            💰 Make a Funding Donation
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition">
                            👤 View Profile
                        </button>
                    </div>
                </div>

                {/* Coming Soon Notice */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <p className="text-yellow-800 font-semibold">
                        ⚠️ More dashboard features coming soon! This is Phase 2 of the implementation.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome
