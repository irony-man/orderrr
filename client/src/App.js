import React, { useState, useEffect } from "react";
import Paths from "./components/Paths";
import Snake from "snake-game-react";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme, removeUser, userLogged } from "./redux/actions/userAction";
import { TextField, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MuiAlert from "@mui/material/Alert";
import AlertMessage from "./utils/AlertMessage";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCookies } from "react-cookie";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const [loading, setLoading] = useState(true);
  var userTheme = useSelector((state) => state.user.theme);
  const system = useMediaQuery("(prefers-color-scheme: dark)");

  if (userTheme === "system") {
    userTheme = system ? "dark" : "light";
  }
  const dispatch = useDispatch();
  const theme = createTheme({
    palette: {
      mode: userTheme,
      ...(userTheme === 'light'? {
        background: {
          default: "#F9F6F1",
        },
        primary: {
          main: "#000",
        },
      }: {
        primary: {
          main: "#fff",
        },
      }),
    },
  });
  useEffect(() => {
    axios
      .get("/initiate")
      .then((response) => {
        setLoading(false);
        if (response.data) {
          dispatch(userLogged(response.data));
        } else {
          dispatch(removeUser());
        }
      })
      .catch((error) => {
        dispatch(removeUser());
      });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          position: "fixed",
          zIndex: "-1000",
          bgcolor: "background.default",
        }}
      ></Box>
        {loading ? (
          <div className="loader">
            <CircularProgress style={{ color: "text.primary" }} />
          </div>
        ) : (
          <>
            <Paths />
            <AlertMessage />
          </>
        )}
    </ThemeProvider>
  );
}

export default App;
