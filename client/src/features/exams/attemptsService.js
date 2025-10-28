import axios from 'axios';

const api = axios.create({ baseURL: '/projectX/api' });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const listMyAttempts = async () => {
    const res = await api.get('/attempts/me');
    return res.data.data.attempts;
};

export default { listMyAttempts };

