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

// User.plugin(uniqueValidator);
User.plugin(uniqueValidator, { type: "mongoose-unique-validator" });

// User.plugin(uniqueValidator, {
//   message: "Error, expected {PATH} to be unique.",
// });

export default mongoose.models.User || mongoose.model("User", User);
