import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAccounts } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const StatCard = ({ label, value }) => {
    return (
        <div className="bg-white/10 rounded-xl p-5 text-center shadow">
            <div className="text-sm text-white/80 mb-1">{label}</div>
            <div className="text-3xl font-semibold">{value}</div>
        </div>
    );
};

const TeacherPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { accounts, isLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getAllAccounts());
    }, [dispatch]);

    const { total, teachers, students } = useMemo(() => {
        const totalCount = accounts?.length || 0;
        const teacherCount = accounts?.filter((a) => a.role === 'Giáo viên').length || 0;
        const studentCount = accounts?.filter((a) => a.role === 'Học viên').length || 0;
        return { total: totalCount, teachers: teacherCount, students: studentCount };
    }, [accounts]);

    return (
        <div className="min-h-screen bg-primary text-white">
            <div className="max-w-5xl mx-auto px-5 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold">Teacher Dashboard</h1>
                    <p className="text-white/80 mt-1">Quản lý lớp học và đề thi</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <StatCard label="Tổng tài khoản" value={isLoading ? '—' : total} />
                    <StatCard label="Giáo viên" value={isLoading ? '—' : teachers} />
                    <StatCard label="Học viên" value={isLoading ? '—' : students} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        className="bg-pink hover:bg-pink/90 transition rounded-xl p-5 text-left shadow"
                        onClick={() => navigate('/create-tests')}
                    >
                        <div className="text-xl font-medium mb-1">Tạo đề thi</div>
                        <div className="text-white/80 text-sm">Khởi tạo đề mới, chọn câu hỏi, cài đặt thời gian</div>
                    </button>

                    <button
                        className="bg-white/10 hover:bg-white/20 transition rounded-xl p-5 text-left shadow"
                        onClick={() => navigate('/my-classes')}
                    >
                        <div className="text-xl font-medium mb-1">Lớp học của tôi</div>
                        <div className="text-white/80 text-sm">Quản lý danh sách lớp và học viên</div>
                    </button>

                    <button
                        className="bg-white/10 hover:bg-white/20 transition rounded-xl p-5 text-left shadow"
                        onClick={() => navigate('/teacher/exams')}
                    >
                        <div className="text-xl font-medium mb-1">Danh sách đề</div>
                        <div className="text-white/80 text-sm">Xem và quản lý các đề đã tạo</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherPage;

