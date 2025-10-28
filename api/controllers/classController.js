const asyncHandler = require('express-async-handler');
const Classroom = require('../models/classModel');

const listClasses = asyncHandler(async (req, res) => {
    const classes = await Classroom.find({}).sort('name');
    res.status(200).json({ status: 'success', data: { classes } });
});

const createClass = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const cls = await Classroom.create({ name, description });
    res.status(201).json({ status: 'success', data: { class: cls } });
});

module.exports = { listClasses, createClass };

