import * as React from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import TextField from "@material-ui/core/TextField";
import ReactStars from "react-rating-stars-component";
import Typography from "@material-ui/core/Typography";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";

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
  userId,
  restaurantId,
  isAdmin,
  isOwner,
  isUser,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const [errors, setErrors] = React.useState({});
  const [errorMessage, setErrorMessage] = React.useState("");
  const [form, setForm] = React.useState({
    ...reviewForm,
    // ...(forNewReview && { created_at: new Date().toString() }),
    // ...(forNewReview && { date: moment().format("DD-MM-YYYY") }),
  });

  const [selectedDate, setDate] = React.useState(moment());
  const [dateValue, setDateValue] = React.useState(
    forNewReview ? moment().format("DD-MM-YYYY") : form.date
  );
  const [rating, setRating] = React.useState(forNewReview ? 0 : form.rating);

  // REVIEW POST
  const postData = async (form) => {
    const postForm = {
      ...form,
      date: dateValue,
      rating: parseInt(rating),
      user_id: userId,
    };

    try {
      const res = await fetch(`/api/restaurants/${form.id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postForm),
      });
      if (!res.ok) {
        throw new Error(res.status);
      }
      const { data } = await res.json();
      mutate(`/api/restaurants/${form.id}`, data, false);
      onCompleted();
      return res;
    } catch (error) {
      setErrorMessage("Failed to add restaurant");
    }
  };

  // REVIEW PUT
  const putData = async (form) => {
    const newReview = {
      id: form.id,
      rating: rating,
      reply: form.reply,
      comment: form.comment,
      date: dateValue,
    };

    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      onCompleted();
      return res;
    } catch (error) {
      setErrorMessage("Failed to update review");
    }
  };

  const onDateChange = (date, value) => {
    setDate(date);
    setDateValue(value);
  };

  const dateFormatter = (str) => {
    return str;
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

  const formValidate = () => {
    setErrors({});
    let err = {};
    if (!rating) err.rating = "rating can't be 0";
    if (!form.comment) err.comment = "comment is required";
    if (!form.reply && isOwner) err.reply = "reply is required";
    return err;
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
              <ReactStars
                count={5}
                value={rating}
                edit={!isOwner}
                onChange={(newRating) => setRating(newRating)}
                a11y={false}
                size={24}
                activeColor="#ffd700"
              />
            </Grid>
            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
              <Grid item xs={6}>
                <KeyboardDatePicker
                  autoOk={true}
                  showTodayButton={true}
                  value={selectedDate}
                  format="DD-MM-YYYY"
                  disabled={isOwner}
                  // error={errors && errors.date}
                  fullWidth
                  label="date visited"
                  variant="inline"
                  required
                  inputVariant="outlined"
                  inputValue={dateValue}
                  // onError={console.log("error")}
                  onChange={onDateChange}
                  rifmFormatter={dateFormatter}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <Grid item xs={12}>
              <TextField
                error={errors && errors.comment}
                id="comment"
                name="comment"
                label="comment"
                value={form.comment}
                disabled={isOwner}
                autoComplete="comment"
                variant="outlined"
                fullWidth
                required={!isOwner}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            {(isAdmin || isOwner) && (
              <Grid item xs={12}>
                <TextField
                  error={errors && errors.reply}
                  id="reply"
                  name="reply"
                  label="reply"
                  value={form.reply}
                  variant="outlined"
                  fullWidth
                  disabled={isAdmin && !form.reply}
                  required={isOwner}
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
            )}
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
