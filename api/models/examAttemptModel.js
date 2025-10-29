const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
	{
		questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
		selectedOption: { type: String, enum: ['A','B','C','D'], required: true },
	},
	{ _id: false }
);

const examAttemptSchema = new mongoose.Schema(
	{
		examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
		studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
		answers: { type: [answerSchema], default: [] },
		score: { type: Number, default: 0 },
		totalQuestions: { type: Number, default: 0 },
		correctCount: { type: Number, default: 0 },
		completedAt: { type: Date },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('ExamAttempt', examAttemptSchema);

