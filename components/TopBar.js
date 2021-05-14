import * as React from "react";
import Link from "next/link";
import Router from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import useMe from "../hooks/use-me";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

function logout() {
  return fetch("/api/logout", { method: "POST" });
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar({}) {
  const classes = useStyles();
  const { data: res, mutate } = useMe();
  const [user, setUser] = React.useState({});

  React.useLayoutEffect(() => {
    if (!res || res.error) Router.replace("/");
    if (res && res.data) setUser({ ...res.data });
  }, [res]);

  if (!res || res.error) {
    return null;
  }

  if (!res || !res.data) return <p>Loading...</p>;

  const isAdmin = user.role === "admin" ? true : false;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {user && (
            <Typography variant="h6" className={classes.title}>
              {user.name}
            </Typography>
          )}
          {isAdmin && (
            <Link href="/restaurants">
              <Button color="inherit" style={{ marginLeft: 12 }}>
                Restaurants
              </Button>
            </Link>
          )}
          {isAdmin && (
            <Link href="/users">
              <Button color="inherit" style={{ marginLeft: 12 }}>
                Users
              </Button>
            </Link>
          )}
          <Button
            color="inherit"
            onClick={() => logout().then(() => mutate())}
            style={{ marginLeft: 12 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
