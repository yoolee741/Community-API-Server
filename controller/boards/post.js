// export const getList = async (req, res) => {
//   try {
//     return res.status(200).send("post!");
//   } catch (err) {
//     res.send(err);
//   }
// };

// export const getPost = async (req, res) => {
//   try {
//     return res.status(200).send("post!");
//   } catch (err) {
//     res.send(err);
//   }
// };

// export const createPost = async (req, res) => {
//   try {
//     return res.status(200).send("post!");
//   } catch (err) {
//     res.send(err);
//   }
// };

// export const deletePost = async (req, res) => {
//   try {
//     return res.status(200).send("post!");
//   } catch (err) {
//     res.send(err);
//   }
// };

// export const likePost = async (req, res) => {
//   try {
//     return res.status(200).send("post!");
//   } catch (err) {
//     res.send(err);
//   }
// };

module.exports = {
  getList: async (req, res) => {
    return res.status(200).send("getList!");
  },
  getPost: async (req, res) => {
    return res.status(200).send("getPost!");
  },
  createPost: async (req, res) => {
    return res.status(200).send("createPost!");
  },
  deletePost: async (req, res) => {
    return res.status(200).send("deletePost!");
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
