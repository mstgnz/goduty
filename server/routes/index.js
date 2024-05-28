const express = require('express');
const router = express.Router();
const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const boardRoute = require("./boardRoute");
const taskRoute = require("./taskRoute");
const chatRoute = require("./chatRoute");

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/board", boardRoute);
router.use("/task", taskRoute);
router.use("/chat", chatRoute);

module.exports = router;