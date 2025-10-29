import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getExamHistory } from '../../features/exams/historySlice';
import { useNavigate } from 'react-router-dom';

const StudentHistory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { attempts, isLoading } = useSelector((s)=>s.history);

    useEffect(()=>{ 
        dispatch(getExamHistory()); 
    },[dispatch]);

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreText = (score) => {
        if (score >= 80) return 'Xuất sắc';
        if (score >= 60) return 'Khá';
        return 'Cần cải thiện';
    };

    return (
        <div className="min-h-screen bg-primary text-white">
            <div className="max-w-4xl mx-auto px-5 py-10">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-semibold">Lịch sử làm bài</h1>
                    <button 
                        className="bg-white/10 hover:bg-white/20 rounded px-4 py-2"
                        onClick={() => navigate(-1)}
                    >
                        ← Quay lại
                    </button>
                </div>
                
                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2">Đang tải...</span>
                    </div>
                )}
                
                <div className="space-y-4">
                    {attempts.map((attempt)=> (
                        <div key={attempt._id} className="bg-white/10 rounded-lg p-6 hover:bg-white/15 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xl font-semibold">{attempt.examId?.name || 'Đề thi'}</h3>
                                <div className={`text-2xl font-bold ${getScoreColor(attempt.score)}`}>
                                    {attempt.score}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-white/5 rounded p-3">
                                    <div className="text-sm text-white/70">Điểm số</div>
                                    <div className={`text-lg font-semibold ${getScoreColor(attempt.score)}`}>
                                        {attempt.score}/100
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded p-3">
                                    <div className="text-sm text-white/70">Số câu đúng</div>
                                    <div className="text-lg font-semibold">
                                        {attempt.correctCount || 0}/{attempt.totalQuestions || 0}
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded p-3">
                                    <div className="text-sm text-white/70">Đánh giá</div>
                                    <div className={`text-lg font-semibold ${getScoreColor(attempt.score)}`}>
                                        {getScoreText(attempt.score)}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-white/70">
                                <div>
                                    Lớp: {attempt.examId?.className || 'N/A'} • 
                                    Thời gian: {attempt.examId?.durationMinutes || 0} phút
                                </div>
                                <div>
                                    Nộp lúc: {new Date(attempt.completedAt || attempt.createdAt).toLocaleString()}
                                </div>
                            </div>
                            
                            <div className="mt-4 flex gap-2">
                                <button 
                                    className="bg-pink hover:bg-pink/80 rounded px-4 py-2 text-sm"
                                    onClick={() => navigate(`/exams/attempts/${attempt._id}`)}
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {!attempts.length && !isLoading && (
                        <div className="text-center py-12">
                            <div className="text-white/70 text-lg mb-2">Chưa có lịch sử bài làm</div>
                            <div className="text-white/50">Hãy làm bài thi để xem kết quả ở đây</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentHistory;

