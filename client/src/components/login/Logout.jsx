import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../../redux/actions/userAction";

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
          alert(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response.data.message) {
          alert(error.response.data.message);
          navigate("/profile");
        }
      });
  };
  return (
    <>
      <button onClick={logout}>Logout</button>
    </>
  );
};

export default Logout;
