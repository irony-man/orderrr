import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { alertMessage } from "../../redux/actions/alertsAction";
import { useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import apis from "../../redux/actions/apis";
import { HttpBadRequestError } from "../../redux/network";

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
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setErrors({});
      await apis.createUser({ username, raw_password: password, email });
      dispatch(
        alertMessage({
          message: "User created!!",
          type: "success",
          open: true,
        })
      );
      navigate(`/login/?${urlParams}`);
    } catch (error) {
      if (error instanceof HttpBadRequestError) {
        setErrors(error.data);
      }
      dispatch(
        alertMessage({
          message: "Error creating user!!",
          type: "error",
          open: true,
        })
      );
    } finally {
      setLoading(false);
    }
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
                error={errors.email}
                helperText={errors.email}
              />
              <TextField
                label="User Name"
                type="text"
                disabled={loading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                error={errors.username}
                helperText={errors.username}
              />
              <TextField
                required
                fullWidth
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                type="password"
                error={errors.raw_password}
                helperText={errors.raw_password}
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
