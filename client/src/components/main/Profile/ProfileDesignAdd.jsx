import React from "react";
import { useState } from "react";
import axios from "axios";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import {
  CircularProgress,
  Button,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProfileDesign } from "../../../redux/actions/userAction";
import { alertMessage } from "../../../redux/actions/alertsAction";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import Select from "@mui/material/Select";
import { InputAdornment } from "@mui/material";

const useStyles = makeStyles({
  uploadButton: {
    border: `2px solid`,
    borderRadius: 5,
    width: "100%",
    padding: "10px",
  },
});

const ProfileDesignAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("painting");

  const maxSize = (e) => {
    if (e.target.files[0] === undefined) {
      setImage("");
      document.getElementById("design-upload").value = null;
    } else if (e.target.files[0].size > 1024 * 1024) {
      dispatch(
        alertMessage({
          message: "File is too big.. Limit is 1Mb..",
          type: "error",
          open: true,
        })
      );
      setImage("");
      document.getElementById("design-upload").value = null;
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        setImage(reader.result);
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/design", {
        image,
        type,
        price,
        title,
        description,
      })
      .then((response) => {
        setLoading(false);
        if (response) {
          setImage(response.data.image.full);
          dispatch(addProfileDesign([response.data]));
          dispatch(
            alertMessage({
              message: "Uploaded the design!!",
              type: "success",
              open: true,
            })
          );
          navigate("/profile");
        }
      })
      .catch((err) => {
        navigate("/profile");
        dispatch(
          alertMessage({
            message: err.response.data.message,
            type: err,
            open: true,
          })
        );
      });
  };

  return (
    <>
      <title>Add Design | Orderrr</title>
      <Box sx={{ m: "0 5vw" }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            "& .MuiTextField-root": { bgcolor: "background.paper" },
          }}
        >
          <Grid container justifyContent="space-between">
            <Grid md={4} sm={12} xs={12} item sx={{ mb: 5 }}>
              <Box sx={{ textAlign: "center", color: "text.primary" }}>
                <label htmlFor="design-upload" className={classes.uploadButton}>
                  {image !== "" ? (
                    <img
                      src={image}
                      className="img-fluid rounded"
                      alt="Design Upload"
                    />
                  ) : (
                    <AddAPhotoIcon />
                  )}
                  <Typography variant="h6">Upload Design</Typography>
                </label>
                <input
                  id="design-upload"
                  type="file"
                  accept="image/*"
                  onChange={maxSize}
                  style={{ display: "none" }}
                  disabled={loading}
                  required
                />
              </Box>
            </Grid>
            <Grid md={7.5} sm={12} xs={12} item>
              <FormControl fullWidth>
                <InputLabel htmlFor="type">Type *</InputLabel>
                <Select
                  sx={{ mb: 1, bgcolor: "background.paper" }}
                  id="type"
                  label="Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={loading}
                  required
                >
                  <ListSubheader>Non-digital Art</ListSubheader>
                  <MenuItem value="painting">Painting</MenuItem>
                  <MenuItem value="poster">Poster</MenuItem>
                  <MenuItem value="sketch">Sketch</MenuItem>
                  <ListSubheader>Digital Art</ListSubheader>
                  <MenuItem value="photoshop">Photoshop</MenuItem>
                  <MenuItem value="illustration">Illustration</MenuItem>
                  <MenuItem value="nft">NFT</MenuItem>
                  <ListSubheader>Other</ListSubheader>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                <TextField
                  type="number"
                  label="Price"
                  value={price > 0 ? price : ""}
                  onChange={(e) => setPrice(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  disabled={loading}
                  required
                />
                <TextField
                  type="text"
                  label="Title"
                  margin="normal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  required
                />
                <TextField
                  multiline
                  rows={8}
                  label="Description"
                  margin="normal"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  required
                />
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  {loading ? (
                    <CircularProgress style={{ color: "text.primary" }} />
                  ) : (
                    <Button
                      type="submit"
                      sx={{ width: "100%" }}
                      variant="contained"
                      size="large"
                    >
                      Add Design
                    </Button>
                  )}
                </Box>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default ProfileDesignAdd;
