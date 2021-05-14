import mongoose from "mongoose";

const User = new mongoose.Schema({
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
});

export default mongoose.models.User || mongoose.model("User", User);
