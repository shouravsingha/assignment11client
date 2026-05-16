import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Search, Heart, Shield, Clock, Phone, Mail, MapPin, ArrowRight } from 'lucide-react'

function HomePage() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-20 bg-[#fcfcfc]">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-red-50/50 -skew-x-12 transform origin-top-right -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-slide-up">
                        <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-sm border border-red-100">
                            <Heart size={14} className="animate-pulse fill-current" /> Every Drop Counts
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-gray-950 leading-[1.1] tracking-tighter">
                            Saving Lives <br />
                            <span className="text-red-600">Simplified.</span>
                        </h1>
                        <p className="text-xl text-gray-600 font-medium max-w-lg leading-relaxed">
                            Join BloodCare, the most advanced platform connecting voluntary blood donors with patients in real-time. Fast, secure, and life-saving.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                                className="bg-red-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 premium-button flex items-center justify-center gap-2"
                            >
                                {isAuthenticated ? 'Go to Dashboard' : 'Join as a Donor'} <ArrowRight size={20} />
                            </button>
                            <button
                                onClick={() => navigate('/donation-requests')}
                                className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-[2rem] font-black text-lg hover:border-red-600 hover:text-red-600 transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                Active Requests <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-lg text-xs ml-1">Live</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-6 pt-8 border-t border-gray-100 max-w-md">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-4 border-white shadow-sm" alt="User" />
                                ))}
                                <div className="w-12 h-12 rounded-full bg-red-600 border-4 border-white shadow-sm flex items-center justify-center text-white text-xs font-black">+2k</div>
                            </div>
                            <p className="text-sm font-bold text-gray-500">Already saved <span className="text-gray-900">2,400+</span> lives this month</p>
                        </div>
                    </div>

                    <div className="relative lg:block hidden animate-fade-in animate-delay-300">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-red-100/30 rounded-full blur-[100px] -z-10"></div>
                        <div className="grid grid-cols-2 gap-6 relative">
                            <div className="space-y-6 pt-12">
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 animate-float">
                                    <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-4">
                                        <Heart size={28} fill="currentColor" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2">Save Lives</h3>
                                    <p className="text-gray-500 font-bold text-sm">Your single donation can save up to 3 lives.</p>
                                </div>
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 animate-float" style={{ animationDelay: '1.5s' }}>
                                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                                        <Clock size={28} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2">Fast Response</h3>
                                    <p className="text-gray-500 font-bold text-sm">Get notified instantly when someone nearby needs help.</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 animate-float" style={{ animationDelay: '0.7s' }}>
                                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                                        <Shield size={28} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2">Verified Donors</h3>
                                    <p className="text-gray-500 font-bold text-sm">All our donors are screened and verified for safety.</p>
                                </div>
                                <div className="bg-red-600 p-8 rounded-[2.5rem] shadow-2xl shadow-red-200 text-white animate-float" style={{ animationDelay: '2.2s' }}>
                                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-4">
                                        <Search size={28} />
                                    </div>
                                    <h3 className="text-xl font-black mb-2 tracking-tight">Smart Search</h3>
                                    <p className="text-red-100 font-bold text-sm">Find donors by blood group, district, and upazila.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Section (Why Donate) */}
            <section className="py-32 relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tighter">Why Donate Blood?</h2>
                        <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full"></div>
                        <p className="text-gray-500 font-bold text-lg max-w-2xl mx-auto pt-2">Regular blood donation not only saves lives but also has significant health benefits for the donor.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-gray-50 p-12 rounded-[3rem] group hover:bg-red-600 transition-all duration-500 transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-red-600 shadow-xl mb-8 group-hover:rotate-12 transition-all">
                                <Heart size={36} fill="currentColor" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-white transition-colors">Heart Health</h3>
                            <p className="text-gray-500 font-medium group-hover:text-red-100 transition-colors">Donating blood reduces the risk of heart disease by maintaining healthy iron levels.</p>
                        </div>
                        <div className="bg-gray-50 p-12 rounded-[3rem] group hover:bg-red-600 transition-all duration-500 transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-red-600 shadow-xl mb-8 group-hover:rotate-12 transition-all">
                                <Shield size={36} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-white transition-colors">Free Health Check</h3>
                            <p className="text-gray-500 font-medium group-hover:text-red-100 transition-colors">Get a mini-physical with every donation, including BP and pulse checks.</p>
                        </div>
                        <div className="bg-gray-50 p-12 rounded-[3rem] group hover:bg-red-600 transition-all duration-500 transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-red-600 shadow-xl mb-8 group-hover:rotate-12 transition-all">
                                <Clock size={36} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-white transition-colors">Burn Calories</h3>
                            <p className="text-gray-500 font-medium group-hover:text-red-100 transition-colors">Did you know? One donation burns about 650 calories. It's good for your body!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions Section */}
            <section className="py-24 bg-red-600 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
                
                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">Ready to Save a Life?</h2>
                    <p className="text-red-100 font-bold text-xl mb-12 max-w-2xl mx-auto">Choose an action below to get started. Whether you're looking for help or want to provide it, we're here for you.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div 
                            onClick={() => navigate('/search-donors')}
                            className="bg-white p-10 rounded-[3rem] cursor-pointer hover:shadow-2xl transition-all group transform hover:-translate-y-2 active:scale-95"
                        >
                            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Search size={40} />
                            </div>
                            <h3 className="text-3xl font-black text-gray-950 mb-3">Find Donors</h3>
                            <p className="text-gray-500 font-bold mb-8">Search our verified database of life-savers in your local area.</p>
                            <span className="bg-red-600 text-white px-8 py-3.5 rounded-2xl font-black inline-block shadow-lg shadow-red-200">Start Searching</span>
                        </div>
                        <div 
                            onClick={() => navigate('/donation-requests')}
                            className="bg-gray-950 p-10 rounded-[3rem] cursor-pointer hover:shadow-2xl transition-all group transform hover:-translate-y-2 active:scale-95"
                        >
                            <div className="w-20 h-20 bg-white/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Heart size={40} fill="currentColor" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Active Requests</h3>
                            <p className="text-gray-400 font-bold mb-8">Browse people who need help right now and volunteer your blood.</p>
                            <span className="bg-white text-gray-900 px-8 py-3.5 rounded-2xl font-black inline-block">See All Requests</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-32 bg-gray-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tighter">Get In Touch</h2>
                                <p className="text-gray-500 font-bold text-lg leading-relaxed">Have questions or need assistance? Our support team is available 24/7 to help you with the donation process.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-5">
                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Phone size={24} /></div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Call Us</p>
                                        <p className="text-lg font-black text-gray-900">+880 1234-567890</p>
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-5">
                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Mail size={24} /></div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email Us</p>
                                        <p className="text-lg font-black text-gray-900">info@bloodcare.com</p>
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-5 sm:col-span-2">
                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl"><MapPin size={24} /></div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Visit Us</p>
                                        <p className="text-lg font-black text-gray-900">Dhaka Medical College Hospital, Dhaka, Bangladesh</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-50 relative">
                            <div className="absolute -top-6 -right-6 w-16 h-16 bg-red-600 rounded-2xl rotate-12 flex items-center justify-center text-white shadow-xl shadow-red-200">
                                <Mail size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-8">Send a Message</h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Name</label>
                                        <input type="text" placeholder="John Doe" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Email</label>
                                        <input type="email" placeholder="john@example.com" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Message</label>
                                    <textarea rows="4" placeholder="How can we help you?" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold resize-none"></textarea>
                                </div>
                                <button className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 premium-button">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage
