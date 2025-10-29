import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const StudentNav = () => {
    const location = useLocation();
    
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="bg-primary/90 backdrop-blur-sm border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <Link 
                            to="/exams" 
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                isActive('/exams') 
                                    ? 'bg-white/20 text-white' 
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            Bài thi
                        </Link>
                        <Link 
                            to="/history" 
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                isActive('/history') 
                                    ? 'bg-white/20 text-white' 
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            Lịch sử
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <span className="text-white/70 text-sm">
                            Học viên
                        </span>
                        <button 
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('account');
                                window.location.href = '/login';
                            }}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default StudentNav;
