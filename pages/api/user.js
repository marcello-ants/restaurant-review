import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";

export default async function login(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "PUT":
      try {
        const user = await User.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!user) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: user });
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

        //   req.body.password,
        //   user.password
        //   compare passwords

        //   res.setHeader("Set-Cookie", `session=${token};`);
        //   res.json({ message: "Logged in" });
        // });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
