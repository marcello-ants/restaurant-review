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

const ReviewForm = ({
  reviewForm,
  // owners,
  forNewReview = true,
  onCompleted,
  isAdmin,
  isCostumer,
}) => {
  const classes = useStyles();
  const [errors, setErrors] = React.useState({});
  const [errorMessage, setErrorMessage] = React.useState("");
  const [form, setForm] = React.useState({
    ...reviewForm,
    ...(forNewReview && { created_at: new Date().toString() }),
  });

  // REVIEW PUT
  const putData = async (form) => {
    try {
      const res = await fetch(`/api/restaurants/${reviewForm.id}`, {
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
      mutate(`/api/restaurants/${reviewForm.id}`, data, false);
      onCompleted();
      return res;
    } catch (error) {
      setErrorMessage("Failed to update restaurant");
    }
  };

  // REVIEW POST
  const postData = async (form) => {
    try {
      // const res = await fetch("/api/restaurants/", {
      const res = await fetch(`/api/restaurants/${form.id}/reviews`, {
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
    if (!form.comment) err.comment = "comment is required";
    if (!form.rating) err.rating = "rating is required";
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
      forNewReview ? postData(form) : putData(form);
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
          {forNewReview ? "Create Review" : "Edit Review"}
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
                error={errors && errors.rating}
                id="rating"
                name="rating"
                label="rating"
                type="number"
                value={form.rating}
                autoComplete="rating"
                variant="outlined"
                fullWidth
                required
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={errors && errors.comment}
                id="comment"
                name="comment"
                label="comment"
                value={form.comment}
                autoComplete="comment"
                variant="outlined"
                fullWidth
                required
                autoFocus
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            {/* {isAdmin && (
              <Grid item xs={6}>
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
            )} */}
          </Grid>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            className={classes.submit}
          >
            {forNewReview ? "Create" : "Edit"}
          </Button>
          <Typography>{errorMessage}</Typography>
        </form>
      </div>
    </>
  );
};

export default ReviewForm;
