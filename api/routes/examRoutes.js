const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const { createExam, listMyExams, getExamById, updateExam, deleteExam, listPublicExams, getExamForTaking, submitExam, exportExam, importExam } = require('../controllers/examController');

const router = express.Router();

// Public/student endpoints
router.get('/public', listPublicExams);
router.get('/:id/take', getExamForTaking);
router.post('/:id/submit', protect, submitExam);

// Teacher endpoints
router.use(protect, restrict('Giáo viên'));

router.route('/')
	.get(listMyExams)
	.post(createExam);

router.route('/:id').get(getExamById);
router.route('/:id')
	.patch(updateExam)
	.delete(deleteExam);

router.get('/:id/export', exportExam);
router.post('/import', importExam);

module.exports = router;

