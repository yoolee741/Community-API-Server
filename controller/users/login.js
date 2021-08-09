/*
- 이메일과 비밀번호로 로그인합니다. [V]
- 이메일과 비밀번호가 일치하면 해당 유저의 JWT 토큰을 발행합니다. [V]
- Response 값의 user 객체에는 비밀번호 필드를 포함시키지 않습니다. [V]

** 에러처리
- 존재하지 않은 이메일일 경우 `403` [V]
- 비밀번호가 틀렸을 경우 `403` [V]
 */

const bcryptjs = require("bcryptjs");
const { User } = require("../../models");
const { generateAccessToken, generateRefreshToken } = require("./tokens");

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const userInfo = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!userInfo) {
      res.status(403).send({
        message: "존재하지 않는 이메일입니다.",
      });
    } else {
      const isMatched = await bcryptjs.compare(password, userInfo.password);
      if (!isMatched) {
        res.status(403).send({
          message: "비밀번호가 일치하지 않습니다.",
        });
      } else {
        const accessToken = generateAccessToken(userInfo);
        const refreshToken = generateRefreshToken(userInfo);
        res.status(200).send({
          message: "로그인에 성공하였습니다!",
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: {
            id: userInfo.id,
            email: userInfo.email,
            nickname: userInfo.nickname,
          },
        });
      }
    }
  },
};
