const bcryptjs = require("bcryptjs");
const { User } = require("../../models");
const { likeData } = require("../../models");
const { validatePassword } = require("./tokens");
/*
1. 이메일과 닉네임, 비밀번호를 받아 회원가입을 합니다. => req.body [V]
2. 닉네임은 10자까지 가능합니다. [V]
3. 비밀번호는 영문과 숫자가 포함되어야 합니다. [V]
4. 이메일은 고유 아이디이므로 테이블에 값이 중복되어선 안됩니다. [V]
5. 비밀번호는 단방향 암호화하여 테이블에 저장합니다. [V]

** 에러처리
- 해당 이메일이 이미 존재할 경우 `403` [V]
- 이메일, 닉네임, 비밀번호 컬럼이 비었을 경우 `400` [V]
- 닉네임이 10자 초과인 경우 `403` [V]
- 비밀번호에 영문과 숫자가 포함되지 않았을 경우 `403` [V]
 */
module.exports = {
  join: async (req, res) => {
    const { nickname, email, password } = req.body;
    const userInfo = await User.findOne({
      where: {
        email: email,
      },
    });

    if (userInfo) {
      res.status(403).send({ message: "이미 사용중인 email입니다!" });
    } else {
      if (!password.length || !nickname.length || !email.length) {
        res.status(400).send({ message: "빈 칸을 모두 채워주세요." });
      } else if (nickname.length > 10) {
        res.status(403).send({ message: "닉네임은 10자 이내여야 합니다." });
      } else if (!validatePassword(password)) {
        res
          .status(403)
          .json({ message: "영문과 숫자를 혼합하여 입력해주세요." });
      } else {
        // genSalt(): 임의의 값을 만들어줌 (메소드 실행때마다 다른 값 생성)
        // Auto-gen a salt and hash
        const creatingPassword = await bcryptjs.hash(password, 10);
        const newUser = await User.create({
          nickname: nickname,
          email: email,
          password: creatingPassword,
        });
        const newUserData = await likeData.create({
          user_id: newUser.null,
        });
        if (newUserData) {
          // console.log("newUser : ", newUser.null); => 16
          //  console.log("newUserData : ", newUserData.dataValues.user_id); => 16
          res.status(201).send({
            message: "회원가입이 성공적으로 완료되었습니다!",
            nickname: nickname,
            email: email,
          });
        }
      }
    }
  },
};
