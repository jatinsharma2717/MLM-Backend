"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTask = exports.deleteTasks = exports.createTask = exports.getTask = exports.getAllTasks = void 0;
const task_1 = require("../data/task");
const tasks_1 = require("../modals/tasks");
const getAllTasks = async (req, res) => {
    try {
        const tasks = await tasks_1.Tasks.find();
        const response = {
            data: tasks,
            message: "success",
            statuscode: 200,
        };
        res.status(200).status(200).send(response);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getAllTasks = getAllTasks;
const getTask = async (req, res) => {
    try {
        const task = await tasks_1.Tasks.findById(req.params.id);
        const responseBody = {
            data: task,
            message: "success",
            statusCode: 200
        };
        res.status(200).send(responseBody);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getTask = getTask;
const createTask = async (req, res) => {
    const newTask = new tasks_1.Tasks({
        tasktitle: req.body.tasktitle,
        note: req.body.note,
        duedate: req.body.duedate,
        remindtime: req.body.remindtime,
    });
    try {
        await newTask.save();
        res.status(200).send(task_1.createTaskResponse);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.createTask = createTask;
const deleteTasks = async (req, res) => {
    try {
        const taskids = req.body.ids;
        await tasks_1.Tasks.deleteMany({ _id: { $in: taskids } });
        res.status(200).send(task_1.deleteTaskResponse);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.deleteTasks = deleteTasks;
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const updatedTask = await tasks_1.Tasks.findByIdAndUpdate(taskId, {
            $set: {
                tasktitle: req.body.tasktitle,
                note: req.body.note,
                duedate: req.body.duedate,
                remindtime: req.body.remindtime,
            },
        }, { new: true });
        const response = {
            data: updatedTask,
            message: "success",
            statusCode: 200,
        };
        res.status(200).send(response);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.updateTask = updateTask;
//# sourceMappingURL=tasks.controller.js.map