import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getExamById, deleteExam } from '../../features/exams/examsSlice';
import { useParams } from 'react-router-dom';

const TeacherExamDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { current, isLoading } = useSelector((s)=>s.exams);

    useEffect(()=>{ dispatch(getExamById(id)); },[dispatch, id]);

    if (isLoading || !current) return <div className="min-h-screen bg-primary text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-primary text-white">
            <div className="max-w-4xl mx-auto px-5 py-10">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-semibold">{current.name}</h1>
                    <button className="text-red-300 hover:text-red-200" onClick={()=>dispatch(deleteExam(current._id))}>Xóa đề</button>
                </div>
                <div className="text-white/70 mb-6">Thời lượng: {current.durationMinutes} phút</div>
                <div className="space-y-4">
                    {current.questionIds.map((q, idx)=> (
                        <div key={q._id || idx} className="bg-white/10 rounded p-4">
                            <div className="font-medium mb-2">{idx+1}. {q.text || `Câu hỏi ${idx+1}`}</div>
                            <ul className="list-disc list-inside text-white/90">
                                {q.options?.map((op)=> (
                                    <li key={op.label} className={q.correctOption === op.label ? 'text-green-300' : ''}>
                                        {op.label}. {op.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherExamDetail;

