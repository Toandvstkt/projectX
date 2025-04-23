const express = require('express');
const {
	login,
	register,
	getAccountInformation,
	getAllAccounts,
} = require('../controllers/accountController');
const { protect, restrict } = require('../middleware/accountMiddleware');
const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);
router
	.route('/information')
	.get(protect, getAccountInformation);
router.route('/').get(getAllAccounts);
module.exports = router;
