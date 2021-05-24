import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ReactStars from "react-rating-stars-component";
import CardContent from "@material-ui/core/CardContent";
import EditIcon from "@material-ui/icons/Edit";
import StarIcon from "@material-ui/icons/Star";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() => ({
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  flexCenter: {
    display: "flex",
    alignItems: "center",
  },
}));

const ReviewsCard = ({ reviews, restaurant, isAdmin, isOwner, editReview }) => {
  const classes = useStyles();

  // order reviews to get top and highest raitings
  const ordered = [...reviews].sort(function (a, b) {
    return b.rating - a.rating;
  });
  const topReview = ordered[0];
  const lowestReview = ordered[ordered.length - 1];

  // order reviews to get newest to oldest dates
  reviews.sort(function (a, b) {
    let aa = a.date.split("/").reverse().join(),
      bb = b.date.split("/").reverse().join();
    return aa > bb ? -1 : aa < bb ? 1 : 0;
  });

  const CommentItem = ({ item }) => {
    return (
      <div
        style={{
          height: "calc(100% - 30px)",
          border: "1px solid gray",
          borderRadius: 8,
          padding: 15,
        }}
      >
        {/* USER NAME */}
        <Typography style={{ fontWeight: "bold" }}>{item.user_name}</Typography>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: 3,
            marginBottom: 2,
          }}
        >
          {/* RATING */}
          <ReactStars
            count={5}
            value={item.rating}
            a11y={false}
            edit={false}
            size={18}
            activeColor="#ffd700"
          />
          {/* DATE */}
          <Typography
            as="span"
            color="textSecondary"
            style={{
              marginLeft: 10,
              fontSize: 14,
            }}
          >
            ({item.date})
          </Typography>
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
        </div>
        {/* COMMENT */}
        <div style={{ marginLeft: 8 }}>
          <Typography style={{ marginBottom: 18 }}>{item.comment}</Typography>
          {item.reply && (
            <div>
              <Typography variant="subtitle2" color="textPrimary">
                Owner's reply:
              </Typography>
              <Typography as="p" color="textSecondary">
                {item.reply}
              </Typography>
            </div>
          )}
        </div>
        {isOwner && !item.reply && (
          <button
            onClick={() => {
              editReview(item);
            }}
          >
            reply
          </button>
        )}
      </div>
    );
  };

  return (
    <CardContent
      style={{
        width: "100%",
        padding: 16,
        paddingTop: 0,
      }}
    >
      <Typography variant="h3">{restaurant.name}</Typography>
      <div className={classes.flexCenter} style={{ marginBottom: 45 }}>
        <div className={classes.flexCenter} style={{ height: 30 }}>
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1;
            return (
              <StarIcon
                style={{
                  color: starValue <= restaurant.rating ? "#ffd700" : "gray",
                }}
              />
            );
          })}
        </div>
        {/* RATING */}
        <Typography
          component="span"
          align="left"
          style={{ fontSize: 18, marginLeft: 8, fontWeight: 600 }}
        >
          {restaurant.rating}
        </Typography>
        {/* TOTAL REVIEWS */}
        <Typography
          component="span"
          align="left"
          style={{ fontSize: 14, marginLeft: 10 }}
        >
          ({reviews.length} reviews)
        </Typography>
      </div>
      {/* <div className={classes.flexCenter} style={{ marginBottom: 40 }}>
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          return (
            <StarIcon
              style={{
                color: starValue <= restaurant.rating ? "#ffd700" : "gray",
              }}
            />
          );
        })}
        <Typography>{restaurant.rating}</Typography>
      </div> */}
      {reviews.length === 0 ? (
        <Typography
          style={{
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          There are no reviews for this restaurant yet.
        </Typography>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 50,
            }}
          >
            <div style={{ width: "50%", paddingRight: 20 }}>
              <Typography className={classes.subtitle}>
                Highest review:
              </Typography>
              <CommentItem item={topReview} />
            </div>
            {reviews.length > 1 && (
              <div style={{ width: "50%", paddingLeft: 20 }}>
                <Typography className={classes.subtitle}>
                  Lowest review:
                </Typography>
                <CommentItem item={lowestReview} />
              </div>
            )}
          </div>
          {reviews.length > 2 && (
            <>
              <Typography className={classes.subtitle}>All reviews:</Typography>
              {reviews.map((item) => {
                if (item._id === topReview._id || item._id === lowestReview._id)
                  return null;
                return (
                  <div
                    key={item._id}
                    item={item._id}
                    style={{ marginBottom: 25 }}
                  >
                    <CommentItem item={item} />
                  </div>
                );
              })}
            </>
          )}
        </>
      )}
    </CardContent>
  );
};

export default ReviewsCard;
