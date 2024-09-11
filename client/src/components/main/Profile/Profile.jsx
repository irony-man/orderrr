import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  ListItem,
  DialogContent,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { changeTheme } from "../../../redux/actions/userAction";
import {
  getProfile,
  removeProfile,
} from "../../../redux/actions/profileAction";
import NotFound from "../NotFound";

const ProfileHeader = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user);
  const fetchedUser = useSelector((state) => state.profile);
  const loading = useSelector((state) => state.loading);
  const { id } = useParams();
  const links = ["/profile/edit", "/profile/new", "/profile/orders"];
  const userIcons = [
    <><EditIcon /></>,
    <><AddCircleIcon /></>,
    <><ShoppingBagIcon /></>,
    <><Brightness7Icon /></>,
  ];
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(loggedUser.theme);

  useEffect(() => {
    if (id) {
      dispatch(getProfile(id));
    }
    return () => {
      dispatch(removeProfile());
    };
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(false);
    dispatch(changeTheme(value));
  };
  const profileDesigns = ({ designs }) => {
    return designs.length > 0 ? (
      <Grid container spacing={1}>
        {designs
          .slice(0)
          .reverse()
          .map((design) => (
            <Grid key={design._id} xl={2} md={4} lg={3} xs={6} item>
              <Link to={`/product/${design._id}${id ? "" : "?ref=profile"}`}>
                <img
                  className="img-fluid profile-designs"
                  src={design.image.thumb}
                  alt={design.title}
                />
              </Link>
            </Grid>
          ))}
      </Grid>
    ) : (
      <Typography
        variant="h4"
        sx={{ color: "text.primary", mt: "30px", textAlign: "center" }}
      >
        No posts yet!!
      </Typography>
    );
  };

  const chooseTheme = (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Choose theme</DialogTitle>
        <DialogContent>
          <FormControl>
            <RadioGroup
              name="radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel
                value="light"
                control={<Radio />}
                label="Light"
              />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
              <FormControlLabel
                value="system"
                control={<Radio />}
                label="System Defualt"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            type="suubmit"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );

  const headerOptions = () => {
    return (
      <Grid item md={3} xs={12}>
        <List>
          {["Edit Profile", "Add Design", "Orders"].map(
            (text, index) => (
              <ListItem
                key={index}
                disablePadding
                component={text !== "Theme" ? Link : ""}
                to={text !== "Theme" ? links[index] : ""}
                onClick={text === "Theme" && (() => setOpen(true))}
              >
                <ListItemButton>
                  <ListItemIcon sx={{ color: "text.primary" }}>
                    {userIcons[index]}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ color: "text.primary" }} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Grid>
    );
  };

  const header = (user) => {
    return (
      <Grid textAlign={"center"} item md={3} sm={12}>
        <img
          style={{ borderRadius: "50%", border: "2px solid", maxWidth: "150px" }}
          src={user.picture.link}
          alt="Profile"
        />
        <Tooltip title={user.username || ""}>
          <Typography variant="h5" noWrap sx={{ mt: 2 }}>
            {user.username}
          </Typography>
        </Tooltip>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Designs:{" "}
          {user.designs.length > 0 ? (
            user.designs.length < 10 ? (
              <>0{user.designs.length}</>
            ) : (
              <>{user.designs.length}</>
            )
          ) : (
            <>00</>
          )}
        </Typography>
      </Grid>
    );
  };

  return (
    <>
      <title>
        Profile {loggedUser._id !== id && fetchedUser.username} | Orderrr
      </title>
      {loading ? (
        <Box textAlign="center" sx={{ mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : fetchedUser.notFound ? (
        <>
          <NotFound type="Profile" />
        </>
      ) : (
        <>
          <Box component={Paper} sx={{ margin: "0 5vw 20px" }}>
            <Grid container sx={{ p: "30px 10px" }} justifyContent="center">
              {header(id ? fetchedUser : loggedUser)}
              {(!id || id === loggedUser._id) && headerOptions()}
            </Grid>
          </Box>
          {chooseTheme}
          <Box sx={{ margin: "28px 5vw 0" }}>
            {profileDesigns(id ? fetchedUser : loggedUser)}
          </Box>
        </>
      )}
    </>
  );
};

export default ProfileHeader;
