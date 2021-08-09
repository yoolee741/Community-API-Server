const express = require("express");
const router = express.Router();

const { usersController } = require("../controller");

router.post("/login", usersController.login.login);
router.post("/join", usersController.join.join);
router.post(
  "/refreshToken",
  usersController.regenerateAccessToken.regenerateAccessToken
);

module.exports = router;
