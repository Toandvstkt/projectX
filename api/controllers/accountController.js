const asyncHandler = require('express-async-handler');
const Account = require('./../models/accountModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: '30d',
    });
};

const login = asyncHandler(async (req, res) => {
    const { userId, password } = req.body;

    const account = await Account.findOne({ userId }).select('+password');

    if (
        account &&
        (await account.comparePasswordInDb(password, account.password))
    ) {
        res.status(200).json({
            status: 'success',
            data: {
                account,
                token: generateToken(account._id),
            },
        });
    } else {
        res.status(400);
        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }
});
const register = asyncHandler(async (req, res) => {
    let { userId, password, role, name, dob } = req.body;

    if (!userId) {
        res.status(400);
        throw new Error('userId là bắt buộc');
    }

    userId = userId.toLowerCase();

    const accountExistsByUsername = await Account.findOne({ userId });
	await Account.deleteMany({ userId: { $exists: false } });
	console.log("Đã xóa tất cả tài khoản không có userId!");
    if (accountExistsByUsername) {
        res.status(400);
        throw new Error('Tên đăng nhập đã tồn tại');
    }

    const account = await Account.create({ userId, password, role, name, dob });

    res.status(201).json({
        status: 'success',
        data: { account },
    });
});

const getAllAccounts = asyncHandler(async (req, res) => {
    const accounts = await Account.find({});

    res.status(200).json({
        status: 'success',
        data: {
            accounts,
        },
    });
});


const getAccountInformation = asyncHandler(async (req, res) => {
    const account = await Account.findById(req.account._id);

    if (!account) {
        res.status(404);
        throw new Error('Tài khoản không tồn tại');
    }
    res.status(200).json({
        status: 'success',
        data: {
            account,
        },
    });
});

module.exports = {
    register,
    login,
    getAccountInformation,
    getAllAccounts,
};
