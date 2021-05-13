import * as React from "react";
import Router, { useRouter } from "next/router";
import useMe from "../hooks/use-me";
import Paper from "@material-ui/core/Paper";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Restaurant from "../models/Restaurant";
import dbConnect from "../utils/dbConnect";
import Modal from "../components/Modal";
import PublicIcon from "@material-ui/icons/Public";
import Fab from "@material-ui/core/Fab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slider from "@material-ui/core/Slider";
import TopBar from "../components/TopBar";
import RestaurantForm from "../components/forms/RestaurantForm";
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

const CustomSlider = withStyles({
  root: {
    color: "#3880ff",
    height: 2,
    padding: "15px 0",
  },
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: "#bfbfbf",
  },
  mark: {
    backgroundColor: "#bfbfbf",
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
  },
})(Slider);

const Restaurants = ({ serverData }) => {
  const router = useRouter();
  const classes = useStyles();
  const { data: res, mutate } = useMe();
  const [user, setUser] = React.useState();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isOwner, setIsOwner] = React.useState(false);
  const [deleteMessage, setDeleteMessage] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(16);
  const [isMapModalOpen, setIsMapModalOpen] = React.useState(false);
  const [forNewRestaurant, setForNewRestaurant] = React.useState(false);
  const [restaurantForm, setRestaurantForm] = React.useState({});
  const [coordinates, setCoordinates] = React.useState([]);
  const [restaurants, setRestaurants] = React.useState(serverData);
  const [priceFilter, setPriceFilter] = React.useState(undefined);
  const [sizeFilter, setSizeFilter] = React.useState(undefined);
  const [roomsFilter, setRoomsFilter] = React.useState(undefined);

  React.useEffect(() => {
    if (restaurants) {
      const arr = restaurants.map((item) => {
        const latlng = item.coordinates.split(",");
        const lat = parseFloat(latlng[0]);
        const lng = parseFloat(latlng[1]);
        return { name: item.name, location: { lat: lat, lng: lng } };
      });
      setCoordinates(arr);
    }
  }, [restaurants]);

  React.useEffect(() => {
    let filteredData = serverData;
    if (priceFilter)
      filteredData = filteredData.filter((item) => item.price <= priceFilter);
    if (sizeFilter)
      filteredData = filteredData.filter((item) => item.size <= sizeFilter);
    if (roomsFilter)
      filteredData = filteredData.filter((item) => item.rooms <= roomsFilter);
    setRestaurants(filteredData);
  }, [priceFilter, sizeFilter, roomsFilter]);

  React.useEffect(() => {
    setRestaurants(serverData);
  }, [serverData]);

  React.useLayoutEffect(() => {
    if (res && res.data) {
      setUser(res.data);
      if (res.data.role === "admin") setIsAdmin(true);
      if (res.data.role === "owner") setIsOwner(true);
    }
    if (!res || res.error) Router.replace("/");
  }, [res]);

  if (!res || res.error) {
    return null;
  }

  if (!res || !res.data) return <CircularProgress />;

  const refreshData = () => {
    router.replace(router.asPath);
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

  const createRestaurant = () => {
    setRestaurantForm({
      name: "",
      owner: "",
      image_url: "",
    });
    setForNewRestaurant(true);
    setIsModalOpen(true);
  };

  const editRestaurant = (item) => {
    setRestaurantForm({
      id: item._id,
      name: item.name,
      description: item.description,
      size: item.size,
      price: item.price,
      rooms: item.rooms,
      coordinates: item.coordinates,
      image_url: item.image_url,
      associated_realtor: item.associated_realtor,
      is_rented: item.is_rented,
    });
    setForNewRestaurant(false);
    setIsModalOpen(true);
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
            <Grid container spacing={10} style={{ padding: "0 30px" }}>
              <Grid item xs={12} md={4}>
                <Typography id="price-slider">
                  max price: {priceFilter && priceFilter}
                </Typography>
                <CustomSlider
                  aria-labelledby="price-slider"
                  step={100}
                  min={100}
                  max={1500}
                  defaultValue={1500}
                  marks
                  onChange={(_, value) => setPriceFilter(value)}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography id="size-slider">
                  max size: {sizeFilter && sizeFilter}
                </Typography>
                <CustomSlider
                  aria-labelledby="size-slider"
                  marks
                  step={10}
                  min={50}
                  max={200}
                  defaultValue={200}
                  onChange={(_, value) => setSizeFilter(value)}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography id="rooms-slider">
                  max rooms: {roomsFilter && roomsFilter}
                </Typography>
                <CustomSlider
                  aria-labelledby="rooms-slider"
                  marks
                  marks
                  step={1}
                  min={1}
                  max={7}
                  defaultValue={7}
                  onChange={(_, value) => setRoomsFilter(value)}
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginLeft: 30,
                marginRight: 10,
              }}
            >
              {(isAdmin || isRealtor) && (
                <Fab
                  color="primary"
                  aria-label="create-restaurant"
                  onClick={() => createRestaurant()}
                >
                  <AddIcon />
                </Fab>
              )}

              <Fab
                color="primary"
                aria-label="open-map"
                onClick={() => setIsMapModalOpen(true)}
                style={{ marginLeft: 20 }}
              >
                <PublicIcon />
              </Fab>
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
                        if (item.is_rented && !isAdmin && !isRealtor)
                          return null;
                        return (
                          <Grid
                            key={item._id}
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                          >
                            <Paper className={classes.paper}>
                              <RestaurantCard
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                size={item.size}
                                rooms={item.rooms}
                                image={item.image_url}
                                createdAt={item.created_at}
                                isRented={item.is_rented}
                                isAdmin={isAdmin}
                                isRealtor={isRealtor}
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
        isOpen={isMapModalOpen}
        onModalClose={() => setIsMapModalOpen(false)}
      >
        <div className={classes.modalBody}>
          <Map items={coordinates} />
        </div>
      </Modal>
      <Modal isOpen={isModalOpen} onModalClose={() => setIsModalOpen(false)}>
        <div className={classes.modalBody}>
          <RestaurantForm
            formId="add-restaurant-form"
            restaurantForm={restaurantForm}
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

  const result = await Restaurant.find({});
  const restaurants = result.map((doc) => {
    const restaurants = doc.toObject();
    restaurants._id = restaurants._id.toString();
    return restaurants;
  });

  return { props: { serverData: restaurants } };
}

export default Restaurants;
