import { Outlet } from "react-router-dom";
// import { Footer, Header } from "../components";
import { ToastBar, Toaster } from "react-hot-toast";

export const Layout = () => {
	return (
		<div className="flex flex-col min-h-screen">
			{/* <Header /> */}
			<div className="flex-grow">
				<Outlet />
			</div>
			{/* <Footer /> */}
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
