import axios from "axios";

export const AddWish = async (id) => {
  let response = new Promise(function (resolve) {
    axios
      .post("/wish/add", {
        id,
      })
      .then((result) => {
        resolve(result.data);
      })
      .catch((err) => {
        resolve(false);
      });
  });
  return await response;
};

export const removeWish = async (id) => {
  let response = new Promise(function (resolve) {
    axios
      .post("/wish/remove", {
        id,
      })
      .then((result) => {
        if (result.data.modifiedCount === 1) {
         resolve(true);
        }
      })
      .catch((err) => {
        resolve(false);
      });
  });
  return await response;
};
