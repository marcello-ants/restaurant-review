import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";

export default async function signup(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const user = await User.create({
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 8),
          role: "client",
        });
        // User.findOne({
        //   username: req.body.username,
        // }).exec((err, user) => {
        //   if (err) {
        //     res.status(500).send({ message: err });
        //     return;
        //   }
        //   if (!user) {
        //     return res.status(404).send({ message: "User Not found." });
        //   }
        //   var passwordIsValid = bcrypt.compareSync(
        //     req.body.password,
        //     user.password
        //   );

        //   if (!passwordIsValid) {
        //     return res.status(401).send({
        //       accessToken: null,
        //       message: "Invalid Password!",
        //     });
        //   }
        //   var token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        //     expiresIn: 86400, // 24 hours
        //   });
        //   const curentUser = {
        //     username: req.body.username,
        //     token: token,
        //   };
        //   res.setHeader("Set-Cookie", `session=${JSON.stringify(curentUser)};`);
        //   res.json({ message: "Logged in" });
        // });
        var token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          process.env.SECRET_KEY,
          {
            expiresIn: 86400, // 24 hours
          }
        );

        res.setHeader("Set-Cookie", `session=${token};`);
        return res.json({ message: "User registered successfully!" });
      } catch (error) {
        return res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
