const asyncHandler = require('express-async-handler');
const Question = require('../models/questionModel');

// Create question (teacher only)
const createQuestion = asyncHandler(async (req, res) => {
    const { text, options, correctOption, correctOptions, correctText, type } = req.body;
    const createdBy = req.account._id;
    const payload = { text, options, correctOption, correctOptions, correctText, type, createdBy };
    const question = await Question.create(payload);
    res.status(201).json({ status: 'success', data: { question } });
});

// List questions (own)
const listMyQuestions = asyncHandler(async (req, res) => {
    const questions = await Question.find({ createdBy: req.account._id }).sort('-createdAt');
    res.status(200).json({ status: 'success', data: { questions } });
});

module.exports = { createQuestion, listMyQuestions };
const updateQuestion = asyncHandler(async (req, res) => {
    const q = await Question.findOne({ _id: req.params.id, createdBy: req.account._id });
    if (!q) { res.status(404); throw new Error('Question not found'); }
    const allowed = ['text','options','correctOption'];
    allowed.forEach((k)=>{ if (req.body[k] !== undefined) q[k] = req.body[k]; });
    await q.save();
    res.status(200).json({ status:'success', data:{ question: q } });
});

const deleteQuestion = asyncHandler(async (req, res) => {
    const q = await Question.findOneAndDelete({ _id: req.params.id, createdBy: req.account._id });
    if (!q) { res.status(404); throw new Error('Question not found'); }
    res.status(204).json({ status:'success', data:null });
});

module.exports = { createQuestion, listMyQuestions, updateQuestion, deleteQuestion };

