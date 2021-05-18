import * as React from "react";
import { mutate } from "swr";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import PersonIcon from "@material-ui/icons/Person";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formControl: {
    margin: theme.spacing(1),
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

const UserForm = ({ userForm, forNewUser, onCompleted }) => {
  const classes = useStyles();
  const contentType = "application/json";
  const [errors, setErrors] = React.useState({});
  const [errorMessage, setErrorMessage] = React.useState("");
  const [form, setForm] = React.useState({ ...userForm });

  // USER PUT
  const putData = async (form) => {
    try {
      const res = await fetch(`/api/users/${userForm.id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }
      const { data } = await res.json();
      mutate(`/api/users/${userForm.id}`, data, false);
      onCompleted();
      return res;
    } catch (error) {
      setErrorMessage("Failed to update user");
    }
  };

  // USER POST
  const postData = async (form) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }
      onCompleted();
      return res;
    } catch (error) {
      setErrorMessage("Failed to create user");
    }
  };

  const formValidate = () => {
    setErrors({});
    let err = {};
    if (!form.name) err.name = "name is required";
    if (!form.password && forNewUser) err.password = "password is required";
    if (!form.role) err.role = "role is required";

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
      forNewUser ? postData(form) : putData(form);
    } else {
      setErrors(errs);
    }
  };

  return (
    <>
      <CssBaseline />
      <div className={classes.paper} style={{ padding: "0 40px" }}>
        <Avatar className={classes.avatar}>
          <PersonIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {forNewUser ? "Create User" : "Edit User"}
        </Typography>
        <form
          id="user-form"
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
                value={form.name}
                autoComplete="name"
                variant="outlined"
                fullWidth
                required
                autoFocus
                onChange={(e) => handleChange(e)}
              />
            </Grid>
            {forNewUser && (
              <Grid item xs={12}>
                <TextField
                  error={errors && errors.password}
                  id="password"
                  name="password"
                  label="password"
                  value={form.password}
                  autoComplete="current-password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  required
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="role">role</InputLabel>
                <Select
                  error={errors && errors.role}
                  labelId="role"
                  id="role"
                  name="role"
                  label="role"
                  value={form.role}
                  onChange={(e) => handleChange(e)}
                >
                  <MenuItem value="customer">customer</MenuItem>
                  <MenuItem value="owner">owner</MenuItem>
                  <MenuItem value="admin">admin</MenuItem>
                </Select>
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
            {forNewUser ? "Create User" : "Edit User"}
          </Button>
          <Typography>{errorMessage}</Typography>
        </form>
      </div>
    </>
  );
};

export default UserForm;
