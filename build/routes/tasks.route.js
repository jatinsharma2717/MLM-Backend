"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const tasks_controller_1 = require("../controllers/tasks.controller");
const tasksRouter = express.Router();
tasksRouter.route('/').get(tasks_controller_1.getAllTasks);
tasksRouter.route('/').post(tasks_controller_1.createTask);
tasksRouter.route('/:id').put(tasks_controller_1.updateTask);
tasksRouter.route('').patch(tasks_controller_1.deleteTasks);
tasksRouter.route('/:id').get(tasks_controller_1.getTask);
exports.default = tasksRouter;
//# sourceMappingURL=tasks.route.js.map