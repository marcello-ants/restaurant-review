import bcrypt from "bcryptjs";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    /* get an user by its ID */
    case "GET":
      try {
        const user = await User.findById(id);
        if (!user) {
          return res.status(400).json({ success: false });
        }
        return res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    /* edit an user by its ID */
    case "PUT":
      try {
        const oldUser = await User.findById(id);
        const newUser = {
          username: req.body.username,
          password: oldUser.password,
          role: req.body.role,
        };

        // const newUser = {
        //   username: req.body.username,
        //   password: bcrypt.hashSync(req.body.password, 8),
        //   role: req.body.role,
        // };

        const user = await User.findByIdAndUpdate(id, newUser, {
          new: true,
          runValidators: true,
        });
        if (!user) {
          return res.status(400).json({ success: false });
        }
        return res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    /* delete an user by its ID */
    case "DELETE":
      try {
        const deletedUser = await User.deleteOne({ _id: id });
        if (!deletedUser) {
          return res.status(400).json({ success: false });
        }
        return res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
