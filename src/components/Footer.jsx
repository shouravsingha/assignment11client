import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="text-2xl font-black flex items-center gap-2 text-white">
                            <span className="bg-red-600 p-1.5 rounded-lg text-sm">🩸</span>
                            BloodCare
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Connecting life-savers across the nation. Our platform simplifies the blood donation process, making it easier to find help when every second counts.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors">
                                <Heart size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors">
                                <Mail size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors">
                                <MapPin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-xs">Explore</h4>
                        <ul className="space-y-4 text-gray-400 text-sm font-bold">
                            <li><Link to="/" className="hover:text-red-500 transition-colors">Home Page</Link></li>
                            <li><Link to="/donation-requests" className="hover:text-red-500 transition-colors">All Requests</Link></li>
                            <li><Link to="/search-donors" className="hover:text-red-500 transition-colors">Find Donors</Link></li>
                            <li><Link to="/funding" className="hover:text-red-500 transition-colors">Our Funding</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-xs">Support</h4>
                        <ul className="space-y-4 text-gray-400 text-sm font-bold">
                            <li><a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-red-500 transition-colors">Cookie Policy</a></li>
                            <li><a href="#" className="hover:text-red-500 transition-colors">Contact Support</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-xs">Contact</h4>
                        <ul className="space-y-4 text-gray-400 text-sm font-medium">
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-gray-800 rounded-lg text-red-500"><Mail size={16} /></div>
                                info@bloodcare.com
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-gray-800 rounded-lg text-red-500"><Phone size={16} /></div>
                                +880 1234-567890
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-gray-800 rounded-lg text-red-500"><MapPin size={16} /></div>
                                Dhaka, Bangladesh
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} BloodCare Application.
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Made with <Heart size={14} className="text-red-600 fill-current" /> by BloodCare Team
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
