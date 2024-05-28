const express = require('express');
const router = express.Router();
const { boardCreate, boardList, boardDelete, boardUpdate, boardInvitation } = require('../controllers/boardController');
const accessRouteMiddleware = require('../middlewares/accessRouteMiddleware');

router.post("/create", accessRouteMiddleware, boardCreate);

router.get("/list", accessRouteMiddleware, boardList);

router.delete("/delete", accessRouteMiddleware, boardDelete);

router.put("/update", accessRouteMiddleware, boardUpdate);

router.post("/invite", accessRouteMiddleware, boardInvitation);

module.exports = router;