import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listClasses, createClass } from '../../features/classes/classesSlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MyClasses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, isLoading } = useSelector((s)=> s.classes);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(()=>{ dispatch(listClasses()); },[dispatch]);

    const onCreate = async (e) => {
        e.preventDefault();
        const res = await dispatch(createClass({ name, description }));
        if (res.type.endsWith('fulfilled')) { toast.success('Đã tạo lớp'); setName(''); setDescription(''); }
        else { toast.error('Tạo lớp thất bại'); }
    };

    return (
        <div className="min-h-screen bg-primary text-white">
            <div className="max-w-4xl mx-auto px-5 py-10">
                <button className="mb-4 bg-white/10 hover:bg-white/20 rounded px-3 py-1" onClick={()=>navigate(-1)}>← Quay về</button>
                <h1 className="text-3xl font-semibold mb-4">Lớp học của tôi</h1>

                <form onSubmit={onCreate} className="bg-white/10 rounded p-4 mb-6 grid md:grid-cols-2 gap-3">
                    <input className="p-2 rounded text-black" placeholder="Tên lớp (VD: 12A1)" value={name} onChange={(e)=>setName(e.target.value)} required />
                    <input className="p-2 rounded text-black" placeholder="Mô tả" value={description} onChange={(e)=>setDescription(e.target.value)} />
                    <div className="md:col-span-2"><button type="submit" className="bg-pink rounded px-4 py-2">Tạo lớp</button></div>
                </form>

                <h2 className="text-2xl font-semibold mb-2">Danh sách lớp</h2>
                {isLoading && <div>Loading...</div>}
                <div className="space-y-2">
                    {items.map((c)=> (
                        <div key={c._id} className="bg-white/10 rounded p-4">
                            <div className="text-lg font-medium">{c.name}</div>
                            <div className="text-white/70 text-sm">{c.description}</div>
                        </div>
                    ))}
                    {!items.length && !isLoading && <div className="text-white/70">Chưa có lớp nào.</div>}
                </div>
            </div>
        </div>
    );
};

export default MyClasses;

