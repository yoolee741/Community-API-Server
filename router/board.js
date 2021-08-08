// import express from "express";
// import { getList } from "../controller/boards/post.js";
// import { getPost } from "../controller/boards/post.js";
// import { createPost } from "../controller/boards/post.js";
// import { deletePost } from "../controller/boards/post.js";
// import { likePost } from "../controller/boards/post.js";
const express = require("express");
const router = express.Router();

const { boardsController } = require("../controller");

router.get("/", boardsController.getList);
router.post("/", boardsController.createPost);
router.get("/:id", boardsController.getPost);
router.post("/:id/like", boardsController.likePost);
router.delete("/:id", boardsController.deletePost);

module.exports = router;
