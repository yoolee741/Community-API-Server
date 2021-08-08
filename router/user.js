// import express from "express";
// import { login } from "../controller/users/login.js";
// import { join } from "../controller/users/join.js";

const express = require("express");
const router = express.Router();

const { usersController } = require("../controller");

router.post("/login", usersController.login.login);
router.post("/join", usersController.join.join);

module.exports = router;
