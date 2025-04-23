import axios from 'axios';

const API_URL = '/projectx/api/accounts/';

const login = async (accountData) => {
	const response = await axios.post(API_URL + 'login', accountData);
  
	if (response.data && response.data.data && response.data.data.account) {
	  localStorage.setItem('account', JSON.stringify(response.data.data.account));
	  return response.data.data.account;
	} else {
	  throw new Error('Dữ liệu tài khoản không hợp lệ');
	}
  };

const register = async (accountData) => {
	const response = await axios.post(API_URL + 'register', accountData);
	return response.data.data.account;
};

const getAllAccounts = async (token) => {
	const response = await axios.get(API_URL);
	return response.data.data.accounts;
};

const logout = async () => {
	localStorage.removeItem('account');
};
const authService = {
	login,
	logout,
	register,
	getAllAccounts,
};

export default authService;
