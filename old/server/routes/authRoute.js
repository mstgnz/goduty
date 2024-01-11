const express = require('express');
const router = express.Router();
const { register, login, logout, forgot, reset, upload } = require('../controllers/authController');
const accessRouteMiddleware = require('../middlewares/accessRouteMiddleware');
const profileImageMiddleware = require('../middlewares/multerMiddleware');

router.post("/login", login);

router.post("/register", register);

router.get("/logout", logout);

router.post("/forgot", forgot);

router.put("/reset", reset);

router.post("/upload", [accessRouteMiddleware, profileImageMiddleware.single('image')], upload);

module.exports = router;