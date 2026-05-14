import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardHome from './pages/DashboardHome'
import Profile from './pages/Profile'
import DonationRequests from './pages/DonationRequests'
import DonationRequestDetails from './pages/DonationRequestDetails'
import CreateDonationRequest from './pages/CreateDonationRequest'
import { AuthProvider } from './contexts/AuthContext'

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/donation-requests" element={<DonationRequests />} />
                            <Route path="/donation-requests/:id" element={<DonationRequestDetails />} />

                            {/* Protected Routes */}
                            <Route path="/create-donation-request" element={
                                <PrivateRoute>
                                    <CreateDonationRequest />
                                </PrivateRoute>
                            } />
                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <DashboardHome />
                                </PrivateRoute>
                            } />
                            <Route path="/profile" element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            } />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App
