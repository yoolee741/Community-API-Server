// import bcryptjs from "bcryptjs";
// export const join = async (req, res) => {
//   try {
//     return res.status(200).send("join!");
//   } catch (err) {
//     res.send(err);
//   }
// };

const bcryptjs = require("bcryptjs");
module.exports = {
  join: async (req, res) => {
    return res.status(200).send("join!");
  },
};
