import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import PersonIcon from "@material-ui/icons/Person";
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

const SignUpForm = ({ sendMutation }) => {
  const classes = useStyles();
  const [errors, setErrors] = React.useState({});
  const [errorMessage, setErrorMessage] = React.useState("");
  const [form, setForm] = React.useState({
    name: "",
    password: "",
    role_owner: false,
  });

  const signup = async (form) => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      return res
        .json()
        .then((json) => {
          throw json;
        })
        .catch((err) => {
          setErrorMessage(err.message);
        });
    }
    return res;
  };

  const formValidate = () => {
    setErrors({});
    let err = {};
    if (!form.name) err.name = "name is required";
    if (!form.password) err.password = "password is required";
    return err;
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = e.target.name;
    const value = name === "role_owner" ? target.checked : target.value;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = formValidate();
    if (Object.keys(errs).length === 0) {
      signup(form).then(() => sendMutation());
    } else {
      setErrors(errs);
    }
  };

  return (
    <>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PersonIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form
          id="signup-form"
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
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                  <FormControlLabel
                    id="role_owner"
                    name="role_owner"
                    label="sign up as owner"
                    labelPlacement="end"
                    textSecondary
                    style={{ color: "gray" }}
                    control={<Checkbox color="primary" />}
                    onChange={(e) => handleChange(e)}
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Typography>{errorMessage}</Typography>
        </form>
      </div>
    </>
  );
};

export default SignUpForm;
