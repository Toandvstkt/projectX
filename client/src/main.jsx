import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import { hydrate } from './features/auth/authSlice.js';

// Hydrate user from token on app start
if (localStorage.getItem('token')) {
    store.dispatch(hydrate());
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);
