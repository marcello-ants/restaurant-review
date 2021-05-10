import mongoose from "mongoose";
import Restaurant from "./Restaurant";
import User from "./User";

mongoose.Promise = global.Promise;

const db = {};

db.restaurant = Restaurant;
db.user = User;

export default db;
