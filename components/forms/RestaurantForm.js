import * as React from "react";
import { mutate } from "swr";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    padding: "0 25px 15px 25px",
    overflowY: "scroll",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const RestaurantForm = ({
  restaurantForm,
  owners,
  forNewRestaurant = true,
  onCompleted,
  isAdmin,
}) => {
  const classes = useStyles();
  const [errors, setErrors] = React.useState({});
  const [errorMessage, setErrorMessage] = React.useState("");
  const [form, setForm] = React.useState({
    ...restaurantForm,
    ...(forNewRestaurant && { created_at: new Date().toString() }),
  });

  // RESTAURANT PUT
  const putData = async (form) => {
    try {
      const res = await fetch(`/api/restaurants/${restaurantForm.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      const { data } = await res.json();
      mutate(`/api/restaurants/${restaurantForm.id}`, data, false);
      onCompleted();
      return res;
    } catch (error) {
      setErrorMessage("Failed to update restaurant");
    }
  };

  // RESTAURANT POST
  const postData = async (form) => {
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error(res.status);
      }
      onCompleted();
      return res;
    } catch (error) {
      setErrorMessage("Failed to add restaurant");
    }
  };

  const formValidate = () => {
    setErrors({});
    let err = {};
    if (!form.name) err.name = "name is required";
    if (!form.owner_id) err.owner_id = "owner ID is required";
    if (!form.image_url) err.image_url = "image is required";
    return err;
  };

  const handleChange = (e) => {
    const target = e.target;
    const type = e.target.type;
    const name = target.name;
    const value = target.value;

    setForm({
      ...form,
      [name]: type === "number" ? parseInt(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = formValidate();
    if (Object.keys(errs).length === 0) {
      forNewRestaurant ? postData(form) : putData(form);
    } else {
      setErrors(errs);
    }
  };

  return (
    <>
      <CssBaseline />
      <div
        className={classes.paper}
        style={{ height: "-webkit-fill-available" }}
      >
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {forNewRestaurant ? "Create Restaurant" : "Edit Restaurant"}
        </Typography>
        <form
          id="restaurant-form"
          className={classes.form}
          noValidate
          onSubmit={(e) => handleSubmit(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                error={errors && errors.name}
                id="name"
                name="name"
                label="name"
                value={form.name}
                autoComplete="name"
                variant="outlined"
                fullWidth
                required
                autoFocus
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            {isAdmin && (
              <Grid item xs={6}>
                {/* ADMIN */}
                {/* <TextField
                  error={errors && errors.owner}
                  id="owner"
                  name="owner"
                  label="owner"
                  value={form.owner}
                  autoComplete="owner"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={(e) => handleChange(e)}
                /> */}
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="owner_id">owner</InputLabel>
                  <Select
                    error={errors && errors.owner_id}
                    labelId="owner_id"
                    id="owner_id"
                    name="owner_id"
                    label="owner"
                    value={form.owner_id}
                    onChange={(e) => handleChange(e)}
                  >
                    {owners.map((item) => (
                      <MenuItem value={item._id}>{item.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                error={errors && errors.image_url}
                id="image_url"
                name="image_url"
                label="image url"
                value={form.image_url}
                autoComplete="image_url"
                type="url"
                variant="outlined"
                fullWidth
                required
                onChange={(e) => handleChange(e)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            className={classes.submit}
          >
            {forNewRestaurant ? "Create" : "Edit"}
          </Button>
          <Typography>{errorMessage}</Typography>
        </form>
      </div>
    </>
  );
};

export default RestaurantForm;
