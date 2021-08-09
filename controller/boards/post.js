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
            likes: 0,
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
    // req.params.id => 해당 게시물의 아이디
    const postData = await Board.findOne({
      where: {
        id: req.params.id,
      },
    });
    const writerInfo = await User.findOne({
      where: {
        nickname: postData.dataValues.nickname,
      },
    });
    const userInfo = verifyAccessToken(req);
    if (!userInfo || !req.headers["authorization"]) {
      // 비회원
      res.status(401).send({
        message: "좋아요 기능은 회원만 사용 가능합니다.",
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
      // 분기: 좋아요 눌렀는지 여부
      // isLike가 이미 true이면, 메시지 보내기
      // isLike가 false라면 true로 바꿔주고, Board에 있는 Likes + 1;
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

      if (!isLikeData) {
        const userLike = await likeData.create({
          post_id: postData.dataValues.id,
          user_id: userData.dataValues.id,
          isLike: true,
        });
        const addLike = await Board.findOne({
          where: {
            id: postData.dataValues.id,
          },
        }).then((el) => {
          el.update({ likes: el.dataValues.likes + 1 });

          res.status(200).send({
            message: "회원님이 이 게시물을 좋아합니다!",
            id: postData.dataValues.id,
            userId: writerInfo.dataValues.id,
            user: {
              nickname: postData.dataValues.nickname,
            },
            title: postData.dataValues.title,
            content: postData.dataValues.content,
            likes: el.dataValues.likes,
            isLike: true,
            createdAt: postData.dataValues.createdAt,
          });
        });
      } else {
        res.status(400).send({
          message: "이미 '좋아요' 버튼을 눌렀습니다!",
        });
      }
    }
    /*
- 해당 id의 게시물에 좋아요를 누를 시 호출하는 API입니다. (좋아요 취소는 없습니다)
- 게시물 당 유저가 누를 수 있는 좋아요는 최대 1번입니다.
- 예를 들어 좋아요가 3개인 게시물에 좋아요를 처음 누를 경우, 4가 됩니다.
- 그 이후 같은 유저가 좋아요를 계속 호출해도 4에서 더 늘어나지 않습니다.
- 좋아요가 눌린 게시물의 객체가 반환됩니다.
- 만일 로그인했고, 해당 유저가 게시물에 좋아요를 눌렀을 경우 isLike는 true 값을 가집니다.
- 로그인을 하지 않았거나, 로그인 했어도 좋아요를 누르지 않았을 경우 isLike는 false 값을 가집니다.

URL `POST` /api/boards/:id/like `인증`

** 에러처리
- 인증 정보가 없을 경우 401

     */
  },
};
