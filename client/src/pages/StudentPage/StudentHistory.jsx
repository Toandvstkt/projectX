import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listMyAttempts } from '../../features/exams/attemptsSlice';

const StudentHistory = () => {
    const dispatch = useDispatch();
    const { items, isLoading } = useSelector((s)=>s.attempts);

    useEffect(()=>{ dispatch(listMyAttempts()); },[dispatch]);

    return (
        <div className="min-h-screen bg-primary text-white">
            <div className="max-w-4xl mx-auto px-5 py-10">
                <h1 className="text-3xl font-semibold mb-6">Lịch sử làm bài</h1>
                {isLoading && <div>Loading...</div>}
                <div className="space-y-2">
                    {items.map((a)=> (
                        <div key={a._id} className="bg-white/10 rounded p-4">
                            <div className="text-xl font-medium">{a.examId?.name || 'Đề thi'}</div>
                            <div className="text-white/70 text-sm">Điểm: {a.score} • Nộp lúc: {new Date(a.completedAt || a.createdAt).toLocaleString()}</div>
                        </div>
                    ))}
                    {!items.length && !isLoading && <div className="text-white/70">Chưa có lịch sử bài làm.</div>}
                </div>
            </div>
        </div>
    );
};

export default StudentHistory;

