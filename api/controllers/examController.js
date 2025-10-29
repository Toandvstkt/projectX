const asyncHandler = require('express-async-handler');
const Exam = require('../models/examModel');
const Question = require('../models/questionModel');
const ExamAttempt = require('../models/examAttemptModel');

// Create exam (teacher only)
const createExam = asyncHandler(async (req, res) => {
    const { name, description, questionIds, durationMinutes, startAt, endAt, className } = req.body;
    const createdBy = req.account._id;
    const exam = await Exam.create({ name, description, questionIds, durationMinutes, startAt, endAt, className, user: createdBy });
    res.status(201).json({ status: 'success', data: { exam } });
});

// List own exams
const listMyExams = asyncHandler(async (req, res) => {
    const exams = await Exam.find({ user: req.account._id }).sort('-createdAt');
    res.status(200).json({ status: 'success', data: { exams } });
});

module.exports = { createExam, listMyExams };
// Get exam by id (own)
const getExamById = asyncHandler(async (req, res) => {
    const exam = await Exam.findOne({ _id: req.params.id, user: req.account._id }).populate('questionIds');
    if (!exam) {
        res.status(404);
        throw new Error('Exam not found');
    }
    res.status(200).json({ status: 'success', data: { exam } });
});

module.exports = { createExam, listMyExams, getExamById };
const updateExam = asyncHandler(async (req, res) => {
    const exam = await Exam.findOne({ _id: req.params.id, user: req.account._id });
    if (!exam) { res.status(404); throw new Error('Exam not found'); }
    const allowed = ['name','description','questionIds','durationMinutes','startAt','endAt','className'];
    allowed.forEach((k)=>{ if (req.body[k] !== undefined) exam[k] = req.body[k]; });
    await exam.save();
    res.status(200).json({ status:'success', data:{ exam } });
});

const deleteExam = asyncHandler(async (req, res) => {
    const exam = await Exam.findOneAndDelete({ _id: req.params.id, user: req.account._id });
    if (!exam) { res.status(404); throw new Error('Exam not found'); }
    res.status(204).json({ status:'success', data:null });
});

module.exports = { createExam, listMyExams, getExamById, updateExam, deleteExam };
// Student: list public exams (simplified - all exams)
const listPublicExams = asyncHandler(async (req, res) => {
    console.log('=== LIST PUBLIC EXAMS CALLED ===');
    const now = new Date();
    const match = {
        $and: [
            { $or: [ { startAt: { $exists: false } }, { startAt: { $lte: now } } ] },
            { $or: [ { endAt: { $exists: false } }, { endAt: { $gte: now } } ] },
        ]
    };

    // Filter by student's class
    const studentClass = req.account.class;
    console.log('=== DEBUG LIST PUBLIC EXAMS ===');
    console.log('Student account:', req.account);
    console.log('Student class:', studentClass);
    if (studentClass) {
        match.className = studentClass;
    }
    console.log('Match query:', match);

    const exams = await Exam.find(match).select('name durationMinutes createdAt startAt endAt className');
    console.log('Found exams:', exams.length);
    console.log('Exams data:', exams);
    res.status(200).json({ status: 'success', data: { exams } });
});

// Student: get exam for taking (with questions)
const getExamForTaking = asyncHandler(async (req, res) => {
    const now = new Date();
    const exam = await Exam.findById(req.params.id).populate('questionIds');
    if (!exam) { res.status(404); throw new Error('Exam not found'); }
    if ((exam.startAt && exam.startAt > now) || (exam.endAt && exam.endAt < now)) {
        res.status(403); throw new Error('Exam is not available at this time');
    }
    // Only send necessary fields
    res.status(200).json({ status: 'success', data: { exam } });
});

// Student: submit answers and score
const submitExam = asyncHandler(async (req, res) => {
    const { answers } = req.body; // [{questionId, selectedOption}]
    const examId = req.params.id;
    const studentId = req.account._id;
    const now = new Date();
    const exam = await Exam.findById(examId).populate('questionIds');
    if (!exam) { res.status(404); throw new Error('Exam not found'); }
    if ((exam.startAt && exam.startAt > now) || (exam.endAt && exam.endAt < now)) {
        res.status(403); throw new Error('Exam is not available at this time');
    }
    const existed = await ExamAttempt.findOne({ examId, studentId });
    if (existed) { res.status(409); throw new Error('You have already submitted this exam'); }

    const correctMap = new Map(exam.questionIds.map((q)=> [q._id.toString(), q.correctOption]));
    let score = 0;
    for (const ans of answers || []) {
        if (correctMap.get(ans.questionId) === ans.selectedOption) score += 1;
    }

    const totalQuestions = exam.questionIds.length;
    const correctCount = score;

    const attempt = await ExamAttempt.create({ examId, studentId, answers, score, completedAt: new Date() });
    res.status(201).json({ status: 'success', data: { attempt: { ...attempt.toObject(), totalQuestions, correctCount } } });
});

module.exports = { createExam, listMyExams, getExamById, updateExam, deleteExam, listPublicExams, getExamForTaking, submitExam };
// Export/Import (teacher)
const exportExam = asyncHandler(async (req, res) => {
    const exam = await Exam.findOne({ _id: req.params.id, createdBy: req.account._id }).populate('questionIds');
    if (!exam) { res.status(404); throw new Error('Exam not found'); }
    res.setHeader('Content-Disposition', `attachment; filename=exam_${exam._id}.json`);
    res.json({
        name: exam.name,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        className: exam.className,
        startAt: exam.startAt,
        endAt: exam.endAt,
        questions: exam.questionIds.map(q=> ({ text: q.text, options: q.options, correctOption: q.correctOption }))
    });
});

const importExam = asyncHandler(async (req, res) => {
    const { name, description, durationMinutes, className, startAt, endAt, questions } = req.body;
    const createdBy = req.account._id;
    // Create questions first
    const createdQs = await Question.insertMany((questions||[]).map(q=> ({ text: q.text, options: q.options, correctOption: q.correctOption, createdBy })));
    const exam = await Exam.create({ name, description, durationMinutes, className, startAt, endAt, questionIds: createdQs.map(q=> q._id), createdBy });
    res.status(201).json({ status: 'success', data: { exam } });
});

module.exports = { createExam, listMyExams, getExamById, updateExam, deleteExam, listPublicExams, getExamForTaking, submitExam, exportExam, importExam };

