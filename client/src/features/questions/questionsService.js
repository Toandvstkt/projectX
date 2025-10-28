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

const createQuestion = async (payload) => {
    const res = await api.post('/questions', payload);
    return res.data.data.question;
};

const listMyQuestions = async () => {
    const res = await api.get('/questions');
    return res.data.data.questions;
};

const updateQuestion = async (id, payload) => {
    const res = await api.patch(`/questions/${id}`, payload);
    return res.data.data.question;
};

const deleteQuestion = async (id) => {
    await api.delete(`/questions/${id}`);
    return id;
};

export default { createQuestion, listMyQuestions, updateQuestion, deleteQuestion };

