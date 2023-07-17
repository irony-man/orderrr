import React, { useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/system";


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
