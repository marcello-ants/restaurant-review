import mongoose from "mongoose";

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
  //   created_at: {
  //     type: Date,
  //   },
});

export default mongoose.models.Restaurant ||
  mongoose.model("Restaurant", Restaurant);
