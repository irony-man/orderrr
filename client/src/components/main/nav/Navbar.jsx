import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MailIcon from "@mui/icons-material/Mail";
import {
  AppBar,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Grid} from "@mui/material";
import DrawerComp from "./Drawer";
import Logout from "../Profile/Logout";

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const profileLink = () => {
    setAnchorElUser(null);
    navigate("/profile");
  };
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const user = useSelector((state) => state.user);
  const icons = [<><MailIcon /></>, <><ShoppingCartIcon /></>, <><FavoriteIcon /></>];

  return (
    <>
      <AppBar sx={{ bgcolor: "background.paper" }}>
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            variant="h5"
            sx={{
              ml: 1,
              color: "text.primary",
              ":hover": { color: "text.primary" },
            }}
          >
            <b>Orderrr</b>
          </Typography>
          {isMatch ? (
            <>
              <DrawerComp />
            </>
          ) : (
            <>
              <Grid container justifyContent="flex-end">
                {["Messages", "Cart", "Wishlist"].map((text, index) => (
                  <Typography
                    variant="h6"
                    component={Link}
                    to={`/${text.toLowerCase()}`}
                    key={index}
                    sx={{
                      color: "text.primary",
                      ":hover": { color: "text.primary" },
                      marginRight: "30px",
                    }}
                  >
                    <Badge
                      color="secondary"
                      badgeContent={text === "Cart" ? user.cart.length : 0}
                    >
                      {icons[index]}
                    </Badge>{" "}
                    {text}
                  </Typography>
                ))}
              </Grid>
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar src={user.picture.link}
                  sx={{ width: 30, height: 30}}
                />
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem sx={{ color: "text.primary" }} onClick={profileLink}>
                  <Typography>Profile</Typography>
                </MenuItem>
                {user._id?<MenuItem>
                  <Logout />
                </MenuItem>:<></>}
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <div style={{ paddingBottom: "120px" }}></div>
    </>
  );
};

export default Navbar;
