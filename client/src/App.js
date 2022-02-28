import React, { useState, useEffect } from "react";
import Paths from "./components/Paths";
import { Offline, Online } from "react-detect-offline";
import Snake from "snake-game-react";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUser, userLogged } from "./redux/actions/userAction";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
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
  }, []);
  return (
    <>
      <Online>
        {loading ? (
          <div className="loader">
            <CircularProgress style={{ color: "#513D2B" }} />
          </div>
        ) : (
          <Paths />
        )}
      </Online>
      <Offline>
        <div className="offline">
          <div className="offline-message">
            <h2>OOPS!! You went offline!!</h2>
            <p>Play this game for now!!</p>
          </div>
          <Snake
            color1="#513D2B"
            color2="#ff0000"
            backgroundColor="#ffffff"
            score="4"
          />
        </div>
      </Offline>
    </>
  );
}

export default App;
