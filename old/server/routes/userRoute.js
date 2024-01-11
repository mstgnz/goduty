const express = require('express');
const router = express.Router();
const { getUser, deleteUser } = require('../controllers/userController');
const accessRouteMiddleware = require('../middlewares/accessRouteMiddleware');

router.get("/:id?", getUser);

router.delete("/delete", accessRouteMiddleware, deleteUser);

module.exports = router;