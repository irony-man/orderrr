import { useState } from "react";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { alertMessage } from "../../redux/actions/alertsAction";
import { useDispatch } from "react-redux";

const Sendmail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/sendmailpass", { email })
      .then(function (response) {
        setLoading(false);
        if (response.data.message) {
          dispatch(alertMessage({message: response.data.message, type: "success", open: true}));
        }
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response.data.message) {
          dispatch(alertMessage({message: error.response.data.message, type: "error", open: true}));

        }
      });
  };
  return (
    <>
      <title>Reset Password | Orderrr</title>
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
            <div className="input-row button">
              {loading ? (
                <CircularProgress style={{ color: "#513D2B" }} />
              ) : (
                <input type="submit" value="Send Mail" />
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

export default Sendmail;
