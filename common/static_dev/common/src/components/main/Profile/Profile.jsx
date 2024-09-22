import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
import NotFound from "../NotFound";
import apis from "../../../redux/actions/apis";
import { HttpNotFound } from "../../../redux/network";

const ProfileHeader = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user);
  const [profile, setProfile] = useState({});
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(loggedUser.theme);
  const { uid } = useParams();

  const profileOptions = [
    {
      text: "Edit Profile",
      icon: <><EditIcon /></>,
      link: "/profile/edit"
    }, {
      text:"Add Design",
      icon:<><AddCircleIcon /></>,
      link: "/design/new",
    }, {
      text: "Orders",
      icon:<><ShoppingBagIcon /></>,
      link: "/orders",
    }, {
      text: "Theme",
      icon:<><Brightness7Icon /></>,
      func: () => setOpen(true)
    }
  ];
  useEffect(() => {
    async function initiate() {
      if(loggedUser.uid) {
        setLoading(true);
        try {
          if (uid && uid !== loggedUser.uid) {
            const response = await apis.getUserProfile(uid);
            setProfile(response);
          } else {
            setProfile(loggedUser);
          }
          const response = await apis.listDesign({user: uid ? uid : loggedUser.uid});
          setDesigns(response.results);
        } catch (error) {
          if(error instanceof HttpNotFound) {
            setProfile({...profile, not_found: true});
          }
        } finally {
          setLoading(false);
        }
      }
    }
    initiate();
  }, [loggedUser.uid, uid]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(false);
    dispatch(changeTheme(value));
  };

  return (
    <div className="container">
      <title>
        Profile {loggedUser.uid !== uid && profile.username} | Orderrr
      </title>
      {loading ? (
        <Box textAlign="center" sx={{ mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : profile.not_found ? (
        <NotFound type="Profile" />
      ) : (
        <div>
          <Box component={Paper} sx={{ mb: 5 }}>
            <Grid container className="w-100 px-3 py-5 mx-auto" sx={{ maxWidth: "920px" }} justifyContent="center">
              <Grid textAlign={"center"} item md={6} sm={12}>
                <div className="profile-img-container">
                  <img
                    src={profile.display_picture_url}
                    alt="Profile"
                  />
                </div>
                <Tooltip title={profile.username || ""}>
                  <Typography variant="h5" noWrap sx={{ mt: 2 }}>
                    {profile.username}
                  </Typography>
                </Tooltip>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Designs: {designs.length.toString().padStart(2, '0')}
                </Typography>
              </Grid>
              {profile.is_logged && <Grid item md={6} xs={12}>
                <List>
                  {profileOptions.map(o => (
                    <ListItem
                      key={o.text}
                      disablePadding
                      component={o.link ? Link : ""}
                      to={o.link ? `${o.link}` : ""}
                      onClick={o.func}
                    >
                      <ListItemButton>
                        <ListItemIcon sx={{ color: "text.primary" }}>
                          {o.icon}
                        </ListItemIcon>
                        <ListItemText primary={o.text} sx={{ color: "text.primary" }} />
                      </ListItemButton>
                    </ListItem>
                  )
                  )}
                </List>
              </Grid>}
            </Grid>
          </Box>
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
                      value="auto"
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
          {designs.length > 0 ? (
            <Grid container spacing={3}>
              {designs.map((design) => (
                <Grid key={design.uid} lg={3} md={4} xs={6} item>
                  <Link to={`/design/${design.uid}`}>
                    <div className="profile-designs">
                      <img
                        src={design.image_thumbnail_url}
                        alt={design.title}
                      />
                    </div>
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
            </Typography>)}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
