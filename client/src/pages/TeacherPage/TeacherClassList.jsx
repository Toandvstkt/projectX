import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherClassList = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get('/projectX/api/exams/scores', config);
            const attempts = res.data.data.attempts || [];
            
            // Extract unique classes from attempts
            const classSet = new Set();
            attempts.forEach(attempt => {
                if (attempt.examId?.className) {
                    classSet.add(attempt.examId.className);
                }
            });
            
            // Get class info with attempt counts
            const classList = Array.from(classSet).map(className => {
                const classAttempts = attempts.filter(a => a.examId?.className === className);
                const uniqueStudents = new Set(classAttempts.map(a => a.studentId?._id)).size;
                const uniqueExams = new Set(classAttempts.map(a => a.examId?._id)).size;
                
                return {
                    name: className,
                    studentCount: uniqueStudents,
                    examCount: uniqueExams,
                    attemptCount: classAttempts.length
                };
            });
            
            setClasses(classList.sort((a, b) => a.name.localeCompare(b.name)));
        } catch (e) {
            console.error('Error fetching classes:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    return (
        <div className="min-h-screen bg-primary text-white">
            <div className="max-w-5xl mx-auto px-5 py-10">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-semibold">Danh sách lớp học</h1>
                    <button 
                        className="bg-white hover:bg-gray-50 rounded px-4 py-2 text-black"
                        onClick={() => navigate('/teacher')}
                    >
                        ← Quay lại Dashboard
                    </button>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2">Đang tải...</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes.map((cls) => (
                        <div 
                            key={cls.name}
                            className="bg-white rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer text-black"
                            onClick={() => navigate(`/teacher/scores/detail?class=${encodeURIComponent(cls.name)}`)}
                        >
                            <div className="text-xl font-semibold mb-2">{cls.name}</div>
                            <div className="space-y-1 text-sm text-gray-600">
                                <div>Số học sinh đã làm: {cls.studentCount}</div>
                                <div>Số đề thi: {cls.examCount}</div>
                                <div>Tổng lượt làm: {cls.attemptCount}</div>
                            </div>
                            <div className="mt-4 text-pink text-sm font-medium">
                                Nhấn để xem điểm →
                            </div>
                        </div>
                    ))}
                </div>

                {!classes.length && !loading && (
                    <div className="text-center py-12">
                        <div className="text-white/70 text-lg mb-2">Chưa có lớp nào có điểm</div>
                        <div className="text-white/50">Hãy tạo đề thi và để học sinh làm bài để xem điểm ở đây</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherClassList;
