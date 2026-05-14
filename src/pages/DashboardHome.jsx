import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function DashboardHome() {
    const navigate = useNavigate()
    const { user, mongoUser } = useAuth()
    const displayName = mongoUser?.name || user?.displayName || 'Donor'

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <section className="mb-8 rounded-lg bg-gradient-to-r from-red-500 to-red-700 p-8 text-white">
                    <h1 className="mb-2 text-4xl font-bold">Welcome, {displayName}!</h1>
                    <p className="text-lg">Your Role: <span className="font-semibold uppercase">{mongoUser?.role || 'donor'}</span></p>
                    <p className="mt-2 text-red-100">Blood Group: <span className="text-xl font-semibold">{mongoUser?.bloodGroup || 'N/A'}</span></p>
                </section>

                <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow transition hover:shadow-lg">
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="mt-2 text-3xl font-bold text-gray-800">245</p>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow transition hover:shadow-lg">
                        <p className="text-sm text-gray-500">Donation Requests</p>
                        <p className="mt-2 text-3xl font-bold text-gray-800">38</p>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow transition hover:shadow-lg">
                        <p className="text-sm text-gray-500">Total Funding</p>
                        <p className="mt-2 text-3xl font-bold text-gray-800">BDT 125k</p>
                    </div>
                </section>

                <section className="rounded-lg bg-white p-8 shadow">
                    <h2 className="mb-6 text-2xl font-bold">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <button
                            onClick={() => navigate('/create-donation-request')}
                            className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
                        >
                            Create Donation Request
                        </button>
                        <button
                            onClick={() => navigate('/donation-requests')}
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            View Donation Requests
                        </button>
                        <button className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700">
                            Make a Funding Donation
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                        >
                            View Profile
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default DashboardHome
