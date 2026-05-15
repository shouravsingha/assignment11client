import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import SearchDonors from './pages/SearchDonors'
import DashboardHome from './pages/DashboardHome'
import Profile from './pages/Profile'
import DonationRequests from './pages/DonationRequests'
import FundingPage from './pages/FundingPage'
import DonationRequestDetails from './pages/DonationRequestDetails'
import CreateDonationRequest from './pages/CreateDonationRequest'
import MyDonationRequests from './pages/MyDonationRequests'
import EditDonationRequest from './pages/EditDonationRequest'
import AllUsers from './pages/AllUsers'
import AllDonationRequests from './pages/AllDonationRequests'
import DashboardLayout from './components/DashboardLayout'
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
                            <Route path="/search-donors" element={<SearchDonors />} />
                            <Route path="/funding" element={<FundingPage />} />
                            <Route path="/donation-requests" element={<DonationRequests />} />
                            <Route path="/donation-requests/:id" element={<DonationRequestDetails />} />

                            {/* Dashboard Routes */}
                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <DashboardLayout />
                                </PrivateRoute>
                            }>
                                <Route index element={<DashboardHome />} />
                                <Route path="my-donation-requests" element={<MyDonationRequests />} />
                                <Route path="create-donation-request" element={<CreateDonationRequest />} />
                                <Route path="edit-donation-request/:id" element={<EditDonationRequest />} />
                                <Route path="all-users" element={<AllUsers />} />
                                <Route path="all-donation-requests" element={<AllDonationRequests />} />
                                <Route path="profile" element={<Profile />} />
                            </Route>
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App
