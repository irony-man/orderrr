import {
  Button,
  FormControl,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import { alertMessage } from "../../../../redux/actions/alertsAction";
import { editBasicProfile } from "../../../../redux/actions/userAction";

const useStyles = makeStyles({
  uploadButton: {
    border: `2px solid`,
    borderRadius: 5,
    padding: "10px",
    marginBottom: "30px",
  },
});

const BasicEdit = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const loading = useSelector((state) => state.loading);
  const defalut =
    "https://res.cloudinary.com/shivam2001/image/upload/v1648115809/Orderrr/Users/default_cv7h4b.svg";
  const [disabled, setDisabled] = useState(true);
  const [values, setValues] = useState({
    picture: "",
    password: "",
    name: "",
    email: "",
    showPassword: false,
  });

  const enableEditing = () => {
    setDisabled(!disabled);
    if (disabled) {
      setValues({
        ...values,
        picture: user.picture.link,
        name: user.username,
        email: user.email,
        password: "",
      });
    }
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const deletePicture = (e) => {
    e.preventDefault();
    setValues({
      ...values,
      picture: defalut,
    });
  };

  const maxSize = (e) => {
    if (e.target.files[0] === undefined) {
      setValues({ ...values, picture: user.picture.link });
      document.getElementById("change-picture").value = null;
    } else if (e.target.files[0].size > 1024 * 1024) {
      dispatch(
        alertMessage({
          message: "File is too big.. Limit is 1Mb..",
          type: "error",
          open: true,
        })
      );
      setValues({ ...values, picture: user.picture.link });
      document.getElementById("change-picture").value = null;
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        setValues({ ...values, picture: reader.result });
      };
    }
  };
  const handleSubmit = (e) => {
    setDisabled(true);
    e.preventDefault();
    if(values.name==="" || values.email===""){
      dispatch(alertMessage({message: "Name and Email are required", type: "error", open: true}));
    } else {
      dispatch(editBasicProfile({ ...values, id: user._id }));
    }
    
  };
  return (
    <>
      <title>Edit Profile | Orderrr</title>
      <FormControlLabel
        control={<Switch checked={!disabled} onChange={enableEditing} />}
        label="Edit: "
        labelPlacement="start"
        sx={{ mb: 4 }}
      />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          "& .MuiTextField-root": { m: "0 0 30px 0", bgcolor: "background.paper" },
          textAlign: "center",
        }}
        noValidate
        autoComplete="off"
      >
        <label htmlFor="change-picture" className={classes.uploadButton}>
          <img
            width="150px"
            src={disabled ? user.picture.link : values.picture}
            className="img-fluid rounded"
            alt="Design Upload"
          />
          <Typography variant="body1" sx={{ mt: 1 }}>
            {disabled ? (
              "Profile Picture"
            ) : (
              <>
                Update Picture
                {values.picture === defalut ? (
                  <></>
                ) : (
                  <IconButton
                    sx={{ color: "red" }}
                    onClick={deletePicture}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </>
            )}
          </Typography>
        </label>
        <FormControl fullWidth>
          <input
            id="change-picture"
            type="file"
            accept="image/*"
            onChange={maxSize}
            style={{ display: "none" }}
            disabled={disabled}
          />
          <TextField
            type="text"
            label="Name"
            value={disabled ? user.username : values.name}
            onChange={handleChange("name")}
            disabled={disabled}
            required
          />
          <TextField
            type="email"
            label="Email"
            value={disabled ? user.email : values.email}
            onChange={handleChange("email")}
            disabled={disabled}
            required
          />
          <TextField
            label="Change Password"
            type={values.showPassword ? "text" : "password"}
            value={disabled ? "" : values.password}
            onChange={handleChange("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            disabled={disabled}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={disabled || values.email==="" || values.name===""}
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </FormControl>
      </Box>
    </>
  );
};

export default BasicEdit;
