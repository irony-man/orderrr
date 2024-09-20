import { useEffect } from "react";
import { useState } from "react";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import {
  CircularProgress,
  Button,
  Grid,
  Typography,
  TextField,
  FormLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { alertMessage } from "../../../redux/actions/alertsAction";
import { Box } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { InputAdornment } from "@mui/material";
import apis from "../../../redux/actions/apis";
import { HttpBadRequestError, HttpNotFound } from "../../../redux/network";


const DesignForm = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [design, setDesign] = useState({});
  const [errors, setErrors] = useState({});
  const { uid } = useParams();

  useEffect(() => {
    async function initiate() {
      try {
        setLoading(true);
        const response = await apis.getDesign(uid);
        setDesign({...response, imageUrl: response.image});
      } catch (error) {
        if(error instanceof HttpNotFound) {
          setDesign({...design, not_found: true});
        }
      } finally {
        setLoading(false);
      }
    }
    initiate();
  }, [uid]);
  const handleImage = (e) => {
    if (e.target.files[0] === undefined) {
      setDesign({...design, image: "", imageUrl: ""});
      document.getElementById("design-upload").value = null;
    } else if (e.target.files[0].size > 1024 * 1024) {
      dispatch(
        alertMessage({
          message: "File is too big.. Limit is 1Mb..",
          type: "error",
          open: true,
        })
      );
      setDesign({...design, image: "", imageUrl: ""});
      document.getElementById("design-upload").value = null;
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        setDesign({...design, image: e.target.files[0], imageUrl: reader.result});
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const formData = new FormData();
      Object.keys(design).forEach((key) => {
        return formData.append(key, design[key] ?? '');
      });
      if (design.image?.name) {
        formData.append("image", design.image, design.image?.name);
      } else {
        formData.delete("image");
      }
      formData.delete("imageUrl");

      const response = await apis.createOrUpdateDesign({uid: uid, formData: formData});
      dispatch(
        alertMessage({
          message: "Uploaded the design!!",
          type: "success",
          open: true,
        })
      );
      navigate(`/design/${response.uid}`);
    } catch (error) {
      console.error(error);
      if (error instanceof HttpBadRequestError) {
        setErrors({...error.data});
      }
      dispatch(
        alertMessage({
          message: "Error saving the design!!",
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
      <title>Add Design | Orderrr</title>
      {loading ? (
        <Grid container justifyContent={"center"}>
          <CircularProgress sx={{ color: "text.primary" }} />
        </Grid>
      ) : (
        <div className="container">
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiInputBase-root": { bgcolor: "background.paper" },
            }}
          >
            <div className="row g-4">
              <div className="col-12 col-md-5">
                <FormLabel
                  htmlFor="design-upload"
                  className="w-100 p-3 rounded-3 h-100 d-flex justify-content-center align-items-center text-center"
                  sx={{ bgcolor: "background.paper", border: "2px dashed", color: "text.primary" }}
                >
                  <div>
                    {design.imageUrl ? (
                      <img
                        src={design.imageUrl}
                        className="img-fluid rounded"
                        alt="Design Upload"
                      />
                    ) : (
                      <AddAPhotoIcon fontSize="large" />
                    )}
                    <Typography className="mt-3" variant="h6">Upload Design</Typography>
                  </div>
                </FormLabel>
                <input
                  id="design-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  style={{ display: "none" }}
                  disabled={loading}
                />
              </div>
              <div className="col">
                <div className="row g-4">
                  <div className="col-12">
                    <TextField
                      type="text"
                      label="Title"
                      value={design.title}
                      onChange={(e) =>
                        setDesign({ ...design, title: e.target.value })
                      }
                      disabled={loading}
                      fullWidth
                      required
                      error={errors.title}
                      helperText={errors.title}
                    />
                  </div>
                  <div className="col-12">
                    <TextField
                      type="number"
                      label="Price"
                      value={design.base_price}
                      onChange={(e) =>
                        setDesign({ ...design, base_price: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      disabled={loading}
                      fullWidth
                      required
                      error={errors.base_price}
                      helperText={errors.base_price}
                    />
                  </div>
                  <div className="col-12">
                    <TextField
                      label="Discount"
                      type="number"
                      value={design.discount * 100}
                      onChange={(e) =>
                        setDesign({
                          ...design,
                          discount: e.target.value / 100,
                        })
                      }
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      inputProps={{max: 100, min: 0}}
                      required
                      error={errors.discount}
                      max={100}
                      helperText={errors.discount}
                    />
                  </div>
                  <div className="col-12">
                    <TextField
                      label="Final Price"
                      type="number"
                      value={design.base_price - (design.discount * design.base_price)}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      disabled
                    />
                  </div>
                  <div className="col-12">
                    <FormControl fullWidth>
                      <InputLabel htmlFor="type">Type *</InputLabel>
                      <Select
                        id="type"
                        label="Type"
                        color="primary"
                        value={design.design_type}
                        onChange={(e) =>
                          setDesign({
                            ...design,
                            design_type: e.target.value,
                          })
                        }
                        disabled={loading}
                        required
                        error={errors.design_type}
                        helperText={errors.design_type}
                      >
                        {user.choices?.design_type.map((t) => (
                          <MenuItem key={t.value} value={t.value}>
                            {t.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-12">
                    <TextField
                      label="Stock"
                      type="number"
                      value={design.stock}
                      onChange={(e) =>
                        setDesign({
                          ...design,
                          stock: e.target.value,
                        })
                      }
                      fullWidth
                      required
                      error={errors.stock}
                      helperText={errors.stock}
                    />
                  </div>
                  <div className="col-12">
                    <TextField
                      multiline
                      rows={6}
                      label="Description"
                      fullWidth
                      value={design.description}
                      onChange={(e) =>
                        setDesign({ ...design, description: e.target.value })
                      }
                      disabled={loading}
                      error={errors.description}
                      helperText={errors.description}
                    />
                  </div>
                  <div className="col-12">
                    {loading ? (
                      <CircularProgress style={{ color: "text.primary" }} />
                    ) : (
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                      >
                        Save Design
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </div>
      )}
    </>
  );
};
export default DesignForm;
