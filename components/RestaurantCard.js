import * as React from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import ReactStars from "react-rating-stars-component";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CssBaseline from "@material-ui/core/CssBaseline";
import CardMedia from "@material-ui/core/CardMedia";
import ReviewForm from "./forms/ReviewForm";
import Modal from "../components/Modal";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AddCommentIcon from "@material-ui/icons/AddComment";
import EditIcon from "@material-ui/icons/Edit";
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
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    padding: "0 25px 15px 25px",
    overflowY: "scroll",
    flexDirection: "column",
    alignItems: "center",
  },
  modalBody: {
    backgroundColor: "white",
    height: "calc(100vh - 200px)",
    width: "calc(100% - 500px)",
    margin: "auto",
    borderRadius: 10,
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
  restaurant,
  reviews,
  //   createdAt,
  isUser,
  userId,
  isAdmin,
  isOwner,
  onEdit,
  onCompleted,
  onEditReview,
  onReview,
  onDelete,
}) => {
  const router = useRouter();
  const classes = useStyles();
  const [errors, setErrors] = React.useState({});
  const [replies, setReplies] = React.useState(
    [...Array(reviews.length)].map((_, i) => "")
  );

  const [reviewForm, setReviewForm] = React.useState({});
  const [forNewReview, setForNewReview] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);

  const { _id: restaurantId, name, image, rating } = restaurant;

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const createReview = () => {
    setReviewForm({
      id: restaurantId,
      comment: "",
      reply: "",
      rating: 0,
    });
    setForNewReview(true);
    setIsReviewModalOpen(true);
  };

  const editReview = (review) => {
    setReviewForm({
      id: review._id,
      rating: review.rating,
      comment: review.comment,
      date: review.date,
      reply: review.reply,
    });
    setForNewReview(false);
    setIsReviewModalOpen(true);
  };

  const isReviewed = reviews.reduce(
    (accumulator, item) => accumulator || item.user_id === userId,
    false
  );

  const ordered = reviews.sort(function (a, b) {
    return b.rating - a.rating;
  });

  return (
    <Card className={classes.root}>
      <CardHeader
        title={
          <Typography component="h3" align="left" style={{ fontSize: 20 }}>
            {name}
          </Typography>
        }
        subheader={
          <div style={{ display: "flex", alignItems: "center" }}>
            <ReactStars
              count={5}
              value={rating}
              a11y={false}
              isHalf={true}
              edit={false}
              size={18}
              activeColor="#ffd700"
            />
            <Typography
              component="span"
              align="left"
              style={{ fontSize: 16, marginLeft: 5 }}
            >
              {rating}
            </Typography>
            <Typography
              component="span"
              align="left"
              style={{ fontSize: 15, marginLeft: 10, cursor: "pointer" }}
              onClick={() => setIsModalOpen(true)}
            >
              ({reviews.length} reviews)
            </Typography>
          </div>
        }
      />
      <CardMedia className={classes.media} image={image} title={name} />
      <CardActions disableSpacing>
        {isUser && (
          <IconButton
            aria-label="add-comment"
            disabled={isReviewed}
            onClick={() => {
              createReview();
            }}
          >
            <AddCommentIcon fontSize="large" />
          </IconButton>
        )}
        {/* DELETE RESTAURANT */}
        {isAdmin && (
          <>
            <IconButton aria-label="edit-restaurant">
              <EditIcon fontSize="large" onClick={() => onEdit()} />
            </IconButton>
            <IconButton aria-label="delete-restaurant">
              <HighlightOffIcon
                color="secondary"
                fontSize="large"
                onClick={() => onDelete()}
              />
            </IconButton>
          </>
        )}
      </CardActions>
      <Modal isOpen={isModalOpen} onModalClose={() => setIsModalOpen(false)}>
        <div className={classes.modalBody}>
          <CssBaseline />
          <div
            className={classes.paper}
            style={{ height: "-webkit-fill-available" }}
          >
            {/* <div
              style={{
                width: "100%",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <ReactStars
                  count={5}
                  value={ordered[0].rating}
                  a11y={false}
                  isHalf={true}
                  edit={false}
                  size={18}
                  activeColor="#ffd700"
                />
                <Typography
                  component="span"
                  align="left"
                  style={{ fontSize: 14, marginLeft: 5 }}
                >
                  ({ordered[0].date} )
                </Typography>
              </div>
              <Typography component="span">{ordered[0].comment}</Typography>
            </div> */}
            <CardContent
              style={{
                width: "100%",
                padding: 16,
                paddingTop: 0,
              }}
            >
              {reviews.map((item, index) => (
                <div
                  key={item._id}
                  item={item._id}
                  style={{ marginBottom: 25 }}
                >
                  {/* EDIT REVIEW */}
                  {isAdmin && (
                    <IconButton aria-label="edit-restaurant">
                      <EditIcon
                        fontSize="small"
                        onClick={() => {
                          editReview(item);
                        }}
                      />
                    </IconButton>
                  )}
                  <ReactStars
                    count={5}
                    value={item.rating}
                    a11y={false}
                    edit={false}
                    size={15}
                    activeColor="#ffd700"
                  />
                  <Typography gutterBottom>{item.comment}</Typography>
                  {item.reply && (
                    <div>
                      <Typography variant="subtitle2">
                        Owner's reply:
                      </Typography>
                      <Typography as="p">{item.reply}</Typography>
                    </div>
                  )}
                  {isOwner && !item.reply && (
                    <button
                      onClick={() => {
                        editReview(item);
                      }}
                    >
                      reply
                    </button>
                  )}
                  {/* {isOwner && !item.reply && (
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
                        </Grid>
                      </>
                    )} */}
                </div>
              ))}
            </CardContent>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isReviewModalOpen}
        onModalClose={() => setIsReviewModalOpen(false)}
      >
        <div className={classes.modalBody}>
          <ReviewForm
            formId="add-review-form"
            reviewForm={reviewForm}
            // TODO: review global user info
            userId={userId}
            restaurantId={restaurantId}
            forNewReview={forNewReview}
            isUser={isUser}
            isOwner={isOwner}
            isAdmin={isAdmin}
            onCompleted={() => {
              onCompleted();
              // refreshData();
              setIsReviewModalOpen(false);
            }}
          />
        </div>
      </Modal>
    </Card>
  );
};

export default RestaurantCard;
