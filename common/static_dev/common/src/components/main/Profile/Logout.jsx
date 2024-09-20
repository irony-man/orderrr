import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../../../redux/actions/userAction";
import { Box } from "@mui/material";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/profile");
    }
  };

  return (
    <>
      <Box onClick={logout}>Logout</Box>
    </>
  );
};

export default Logout;
