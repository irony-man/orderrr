import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { alertMessage } from "../../redux/actions/alertsAction";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  Box,
  CircularProgress,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  bgimage: {
    backgroundImage:
      "url(https://images.unsplash.com/photo-1519389950473-47ba0277781c)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
});

const Signup = () => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/signup", { username, email, password })
      .then(function (response) {
        setLoading(false);
        if (response.status === 201) {
          dispatch(
            alertMessage({
              message: response.data.message,
              type: "success",
              open: true,
            })
          );
          navigate("/login");
        }
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response.status) {
          dispatch(
            alertMessage({
              message: error.response.data.message,
              type: "error",
              open: true,
            })
          );
        }
      });
  };
  return (
    <>
      <title>Sign Up | Orderrr</title>
      <Grid container sx={{ height: "100vh", mt: -10 }}>
        <Grid item xs={false} sm={4} md={7} className={classes.bgimage} />
        <Grid item xs={12} sm={8} md={5}>
          <Box
            sx={{
              mt: 15,
              mx: 4,
              textAlign: "center",
            }}
          >
            <Typography
              component={Link}
              to="/"
              variant="h3"
              sx={{
                color: "text.primary",
                fontWeight: 800,
                ":hover": {
                  color: "text.primary",
                },
              }}
            >
              Orderrr
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                "& .MuiTextField-root": { mt: 3, bgcolor: "background.paper" },
                textAlign: "center",
              }}
            >
              <TextField
                required
                fullWidth
                autoFocus
                disabled={loading}
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="User Name"
                type="text"
                disabled={loading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
              />
              <TextField
                required
                fullWidth
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                type="password"
              />
              <Button
                type="submit"
                size="large"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </Box>
            <Typography
              variant="body1"
              sx={{ mt: 2, textAlign: "left", color: "text.primary" }}
            >
              Already a member? <Link to="/login">Login now</Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Signup;
