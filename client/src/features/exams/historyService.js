import axios from 'axios';

const API_URL = '/projectX/api/exams';

// Get exam history
const getExamHistory = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/history`, config);
    return response.data;
};

// Get exam attempt detail
const getExamAttemptDetail = async (attemptId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/attempts/${attemptId}`, config);
    return response.data;
};

const historyService = {
    getExamHistory,
    getExamAttemptDetail,
};

export default historyService;
