import React from "react";
import "./Navbar.css";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { brown } from "@mui/material/colors";
import { isBrowser } from "react-device-detect";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  return (
    <>
      <nav className="navbar-desktop">
        <div className="left-nav">
          <NavLink exact="true" className="brand-title" to="/">
            <b>Orderrr</b>
          </NavLink>
        </div>
        {isBrowser ? (
          <div className="mid-nav">
            <div className="input-search">
              <i className="fas fa-search"></i>
              <input type="search" placeholder="Search" name="search" />
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="right-nav">
          <NavLink exact="true" to="/cart">
            <Badge color="secondary" badgeContent={user.cart.length}>
              <ShoppingCartOutlinedIcon />
            </Badge>
          </NavLink>
          <NavLink exact="true" to="/wishlist">
            <FavoriteBorderOutlinedIcon />
          </NavLink>
          <NavLink exact="true" to="/profile">
            <Tooltip title={user.email ? user.email : "Log In!!"}>
              <Avatar sx={{ background: brown["700"], width: 24, height: 24 }}>
                {user.username ? (
                  user.username.charAt(0).toUpperCase()
                ) : (
                  <AccountCircleIcon />
                )}
              </Avatar>
            </Tooltip>
          </NavLink>
        </div>
      </nav>
      <div style={{ paddingBottom: "80px" }}></div>
    </>
  );
};

export default Navbar;
