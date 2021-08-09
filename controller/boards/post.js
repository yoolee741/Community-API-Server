const { User } = require("../../models");
const { Board } = require("../../models");
const { likeData } = require("../../models");
const { verifyAccessToken } = require("../users/tokens");

module.exports = {
  getList: async (req, res) => {
    return res.status(200).send("deletePost!");
    /*
- 생성된 게시물을 모두 불러옵니다.
- 만약 게시물이 없을 시 빈 배열을 반환합니다.
- Response의 user 객체의 경우  게시물을 작성한 유저의 닉네임만 가져옵니다.

* 예시
[
	{
		"id": 2,
		"userId" : 1,
		"user": {
			"nickname": "팬더"
		},
		"title": "제목입니다2",
		"content": "내용입니다2",
		"like": 0,
		"createdAt": "2021-08-01T06:02:00.000Z"
	},
	{
		"id": 1,
		"userId" : 1,
		"user": {
			"nickname": "팬더"
		},
		"title": "제목입니다",
		"content": "내용입니다",
		"like": 1,
		"createdAt": "2021-08-01T02:02:00.000Z"
	}
]
     */
  },
  getPost: async (req, res) => {
    return res.status(200).send("getPost!");
  },
  createPost: async (req, res) => {
    /*
- 게시물을 생성합니다. [V]
- 헤더에 Authorization 토큰이 없을 경우 에러를 반환합니다. [V]

** 에러처리
- 제목이 없을 경우 `400` [V]
- 내용이 없을 경우 `400` [V]
- 제목이 30자 넘어갈 경우 `403` [V]
- 인증 정보가 없을 경우 `401` [V]

*/

    const userInfo = verifyAccessToken(req);
    const { title, content } = req.body;
    if (!userInfo) {
      res.status(401).send({
        message: "유효하지 않은 access token 입니다.",
      });
    } else {
      if (!title.length || !content.length) {
        res.status(400).send({
          message: "제목과 내용을 모두 채워주세요.",
        });
      } else if (title.length > 30) {
        res.status(403).send({
          message: "제목은 30자 이내로 작성해주세요.",
        });
      } else {
        const userData = await User.findOne({
          where: {
            email: userInfo.email,
          },
        });
        const newPost = await Board.create({
          nickname: userData.dataValues.nickname,
          title: title,
          content: content,
          likes: 0,
        });

        const newPostData = await likeData.create({
          post_id: newPost.null,
        });
        if (newPostData) {
          res.status(201).send({
            id: newPostData.post_id,
            userId: userData.id,
            user: {
              nickname: userData.nickname,
            },
            title: title,
            content: content,
            like: 0,
            createdAt: newPost.createdAt,
          });
        }
      }
    }
  },
  deletePost: async (req, res) => {
    /*
    ** 에러처리
- 인증 정보가 없을 경우 `401` [V]
- 해당 게시물의 작성자가 아닐 경우 `401` [V]
- 해당 번호의 게시물이 없을 경우 `404` [V]
     */
    const userInfo = verifyAccessToken(req);
    if (!userInfo) {
      res.status(401).send({
        message: "유효하지 않은 access token 입니다.",
      });
    } else {
      // req.params.id => 해당 게시물 아이디
      const userData = await User.findOne({
        where: {
          email: userInfo.email,
        },
      });
      const postData = await Board.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!postData) {
        res.status(404).send({
          message: "존재하지 않는 게시물입니다.",
        });
      } else if (postData.dataValues.nickname !== userData.nickname) {
        res.status(401).send({
          message: "작성자가 아니므로 삭제할 수 없습니다.",
        });
      } else {
        const postID = await likeData.findOne({
          where: {
            post_id: req.params.id,
          },
        });
        await postID.destroy();
        await postData.destroy();
        res.status(200).send({
          message: "게시물이 삭제되었습니다!",
        });
      }
    }
  },

  likePost: async (req, res) => {
    return res.status(200).send("likePost!");
  },
};

/*
1. get list
2. get a specific post
3. create a post => 생성 시 post_id
4. delete a post
5. post a like (likeData 내에서 해당 유저의 아이디와 및 post_id와 일치하는 애 찾고, 만약 isLike가 false면 true로 바꿔줌 + 해당 게시물의 좋아요 count도 올림, 이미 true면 에러 메시지 및 카운트X)

 */
