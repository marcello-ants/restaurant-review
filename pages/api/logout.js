export default async function logout(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        if (req.cookies?.session === "invalid") {
          res.status(400);
          res.json({ message: "You are not logged in!" });
        } else {
          res.setHeader("Set-Cookie", "session=invalid;");
          res.status(200);
          res.json({ message: "Logged out" });
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
