const asyncHandler = require('express-async-handler');
const Exam = require('../models/examModel');
const Question = require('../models/questionModel');
const ExamAttempt = require('../models/examAttemptModel');

// Create exam (teacher only)
const createExam = asyncHandler(async (req, res) => {
    console.log('=== CREATE EXAM ===');
    console.log('Request body:', req.body);
    const { name, description, questionIds, durationMinutes, startAt, endAt, className, allowRetake } = req.body;
    const createdBy = req.account._id;
    console.log('Question IDs:', questionIds);
    console.log('Question IDs length:', questionIds?.length || 0);
    const exam = await Exam.create({ 
        name, 
        description, 
        questionIds, 
        durationMinutes, 
        startAt, 
        endAt, 
        className, 
        allowRetake: allowRetake || false,
        user: createdBy 
    });
    console.log('Created exam:', exam);
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
    const allowed = ['name','description','questionIds','durationMinutes','startAt','endAt','className','allowRetake'];
    allowed.forEach((k)=>{ if (req.body[k] !== undefined) exam[k] = req.body[k]; });
    await exam.save();
    res.status(200).json({ status:'success', data:{ exam } });
});

const deleteExam = asyncHandler(async (req, res) => {
    const exam = await Exam.findOneAndDelete({ _id: req.params.id, user: req.account._id });
    if (!exam) { res.status(404); throw new Error('Exam not found'); }
    res.status(204).json({ status:'success', data:null });
});

// Teacher: list scores of my exams, optional class filter
const listScoresByClass = asyncHandler(async (req, res) => {
    const teacherId = req.account._id;
    const { className } = req.query;
    // find exams owned by teacher (and optional class)
    const examQuery = { user: teacherId };
    if (className) examQuery.className = className;
    const exams = await Exam.find(examQuery).select('_id name className');
    const examIds = exams.map(e => e._id);
    if (!examIds.length) return res.status(200).json({ status: 'success', data: { attempts: [] } });
    const attempts = await ExamAttempt.find({ examId: { $in: examIds } })
        .populate('examId', 'name className durationMinutes')
        .populate('studentId', 'name userId class')
        .sort('-createdAt');
    res.status(200).json({ status: 'success', data: { attempts } });
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
    console.log('=== GET EXAM FOR TAKING ===');
    console.log('Exam ID:', req.params.id);
    const now = new Date();
    const exam = await Exam.findById(req.params.id).populate('questionIds');
    console.log('Found exam:', exam ? 'Yes' : 'No');
    if (exam) {
        console.log('Questions count:', exam.questionIds?.length || 0);
        console.log('First question:', exam.questionIds?.[0]);
    }
    if (!exam) { res.status(404); throw new Error('Exam not found'); }
    if ((exam.startAt && exam.startAt > now) || (exam.endAt && exam.endAt < now)) {
        res.status(403); throw new Error('Exam is not available at this time');
    }
    // Only send necessary fields
    res.status(200).json({ status: 'success', data: { exam } });
});

// Student: submit answers and score
const submitExam = asyncHandler(async (req, res) => {
    console.log('=== SUBMIT EXAM ===');
    console.log('Request body:', req.body);
    console.log('Exam ID:', req.params.id);
    console.log('Student ID:', req.account._id);
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
    console.log('=== CHECK EXISTING ATTEMPT ===');
    console.log('Exam ID:', examId);
    console.log('Student ID:', studentId);
    console.log('Existing attempt:', existed);
    console.log('Exam allowRetake:', exam.allowRetake);
    
    if (existed) { 
        if (!exam.allowRetake) {
            console.log('Attempt already exists and retake not allowed, returning 409');
            res.status(409); 
            throw new Error('Bạn đã làm bài thi này rồi. Không được phép làm lại.'); 
        } else {
            console.log('Attempt already exists, deleting old attempt to allow resubmit');
            await ExamAttempt.deleteOne({ _id: existed._id });
            console.log('Old attempt deleted');
        }
    }

    const correctMap = new Map(exam.questionIds.map((q)=> [q._id.toString(), q.correctOption]));
    let correctCount = 0;
    for (const ans of answers || []) {
        if (correctMap.get(ans.questionId) === ans.selectedOption) correctCount += 1;
    }

    const totalQuestions = exam.questionIds.length;
    // Tính điểm theo công thức: 100 / số câu được tick * số câu đúng
    const pointsPerQuestion = totalQuestions > 0 ? 100 / totalQuestions : 0;
    const score = Math.round(correctCount * pointsPerQuestion);
    
    console.log('=== SCORING CALCULATION ===');
    console.log('Total questions:', totalQuestions);
    console.log('Correct count:', correctCount);
    console.log('Points per question:', pointsPerQuestion);
    console.log('Final score:', score);

    console.log('Creating new attempt with:', { examId, studentId, answers, score, totalQuestions, correctCount });
    const attempt = await ExamAttempt.create({ 
        examId, 
        studentId, 
        answers, 
        score, 
        totalQuestions, 
        correctCount, 
        completedAt: new Date() 
    });
    console.log('Attempt created successfully:', attempt._id);
    res.status(201).json({ status: 'success', data: { attempt: { ...attempt.toObject(), totalQuestions, correctCount } } });
});

// Student: get exam history
const getExamHistory = asyncHandler(async (req, res) => {
    const studentId = req.account._id;
    const attempts = await ExamAttempt.find({ studentId })
        .populate('examId', 'name durationMinutes className createdAt')
        .sort('-completedAt');
    res.status(200).json({ status: 'success', data: { attempts } });
});

// Student: get exam attempt detail
const getExamAttemptDetail = asyncHandler(async (req, res) => {
    const attemptId = req.params.attemptId;
    const studentId = req.account._id;
    const attempt = await ExamAttempt.findOne({ _id: attemptId, studentId })
        .populate('examId', 'name durationMinutes className createdAt')
        .populate({
            path: 'examId',
            populate: {
                path: 'questionIds',
                select: 'text type options correctOption correctOptions correctText'
            }
        });
    if (!attempt) { res.status(404); throw new Error('Attempt not found'); }
    res.status(200).json({ status: 'success', data: { attempt } });
});

// Export/Import (teacher)
const exportExam = asyncHandler(async (req, res) => {
    const exam = await Exam.findOne({ _id: req.params.id, user: req.account._id }).populate('questionIds');
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
    const exam = await Exam.create({ name, description, durationMinutes, className, startAt, endAt, questionIds: createdQs.map(q=> q._id), user: createdBy });
    res.status(201).json({ status: 'success', data: { exam } });
});

module.exports = { 
    createExam, 
    listMyExams, 
    getExamById, 
    updateExam, 
    deleteExam, 
    listPublicExams, 
    getExamForTaking, 
    submitExam, 
    getExamHistory, 
    getExamAttemptDetail,
    exportExam, 
    importExam 
};

module.exports.listScoresByClass = listScoresByClass;

