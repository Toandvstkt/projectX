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

const createExam = async (payload) => {
    const res = await api.post('/exams', payload);
    return res.data.data.exam;
};

const listMyExams = async () => {
    const res = await api.get('/exams');
    return res.data.data.exams;
};

const getExamById = async (id) => {
    const res = await api.get(`/exams/${id}`);
    return res.data.data.exam;
};

const updateExam = async (id, payload) => {
    const res = await api.patch(`/exams/${id}`, payload);
    return res.data.data.exam;
};

const deleteExam = async (id) => {
    await api.delete(`/exams/${id}`);
    return id;
};

// Student endpoints
const listPublicExams = async (params) => {
    const res = await api.get('/exams/public', { params });
    return res.data.data.exams;
};

const getExamForTaking = async (id) => {
    const res = await api.get(`/exams/${id}/take`);
    return res.data.data.exam;
};

const submitExam = async (id, answers) => {
    const res = await api.post(`/exams/${id}/submit`, { answers });
    return res.data.data.attempt;
};

export default { createExam, listMyExams, getExamById, updateExam, deleteExam, listPublicExams, getExamForTaking, submitExam };

