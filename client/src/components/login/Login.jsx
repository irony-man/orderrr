import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userLogged } from "../../redux/actions/userAction";
import { alertMessage } from "../../redux/actions/alertsAction";
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
const Login = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/login", { email, password })
      .then(function (response) {
        setLoading(false);
        if (response.status === 200) {
          dispatch(userLogged(response.data));
          navigate("/");
        }
        if (response.data.message) {
          dispatch(
            alertMessage({
              message: response.data.message,
              type: "success",
              open: true,
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response.data.message) {
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
      <title>Login | Orderrr</title>
      <Grid container sx={{ height: "100vh", mt: -10 }}>
        <Grid item xs={false} sm={4} md={7} className={classes.bgimage} />
        <Grid item xs={12} sm={8} md={5}>
          <Box
            sx={{
              mt: 15,
              mx: 4,
              textAlign: "center",
              color: "text.primary",
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
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                disabled={loading}
              />
              <TextField
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                type="password"
                disabled={loading}
              />
              <Button
                type="submit"
                size="large"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? "Logging In..." : "Login"}
              </Button>
            </Box>
            <Typography variant="body1" sx={{ mt: 2, textAlign: "left" }}>
              Not a member? <Link to="/signup">Signup now</Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
