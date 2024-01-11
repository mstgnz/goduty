const express = require('express');
const router = express.Router();

router.get("/create",(req,res)=>{
    res.end("create")
});

router.get("/delete",(req,res)=>{
    res.end("delete")
});

router.get("/list",(req,res)=>{
    res.end("list")
});

module.exports = router;