const Task = require("../models/Task");
const CustomError = require('../classes/CustomError');
const asyncWrapper = require('express-async-handler');

const taskCreate = asyncWrapper(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "task create"
    });
});

const taskList = asyncWrapper(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "task list"
    });
});

const taskDelete = asyncWrapper(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "task delete"
    });
});

module.exports = {
    taskCreate,
    taskList,
    taskDelete
}