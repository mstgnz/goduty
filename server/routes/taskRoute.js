const express = require('express');
const router = express.Router();
const { taskCreate, taskList, taskDelete } = require('../controllers/taskController');
const accessRouteMiddleware = require('../middlewares/accessRouteMiddleware');

router.post("/create", accessRouteMiddleware, taskCreate);

router.get("/task", accessRouteMiddleware, taskList);

router.post("/delete", accessRouteMiddleware, taskDelete);

module.exports = router;