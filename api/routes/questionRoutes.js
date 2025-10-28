const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const { createQuestion, listMyQuestions, updateQuestion, deleteQuestion } = require('../controllers/questionController');

const router = express.Router();

router.use(protect, restrict('Giáo viên'));

router.route('/')
	.get(listMyQuestions)
	.post(createQuestion);

router.route('/:id')
	.patch(updateQuestion)
	.delete(deleteQuestion);

module.exports = router;

