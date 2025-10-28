import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
} from 'react-router-dom';
import 'aos/dist/aos.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Layout } from './layout';
import { useMemo } from 'react';
import { TeacherPage } from './pages/TeacherPage';
import { StudentPage } from './pages/StudentPage';
import { CreateTests } from './pages/CreateTests';
import TeacherExamsList from './pages/TeacherPage/TeacherExamsList';
import TeacherExamDetail from './pages/TeacherPage/TeacherExamDetail';
import StudentExamsList from './pages/StudentPage/StudentExamsList';
import TakeExam from './pages/StudentPage/TakeExam';
import StudentHistory from './pages/StudentPage/StudentHistory';
import MyClasses from './pages/TeacherPage/MyClasses';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { ExamPage } from './pages/ExamPage';
// import { MyAccount } from './pages/MyAccount';

const App = () => {
	return (
		<Router>
			<AppContent />
		</Router>
	);
};

const RequireAuth = ({ children }) => {
    const token = useMemo(() => localStorage.getItem('token'), []);
    if (!token) {
        window.location.href = '/login';
        return null;
    }
    return children;
};

const AppContent = () => {
	const { pathname } = useLocation();

	const isAdminPage = pathname.startsWith('/admin');
	return (
		<div className="app-container select-none bg-white">
			{!isAdminPage && <div className="sidebar-container z-50"></div>}
			{/* {!isAdminPage && <Chat />} */}

			<div className="content-container select-none">
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route path="/" element={<LoginPage />} />
                    <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/login" element={<LoginPage />} />
                    <Route path="/exams" element={<RequireAuth><StudentExamsList /></RequireAuth>} />
                    <Route path="/exams/:id/take" element={<RequireAuth><TakeExam /></RequireAuth>} />
                    <Route path="/history" element={<RequireAuth><StudentHistory /></RequireAuth>} />
                    <Route path="/teacher" element={<RequireAuth><TeacherPage /></RequireAuth>} />
                    <Route path="/teacher/exams" element={<RequireAuth><TeacherExamsList /></RequireAuth>} />
                    <Route path="/teacher/exams/:id" element={<RequireAuth><TeacherExamDetail /></RequireAuth>} />
                    <Route path="/my-classes" element={<RequireAuth><MyClasses /></RequireAuth>} />
                    <Route path="/student" element={<RequireAuth><StudentPage /></RequireAuth>} />
                    <Route path="/create-tests" element={<RequireAuth><CreateTests /></RequireAuth>} />
					</Route>
				</Routes>
			</div>
		</div>
	);
};

export default App;
