import { useState } from "react";
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
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

const DrawerComp = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const user = useSelector((state) => state.user);

  const links = [
    {
      text: "Messages",
      icon: (
        <>
          <MailIcon />
        </>
      ),
      link: "/messages",
    },
    {
      text: "Cart",
      icon: (
        <>
          <ShoppingCartIcon />
        </>
      ),
      link: "/cart",
      badge: user.cart_length,
    },
    {
      text: "Wishlist",
      icon: (
        <>
          <FavoriteIcon />
        </>
      ),
      link: "/wishlist",
    },
    {
      text: "Profile",
      icon: (
        <>
          <AccountCircle />
        </>
      ),
      link: "/profile",
    },
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
            {user.is_staff && <ListItem
              component={Link}
              to="/odr-adm/"
              target="_blank"
            >
              <ListItemIcon sx={{ color: "text.primary" }}>
                <SupervisorAccountIcon />
              </ListItemIcon>
              <ListItemText
                primary="Admin"
                sx={{ color: "text.primary" }}
              />
            </ListItem>}
            {links.map((l) => (
              <ListItem
                component={Link}
                to={l.link}
                key={l.link}
                target={l.target}
              >
                <ListItemIcon sx={{ color: "text.primary" }}>
                  <Badge color="secondary" badgeContent={l.badge}>
                    {l.icon}
                  </Badge>
                </ListItemIcon>
                <ListItemText
                  primary={l.text}
                  sx={{ color: "text.primary" }}
                />
              </ListItem>
            ))}
            {user.uid ? (
              <ListItem>
                <ListItemIcon sx={{ color: "text.primary" }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Logout />}
                  sx={{ color: "text.primary" }}
                />
              </ListItem>
            ) : (
              <></>
            )}
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
