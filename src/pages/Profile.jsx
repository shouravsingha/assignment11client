import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../utils/axiosInstance';
import { bangladeshData, bloodGroups } from '../utils/constants';
import { uploadImage } from '../utils/imageUpload';

const Profile = () => {
    const { user, mongoUser, setMongoUser, updateUserProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [formData, setFormData] = useState({
        name: '',
        avatar: '',
        bloodGroup: '',
        district: '',
        upazila: ''
    });

    useEffect(() => {
        if (mongoUser) {
            setFormData({
                name: mongoUser.name || '',
                avatar: mongoUser.avatar || '',
                bloodGroup: mongoUser.bloodGroup || '',
                district: mongoUser.district || '',
                upazila: mongoUser.upazila || ''
            });
        }
    }, [mongoUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const imageUrl = await uploadImage(file);
            setFormData(prev => ({ ...prev, avatar: imageUrl }));
        } catch (error) {
            setMessage({ type: 'error', text: 'Image upload failed' });
        } finally {
            setUploading(false);
        }
    };

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        setFormData(prev => ({ ...prev, district: districtId, upazila: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            console.log('Starting profile update with data:', formData);
            // 1. Update Firebase Profile (Name/Photo)
            await updateUserProfile(formData.name, formData.avatar);
            console.log('Firebase profile updated');

            // 2. Update MongoDB Profile
            const response = await axiosInstance.put('/users/profile', formData);
            console.log('Server response:', response.data);

            if (response.data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setMongoUser(response.data.user); // Update global state
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Profile update full error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Update failed';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const getUpazilas = () => {
        if (!formData.district) return [];
        // Ensure comparison matches the type (id is number in constants, district is string in form)
        return bangladeshData.upazilas[formData.district] || [];
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-red-600 h-32 flex items-end justify-center pb-4">
                    <div className="relative">
                        <img 
                            src={formData.avatar || 'https://i.ibb.co/default-avatar.png'} 
                            alt="Profile" 
                            className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white translate-y-16"
                        />
                    </div>
                </div>

                <div className="mt-20 px-8 pb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">{formData.name}</h1>
                    <p className="text-gray-500 font-medium">{user?.email}</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold uppercase">
                        {mongoUser?.role}
                    </div>

                    {message.text && (
                        <div className={`mt-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
                        >
                            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-50"
                            />
                        </div>

                        {/* Avatar Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Update Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={!isEditing || uploading}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-50"
                            />
                            {uploading && <p className="text-xs text-blue-600 mt-1">Uploading image...</p>}
                            {formData.avatar && !uploading && isEditing && <p className="text-xs text-green-600 mt-1">Image ready to be saved!</p>}
                        </div>

                        {/* Blood Group */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-50"
                            >
                                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                        </div>

                        {/* District */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <select
                                name="district"
                                value={formData.district}
                                onChange={handleDistrictChange}
                                disabled={!isEditing}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-50"
                            >
                                <option value="">Select District</option>
                                {bangladeshData.districts.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Upazila */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upazila</label>
                            <select
                                name="upazila"
                                value={formData.upazila}
                                onChange={handleInputChange}
                                disabled={!isEditing || !formData.district}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-50"
                            >
                                <option value="">Select Upazila</option>
                                {getUpazilas().map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>

                        {isEditing && (
                            <div className="md:col-span-2 mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 disabled:bg-red-300"
                                >
                                    {loading ? 'Saving Changes...' : 'Save Profile'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
