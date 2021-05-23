import * as React from "react";
import Router, { useRouter } from "next/router";
import useMe from "../hooks/use-me";
import Paper from "@material-ui/core/Paper";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Restaurant from "../models/Restaurant";
import User from "../models/User";
import dbConnect from "../utils/dbConnect";
import Modal from "../components/Modal";
import PublicIcon from "@material-ui/icons/Public";
import Fab from "@material-ui/core/Fab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slider from "@material-ui/core/Slider";
import TopBar from "../components/TopBar";
import RestaurantCard from "../components/RestaurantCard";
import RestaurantForm from "../components/forms/RestaurantForm";
import ReviewForm from "../components/forms/ReviewForm";
import AddIcon from "@material-ui/icons/Add";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  modalBody: {
    backgroundColor: "white",
    height: "calc(100vh - 120px)",
    width: "calc(100% - 400px)",
    margin: "auto",
    borderRadius: 10,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  button: {
    height: 40,
    margin: theme.spacing(1),
  },
}));

const Restaurants = ({ serverData }) => {
  const router = useRouter();
  const classes = useStyles();
  const { data: res, mutate } = useMe();
  const { owners } = serverData;

  const [user, setUser] = React.useState();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isOwner, setIsOwner] = React.useState(false);
  const [isUser, setisUser] = React.useState(false);
  const [deleteMessage, setDeleteMessage] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(16);
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [forNewRestaurant, setForNewRestaurant] = React.useState(false);
  const [restaurantForm, setRestaurantForm] = React.useState({});
  const [reviewForm, setReviewForm] = React.useState({});
  const [forNewReview, setForNewReview] = React.useState(false);
  const [restaurants, setRestaurants] = React.useState(serverData.restaurants);

  console.log(restaurants);

  React.useEffect(() => {
    setRestaurants(serverData.restaurants);
  }, [serverData]);

  React.useLayoutEffect(() => {
    if (res && res.data) {
      setUser(res.data);
      if (res.data.role === "admin") setIsAdmin(true);
      if (res.data.role === "owner") setIsOwner(true);
      if (res.data.role === "user") setisUser(true);
    }
    if (!res || res.error) Router.replace("/");
  }, [res]);

  React.useEffect(() => {
    if (user?.role === "owner") {
      const filteredRestaurants = restaurants.filter(
        (item) => item.owner_id === user?.id
      );
      setRestaurants(filteredRestaurants);
    }
  }, [user]);

  if (!res || res.error) {
    return null;
  }

  if (!res || !res.data) return <CircularProgress />;

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const createRestaurant = () => {
    setRestaurantForm({
      name: "",
      rating: 0,
      owner_id: "",
      image_url: "",
      reviews: [],
    });
    setForNewRestaurant(true);
    setIsModalOpen(true);
  };

  const editRestaurant = (item) => {
    setRestaurantForm({
      id: item._id,
      name: item.name,
      owner_id: item.owner_id,
      image_url: item.image_url,
    });
    setForNewRestaurant(false);
    setIsModalOpen(true);
  };

  const deleteRestaurant = async (id) => {
    try {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(res.status);
      }
      refreshData();
      return res;
    } catch (error) {
      setDeleteMessage("Failed to delete");
    }
  };

  const createReview = (item) => {
    setReviewForm({
      id: item._id,
      comment: "",
      rating: 0,
    });
    setForNewReview(true);
    setIsReviewModalOpen(true);
  };

  const editReview = async (restaurantId, review) => {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      const { data } = await res.json();
      // mutate(`/api/restaurants/${restaurantId}`, data, false);
      refreshData();
      // onCompleted();
      return res;
    } catch (error) {
      console.log(error);
      // setErrorMessage("Failed to update restaurant");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <TopBar />
      <div style={{ padding: "30px 50px", backgroundColor: "inherit" }}>
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 30,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginLeft: 30,
                marginRight: 10,
              }}
            >
              {(isAdmin || isOwner) && (
                <Fab
                  color="primary"
                  aria-label="create-restaurant"
                  onClick={() => createRestaurant()}
                >
                  <AddIcon />
                </Fab>
              )}
            </div>
          </div>
        )}
        <TableContainer>
          <Table>
            <TableBody>
              <TableCell>
                <Grid container spacing={3}>
                  {restaurants &&
                    restaurants
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item) => {
                        // if (item.is_rented && !isAdmin && !isRealtor)
                        //   return null;
                        return (
                          <Grid key={item._id} item xs={12} sm={6} md={4}>
                            <p>{item.rating}</p>
                            <Paper className={classes.paper}>
                              <RestaurantCard
                                data={item}
                                name={item.name}
                                image={item.image_url}
                                // createdAt={item.created_at}
                                userId={user?.id}
                                isAdmin={isAdmin}
                                isOwner={isOwner}
                                isUser={isUser}
                                reviews={item.reviews}
                                onReview={() => {
                                  createReview(item);
                                }}
                                onEditReview={(id, item) => {
                                  editReview(id, item);
                                }}
                                onEdit={() => {
                                  editRestaurant(item);
                                }}
                                onDelete={() => {
                                  deleteRestaurant(item._id);
                                }}
                              />
                            </Paper>
                          </Grid>
                        );
                      })}
                </Grid>
              </TableCell>
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[16, 32, 64]}
            component="div"
            count={restaurants.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>
      {/* <div>{deleteMessage}</div> */}
      <Modal
        isOpen={isReviewModalOpen}
        onModalClose={() => setIsReviewModalOpen(false)}
      >
        <div className={classes.modalBody}>
          <ReviewForm
            formId="add-review-form"
            reviewForm={reviewForm}
            // TODO: review global user info
            userId={user?.id}
            forNewReview={forNewReview}
            isAdmin={isAdmin}
            isUser={isUser}
            onCompleted={() => {
              refreshData();
              setIsReviewModalOpen(false);
            }}
          />
        </div>
      </Modal>
      <Modal isOpen={isModalOpen} onModalClose={() => setIsModalOpen(false)}>
        <div className={classes.modalBody}>
          <RestaurantForm
            formId="add-restaurant-form"
            restaurantForm={restaurantForm}
            owners={owners}
            forNewRestaurant={forNewRestaurant}
            isAdmin={isAdmin}
            onCompleted={() => {
              refreshData();
              setIsModalOpen(false);
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export async function getServerSideProps() {
  await dbConnect();

  const restaurantData = await Restaurant.find({});
  const ownersData = await User.find({ role: "owner" });

  let ratings;
  await Restaurant.aggregate([
    { $unwind: "$reviews" },
    {
      $group: {
        _id: "$_id",
        averageRating: { $avg: "$reviews.rating" },
      },
    },
  ]).then((res) => {
    ratings = res;
  });

  const ratedRestaurant = restaurantData.map((restItem) => {
    const filteredRating = ratings.filter(
      (item) => restItem._id.toString() === item._id.toString()
    );

    return Object.assign(restItem, {
      rating: filteredRating[0]?.averageRating,
    });
  });

  const restaurants = JSON.parse(JSON.stringify(ratedRestaurant));

  const owners = ownersData.map((doc) => {
    const owners = doc.toObject();
    owners._id = owners._id.toString();
    return owners;
  });

  return {
    props: { serverData: { restaurants: restaurants, owners: owners } },
  };
}

export default Restaurants;
