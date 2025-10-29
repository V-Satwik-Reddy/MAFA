import api from "./axios";

const verify = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const response = await api.get('/auth/verify');
        return response.status === 200;
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }  
};

export default verify;