import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import EditIcon from "@material-ui/icons/Edit";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
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
}));

const RestaurantCard = ({
  name,
  image,
  //   createdAt,
  isAdmin,
  isOwner,
  onEdit,
  onDelete,
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
          {/* <Typography gutterBottom component="h3" align="left">
            {createdAt}
          </Typography> */}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            component="p"
            style={{ color: "darkGreen", fontSize: 18 }}
          >
            $ price
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            style={{ fontSize: 16 }}
          >
            Rooms: rooms
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            style={{ fontSize: 16 }}
          >
            Size: size
          </Typography>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            style={{ marginLeft: 0 }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </div>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent style={{ padding: 16, paddingTop: 0 }}>
          <Typography align="left">description</Typography>
        </CardContent>
      </Collapse>
      {(isAdmin || isOwner) && (
        <CardActions>
          <Button
            startIcon={<EditIcon />}
            onClick={() => {
              onEdit();
            }}
          >
            Edit
          </Button>
          <Button
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={() => {
              onDelete();
            }}
          >
            Delete
          </Button>
          <Typography
            variant="body2"
            color="secondary"
            component="p"
            style={{ marginLeft: 20 }}
          >
            RENTED
          </Typography>
        </CardActions>
      )}
    </Card>
  );
};

export default RestaurantCard;
