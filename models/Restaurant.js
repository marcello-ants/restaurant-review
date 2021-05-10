import mongoose from "mongoose";

const Restaurant = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for this restaurant."],
    maxlength: [60, "Name can't be more than 60 characters"],
  },
  owner: {
    type: String,
    required: [true, "Please provide an owner for this restaurant."],
    maxlength: [60, "Description can't be more than 60 characters"],
  },
  rating: {
    type: Number,
  },
  image_url: {
    type: String,
  },
  //   created_at: {
  //     type: Date,
  //   },
});

export default mongoose.models.Restaurant ||
  mongoose.model("Restaurant", Restaurant);
