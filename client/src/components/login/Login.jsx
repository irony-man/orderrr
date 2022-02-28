import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userLogged } from "../../redux/actions/userAction";

const Login = () => {
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
          alert(response.data.message);
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
      <title>Login | Orderrr</title>
      <div className="login-container">
        <div className="wrapper">
          <div className="login-title">
            <Link to="/">Orderrr</Link>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-row">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="pass">
              <Link to="/password-reset">Forgot password?</Link>
            </div>
            <div className="input-row button">
              {loading ? (
                <CircularProgress style={{ color: "#513D2B" }} />
              ) : (
                <input type="submit" value="Login" />
              )}
            </div>
            <div className="signup-link">
              Not a member? <Link to="/signup">Signup now</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
