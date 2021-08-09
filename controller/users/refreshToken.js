const { verifyRefreshToken, generateAccessToken } = require("./tokens");
const { User } = require("../../models");
module.exports = {
  regenerateAccessToken: function (req, res) {
    const validateRefreshToken = verifyRefreshToken(req);
    if (!validateRefreshToken) {
      res
        .status(401)
        .send({ message: "토큰이 만료되었습니다. 다시 로그인을 해주세요." });
    } else {
      const { email } = validateRefreshToken;
      const findingUser = User.findOne({
        email: email,
      }).then((data) => {
        const newAccessToken = generateAccessToken(data);
        res.status(200).send({
          message: "토큰이 재발급 되었습니다!",
          newAccessToken: newAccessToken,
        });
      });
    }
  },
};
