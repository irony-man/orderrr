import {
  Button,
  FormControl,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  FormLabel,
  CircularProgress,
  Grid,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import { alertMessage } from "../../../../redux/actions/alertsAction";
import { setUser } from "../../../../redux/actions/userAction";
import apis from "../../../../redux/actions/apis";
import { HttpBadRequestError } from "../../../../redux/network";
// import { editBasicProfile } from "../../../../redux/actions/userAction";

const useStyles = makeStyles({
  uploadButton: {
    border: `2px solid`,
    borderRadius: 5,
    padding: "10px",
    marginBottom: "30px",
    cursor: "pointer",
  },
});

const BasicEdit = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState({
    display_picture_file: "",
    raw_password: "",
    name: "",
    email: "",
    showPassword: false,
  });

  useEffect(() => {
    async function initiate() {
      if (loggedUser.uid) {
        setInitialLoading(true);
        try {
          if (loggedUser.uid) {
            setProfile({
              ...loggedUser,
              imageUrl: loggedUser.default_display_picture ? '' : loggedUser.display_picture_url,
            });
          }
        } catch (error) {
          dispatch(
            alertMessage({
              payload: "Error fetching user",
              type: "error",
              open: true,
            })
          );
        } finally {
          setInitialLoading(false);
        }
      }
    }
    initiate();
  }, [loggedUser.uid]);

  const handleClickShowPassword = () => {
    setProfile({
      ...profile,
      showPassword: !profile.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (prop) => (event) => {
    setProfile({ ...profile, [prop]: event.target.value });
  };
  const deletePicture = (e) => {
    e.preventDefault();
    setProfile({
      ...profile,
      display_picture_file: "",
      imageUrl: "",
    });
  };

  const handleImage = (e) => {
    if (e.target.files[0] === undefined) {
      document.getElementById("change-picture").value = null;
    } else if (e.target.files[0].size > 1024 * 1024) {
      dispatch(
        alertMessage({
          message: "File is too big.. Limit is 1Mb..",
          type: "error",
          open: true,
        })
      );
      document.getElementById("change-picture").value = null;
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        setProfile({
          ...profile,
          display_picture_file: e.target.files[0],
          imageUrl: reader.result,
        });
      };
    }
  };


  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const formData = new FormData();
      Object.keys(profile).forEach((key) => {
        return formData.append(key, profile[key] ?? '');
      });
      if (profile.display_picture_file?.name) {
        formData.append("display_picture", profile.display_picture_file, profile.display_picture_file?.name);
      } else {
        if (profile.imageUrl) {
          formData.delete("display_picture");
        } else {
          formData.append("display_picture", "");
        }
      }
      formData.delete("imageUrl");
      const user = await apis.updateUser({uid: profile.uid, formData});
      dispatch(setUser(user));
      dispatch(
        alertMessage({
          message: "Profile Saved!!",
          type: "success",
          open: true,
        })
      );
      setErrors({});
    } catch (error) {
      console.error(error);
      if (error instanceof HttpBadRequestError) {
        setErrors({...error.data});
      }
      dispatch(
        alertMessage({
          message: "Error saving the profile!!",
          type: "error",
          open: true,
        })
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <title>Edit Profile | Orderrr</title>
      {initialLoading ? (
        <Grid sx={{p:5}} container justifyContent={"center"}>
          <CircularProgress sx={{ color: "text.primary" }} />
        </Grid>
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          autoComplete="off"
          sx={{
            "& .MuiTextField-root": {
              m: "0 0 30px 0",
            },
            textAlign: "center",
          }}
        >
          <FormLabel htmlFor="change-picture" className={classes.uploadButton}>
            <div>
              {profile.imageUrl ? (
                <img
                  width="150px"
                  src={profile.imageUrl}
                  className="img-fluid rounded"
                  alt="Design Upload"
                />
              ) : (
                <AddAPhotoIcon fontSize="large" />
              )}
              <Typography className="mt-3" variant="h6">
                Upload Picture
                {profile.imageUrl ? (
                  <IconButton sx={{ color: "red" }} onClick={deletePicture}>
                    <DeleteIcon />
                  </IconButton>
                ) : (
                  <></>
                )}
              </Typography>
            </div>
          </FormLabel>
          <div className="row flex-column">
            <div className="col-12">
              <FormControl fullWidth>
                <input
                  id="change-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  style={{ display: "none" }}
                  disabled={loading}
                />
              </FormControl>
            </div>
            <div className="col-12">
              <TextField
                type="text"
                label="Name"
                value={profile.username}
                onChange={handleChange("username")}
                disabled={loading}
                required
                fullWidth
                error={errors.username}
                helperText={errors.username}
              />
            </div>
            <div className="col-12">
              <TextField
                type="email"
                label="Email"
                value={profile.email}
                onChange={handleChange("email")}
                disabled={loading}
                required
                fullWidth
                error={errors.email}
                helperText={errors.email}
              />
            </div>
            <div className="col-12">
              <TextField
                label="Change Password"
                type={profile.showPassword ? "text" : "password"}
                value={profile.raw_password}
                onChange={handleChange("raw_password")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {profile.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                disabled={loading}
                fullWidth
                error={errors.raw_password}
                helperText={errors.raw_password}
              />
            </div>
            <div className="col-12">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={
                  loading || profile.email === "" || profile.name === ""
                }
              >
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </Box>
      )}
    </>
  );
};

export default BasicEdit;
