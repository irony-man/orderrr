import React, { useEffect, useState } from "react";
import axios from "axios";
import Profile from "./Profile";
import "./Profile.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ProfileDesigns = () => {
  const designs = useSelector((state) => state.user.designs);

  return (
    <>
      <Profile />
      <div className="designs-container">
        <div className="row">
          {designs.length > 0 ? (
            designs
              .slice(0)
              .reverse()
              .map((design) => (
                <div key={design._id} className="col-md-4 p-2 col-6">
                  <Link to={`/design/${design._id}`}>
                    <img
                      className="img-fluid profile-designs"
                      src={design.image.thumb}
                      alt={design.title}
                    />
                  </Link>
                </div>
              ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileDesigns;
