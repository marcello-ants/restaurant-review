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
          name: req.body.name,
          password: bcrypt.hashSync(req.body.password, 8),
          role: req.body.role_owner ? "owner" : "user",
        });

        var token = jwt.sign(
          { id: user.id, name: user.name, role: user.role },
          process.env.SECRET_KEY,
          {
            expiresIn: 86400, // 24 hours
          }
        );

        res.setHeader("Set-Cookie", `session=${token};`);
        return res.json({ message: "User registered successfully!" });
      } catch (error) {
        const message = error.errors.name.properties.message;
        return res.status(400).json({ success: false, message: message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
