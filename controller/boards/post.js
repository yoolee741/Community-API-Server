const { User } = require("../../models");
const { Board } = require("../../models");
const { likeData } = require("../../models");
const { verifyAccessToken } = require("../users/tokens");

module.exports = {
  getList: async (req, res) => {
    const list = await Board.findAll();
    if (!list) {
      return [];
    } else {
      res.status(200).send(list);
    }
    /*
- 생성된 게시물을 모두 불러옵니다. [V]
- 만약 게시물이 없을 시 빈 배열을 반환합니다. [V]
- Response의 user 객체의 경우  게시물을 작성한 유저의 닉네임만 가져옵니다. [V]
*/
  },

  getPost: async (req, res) => {
    // req.params.id => 해당 게시물의 id
    const postData = await Board.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!postData) {
      res.status(404).send({
        message: "존재하지 않는 게시물입니다.",
      });
    } else {
      // console.log("폿트 데이터: ", postData);
      const writerInfo = await User.findOne({
        where: {
          nickname: postData.dataValues.nickname,
        },
      });

      const userInfo = verifyAccessToken(req);
      if (!userInfo) {
        // 비회원
        res.status(200).send({
          id: postData.dataValues.id,
          userId: writerInfo.dataValues.id,
          user: {
            nickname: postData.dataValues.nickname,
          },
          title: postData.dataValues.title,
          content: postData.dataValues.content,
          likes: postData.dataValues.likes,
          isLike: false,
          createdAt: postData.dataValues.createdAt,
        });
      } else {
        // 로그인 성공
        // 로그인 했으면 해당 유저의 정보를 찾아서 반환
        const userData = await User.findOne({
          where: {
            email: userInfo.email,
          },
        });
        const isLikeData = await likeData.findOne({
          where: {
            post_id: postData.dataValues.id,
            user_id: userData.dataValues.id,
          },
        });
        console.log("이즈라이크: ", isLikeData);

        res.status(200).send({
          id: postData.dataValues.id,
          userId: writerInfo.dataValues.id,
          user: {
            nickname: postData.dataValues.nickname,
          },
          title: postData.dataValues.title,
          content: postData.dataValues.content,
          likes: postData.dataValues.likes,
          isLike: isLikeData.dataValues.isLike,
          createdAt: postData.dataValues.createdAt,
        });
      }
    }
    /*
- 해당 id를 가진 게시물을 반환합니다.
- 만일 로그인했고, 해당 유저가 게시물에 좋아요를 눌렀을 경우 isLike는 true 값을 가집니다.
- 로그인을 하지 않았거나, 로그인 했어도 좋아요를 누르지 않았을 경우 isLike는 false 값을 가집니다.

URL `GET` /api/boards/:id

** 에러처리
해당 번호의 게시물이 없을 경우 404 [V]

{
	"id": 1,
	"userId" : 1,
	"user": {
		"nickname": "팬더"
	},
	"title": "제목입니다",
	"content": "내용입니다",
	"like": 0,
	"isLike": false,
	"createdAt": "2021-08-01T02:02:00.000Z"
}
    */
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
1. get list [V]
2. get a specific post
3. create a post => 생성 시 post_id [V]
4. delete a post [V]
5. post a like (likeData 내에서 해당 유저의 아이디와 및 post_id와 일치하는 애 찾고, 만약 isLike가 false면 true로 바꿔줌 + 해당 게시물의 좋아요 count도 올림, 이미 true면 에러 메시지 및 카운트X)

 */
