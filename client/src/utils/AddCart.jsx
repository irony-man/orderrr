import axios from "axios";

const AddCart = async (id) => {
  let response = new Promise(function (resolve) {
  axios
    .post("/cart/add", {
      id,
    })
    .then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      resolve(false);
    })
  })
  return await response;
 ;
}

export default AddCart;
