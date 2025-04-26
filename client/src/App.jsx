import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
} from 'react-router-dom';
import 'aos/dist/aos.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Layout } from './layout';
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
						<Route path="/home" element={<HomePage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/exams" element={<ExamPage />} />
					</Route>
				</Routes>
			</div>
		</div>
	);
};

export default App;
