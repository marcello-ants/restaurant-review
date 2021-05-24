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
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
