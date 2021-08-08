// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import { usersRouter, boardsRouter } from "./router/index";
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const usersRouter = require("./router/user");
const boardsRouter = require("./router/board");

const app = express();

app.use(bodyParser.json());
const PORT = process.env.PORT;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    // origin : true,
    methods: "GET, POST, DELETE, OPTIONS",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(201).send("게시판 구현중...");
});
app.use("/api/users", usersRouter);
app.use("/api/boards", boardsRouter);

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 정상적으로 작동중입니다.`);
});
