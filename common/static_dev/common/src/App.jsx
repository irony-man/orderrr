import { useState, useEffect } from "react";
import Paths from "./components/Paths";
import { Box, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { removeUser, userLogged } from "./redux/actions/userAction";
import AlertMessage from "./utils/AlertMessage";
import useMediaQuery from "@mui/material/useMediaQuery";

import { createTheme, ThemeProvider } from "@mui/material/styles";

function App() {
  const [loading, setLoading] = useState(true);
  var userTheme = useSelector((state) => state.user.theme);
  const system = useMediaQuery("(prefers-color-scheme: dark)");

  if (userTheme.toUpperCase() === "AUTO") {
    userTheme = system ? "dark" : "light";
  }

  const dispatch = useDispatch();
  const theme = createTheme({
    palette: {
      mode: userTheme.toLowerCase(),
      ...(userTheme === 'light'? {
        background: {
          default: "#F9F6F1",
          // paper: '#ffe4c4',
        },
        primary: {
          main: "#000",
        },
      }: {
        primary: {
          main: "#fff",
        }
      }),
    },
  });

  useEffect(() => {
    async function initiate() {
      try {
        dispatch(userLogged());
        setLoading(false);
      } catch (err) {
        dispatch(removeUser());
        console.error(err);
      }
    }
    initiate();
  }, []);

  return (
    <ThemeProvider theme={theme}><Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        zIndex: "-1000",
        bgcolor: "background.default",
        backgroundImage: "linear-gradient(#a292710c 1.2px, transparent 1.2px), linear-gradient(to right, #a292710c 1.2px, transparent 1.2px)",
        backgroundSize: "20px 20px",
      }}
    ></Box>
    {loading ? (
      <div className="loader">
        <CircularProgress style={{ color: "text.primary" }} />
      </div>
    ) : (
      <div>
        <Paths />
        <AlertMessage />
      </div>
    )}
    </ThemeProvider>
  );
}

export default App;
