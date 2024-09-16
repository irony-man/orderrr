import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useDispatch } from "react-redux";
import { alertMessage } from "../../redux/actions/alertsAction";

const Setpass = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setpassword] = useState("");
  const [otpMatch, setOptmatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const para = new URLSearchParams(window.location.search);
  useEffect(() => {
    axios
      .get("/setpass/" + para)
      .then((response) => {
        if (response.status === 200) {
          setOptmatch(true);
        }
      })
      .catch(function (error) {
        if (error.response.data.message) {
          alert(error.response.data.message);
          navigate("/login");
        }
      });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/setpass/" + para, { password })
      .then(function (response) {
        setLoading(false);
        if (response.status === 200) {
          navigate("/login");
          dispatch(alertMessage({message: response.data.message, type: "success", open: true}));
        }
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response.data.message) {
          alert(error.response.data.message);
        }
      });
  };
  return (
    <>
      {otpMatch ? (
        <>
          <title>Reset Password | Orderrr</title>
          <div className="login-container">
            <div className="wrapper">
              <div className="login-title">
                <Link to="/">Orderrr</Link>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="input-row">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    required
                  />
                </div>
                <div className="input-row button">
                  {loading ? (
                    <CircularProgress style={{ color: "#513D2B" }} />
                  ) : (
                    <input type="submit" value="Change Password" />
                  )}
                </div>
                <div className="signup-link">
                  A member? <Link to="/login">Login now</Link>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <div className="loader">
          <CircularProgress style={{ color: "white" }} />
        </div>
      )}
    </>
  );
};

export default Setpass;
