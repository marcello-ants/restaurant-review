import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";
import Restaurant from "../../../../models/Restaurant";
var mongoose = require("mongoose");

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "POST" /* Edit a review by its ID */:
      try {
        const user = await User.findById(req.body.user_id);
        const review = {
          ...req.body,
          user_name: user.name,
        };

        const restaurant = await Restaurant.findById(id);

        restaurant.reviews.push(review);

        const reviewedRestaurant = await restaurant.save();

        if (!reviewedRestaurant) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: reviewedRestaurant });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT" /* Edit a review by its ID */:
      try {
        const review = req.body;
        const restaurant = await Restaurant.findById(id);

        const reviewIndex = restaurant.reviews.findIndex(
          (item) => item._id.toString() === review.id
        );

        restaurant.reviews[reviewIndex] = {
          ...review,
          _id: mongoose.Types.ObjectId(review._id),
        };

        const reviewedRestaurant = await restaurant.save();

        if (!reviewedRestaurant) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: reviewedRestaurant });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    // case "DELETE" /* Delete a review by its ID */:
    //   try {
    //     const deletedRestaurant = await Restaurant.deleteOne({ _id: id });
    //     if (!deletedRestaurant) {
    //       return res.status(400).json({ success: false });
    //     }
    //     res.status(200).json({ success: true, data: {} });
    //   } catch (error) {
    //     res.status(400).json({ success: false });
    //   }
    //   break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
