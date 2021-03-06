import * as React from "react";
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

const TextFieldComponent = (props) => {
  return <TextField {...props} disabled={true} />;
};

const ReviewForm = ({
  reviewForm,
  forNewReview = true,
  onCompleted,
  userId,
  restaurantId,
  isAdmin,
  isOwner,
}) => {
  const classes = useStyles();
  const [errors, setErrors] = React.useState({});
  const [errorMessage, setErrorMessage] = React.useState("");
  const [form, setForm] = React.useState({
    ...reviewForm,
  });

  const [selectedDate, setDate] = React.useState(moment());
  const [dateValue, setDateValue] = React.useState(
    forNewReview ? moment().format("DD/MM/YYYY") : form.date
  );
  const [rating, setRating] = React.useState(forNewReview ? 0 : form.rating);

  // REVIEW POST
  const createReview = async (form) => {
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
      onCompleted();
      return res;
    } catch (error) {
      setErrorMessage("Failed to add review");
    }
  };

  // REVIEW PUT
  const editReview = async (form) => {
    const newReview = {
      id: form.id,
      rating: rating,
      reply: form.reply,
      comment: form.comment,
      user_name: form.user_name,
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
      forNewReview ? createReview(form) : editReview(form);
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
          {forNewReview ? "Add Review" : "Edit Review"}
        </Typography>
        <form
          id="restaurant-form"
          className={classes.form}
          noValidate
          onSubmit={(e) => handleSubmit(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                <KeyboardDatePicker
                  autoOk={true}
                  showTodayButton={true}
                  value={selectedDate}
                  maxDate={new Date()}
                  format="DD/MM/YYYY"
                  disabled={isOwner}
                  disableFuture={true}
                  fullWidth
                  label="date visited"
                  variant="inline"
                  required
                  inputVariant="outlined"
                  inputValue={dateValue}
                  onChange={onDateChange}
                  TextFieldComponent={TextFieldComponent}
                  rifmFormatter={dateFormatter}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
            <Grid item xs={12}>
              <TextField
                error={errors && errors.comment}
                id="comment"
                name="comment"
                label="comment"
                multiline
                rows={4}
                value={form.comment}
                disabled={isOwner}
                autoComplete="comment"
                variant="outlined"
                fullWidth
                required={!isOwner}
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            {((isAdmin && form.reply) || isOwner) && (
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
            disabled={!rating}
            className={classes.submit}
          >
            {forNewReview ? "Review" : "Edit"}
          </Button>
          <Typography>{errorMessage}</Typography>
        </form>
      </div>
    </>
  );
};

export default ReviewForm;
