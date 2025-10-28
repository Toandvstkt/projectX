const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const { listClasses, createClass } = require('../controllers/classController');

const router = express.Router();

router.get('/', listClasses);
router.post('/', protect, restrict('Giáo viên'), createClass);

module.exports = router;

