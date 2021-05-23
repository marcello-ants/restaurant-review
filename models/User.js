import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
});

User.plugin(uniqueValidator, {
  message: "Error, this {PATH} already exists.",
});

export default mongoose.models.User || mongoose.model("User", User);
