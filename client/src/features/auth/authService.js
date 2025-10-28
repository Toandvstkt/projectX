import axios from 'axios';

// Create axios instance with correct base URL (case-sensitive)
const api = axios.create({ baseURL: '/projectX/api' });

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const login = async (accountData) => {
    const response = await api.post('/accounts/login', accountData);
    const payload = response.data && response.data.data;
    if (payload && payload.account && payload.token) {
        localStorage.setItem('account', JSON.stringify(payload.account));
        localStorage.setItem('token', payload.token);
        return payload.account;
    }
    throw new Error('Dữ liệu tài khoản không hợp lệ');
};

const register = async (accountData) => {
    const response = await api.post('/accounts/register', accountData);
    return response.data.data.account;
};

const getAllAccounts = async () => {
    const response = await api.get('/accounts');
    return response.data.data.accounts;
};

const getInformation = async () => {
    const response = await api.get('/accounts/information');
    return response.data.data.account;
};

const logout = async () => {
    localStorage.removeItem('account');
    localStorage.removeItem('token');
};

const authService = { login, logout, register, getAllAccounts, getInformation };
export default authService;
