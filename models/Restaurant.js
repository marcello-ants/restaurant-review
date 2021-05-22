import mongoose from "mongoose";

const Review = new mongoose.Schema({
  user_id: {
    type: String,
  },
  comment: {
    type: String,
  },
  reply: {
    type: String,
  },
  rating: {
    type: Number,
  },
  date: {
    type: String,
  },
});

const Restaurant = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for this restaurant."],
    maxlength: [60, "Name can't be more than 60 characters"],
  },
  owner_id: {
    type: String,
    required: [true, "Please provide an owner ID for this restaurant."],
  },
  rating: {
    type: Number,
  },
  image_url: {
    type: String,
  },
  reviews: [Review],
  //   created_at: {
  //     type: Date,
  //   },
});

export default mongoose.models.Restaurant ||
  mongoose.model("Restaurant", Restaurant);
