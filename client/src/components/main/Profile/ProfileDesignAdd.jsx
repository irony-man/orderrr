import React, { useEffect } from "react";
import Profile from "./Profile";
import { useState } from "react";
import axios from "axios";
import "./Profile.css";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProfileDesign } from "../../../redux/actions/userAction";

const ProfileDesignAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("painting");

  const maxSize = (e) => {
    if (e.target.files[0].size > 1024 * 1024) {
      alert("File is too big.. Limit is 1Mb..");
      e.target.files[0].value = "";
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        setImage(reader.result);
      };
    }
  };

  const handleSubit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/designadd", {
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
          navigate("/profile");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Profile />
      <div className="design-add-container">
        <form onSubmit={handleSubit}>
          <div className="row d-flex justify-content-center">
            <div className="col-md-4">
              <label htmlFor="design-upload" className="design-upload">
                {image !== "" ? (
                  <img
                    src={image}
                    className="img-fluid rounded"
                    alt="Design Upload"
                  />
                ) : (
                  <AddAPhotoIcon />
                )}
                <p className="text-center mt-2 mb-0">
                  <b>Upload Design</b>
                </p>
              </label>
              <input
                id="design-upload"
                type="file"
                accept="image/png, image/jpeg"
                onChange={maxSize}
                required
              />
            </div>
            <div className="col-md-8">
              <select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <optgroup label="Non-digital Art">
                  <option value="painting">Painting</option>
                  <option value="poster">Poster</option>
                  <option value="sketch">Sketch</option>
                </optgroup>
                <optgroup label="Digital Art">
                  <option value="photoshop">Photoshop</option>
                  <option value="illustration">Illustration</option>
                  <option value="nft">NFT</option>
                </optgroup>
                <option value="other">Other</option>
              </select>
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={price > 0 ? price : ""}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                rows="8"
                name="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
              <div className="design-add-button">
                {loading ? (
                  <CircularProgress style={{ color: "#513D2B" }} />
                ) : (
                  <input type="submit" value="Add Design" />
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default ProfileDesignAdd;
