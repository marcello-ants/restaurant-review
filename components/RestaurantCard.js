import * as React from "react";
import Router, { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ReactStars from "react-rating-stars-component";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 200,
  },
  button: {
    height: 35,
  },
  media: {
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const RestaurantCard = ({
  name,
  image,
  data,
  //   createdAt,
  isCustomer,
  userId,
  isAdmin,
  isOwner,
  reviews,
  onEdit,
  onEditReview,
  onReview,
  onDelete,
}) => {
  const router = useRouter();
  const classes = useStyles();
  const [errors, setErrors] = React.useState({});
  const [reply, setReply] = React.useState("");
  const [replies, setReplies] = React.useState(
    [...Array(reviews.length)].map((_, i) => "")
  );

  const [expanded, setExpanded] = React.useState(false);

  const { _id: restaurantId } = data;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const formValidate = () => {
    setErrors({});
    let err = {};
    if (!reply) err.reply = "reply is required";
    return err;
  };

  const handleSubmit = (review, reply) => {
    const newReview = {
      ...review,
      reply: reply,
    };

    onEditReview(restaurantId, newReview);
  };

  const isReviewed = reviews.reduce(
    (accumulator, item) => accumulator || item.customer_id === userId,
    false
  );

  return (
    <Card className={classes.root}>
      <CardMedia className={classes.media} image={image} title={name} />
      <CardContent style={{ padding: "12px 6px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            gutterBottom
            component="h3"
            align="left"
            style={{ fontSize: 18 }}
          >
            {name}
          </Typography>
        </div>
      </CardContent>
      <CardContent style={{ padding: 16, paddingTop: 0 }}>
        {reviews.map((item, index) => (
          <div key={item._id} item={item._id}>
            <span>
              <ReactStars
                count={5}
                value={item.rating}
                a11y={false}
                edit={false}
                size={15}
                activeColor="#ffd700"
              />
              <Typography component="span">{item.comment}</Typography>
            </span>
            {isOwner && !item.reply && (
              <>
                <Grid item xs={12}>
                  <TextField
                    error={errors && errors.reply}
                    id={`${item._id}-reply`}
                    name="reply"
                    label="reply"
                    value={replies[index]}
                    autoComplete="reply"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                      let newArr = [...replies];
                      newArr[index] = e.target.value;
                      setReplies(newArr);
                    }}
                  />
                </Grid>
                <Button
                  className={classes.button}
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    // onEditReview();
                    handleSubmit(item, replies[index]);
                  }}
                >
                  Review
                </Button>
              </>
            )}
            <br />
          </div>
        ))}
      </CardContent>
      <CardActions>
        {isCustomer && !isReviewed && (
          <Button
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={() => {
              onReview();
            }}
          >
            Review
          </Button>
        )}
        {/* <Button
            startIcon={<EditIcon />}
            onClick={() => {
              onEdit();
            }}
          >
            Edit
          </Button> */}
        {isAdmin && (
          <Button
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={() => {
              onDelete();
            }}
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default RestaurantCard;
