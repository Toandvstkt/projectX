import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getExamAttemptDetail, clearCurrentAttempt } from '../../features/exams/historySlice';
import { useParams, useNavigate } from 'react-router-dom';

const ExamResultDetail = () => {
    const { attemptId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentAttempt, isLoading } = useSelector((s) => s.history);

    useEffect(() => {
        if (attemptId) {
            dispatch(getExamAttemptDetail(attemptId));
        }
        return () => {
            dispatch(clearCurrentAttempt());
        };
    }, [dispatch, attemptId]);

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

    const isAnswerCorrect = (question, userAnswer) => {
        if (question.type === 'select') {
            return question.correctOption === userAnswer;
        } else if (question.type === 'checkbox') {
            const userSet = new Set(userAnswer || []);
            const correctSet = new Set(question.correctOptions || []);
            return userSet.size === correctSet.size && [...userSet].every(x => correctSet.has(x));
        } else if (question.type === 'input') {
            return question.correctText && userAnswer && 
                   question.correctText.toLowerCase().trim() === userAnswer.toLowerCase().trim();
        }
        return false;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-primary text-white flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải...</span>
                </div>
            </div>
        );
    }

    if (!currentAttempt) {
        return (
            <div className="min-h-screen bg-primary text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl mb-4">Không tìm thấy kết quả bài thi</div>
                    <button 
                        className="bg-pink hover:bg-pink/80 rounded px-4 py-2"
                        onClick={() => navigate('/history')}
                    >
                        Quay lại lịch sử
                    </button>
                </div>
            </div>
        );
    }

    const exam = currentAttempt.examId;
    const questions = exam?.questionIds || [];
    const userAnswers = currentAttempt.answers || [];

    return (
        <div className="min-h-screen bg-primary text-white">
            <div className="max-w-6xl mx-auto px-5 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold mb-2">{exam?.name || 'Đề thi'}</h1>
                        <div className="text-white/70">
                            Lớp: {exam?.className || 'N/A'} • 
                            Thời gian: {exam?.durationMinutes || 0} phút • 
                            Nộp lúc: {new Date(currentAttempt.completedAt || currentAttempt.createdAt).toLocaleString()}
                        </div>
                    </div>
                    <button 
                        className="bg-white/10 hover:bg-white/20 rounded px-4 py-2"
                        onClick={() => navigate('/history')}
                    >
                        ← Quay lại
                    </button>
                </div>

                {/* Score Summary */}
                <div className="bg-white/10 rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className={`text-4xl font-bold ${getScoreColor(currentAttempt.score)}`}>
                                {currentAttempt.score}
                            </div>
                            <div className="text-white/70">Điểm số</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold">
                                {currentAttempt.correctCount || 0}/{currentAttempt.totalQuestions || 0}
                            </div>
                            <div className="text-white/70">Số câu đúng</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-2xl font-semibold ${getScoreColor(currentAttempt.score)}`}>
                                {getScoreText(currentAttempt.score)}
                            </div>
                            <div className="text-white/70">Đánh giá</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-semibold">
                                {Math.round(((currentAttempt.correctCount || 0) / (currentAttempt.totalQuestions || 1)) * 100)}%
                            </div>
                            <div className="text-white/70">Tỷ lệ đúng</div>
                        </div>
                    </div>
                </div>

                {/* Questions Review */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-4">Chi tiết từng câu hỏi</h2>
                    
                    {questions.map((question, index) => {
                        const userAnswer = userAnswers.find(a => a.questionId === question._id)?.selectedOption;
                        const isCorrect = isAnswerCorrect(question, userAnswer);
                        
                        return (
                            <div key={question._id} className={`rounded-lg p-6 ${isCorrect ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-semibold">
                                        Câu {index + 1}: {question.text || `Câu hỏi ${index + 1}`}
                                    </h3>
                                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {isCorrect ? 'Đúng' : 'Sai'}
                                    </div>
                                </div>

                                {question.type === 'select' && question.options && (
                                    <div className="space-y-2">
                                        <div className="text-sm text-white/70 mb-2">Các lựa chọn:</div>
                                        {question.options.map((option) => (
                                            <div 
                                                key={option.label} 
                                                className={`p-3 rounded border ${
                                                    option.label === question.correctOption 
                                                        ? 'bg-green-500/30 border-green-500 text-green-300' 
                                                        : option.label === userAnswer 
                                                            ? 'bg-red-500/30 border-red-500 text-red-300'
                                                            : 'bg-white/5 border-white/20'
                                                }`}
                                            >
                                                <span className="font-semibold">{option.label}.</span> {option.text}
                                                {option.label === question.correctOption && (
                                                    <span className="ml-2 text-green-300">✓ Đáp án đúng</span>
                                                )}
                                                {option.label === userAnswer && option.label !== question.correctOption && (
                                                    <span className="ml-2 text-red-300">✗ Bạn chọn</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {question.type === 'checkbox' && question.options && (
                                    <div className="space-y-2">
                                        <div className="text-sm text-white/70 mb-2">Các lựa chọn:</div>
                                        {question.options.map((option) => {
                                            const isCorrectOption = question.correctOptions?.includes(option.label);
                                            const isUserSelected = userAnswer?.includes(option.label);
                                            return (
                                                <div 
                                                    key={option.label} 
                                                    className={`p-3 rounded border ${
                                                        isCorrectOption 
                                                            ? 'bg-green-500/30 border-green-500 text-green-300' 
                                                            : isUserSelected 
                                                                ? 'bg-red-500/30 border-red-500 text-red-300'
                                                                : 'bg-white/5 border-white/20'
                                                    }`}
                                                >
                                                    <span className="font-semibold">{option.label}.</span> {option.text}
                                                    {isCorrectOption && (
                                                        <span className="ml-2 text-green-300">✓ Đáp án đúng</span>
                                                    )}
                                                    {isUserSelected && !isCorrectOption && (
                                                        <span className="ml-2 text-red-300">✗ Bạn chọn</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {question.type === 'input' && (
                                    <div className="space-y-3">
                                        <div className="bg-white/5 rounded p-3">
                                            <div className="text-sm text-white/70 mb-1">Đáp án đúng:</div>
                                            <div className="text-green-300 font-semibold">{question.correctText}</div>
                                        </div>
                                        <div className="bg-white/5 rounded p-3">
                                            <div className="text-sm text-white/70 mb-1">Câu trả lời của bạn:</div>
                                            <div className={isCorrect ? 'text-green-300' : 'text-red-300'}>
                                                {userAnswer || 'Không trả lời'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ExamResultDetail;
