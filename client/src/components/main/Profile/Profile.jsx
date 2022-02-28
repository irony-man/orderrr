import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Logout from "../../login/Logout";
import Navbar from "../nav/Navbar";
import "./Profile.css";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import ProfileNav from "./ProfileNav";

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (window.location.pathname === "/profile") {
      navigate("/profile/designs");
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <>
      <title>Profile | Orderrr</title>
      <Navbar />
      <div className="profile-header row">
        <div className="profile-img col-md-4 text-center">
          <img
            src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/profile-pic-male_4811a1.svg"
            alt="Profile Image"
          />
        </div>
        <div className="profile-details col-md-4">
          <h3>{user.username}</h3>
          <div className="row">
            <div className="col-4">
              <p>
                <b>Designs</b>
              </p>
              <p>
                {user.designs.length > 0 ? (
                  user.designs.length < 10 ? (
                    <>0{user.designs.length}</>
                  ) : (
                    <>{user.designs.length}</>
                  )
                ) : (
                  <>00</>
                )}
              </p>
            </div>
            <div className="col-4">
              <p>
                <b>Designs</b>
              </p>
              <p>09</p>
            </div>
            <div className="col-4">
              <p>
                <b>Designs</b>
              </p>
              <p>09</p>
            </div>
          </div>
        </div>
        <div className="profile-settings col-md-4">
          <Logout />
        </div>
      </div>
      <ProfileNav />
    </>
  );
};

export default Profile;
