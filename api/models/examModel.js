const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }],
		durationMinutes: { type: Number, required: true },
		className: { type: String },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
		startAt: { type: Date },
		endAt: { type: Date },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);

