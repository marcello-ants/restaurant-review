import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const users = await User.find({});
        return res.status(200).json({ success: true, data: users });
      } catch (error) {
        return res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const user = await User.create({
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 8),
          role: req.body.role,
        });
        return res.status(201).json({ success: true, data: user });
      } catch (error) {
        return res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
