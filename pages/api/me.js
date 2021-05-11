import jwt from "jsonwebtoken";

export default function me(req, res) {
  if (!req.cookies.session || req.cookies.session === "invalid") {
    res.status(401);
    return res.json({ message: "Not logged in!" });
  } else {
    const user = jwt.verify(req.cookies.session, process.env.SECRET_KEY);
    res.status(200);
    return res.json(user);
  }
}
