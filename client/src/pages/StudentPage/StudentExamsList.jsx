import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listPublicExams } from '../../features/exams/examsSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const StudentExamsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { publicItems, isLoading } = useSelector((s)=>s.exams);

    useEffect(()=>{
        const account = JSON.parse(localStorage.getItem('account') || '{}');
        const cls = account?.class;
        dispatch(listPublicExams(cls ? { className: cls } : undefined));
    },[dispatch]);

    return (
        <div className="min-h-screen bg-primary text-white">
            <div className="max-w-4xl mx-auto px-5 py-10">
                <h1 className="text-3xl font-semibold mb-6">Bài thi khả dụng</h1>
                {isLoading && <div>Loading...</div>}
                <div className="space-y-2">
                    {publicItems.map((e)=> (
                        <div key={e._id} className="bg-white/10 rounded p-4 cursor-pointer hover:bg-white/20" onClick={()=>navigate(`/exams/${e._id}/take`)}>
                            <div className="text-xl font-medium">{e.name}</div>
                            <div className="text-white/70 text-sm">{e.durationMinutes} phút • {new Date(e.createdAt).toLocaleString()}</div>
                        </div>
                    ))}
                    {!publicItems.length && !isLoading && <div className="text-white/70">Chưa có bài thi nào.</div>}
                </div>
            </div>
        </div>
    );
};

export default StudentExamsList;

