const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const { createExam, listMyExams, getExamById, updateExam, deleteExam, listPublicExams, getExamForTaking, submitExam, getExamHistory, getExamAttemptDetail, exportExam, importExam, listScoresByClass } = require('../controllers/examController');

const router = express.Router();

// Public/student endpoints
router.get('/public', protect, listPublicExams);
router.get('/history', protect, getExamHistory);
router.get('/attempts/:attemptId', protect, getExamAttemptDetail);
router.get('/:id/take', protect, getExamForTaking);
router.post('/:id/submit', protect, submitExam);

// Teacher endpoints
router.use(protect, restrict('Giáo viên'));

router.route('/')
	.get(listMyExams)
	.post(createExam);

// Scores overview
router.get('/scores', listScoresByClass);

// Specific routes before generic /:id
router.get('/:id/export', exportExam);
router.post('/import', importExam);

router.route('/:id')
	.get(getExamById)
	.patch(updateExam)
	.delete(deleteExam);

module.exports = router;

