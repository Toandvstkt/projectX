const jwt = require('jsonwebtoken');
const Account = require('./../models/accountModel');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1];

			const decoded = jwt.verify(token, process.env.SECRET_STR);

			req.account = await Account.findById(decoded.id).select('-password');

			next();
		} catch (error) {
			res.status(401);
			throw new Error('Chưa xác thực!');
		}

		if (!token) {
			res.status(401);
			throw new Error('Không có token');
		}
	} else {
		res.status(401);
		throw new Error('Không có token');
	}
});

const restrict = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.account.role)) {
			res.status(403);
			throw new Error('Bạn không có quyền thực hiện hành động này');
		}
		next();
	};
};
module.exports = { protect, restrict };
