import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/signup", { username, email, password })
      .then(function (response) {
        setLoading(false);
        if (response.status === 201) {
          navigate("/login");
        }
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response.status) {
          alert(error.response.data.message);
        }
      });
  };
  return (
    <>
      <div className="login-container">
        <div className="wrapper">
          <div className="login-title">
            <Link to="/">Orderrr</Link>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="Name"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
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
            <div className="input-row button">
              {loading ? (
                <CircularProgress style={{ color: "#513D2B" }} />
              ) : (
                <input type="submit" value="Sign Up" />
              )}
            </div>
            <div className="signup-link">
              A member? <Link to="/login">Login now</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
