import axios from 'axios';

export const uploadImage = async (imageFile) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
        console.error('ImageBB API Key is missing in .env');
        throw new Error('Upload configuration error');
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            formData
        );
        return response.data.data.display_url;
    } catch (error) {
        console.error('ImageBB upload error details:', error.response?.data || error.message);
        throw new Error('Image upload failed');
    }
};
