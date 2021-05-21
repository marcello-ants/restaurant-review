import dbConnect from "../../../../utils/dbConnect";
import Restaurant from "../../../../models/Restaurant";
var mongoose = require("mongoose");

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    // case "GET" /* Get a review by its ID */:
    //   try {
    //     const restaurant = await Restaurant.findById(id);
    //     if (!restaurant) {
    //       return res.status(400).json({ success: false });
    //     }
    //     res.status(200).json({ success: true, data: restaurant });
    //   } catch (error) {
    //     res.status(400).json({ success: false });
    //   }
    //   break;

    case "POST" /* Edit a review by its ID */:
      try {
        const review = req.body;

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
          (item) => item._id.toString() === review._id
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
