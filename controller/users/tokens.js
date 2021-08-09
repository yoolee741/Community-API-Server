const { sign, verify } = require("jsonwebtoken");
const { User } = require("../../models");
require("dotenv").config();
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

module.exports = {
  generateAccessToken: function (User) {
    return sign({ email: User.email }, ACCESS_SECRET, {
      algorithm: "HS256",
      expiresIn: "2h",
    });
  },

  generateRefreshToken: function (User) {
    return sign({ email: User.email }, REFRESH_SECRET, {
      algorithm: "HS256",
      expiresIn: "14d",
    });
  },

  verifyAccessToken: function (req) {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return "not authorized";
    }
    const token = authorization.split(" ")[1];
    return verify(token, ACCESS_SECRET);
  },

  verifyRefreshToken: function (req) {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return "유효하지 않은 리프레쉬 토큰입니다.";
    }
    const token = authorization.split(" ")[1];
    return verify(token, REFRESH_SECRET);
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
