//export const login = async (req, res) => {
//   try {
//     return res.status(200).send("login!");
//   } catch (err) {
//     res.send(err);
//   }
// };

module.exports = {
  login: async (req, res) => {
    res.status(200).send("login!");
  },
};
