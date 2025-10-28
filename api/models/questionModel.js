const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
	{
		label: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
		text: { type: String, required: true },
	},
	{ _id: false }
);

const questionSchema = new mongoose.Schema(
	{
		text: { type: String, default: '' },
		type: { type: String, enum: ['select','checkbox','input'], default: 'select' },
		options: { type: [optionSchema] },
		correctOption: { type: String, enum: ['A', 'B', 'C', 'D'] },
		correctOptions: [{ type: String, enum: ['A','B','C','D'] }],
		correctText: { type: String },
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);

