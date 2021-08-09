const express = require("express");
const router = express.Router();

const { boardsController } = require("../controller");

router.get("/", boardsController.getList);
router.post("/", boardsController.createPost);
router.get("/:id", boardsController.getPost);
router.post("/:id/like", boardsController.likePost);
router.delete("/:id", boardsController.deletePost);

module.exports = router;
