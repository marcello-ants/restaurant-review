import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";

async function dbConnect() {
  // check if we have a connection to the database or if it's currently
  // connecting or disconnecting (readyState 1, 2 and 3)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  function initial() {
    User.estimatedDocumentCount((err, count) => {
      if (!err && count <= 100) {
        new User({
          username: "admin",
          password: bcrypt.hashSync("admin", 8),
          role: "admin",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'admin' to users collection");
        });
      }
    });
  }

  initial();

  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
}

export default dbConnect;
