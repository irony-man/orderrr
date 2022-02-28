import React from "react";
import { isBrowser } from "react-device-detect";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const ProfileNav = () => {
  const user = useSelector((state) => state.user);
  return (
    <>
      <div className="navbar-profile">
        <NavLink
          exact="true"
          style={({ isActive }) =>
            isActive ? { borderBottom: "#513D2B solid 2px" } : {}
          }
          to="/profile/designs"
        >
          <Tooltip title="Designs">
            <ViewQuiltIcon />
          </Tooltip>
        </NavLink>
        <NavLink
          exact="true"
          style={({ isActive }) =>
            isActive ? { borderBottom: "#513D2B solid 2px" } : {}
          }
          to="/profile/design-new"
        >
          <Tooltip title="Add New Design">
            <AddCircleIcon />
          </Tooltip>
        </NavLink>
        <NavLink
          exact="true"
          style={({ isActive }) =>
            isActive ? { borderBottom: "#513D2B solid 2px" } : {}
          }
          to="/profile/edit"
        >
          <Tooltip title="Edit Profile">
            <EditIcon />
          </Tooltip>
        </NavLink>
      </div>
    </>
  );
};

export default ProfileNav;
