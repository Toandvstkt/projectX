import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getExamForTaking, submitExam } from '../../features/exams/examsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const TakeExam = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { current, isLoading, attempt } = useSelector((s)=>s.exams);
    const [answers, setAnswers] = useState({});
    const [remaining, setRemaining] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const unloadingRef = useRef(false);

    useEffect(()=>{ dispatch(getExamForTaking(id)); },[dispatch, id]);

    useEffect(()=>{
        if (current?.durationMinutes) {
            // Restore from localStorage if available
            const savedAnswers = localStorage.getItem(`exam_answers_${id}`);
            const savedRemaining = localStorage.getItem(`exam_remaining_${id}`);
            if (savedAnswers) {
                try { setAnswers(JSON.parse(savedAnswers) || {}); } catch {}
            }
            if (savedRemaining) {
                const val = parseInt(savedRemaining, 10);
                if (!Number.isNaN(val) && val > 0) {
                    setRemaining(val);
                } else {
                    setRemaining(current.durationMinutes * 60);
                }
            } else {
                setRemaining(current.durationMinutes * 60);
            }
        }
    },[current, id]);

    useEffect(()=>{
        if (remaining === null) return;
        if (remaining <= 0) { handleSubmit(); return; }
        const t = setTimeout(()=> setRemaining((r)=> r-1), 1000);
        localStorage.setItem(`exam_remaining_${id}`, String(remaining));
        return ()=> clearTimeout(t);
    },[remaining, id]);

    // After submit, show score on this page instead of redirect

    const handleSelect = (qid, opt) => {
        setAnswers((a)=> ({ ...a, [qid]: opt }));
    };

    // Persist answers on change
    useEffect(()=>{
        localStorage.setItem(`exam_answers_${id}`, JSON.stringify(answers));
    }, [answers, id]);

    const handleSubmit = () => {
        if (submitting || attempt) return;
        const confirmed = window.confirm('Bạn có chắc chắn muốn nộp bài? Sau khi nộp không thể sửa lại.');
        if (!confirmed) return;
        setSubmitting(true);
        const payload = Object.entries(answers).map(([questionId, selectedOption])=> ({ questionId, selectedOption }));
        dispatch(submitExam({ id, answers: payload })).finally(()=> {
            setSubmitting(false);
            // Clear persisted data after submit
            localStorage.removeItem(`exam_answers_${id}`);
            localStorage.removeItem(`exam_remaining_${id}`);
        });
    };

    const mmss = useMemo(()=>{
        if (remaining === null) return '--:--';
        const m = Math.floor(remaining/60).toString().padStart(2,'0');
        const s = (remaining%60).toString().padStart(2,'0');
        return `${m}:${s}`;
    },[remaining]);

    useEffect(()=>{
        const onBeforeUnload = (e) => {
            unloadingRef.current = true;
            if (!attempt) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', onBeforeUnload);
        return ()=> window.removeEventListener('beforeunload', onBeforeUnload);
    }, [attempt]);

    // Clear draft answers when navigating away (SPA route change), but keep on reload/close
    useEffect(()=>{
        return () => {
            if (!attempt && !unloadingRef.current) {
                localStorage.removeItem(`exam_answers_${id}`);
                localStorage.removeItem(`exam_remaining_${id}`);
            }
        };
    }, [attempt, id]);

    if (isLoading || !current) return <div className="min-h-screen bg-primary text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-primary text-white">
            <div className="max-w-4xl mx-auto px-5 py-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button 
                            className="bg-white/10 hover:bg-white/20 rounded px-3 py-1" 
                            onClick={() => {
                                if (attempt) {
                                    navigate(-1);
                                } else {
                                    const confirmed = window.confirm('Bạn có chắc chắn muốn thoát? Tiến trình làm bài sẽ được lưu tạm thời.');
                                    if (confirmed) navigate(-1);
                                }
                            }}
                        >
                            ← Quay lại
                        </button>
                        <h1 className="text-2xl font-semibold">{current.name}</h1>
                    </div>
                    <div className="bg-white/10 rounded px-3 py-1">{mmss}</div>
                </div>
                <div className="space-y-4 mb-6">
                    {current.questionIds.map((q, idx)=> (
                        <div key={q._id || idx} className="bg-white/10 rounded p-4">
                            <div className="font-medium mb-2">{idx+1}. {q.text || `Câu hỏi ${idx+1}`}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {q.options?.map((op)=> (
                                    <label key={op.label} className={`cursor-pointer p-2 rounded border ${answers[q._id]===op.label?'bg-white/20':'border-white/20'} ${attempt ? 'opacity-60 pointer-events-none' : ''}`}>
                                        <input type="radio" name={q._id} className="mr-2" checked={answers[q._id]===op.label} onChange={()=>handleSelect(q._id, op.label)} disabled={!!attempt} />
                                        {op.label}. {op.text}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {!attempt && <button className="bg-pink rounded px-4 py-2 disabled:opacity-60" onClick={handleSubmit} disabled={submitting}>Nộp bài</button>}
                {attempt && (
                    <div className="mt-4 bg-white/10 rounded p-4">
                        <div className="text-xl">Bạn đã nộp bài.</div>
                        <div className="text-white/80">Điểm: {attempt.score} / {attempt.totalQuestions}</div>
                        <div className="text-white/80">Số câu đúng: {attempt.correctCount}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TakeExam;

