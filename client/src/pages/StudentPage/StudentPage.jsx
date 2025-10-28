import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickButton = ({ title, desc, onClick }) => (
    <button className="bg-white/10 hover:bg-white/20 transition rounded-xl p-5 text-left shadow" onClick={onClick}>
        <div className="text-xl font-medium mb-1">{title}</div>
        <div className="text-white/80 text-sm">{desc}</div>
    </button>
);

const StudentPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-primary text-white">
            <div className="max-w-5xl mx-auto px-5 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold">Student Dashboard</h1>
                    <p className="text-white/80 mt-1">Làm bài thi và xem kết quả</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickButton title="Bài thi của tôi" desc="Xem danh sách các bài thi được giao" onClick={() => navigate('/exams')} />
                    <QuickButton title="Lịch sử" desc="Xem điểm và bài làm trước đây" onClick={() => navigate('/history')} />
                    <QuickButton title="Hướng dẫn" desc="Cách làm bài thi trên Project X" onClick={() => navigate('/guide')} />
                </div>
            </div>
        </div>
    );
};

export default StudentPage;

