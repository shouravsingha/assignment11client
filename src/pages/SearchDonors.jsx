import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { bangladeshData, bloodGroups, getDistrictName } from '../utils/constants';
import { Search, MapPin, Droplets, User } from 'lucide-react';

const SearchDonors = () => {
    const [filters, setFilters] = useState({
        bloodGroup: '',
        district: '',
        upazila: ''
    });
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!filters.bloodGroup || !filters.district || !filters.upazila) {
            alert('Please select blood group, district, and upazila to search.');
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.get('/users/search-donors', {
                params: {
                    bloodGroup: filters.bloodGroup,
                    district: filters.district,
                    upazila: filters.upazila
                }
            });
            if (response.data.success) {
                setDonors(response.data.users);
            }
            setSearched(true);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-block bg-red-50 p-4 rounded-[2rem] mb-6">
                        <span className="text-4xl">🔍</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 md:text-5xl tracking-tight mb-4">Find Life Savers</h1>
                    <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">Search for available blood donors in your area and contact them directly to request help.</p>
                </div>

                {/* Search Form */}
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 mb-16 animate-slide-up">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 px-1">Blood Group</label>
                            <select
                                value={filters.bloodGroup}
                                onChange={(e) => setFilters({...filters, bloodGroup: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium text-gray-700"
                            >
                                <option value="">Select Group</option>
                                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 px-1">District</label>
                            <select
                                value={filters.district}
                                onChange={(e) => setFilters({...filters, district: e.target.value, upazila: ''})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium text-gray-700"
                            >
                                <option value="">Select District</option>
                                {bangladeshData.districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 px-1">Upazila</label>
                            <select
                                value={filters.upazila}
                                onChange={(e) => setFilters({...filters, upazila: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium text-gray-700 disabled:opacity-50"
                                disabled={!filters.district}
                            >
                                <option value="">Select Upazila</option>
                                {filters.district && bangladeshData.upazilas[filters.district]?.map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-red-700 transition shadow-xl shadow-red-200 flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 disabled:bg-gray-300"
                            >
                                {loading ? 'Searching...' : <><Search size={24} /> Search Available Donors</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {searched && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-2xl font-black text-gray-900">
                                {donors.length} Donors Found
                            </h2>
                            <div className="h-px bg-gray-100 flex-1 mx-8 hidden sm:block"></div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Near Your Location</span>
                        </div>
                        
                        {donors.length === 0 ? (
                            <div className="bg-white p-20 rounded-[3rem] text-center border border-gray-100 shadow-xl shadow-gray-200/50">
                                <div className="bg-gray-50 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                                    <span className="text-4xl text-gray-300">🏢</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">No donors found</h3>
                                <p className="text-gray-500 font-medium text-lg mt-4">Try expanding your search to nearby districts or different blood groups.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {donors.map((donor) => (
                                    <div key={donor._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-xl shadow-gray-200/50 flex items-center gap-8 group hover:shadow-2xl hover:shadow-red-500/5 transition-all hover:-translate-y-1">
                                        <div className="relative shrink-0">
                                            <img 
                                                src={donor.avatar || 'https://i.ibb.co/default-avatar.png'} 
                                                alt={donor.name} 
                                                className="w-24 h-24 rounded-[2rem] object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform"
                                            />
                                            <div className="absolute -top-3 -right-3 bg-red-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-xl shadow-red-200 border-4 border-white">
                                                {donor.bloodGroup}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-2xl font-black text-gray-900 mb-2 truncate">{donor.name}</h3>
                                            <div className="flex items-center gap-2 text-gray-500 font-bold text-sm mb-4">
                                                <div className="p-1.5 bg-gray-50 rounded-lg">
                                                    <MapPin size={14} className="text-red-500" />
                                                </div>
                                                <span className="truncate">{donor.upazila}, {getDistrictName(donor.district)}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${donor.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                    {donor.status}
                                                </span>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saving Lives since {new Date(donor.createdAt).getFullYear()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchDonors;
