import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
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

const LoginForm = ({ sendMutation }) => {
  const classes = useStyles();
  const [errors, setErrors] = React.useState({});
  const [errorMessage, setErrorMessage] = React.useState("");
  const [form, setForm] = React.useState({ name: "", password: "" });

  const login = async (form) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      return res;
    } catch (error) {
      setErrorMessage("Failed to login");
    }
  };

  const formValidate = () => {
    setErrors({});
    let err = {};
    if (!form.name) err.name = "name is required";
    if (!form.password) err.password = "password is required";
    return err;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = formValidate();
    if (Object.keys(errs).length === 0) {
      login(form).then(() => sendMutation());
    } else {
      setErrors(errs);
    }
  };

  return (
    <>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form
          id="login-form"
          className={classes.form}
          noValidate
          onSubmit={(e) => handleSubmit(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={errors && errors.name}
                id="name"
                name="name"
                label="user name"
                autoComplete="name"
                variant="outlined"
                fullWidth
                required
                autoFocus
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={errors && errors.password}
                id="password"
                name="password"
                label="password"
                autoComplete="current-password"
                variant="outlined"
                type="password"
                fullWidth
                required
                onChange={(e) => handleChange(e)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            className={classes.submit}
          >
            Login
          </Button>
          <Typography color="error">{errorMessage}</Typography>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
