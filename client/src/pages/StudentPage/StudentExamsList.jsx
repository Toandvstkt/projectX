import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listPublicExams } from '../../features/exams/examsSlice';
import { getExamHistory } from '../../features/exams/historySlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const StudentExamsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { publicItems, isLoading } = useSelector((s)=>s.exams);
    const { attempts } = useSelector((s)=>s.history);
    const [attemptedExams, setAttemptedExams] = useState(new Set());

    useEffect(()=>{
        const account = JSON.parse(localStorage.getItem('account') || '{}');
        const cls = account?.class;
        dispatch(listPublicExams(cls ? { className: cls } : undefined));
        dispatch(getExamHistory());
    },[dispatch]);

    useEffect(() => {
        const attemptedIds = new Set(attempts.map(attempt => attempt.examId?._id));
        setAttemptedExams(attemptedIds);
    }, [attempts]);

    return (
        <div className="min-h-screen bg-primary text-white">
            <div className="max-w-4xl mx-auto px-5 py-10">
                <h1 className="text-3xl font-semibold mb-6">Bài thi khả dụng</h1>
                {isLoading && <div>Loading...</div>}
                <div className="space-y-2">
                    {publicItems.map((e)=> {
                        const isAttempted = attemptedExams.has(e._id);
                        const canRetake = e.allowRetake;
                        const shouldShowRetake = isAttempted && canRetake;
                        const shouldBlock = isAttempted && !canRetake;
                        
                        return (
                            <div 
                                key={e._id} 
                                className={`bg-white/10 rounded p-4 ${shouldBlock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/20'}`} 
                                onClick={()=>{
                                    if (shouldBlock) {
                                        toast.error('Bạn đã làm bài thi này rồi. Không được phép làm lại.');
                                        return;
                                    }
                                    navigate(`/exams/${e._id}/take`);
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-xl font-medium">{e.name}</div>
                                    {isAttempted && (
                                        <div className={`px-2 py-1 rounded text-xs ${
                                            shouldShowRetake ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'
                                        }`}>
                                            {shouldShowRetake ? 'Có thể làm lại' : 'Đã hoàn thành'}
                                        </div>
                                    )}
                                </div>
                                <div className="text-white/70 text-sm">
                                    {e.durationMinutes} phút • {new Date(e.createdAt).toLocaleString()}
                                    {e.allowRetake && <span className="ml-2 text-green-300">• Cho phép làm lại</span>}
                                </div>
                            </div>
                        );
                    })}
                    {!publicItems.length && !isLoading && <div className="text-white/70">Chưa có bài thi nào.</div>}
                </div>
            </div>
        </div>
    );
};

export default StudentExamsList;

