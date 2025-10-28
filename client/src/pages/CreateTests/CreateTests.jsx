import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createQuestion, listMyQuestions, deleteQuestion } from '../../features/questions/questionsSlice';
import { createExam } from '../../features/exams/examsSlice';
import { listClasses } from '../../features/classes/classesSlice';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateTests = () => {
    const dispatch = useDispatch();
    const { items: questions } = useSelector((s)=>s.questions);
    const navigate = useNavigate();
    const [qText, setQText] = useState('');
    const [options, setOptions] = useState({ A:'', B:'', C:'', D:'' });
    const [correct, setCorrect] = useState('A');
    const [examName, setExamName] = useState('');
    const [duration, setDuration] = useState(30);
    const [selectedIds, setSelectedIds] = useState([]);
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [className, setClassName] = useState('');
    const [templateType, setTemplateType] = useState('');
    const [items, setItems] = useState([]); // form-like items
    const [selectedParts, setSelectedParts] = useState({ reading: false, listening: false, writing: false });
    const [selectedItems, setSelectedItems] = useState(new Set()); // track which items are selected for exam
    const [isCreating, setIsCreating] = useState(false); // loading state for exam creation

    const optionLabels = useMemo(()=> ['A','B','C','D'],[]);

    const classes = useSelector((s)=> s.classes.items);
    useEffect(()=>{ dispatch(listMyQuestions()); dispatch(listClasses()); },[dispatch]);

    // Generate template rows based on selected parts
    const generateTemplate = async () => {
        const READING_MAX = 32;
        const LISTENING_MAX = 25;
        let useReading = selectedParts.reading;
        let useListening = selectedParts.listening;
        if (templateType === 'final') {
            useReading = true;
            useListening = true;
            setSelectedParts({ reading: true, listening: true, writing: false });
        }
        const rows = [];
        if (useReading) {
            for (let i = 0; i < READING_MAX; i++) {
                rows.push({ part: 'reading', type: 'select', optionCount: 4, correctOption: 'A', correctOptions: [], correctText: '' });
            }
        }
        if (useListening) {
            for (let i = 0; i < LISTENING_MAX; i++) {
                rows.push({ part: 'listening', type: 'select', optionCount: 4, correctOption: 'A', correctOptions: [], correctText: '' });
            }
        }
        setItems(rows);
        toast.success(`Đã tạo mẫu ${rows.length} câu (${useReading ? `Reading ${READING_MAX}`: ''}${useReading && useListening ? ' + ' : ''}${useListening ? `Listening ${LISTENING_MAX}`: ''})`);
    };

    const toggleSelect = (id) => {
        setSelectedIds((prev)=> prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
    };

    const createExamSubmit = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            // Build questions from selected items only
            const createdIds = [];
            const filteredItems = items.filter((_, idx) => selectedItems.has(idx));
            if (filteredItems.length === 0) {
                toast.error('Chọn ít nhất một câu để tạo đề');
                return;
            }
        for (const it of filteredItems) {
            let payloadQ = { text: '', type: it.type };
            if (it.type === 'select') {
                payloadQ.options = optionLabels.slice(0, it.optionCount).map(l=>({ label:l, text:l }));
                payloadQ.correctOption = it.correctOption || 'A';
            } else if (it.type === 'checkbox') {
                payloadQ.options = optionLabels.slice(0, it.optionCount).map(l=>({ label:l, text:l }));
                payloadQ.correctOptions = it.correctOptions && it.correctOptions.length ? it.correctOptions : ['A'];
            } else if (it.type === 'input') {
                payloadQ.correctText = it.correctText || '';
            }
            const res = await dispatch(createQuestion(payloadQ));
            if (res.type.endsWith('fulfilled')) {
                const q = res.payload;
                createdIds.push(q._id || q?.id || q?.question?._id);
            } else {
                toast.error('Tạo câu trả lời thất bại ở một mục');
                return;
            }
        }
        const payload = { name: examName, description: '', questionIds: createdIds, durationMinutes: Number(duration) };
        // Calculate max score based on actual selected questions' parts (100 points per part)
        const selectedPartsFromQuestions = new Set(filteredItems.map(item => item.part));
        const maxScore = selectedPartsFromQuestions.size * 100;
        if (maxScore > 0) payload.maxScore = maxScore;
        if (startAt) payload.startAt = new Date(startAt);
        if (endAt) payload.endAt = new Date(endAt);
        if (className) payload.className = className;
        const res = await dispatch(createExam(payload));
        if (res.type.endsWith('fulfilled')) {
            toast.success(`Tạo đề thi thành công với ${filteredItems.length} câu (điểm tối đa: ${maxScore})`);
        } else {
            toast.error('Tạo đề thi thất bại');
        }
            setExamName(''); setDuration(30); setSelectedIds([]); setItems([]); setSelectedItems(new Set());
            setStartAt(''); setEndAt('');
            setClassName('');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo đề thi');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary text-white">
            <div className="max-w-4xl mx-auto px-5 py-10">
                <div>
                    <button className="mb-4 bg-white/10 hover:bg-white/20 rounded px-3 py-1" onClick={()=>navigate(-1)}>← Quay về</button>
                    <h2 className="text-2xl font-semibold mb-4">Tạo đề thi</h2>
                    <form id="examForm" onSubmit={createExamSubmit} className="space-y-3 mb-8">
                        <input className="w-full p-2 rounded text-black" placeholder="Tên đề thi" value={examName} onChange={(e)=>setExamName(e.target.value)} />
                        <input className="w-full p-2 rounded text-black" type="number" min="1" placeholder="Thời lượng (phút)" value={duration} onChange={(e)=>setDuration(e.target.value)} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <label className="block mb-1">Mở từ</label>
                                <input type="datetime-local" className="w-full p-2 rounded text-black" value={startAt} onChange={(e)=>setStartAt(e.target.value)} />
                            </div>
                            <div>
                                <label className="block mb-1">Đến</label>
                                <input type="datetime-local" className="w-full p-2 rounded text-black" value={endAt} onChange={(e)=>setEndAt(e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-1">Lớp áp dụng</label>
                                <select className="w-full p-2 rounded text-black" value={className} onChange={(e)=>setClassName(e.target.value)}>
                                    <option value="">-- Select class --</option>
                                    {classes.map((c)=> <option key={c._id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Tạo theo mẫu (Google Form style)</h2>
                    <div className="space-y-3">
                        <div className="bg-white/10 rounded p-4">
                            <div className="mb-2">Chọn loại mẫu:</div>
                            <div className="flex items-center gap-3 mb-3">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="template" value="final" checked={templateType==='final'} onChange={(e)=>{ setTemplateType(e.target.value); setSelectedParts({ reading: true, listening: true, writing: true }); }} /> Final test
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="template" value="mini" checked={templateType==='mini'} onChange={(e)=>{ setTemplateType(e.target.value); setSelectedParts({ reading: false, listening: false, writing: false }); }} /> Mini test
                                </label>
                                <button type="button" className="bg-white/10 hover:bg-white/20 rounded px-3 py-1" onClick={generateTemplate}>Tạo mẫu câu trả lời</button>
                            </div>
                            {templateType === 'mini' && (
                                <div className="mt-3">
                                    <div className="mb-2">Chọn phần thi (Mini test):</div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={selectedParts.reading} onChange={(e)=>setSelectedParts(prev=>({...prev, reading:e.target.checked}))} /> Reading (100 điểm)
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={selectedParts.listening} onChange={(e)=>setSelectedParts(prev=>({...prev, listening:e.target.checked}))} /> Listening (100 điểm)
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={selectedParts.writing} onChange={(e)=>setSelectedParts(prev=>({...prev, writing:e.target.checked}))} /> Writing (100 điểm)
                                        </label>
                                    </div>
                                </div>
                            )}
                            <div className="text-white/70 text-sm mt-2">
                                {templateType === 'final' ? 'Final test: bắt buộc 3 phần (Reading, Listening, Writing)' : 'Mini test: chọn 1-3 phần, mỗi phần 100 điểm'}
                            </div>
                        </div>

                        {items.length > 0 && (
                            <div className="max-h-[60vh] overflow-auto border border-white/20 rounded">
                                <div className="p-3 bg-white/5 border-b border-white/10">
                                    <div className="flex items-center justify-between">
                                        <span>Câu đã chọn: {selectedItems.size}/{items.length}</span>
                                        <div className="flex gap-2">
                                            <button type="button" className="bg-white/10 hover:bg-white/20 rounded px-2 py-1 text-sm" onClick={()=>setSelectedItems(new Set(items.map((_,i)=>i)))}>Chọn tất cả</button>
                                            <button type="button" className="bg-white/10 hover:bg-white/20 rounded px-2 py-1 text-sm" onClick={()=>setSelectedItems(new Set())}>Bỏ chọn tất cả</button>
                                        </div>
                                    </div>
                                </div>
                                {items.map((it, idx)=> (
                                    <div key={idx} className="p-3 border-b border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" checked={selectedItems.has(idx)} onChange={(e)=>{
                                                    const newSet = new Set(selectedItems);
                                                    if (e.target.checked) newSet.add(idx); else newSet.delete(idx);
                                                    setSelectedItems(newSet);
                                                }} />
                                                <span className="font-medium">Câu {idx+1} ({it.part})</span>
                                            </div>
                                            <select className="text-black p-1 rounded" value={it.type} onChange={(e)=>{
                                                const v = e.target.value; setItems((arr)=> arr.map((x,i)=> i===idx? { ...x, type:v }: x));
                                            }}>
                                                <option value="select">Trắc nghiệm (một đáp án)</option>
                                                <option value="checkbox">Trắc nghiệm (nhiều đáp án)</option>
                                                <option value="input">Điền từ</option>
                                            </select>
                                        </div>
                                        {it.type !== 'input' && (
                                            <div className="flex items-center gap-3 mb-2">
                                                <label>Số đáp án:</label>
                                                <input type="number" min={2} max={4} className="w-20 text-black p-1 rounded" value={it.optionCount} onChange={(e)=>{
                                                    let n = parseInt(e.target.value||'4',10); if (n<2) n=2; if (n>4) n=4;
                                                    setItems((arr)=> arr.map((x,i)=> i===idx? { ...x, optionCount:n, correctOption:'A', correctOptions:[] }: x));
                                                }} />
                                            </div>
                                        )}
                                        {it.type === 'select' && (
                                            <div>
                                                <label className="mr-2">Đáp án đúng:</label>
                                                <select className="text-black p-1 rounded" value={it.correctOption} onChange={(e)=> setItems((arr)=> arr.map((x,i)=> i===idx? { ...x, correctOption:e.target.value }: x))}>
                                                    {optionLabels.slice(0, it.optionCount).map((l)=> <option key={l} value={l}>{l}</option>)}
                                                </select>
                                            </div>
                                        )}
                                        {it.type === 'checkbox' && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {optionLabels.slice(0, it.optionCount).map((l)=> (
                                                    <label key={l} className="flex items-center gap-1">
                                                        <input type="checkbox" checked={it.correctOptions?.includes(l)} onChange={(e)=>{
                                                            setItems((arr)=> arr.map((x,i)=>{
                                                                if (i!==idx) return x;
                                                                const set = new Set(x.correctOptions||[]);
                                                                if (e.target.checked) set.add(l); else set.delete(l);
                                                                return { ...x, correctOptions: Array.from(set) };
                                                            }));
                                                        }} /> {l}
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                        {it.type === 'input' && (
                                            <div>
                                                <input className="w-full p-2 rounded text-black" placeholder="Đáp án đúng (chuỗi)" value={it.correctText} onChange={(e)=> setItems((arr)=> arr.map((x,i)=> i===idx? { ...x, correctText:e.target.value }: x))} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8">
                    <button 
                        type="submit" 
                        form="examForm" 
                        className="bg-pink rounded px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
                        disabled={isCreating}
                    >
                        {isCreating && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {isCreating ? 'Đang tạo đề thi...' : 'Tạo đề thi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTests;

