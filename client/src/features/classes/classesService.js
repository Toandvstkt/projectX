import axios from 'axios';

const api = axios.create({ baseURL: '/projectX/api' });

const listClasses = async () => {
    const res = await api.get('/classes');
    return res.data.data.classes;
};

const createClass = async (payload) => {
    // reuse auth interceptor pattern via token header
    const token = localStorage.getItem('token');
    const res = await api.post('/classes', payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    return res.data.data.class;
};

export default { listClasses, createClass };

