import React from "react";
import { useSelector } from "react-redux";
import "./Loader.css";

const Loader = () => {
  const loading = useSelector((state) => state.loading);
  return (
    <>
      {loading ? (
        <div className="loader">
          <div className="loading">
            <span>O</span>
            <span>R</span>
            <span>D</span>
            <span>E</span>
            <span>R</span>
            <span>R</span>
            <span>R</span>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Loader;
