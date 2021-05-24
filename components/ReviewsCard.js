import * as React from "react";
import ReactStars from "react-rating-stars-component";
import CardContent from "@material-ui/core/CardContent";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

const ReviewsCard = ({ reviews, isAdmin, isOwner, editReview }) => {
  reviews.sort(function (a, b) {
    let aa = a.date.split("/").reverse().join(),
      bb = b.date.split("/").reverse().join();
    return aa > bb ? -1 : aa < bb ? 1 : 0;
  });

  return (
    <CardContent
      style={{
        width: "100%",
        padding: 16,
        paddingTop: 0,
      }}
    >
      {reviews.length === 0 ? (
        <Typography
          style={{
            fontWeight: "bold",
            fontSize: 22,
            textAlign: "center",
          }}
        >
          There are no reviews for this restaurant yet :(
        </Typography>
      ) : (
        <>
          {reviews.map((item) => (
            <div key={item._id} item={item._id} style={{ marginBottom: 25 }}>
              {/* USER NAME */}
              <Typography style={{ fontWeight: "bold" }}>
                {item.user_name}
              </Typography>
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
                <Typography style={{ marginBottom: 18 }}>
                  {item.comment}
                </Typography>
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
          ))}
        </>
      )}
    </CardContent>
  );
};

export default ReviewsCard;
