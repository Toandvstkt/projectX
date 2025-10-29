import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TeacherScores = () => {
    const [attempts, setAttempts] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedExam, setSelectedExam] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const className = searchParams.get('class') || '';

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Fetch attempts for the class
            const params = className ? { params: { className } } : {};
            const res = await axios.get('/projectX/api/exams/scores', { ...config, ...params });
            const data = res.data.data.attempts || [];
            setAttempts(data);
            
            // Extract unique exams for this class
            const examSet = new Set();
            data.forEach(attempt => {
                if (attempt.examId) {
                    examSet.add(JSON.stringify({
                        _id: attempt.examId._id,
                        name: attempt.examId.name,
                        className: attempt.examId.className
                    }));
                }
            });
            
            const examList = Array.from(examSet).map(examStr => JSON.parse(examStr));
            setExams(examList);
            
            // Auto-select first exam if only one
            if (examList.length === 1) {
                setSelectedExam(examList[0]._id);
            }
        } catch (e) {
            console.error('Error fetching data:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [className]);

    // Filter attempts by selected exam
    const filteredAttempts = selectedExam 
        ? attempts.filter(a => a.examId?._id === selectedExam)
        : attempts;

    const selectedExamData = exams.find(e => e._id === selectedExam);

    return (
        <div className="min-h-screen bg-primary text-white">
            <div className="max-w-5xl mx-auto px-5 py-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-semibold">
                            {className ? `Điểm lớp ${className}` : 'Điểm bài kiểm tra'}
                        </h1>
                        {selectedExamData && (
                            <p className="text-white/70 mt-1">Đề thi: {selectedExamData.name}</p>
                        )}
                    </div>
                    <button 
                        className="bg-white hover:bg-gray-50 rounded px-4 py-2 text-black"
                        onClick={() => navigate('/teacher/scores')}
                    >
                        ← Quay lại danh sách lớp
                    </button>
                </div>

                {className && exams.length > 0 && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Chọn đề thi:</label>
                        <select 
                            className="p-2 rounded text-black w-full max-w-md"
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                        >
                            <option value="">Tất cả đề thi</option>
                            {exams.map(exam => (
                                <option key={exam._id} value={exam._id}>
                                    {exam.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2">Đang tải...</span>
                    </div>
                )}

                <div className="space-y-3">
                    {filteredAttempts.map(a => (
                        <div key={a._id} className="bg-white rounded p-4 text-black">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold text-lg">
                                    {a.studentId?.name} ({a.studentId?.userId})
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-pink">{a.score}/100</div>
                                    <div className="text-sm text-gray-600">
                                        {a.correctCount}/{a.totalQuestions} câu đúng
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                <div>Lớp: <span className="font-semibold">{a.studentId?.class || 'N/A'}</span></div>
                                <div>Đề thi: <span className="font-semibold">{a.examId?.name}</span></div>
                                <div>Nộp lúc: <span className="font-semibold">
                                    {new Date(a.completedAt || a.createdAt).toLocaleString()}
                                </span></div>
                            </div>
                            
                            <div className="mt-2">
                                <div className="text-xs text-gray-500">
                                    Thời gian làm: {a.examId?.durationMinutes} phút
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {!filteredAttempts.length && !loading && (
                        <div className="text-center py-12">
                            <div className="text-white/70 text-lg mb-2">
                                {selectedExam ? 'Chưa có học sinh nào làm đề thi này' : 'Chưa có lượt làm nào'}
                            </div>
                            <div className="text-white/50">
                                {className ? `Lớp ${className} chưa có điểm` : 'Chưa có dữ liệu điểm'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherScores;


