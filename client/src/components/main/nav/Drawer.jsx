import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MailIcon from "@mui/icons-material/Mail";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import Logout from "../Profile/Logout";

const DrawerComp = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const user = useSelector((state) => state.user);
  const icons = [
    <><MailIcon /></>,
    <><ShoppingCartIcon /></>,
    <><FavoriteIcon /></>,
    <><AccountCircle /></>,
  ];

  return (
    <>
      <SwipeableDrawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onOpen={() => setOpenDrawer(true)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenDrawer(false)}
          onKeyDown={() => setOpenDrawer(false)}
        >
          <List>
            {["Messages", "Cart", "Wishlist", "Profile"].map((text, index) => (
              <ListItem component={Link} button to={`/${text}`} key={text}>
                <ListItemIcon sx={{ color: "text.primary" }}>
                  {text === "Cart" ? (
                    <Badge color="secondary" badgeContent={user.cart.length}>
                      {icons[index]}
                    </Badge>
                  ) : (
                    <>{icons[index]}</>
                  )}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ color: "text.primary" }} />
              </ListItem>
            ))}
            {user._id?<ListItem button>
              <ListItemIcon sx={{ color: "text.primary" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary={<Logout />}
                sx={{ color: "text.primary" }}
              />
            </ListItem>:<></>}
          </List>
        </Box>
      </SwipeableDrawer>
      <IconButton
        sx={{ marginLeft: "auto", color: "text.primary" }}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
};

export default DrawerComp;
