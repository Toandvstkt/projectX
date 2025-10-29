import { Outlet, useLocation } from "react-router-dom";
import { ToastBar, Toaster } from "react-hot-toast";
import StudentNav from "../components/StudentNav";

export const Layout = () => {
	const location = useLocation();
	const isStudentPage = location.pathname.startsWith('/exams') || location.pathname.startsWith('/history');
	
	return (
		<div className="flex flex-col min-h-screen">
			{isStudentPage && <StudentNav />}
			<div className="flex-grow">
				<Outlet />
			</div>
			<Toaster>
				{(t) => (
					<ToastBar
						toast={t}
						style={{
							...t.style,
							animation: t.visible
								? 'custom-enter 1s ease'
								: 'custom-exit 1s ease',
						}}
					/>
				)}
			</Toaster>
		</div>
	);
};
