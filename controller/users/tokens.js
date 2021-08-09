const { sign, verify } = require("jsonwebtoken");
const { user } = require("../../models/user");
require("dotenv").config();
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

module.exports = {
  generateAccessToken: async (req, res) => {
    res.status(200).send("엑세스 생성!");
  },

  generateRefreshToken: async (req, res) => {
    res.status(200).send("리프레쉬 생성!");
  },

  verifyAccessToken: async (req, res) => {
    res.status(200).send("엑세스 확인!");
  },

  verifyRefreshToken: async (req, res) => {
    res.status(200).send("리스레쉬 확인!");
  },

  regenerateAccessToken: async (req, res) => {
    res.status(200).send("리스레쉬 후 로그아웃 || 재발급!");
  },

  // 비밀번호 유효성 함수도 여기에 포함!
  validatePassword: (str) => {
    let password = str;
    let num = password.search(/[0-9]/g);
    let eng = password.search(/[a-z]/gi);
    if (num < 0 || eng < 0) {
      // 영어나 숫자가 없으면 안됨
      return false;
    }
    if (password.length < 8 || password.length > 20) {
      // 길이는 8-20자 사이
      return false;
    }
    if (password.search(/Ws/) !== -1) {
      // 비밀번호 입력 시 공백 없어야 함
      return false;
    }
    return true;
  },
};
