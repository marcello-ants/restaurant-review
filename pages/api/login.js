import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";

export default async function login(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        User.findOne({
          username: req.body.username,
        }).exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }

          // compare passwords
          var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );

          if (!passwordIsValid) {
            return res.status(401).send({
              token: null,
              message: "Invalid Password!",
            });
          }

          // returns when token is valid:
          var token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.SECRET_KEY,
            {
              expiresIn: 86400, // 24 hours
            }
          );

          res.setHeader("Set-Cookie", `session=${token};`);
          res.json({ message: "Logged in" });
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
