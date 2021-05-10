import * as React from "react";
import Router, { useRouter } from "next/router";
// import useMe from "../hooks/use-me";

import Restaurant from "../models/Restaurant";
import dbConnect from "../utils/dbConnect";

const Restaurants = ({ serverData }) => {
  return <div> oi</div>;
};

export async function getServerSideProps() {
  await dbConnect();

  const result = await Restaurant.find({});
  const restaurants = result.map((doc) => {
    const restaurants = doc.toObject();
    restaurants._id = restaurants._id.toString();
    return restaurants;
  });

  return { props: { serverData: restaurants } };
}

export default Restaurants;
