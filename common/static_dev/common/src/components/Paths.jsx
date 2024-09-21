import {useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./main/nav/Navbar.jsx";
import Login from "./login/Login";
import Signup from "./login/Signup";
import Setpass from "./login/SetPass";
import Sendmail from "./login/SendMail";
import LoginRoute from "../utils/LoginRoute";
import PrivateRoute from "../utils/PrivateRoute.jsx";
import Home from "./main/home/Home.jsx";
import Cart from "./main/home/Cart.jsx";
import WishList from "./main/home/WishList.jsx";
import Profile from "./main/Profile/Profile.jsx";
import DesignForm from "./main/Profile/DesignForm.jsx";
import ProfileEdit from "./main/Profile/ProfileEdit.jsx";
import NotFound from "./main/NotFound.jsx";
import DesignPage from "./main/home/DesignPage.jsx";
import Messages from "./main/home/Messages.jsx";
import { Box } from "@mui/material";
import ProfileOrders from "./main/Profile/ProfileOrders";
import PlaceOrder from "./main/home/PlaceOrder";

import { useLocation } from 'react-router-dom';


const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return <></>;
};
function Paths() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/design/:uid" element={<DesignPage />} />
          <Route element={<LoginRoute />}>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/password-reset" element={<Sendmail />} />
            <Route exact path="/verify/" element={<Setpass />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route exact path="/design/new" element={<DesignForm />} />
            <Route exact path="/design/:uid/edit" element={<DesignForm />} />
            <Route exact path="/messages" element={<Messages />} />
            <Route exact path="/cart" element={<Cart />} />
            <Route exact path="/wishlist" element={<WishList />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/profile/:uid" element={<Profile />} />
            <Route exact path="/profile/edit" element={<ProfileEdit />} />
            <Route exact path="/profile/edit/:id" element={<ProfileEdit />} />
            <Route exact path="/place" element={<PlaceOrder />} />
            <Route exact path="/orders" element={<ProfileOrders />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Box sx={{ pb: 5 }}></Box>
      </Router>
    </>
  );
}

export default Paths;
