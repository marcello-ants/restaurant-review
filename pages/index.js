import * as React from "react";
import Router from "next/router";
import useMe from "../hooks/use-me";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignupForm";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ padding: "0 30px" }}
    >
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const Home = () => {
  const { data: res, mutate } = useMe();
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const mutationCallback = () => {
    mutate();
  };

  React.useLayoutEffect(() => {
    if (res?.data) {
      Router.replace("/apartments");
    }
  }, [res]);

  if (res?.data) {
    return null;
  }

  return (
    <Container component="main" maxWidth="xs" style={{ height: "100%" }}>
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 600,
            height: 500,
            backgroundColor: "white",
            borderRadius: 12,
          }}
        >
          <AppBar
            position="static"
            style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
          >
            <Tabs
              variant="fullWidth"
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
              selectionFollowsFocus
            >
              <Tab label="sign up" {...a11yProps(0)} />
              <Tab label="login" {...a11yProps(1)} selected={true} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <SignUpForm sendMutation={mutationCallback} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <LoginForm sendMutation={mutationCallback} />
          </TabPanel>
        </div>
      </div>
    </Container>
  );
};

export default Home;
