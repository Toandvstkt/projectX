const express = require('express');
const { protect } = require('../middleware/accountMiddleware');
const asyncHandler = require('express-async-handler');
const ExamAttempt = require('../models/examAttemptModel');
const Exam = require('../models/examModel');

const router = express.Router();

router.get('/me', protect, asyncHandler(async (req, res) => {
    const attempts = await ExamAttempt.find({ studentId: req.account._id })
        .sort('-createdAt')
        .populate('examId', 'name durationMinutes');
    res.status(200).json({ status: 'success', data: { attempts } });
}));

module.exports = router;

