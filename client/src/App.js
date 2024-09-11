import React, { useState, useEffect } from "react";
import Paths from "./components/Paths";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeUser, userLogged } from "./redux/actions/userAction";
import { Box } from "@mui/material";
import AlertMessage from "./utils/AlertMessage";
import useMediaQuery from "@mui/material/useMediaQuery";

import { createTheme, ThemeProvider } from "@mui/material/styles";


function App() {
  const [loading, setLoading] = useState(true);
  var userTheme = useSelector((state) => state.user.theme);
  const system = useMediaQuery("(prefers-color-scheme: dark)");

  if (userTheme === "system") {
    userTheme = system ? "dark" : "light";
  }
  userTheme = "light"
  const dispatch = useDispatch();
  const theme = createTheme({
    palette: {
      mode: userTheme,
      ...(userTheme === 'light'? {
        background: {
          default: "#ffefd5",
          paper: '#ffe4c4',
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
