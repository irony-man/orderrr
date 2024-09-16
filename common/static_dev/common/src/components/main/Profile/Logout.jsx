import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../../../redux/actions/userAction";
import { alertMessage } from "../../../redux/actions/alertsAction";
import { Box } from "@mui/material";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    axios
      .get("/logout")
      .then((response) => {
        if (response.status === 200) {
          navigate("/login");
          dispatch(removeUser());
          dispatch(
            alertMessage({
              message: response.data.message,
              type: "success",
              open: true,
            })
          );
        }
      })
      .catch((error) => {
        if (error.response.data.message) {
          dispatch(
            alertMessage({
              message: error.response.data.message,
              type: "error",
              open: true,
            })
          );
          navigate("/profile");
        }
      });
  };
  return (
    <>
      <Box onClick={logout}>Logout</Box>
    </>
  );
};

export default Logout;
