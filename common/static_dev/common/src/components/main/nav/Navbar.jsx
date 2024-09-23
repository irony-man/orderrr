import { useState } from "react";
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
  Grid,
  Tooltip,
} from "@mui/material";
import DrawerComp from "./Drawer";
import Logout from "../Profile/Logout";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorElUser, setAnchorElUser] = useState(null);
  const user = useSelector((state) => state.user);

  const links = [
    {
      text: "Admin",
      icon: (
        <>
          <SupervisorAccountIcon />
        </>
      ),
      link: "/odr-adm/",
      target: "_blank",
      condition: user.is_staff,
    },
    {
      text: "Designs",
      icon: (
        <>
          <GridOnOutlinedIcon />
        </>
      ),
      link: "/designs",
      condition: true,
    },
    {
      text: "Messages",
      icon: (
        <>
          <MailIcon />
        </>
      ),
      link: "/messages",
      condition: true,
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
      condition: true,
    },
    {
      text: "Wishlist",
      icon: (
        <>
          <FavoriteIcon />
        </>
      ),
      link: "/wishlist",
      condition: true,
    },
  ];

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

  return (
    <>
      <AppBar sx={{ bgcolor: "background.paper" }}>
        <Toolbar className="container px-0">
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
                {links.map((l) => {
                  if (l.condition)
                    return (
                      <IconButton
                        component={Link}
                        to={l.link}
                        key={l.link}
                        sx={{
                          color: "text.primary",
                          ":hover": { color: "text.primary" },
                          marginRight: "40px",
                        }}
                        target={l.target}
                      >
                        <Tooltip title={l.text}>
                          <Badge color="secondary" badgeContent={l.badge}>
                            {l.icon}
                          </Badge>
                        </Tooltip>
                      </IconButton>
                    );
                })}
              </Grid>
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar
                  src={user.display_picture_url}
                  sx={{ width: 30, height: 30 }}
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
                {user.uid && (
                  <MenuItem>
                    <Logout />
                  </MenuItem>
                )}
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
