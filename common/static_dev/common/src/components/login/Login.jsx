import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/actions/userAction";
import { alertMessage } from "../../redux/actions/alertsAction";
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
const Login = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const user = await apis.loginUser({ username, password });
      dispatch(setUser(user));
      navigate(urlParams.get("next") ?? "/");
    } catch (error) {
      let message = "Error logging in!!";
      if (error instanceof HttpBadRequestError) {
        message = error.data.message;
      }
      dispatch(
        alertMessage({
          message: message,
          type: "error",
          open: true,
        })
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
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
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
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
              Not a member?{" "}
              <Link style={{ color: "text.primary" }} to={`/signup/?${urlParams}`}>
                Signup now
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
