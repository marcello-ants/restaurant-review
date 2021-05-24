import * as React from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import CssBaseline from "@material-ui/core/CssBaseline";
import CardMedia from "@material-ui/core/CardMedia";
import ReviewForm from "./forms/ReviewForm";
import Modal from "../components/Modal";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AddCommentIcon from "@material-ui/icons/AddComment";
import EditIcon from "@material-ui/icons/Edit";
import StarIcon from "@material-ui/icons/Star";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DeleteDialog from "./DeleteDialog";
import ReviewsCard from "./ReviewsCard";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0 16px 12px",
  },
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
  },
  flexCenter: {
    display: "flex",
    alignItems: "center",
  },
  button: {
    padding: "6px 12px",
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
    width: "80%",
    maxWidth: 900,
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
  isUser,
  userId,
  isAdmin,
  isOwner,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();
  const classes = useStyles();
  const [reviewForm, setReviewForm] = React.useState({});
  const [forNewReview, setForNewReview] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
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
    });
    setForNewReview(true);
    setIsReviewModalOpen(true);
  };

  const editReview = (review) => {
    setReviewForm({
      id: review._id,
      rating: review.rating,
      user_name: review.user_name,
      comment: review.comment,
      date: review.date,
      reply: review.reply,
    });
    setForNewReview(false);
    setIsReviewModalOpen(true);
  };

  const deleteReview = async (review) => {
    const reviewId = review._id;

    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewId),
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

  const isReviewed = reviews.reduce(
    (accumulator, item) => accumulator || item.user_id === userId,
    false
  );

  const pendingReply = reviews.filter((item) => !item.reply);

  return (
    <Card
      className={classes.root}
      style={{
        border: isOwner && pendingReply.length > 0 ? "1px solid red" : "",
      }}
    >
      <CardHeader
        style={{ paddingLeft: 5 }}
        title={
          <Typography component="h2" align="left" style={{ fontSize: 24 }}>
            {name}
          </Typography>
        }
        subheader={
          <div
            className={classes.flexCenter}
            style={{ cursor: "pointer" }}
            onClick={() => setIsModalOpen(true)}
          >
            <div className={classes.flexCenter} style={{ height: 30 }}>
              {[...Array(5)].map((_, i) => {
                const starValue = i + 1;
                return (
                  <StarIcon
                    style={{ color: starValue <= rating ? "#ffd700" : "gray" }}
                  />
                );
              })}
            </div>
            {/* RATING */}
            {rating && (
              <Typography
                component="span"
                align="left"
                style={{ fontSize: 18, marginLeft: 8, fontWeight: 600 }}
              >
                {rating}
              </Typography>
            )}
            {/* TOTAL REVIEWS */}
            <Typography
              component="span"
              align="left"
              style={{ fontSize: 14, marginLeft: 10 }}
            >
              ({reviews.length} reviews)
            </Typography>
          </div>
        }
      />
      <CardMedia
        className={classes.media}
        image={image}
        title={name}
        onClick={() => setIsModalOpen(true)}
        style={{ cursor: "pointer" }}
      />
      <CardActions disableSpacing style={{ paddingLeft: 0 }}>
        {/* CREATE REVIEW */}
        {isUser && (
          <Button
            className={classes.button}
            aria-label="add-comment"
            variant="contained"
            disabled={isReviewed}
            color="primary"
            startIcon={<AddCommentIcon size="large" />}
            onClick={() => {
              createReview();
            }}
          >
            Review
          </Button>
        )}
        {isAdmin && (
          <div className={classes.flexBetween} style={{ width: "100%" }}>
            {/* EDIT RESTAURANT */}
            <IconButton
              aria-label="edit-restaurant"
              className={classes.button}
              onClick={() => onEdit()}
            >
              <EditIcon fontSize="large" />
            </IconButton>
            {/* DELETE RESTAURANT */}
            <IconButton
              aria-label="delete-restaurant"
              className={classes.button}
              onClick={() => setIsDialogOpen(true)}
            >
              <HighlightOffIcon color="secondary" fontSize="large" />
            </IconButton>
            <DeleteDialog
              isOpen={isDialogOpen}
              onCancel={() => setIsDialogOpen(false)}
              onConfirm={() => {
                onDelete();
                setIsDialogOpen(false);
              }}
            />
          </div>
        )}
      </CardActions>
      <Modal isOpen={isModalOpen} onModalClose={() => setIsModalOpen(false)}>
        <div className={classes.modalBody}>
          <CssBaseline />
          <div
            className={classes.paper}
            style={{ height: "-webkit-fill-available" }}
          >
            <ReviewsCard
              reviews={reviews}
              restaurant={restaurant}
              isAdmin={isAdmin}
              isOwner={isOwner}
              editReview={(item) => editReview(item)}
              deleteReview={(item) => deleteReview(item)}
            />
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isReviewModalOpen}
        onModalClose={() => setIsReviewModalOpen(false)}
      >
        <div
          className={classes.modalBody}
          style={{ maxWidth: forNewReview ? 500 : 900 }}
        >
          <ReviewForm
            formId="add-review-form"
            reviewForm={reviewForm}
            userId={userId}
            restaurantId={restaurantId}
            forNewReview={forNewReview}
            isOwner={isOwner}
            isAdmin={isAdmin}
            onCompleted={() => {
              setIsReviewModalOpen(false);
              refreshData();
            }}
          />
        </div>
      </Modal>
    </Card>
  );
};

export default RestaurantCard;
